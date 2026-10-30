import { View } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedProps,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

type MetaballPaginationProps = {
  count: number;
  pageWidth: number;
  scrollX: SharedValue<number>;
  activeColor: string;
  inactiveColor: string;
};

const HEIGHT = 32;
const STEP = 26;
const CENTER_Y = HEIGHT / 2;
const ACTIVE_RADIUS = 6;
const INACTIVE_RADIUS = 3;

/** Control-point factor for approximating a quarter circle with a cubic Bézier. */
const KAPPA = 0.5523;

/** How much the droplet thins out at peak stretch (px). */
const MAX_SQUASH = 1.4;

/** How much the waist pinches at peak stretch (0–1). */
const MAX_PINCH = 0.35;

/** Fraction of the travel during which the leading / trailing edge is "waiting". */
const LAG = 0.28;

export function MetaballPagination({
  count,
  pageWidth,
  scrollX,
  activeColor,
  inactiveColor,
}: MetaballPaginationProps) {
  const dropletProps = useAnimatedProps(() => {
    const maxIndex = count - 1;
    const progress = clamp(scrollX.value / pageWidth, 0, maxIndex);

    // The droplet always lives between dot `i` and dot `i + 1`.
    const i = Math.min(Math.floor(progress), Math.max(maxIndex - 1, 0));
    const t = progress - i;

    const startX = centerX(i);

    // Leading (right) edge moves first, trailing (left) edge follows.
    const lead = easeOutCubic(clamp(t / (1 - LAG), 0, 1));
    const trail = easeInOutCubic(clamp((t - LAG) / (1 - LAG), 0, 1));

    const left = startX - ACTIVE_RADIUS + STEP * trail;
    const right = startX + ACTIVE_RADIUS + STEP * lead;

    // 0 at rest, 1 at the midpoint of the travel.
    const stretch = Math.sin(Math.PI * t);

    return {
      d: blobPath(
        left,
        right,
        CENTER_Y,
        ACTIVE_RADIUS - stretch * MAX_SQUASH,
        stretch * MAX_PINCH
      ),
    };
  });

  if (count <= 1 || pageWidth <= 0) {
    return null;
  }

  const svgWidth = count * STEP;

  return (
    <View
      style={{
        height: HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg
        width={svgWidth}
        height={HEIGHT}
        viewBox={`0 0 ${svgWidth} ${HEIGHT}`}
      >
        {Array.from({ length: count }, (_, index) => (
          <Circle
            key={index}
            cx={centerX(index)}
            cy={CENTER_Y}
            r={INACTIVE_RADIUS}
            fill={inactiveColor}
            opacity={0.35}
          />
        ))}

        <AnimatedPath animatedProps={dropletProps} fill={activeColor} />
      </Svg>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function centerX(index: number) {
  'worklet';
  return STEP / 2 + index * STEP;
}

function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.max(min, Math.min(max, value));
}

function easeOutCubic(x: number) {
  'worklet';
  return 1 - Math.pow(1 - x, 3);
}

function easeInOutCubic(x: number) {
  'worklet';
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/**
 * A horizontal blob: circular caps on both ends joined by a waist that can
 * pinch inwards. With width == 2 * radiusY and pinch == 0 it is a perfect circle.
 *
 * @param left    x of the left edge
 * @param right   x of the right edge
 * @param cy      vertical centre
 * @param ry      half-height of the caps
 * @param pinch   0–1, how far the waist is pulled in relative to ry
 */
function blobPath(
  left: number,
  right: number,
  cy: number,
  ry: number,
  pinch: number
) {
  'worklet';

  const width = right - left;
  const rx = Math.min(ry, width / 2);

  const top = cy - ry;
  const bottom = cy + ry;

  const capLeftX = left + rx; // where the left cap meets the body
  const capRightX = right - rx; // where the right cap meets the body
  const midX = (capLeftX + capRightX) / 2;
  const half = (capRightX - capLeftX) / 2;

  const waistTop = cy - ry * (1 - pinch);
  const waistBottom = cy + ry * (1 - pinch);

  const kx = rx * KAPPA;
  const ky = ry * KAPPA;

  return [
    `M ${left} ${cy}`,

    // top-left cap
    `C ${left} ${cy - ky} ${capLeftX - kx} ${top} ${capLeftX} ${top}`,
    // top edge, dipping into the waist
    `C ${capLeftX + half / 2} ${top} ${midX - half / 2} ${waistTop} ${midX} ${waistTop}`,
    `C ${midX + half / 2} ${waistTop} ${capRightX - half / 2} ${top} ${capRightX} ${top}`,
    // top-right cap
    `C ${capRightX + kx} ${top} ${right} ${cy - ky} ${right} ${cy}`,

    // bottom-right cap
    `C ${right} ${cy + ky} ${capRightX + kx} ${bottom} ${capRightX} ${bottom}`,
    // bottom edge, dipping into the waist
    `C ${capRightX - half / 2} ${bottom} ${midX + half / 2} ${waistBottom} ${midX} ${waistBottom}`,
    `C ${midX - half / 2} ${waistBottom} ${capLeftX + half / 2} ${bottom} ${capLeftX} ${bottom}`,
    // bottom-left cap
    `C ${capLeftX - kx} ${bottom} ${left} ${cy + ky} ${left} ${cy}`,

    'Z',
  ].join(' ');
}