export type OklchColor = {
  l: number;
  c: number;
  h: number;
};

export function normalizeHex(
  value: string
): string | null {
  let hex =
    value
      .trim()
      .replace(
        '#',
        ''
      );

  if (
    /^[0-9a-fA-F]{3}$/.test(
      hex
    )
  ) {
    hex =
      hex
        .split('')
        .map(
          character =>
            character +
            character
        )
        .join('');
  }

  if (
    !/^[0-9a-fA-F]{6}$/.test(
      hex
    )
  ) {
    return null;
  }

  return `#${hex.toUpperCase()}`;
}

export function hexToOklch(
  hex: string
): OklchColor {
  const normalized =
    normalizeHex(hex);

  if (!normalized) {
    throw new Error(
      'Invalid HEX color'
    );
  }

  const r =
    parseInt(
      normalized.slice(
        1,
        3
      ),
      16
    ) / 255;

  const g =
    parseInt(
      normalized.slice(
        3,
        5
      ),
      16
    ) / 255;

  const b =
    parseInt(
      normalized.slice(
        5,
        7
      ),
      16
    ) / 255;

  const linearR =
    srgbToLinear(r);

  const linearG =
    srgbToLinear(g);

  const linearB =
    srgbToLinear(b);

  const l =
    0.4122214708 *
      linearR +
    0.5363325363 *
      linearG +
    0.0514459929 *
      linearB;

  const m =
    0.2119034982 *
      linearR +
    0.6806995451 *
      linearG +
    0.1073969566 *
      linearB;

  const s =
    0.0883024619 *
      linearR +
    0.2817188376 *
      linearG +
    0.6299787005 *
      linearB;

  const lRoot =
    Math.cbrt(l);

  const mRoot =
    Math.cbrt(m);

  const sRoot =
    Math.cbrt(s);

  const lightness =
    0.2104542553 *
      lRoot +
    0.793617785 *
      mRoot -
    0.0040720468 *
      sRoot;

  const a =
    1.9779984951 *
      lRoot -
    2.428592205 *
      mRoot +
    0.4505937099 *
      sRoot;

  const labB =
    0.0259040371 *
      lRoot +
    0.7827717662 *
      mRoot -
    0.808675766 *
      sRoot;

  const chroma =
    Math.sqrt(
      a * a +
        labB * labB
    );

  let hue =
    Math.atan2(
      labB,
      a
    ) *
    (
      180 /
      Math.PI
    );

  if (hue < 0) {
    hue += 360;
  }

  return {
    l: lightness,
    c: chroma,
    h: hue,
  };
}

export function oklchToHex({
  l,
  c,
  h,
}: OklchColor): string {
  /*
   * Very strong OKLCH colors can fall
   * outside the RGB color range.
   *
   * When that happens, reduce chroma
   * while preserving hue/lightness.
   */
  let currentChroma =
    Math.max(
      0,
      c
    );

  for (
    let attempt = 0;
    attempt < 20;
    attempt += 1
  ) {
    const rgb =
      oklchToLinearRgb(
        l,
        currentChroma,
        h
      );

    if (
      isRgbInGamut(
        rgb
      )
    ) {
      return rgbToHex(
        rgb
      );
    }

    currentChroma *=
      0.88;
  }

  return rgbToHex(
    oklchToLinearRgb(
      l,
      0,
      h
    )
  );
}

export function getReadableTextColor(
  background: string
) {
  const white =
    '#F7FAFC';

  const dark =
    '#101418';

  const whiteContrast =
    getContrastRatio(
      background,
      white
    );

  const darkContrast =
    getContrastRatio(
      background,
      dark
    );

  return whiteContrast >
    darkContrast
    ? white
    : dark;
}

export function clamp(
  value: number,
  minimum: number,
  maximum: number
) {
  return Math.max(
    minimum,
    Math.min(
      maximum,
      value
    )
  );
}

function srgbToLinear(
  value: number
) {
  if (
    value <=
    0.04045
  ) {
    return (
      value /
      12.92
    );
  }

  return Math.pow(
    (
      value +
      0.055
    ) /
      1.055,
    2.4
  );
}

function linearToSrgb(
  value: number
) {
  if (
    value <=
    0.0031308
  ) {
    return (
      12.92 *
      value
    );
  }

  return (
    1.055 *
      Math.pow(
        value,
        1 / 2.4
      ) -
    0.055
  );
}

function oklchToLinearRgb(
  lightness: number,
  chroma: number,
  hue: number
) {
  const hueRadians =
    hue *
    (
      Math.PI /
      180
    );

  const a =
    chroma *
    Math.cos(
      hueRadians
    );

  const b =
    chroma *
    Math.sin(
      hueRadians
    );

  const lRoot =
    lightness +
    0.3963377774 *
      a +
    0.2158037573 *
      b;

  const mRoot =
    lightness -
    0.1055613458 *
      a -
    0.0638541728 *
      b;

  const sRoot =
    lightness -
    0.0894841775 *
      a -
    1.291485548 *
      b;

  const l =
    lRoot *
    lRoot *
    lRoot;

  const m =
    mRoot *
    mRoot *
    mRoot;

  const s =
    sRoot *
    sRoot *
    sRoot;

  return {
    r:
      4.0767416621 *
        l -
      3.3077115913 *
        m +
      0.2309699292 *
        s,

    g:
      -1.2684380046 *
        l +
      2.6097574011 *
        m -
      0.3413193965 *
        s,

    b:
      -0.0041960863 *
        l -
      0.7034186147 *
        m +
      1.707614701 *
        s,
  };
}

function isRgbInGamut(
  rgb: {
    r: number;
    g: number;
    b: number;
  }
) {
  return (
    rgb.r >= 0 &&
    rgb.r <= 1 &&
    rgb.g >= 0 &&
    rgb.g <= 1 &&
    rgb.b >= 0 &&
    rgb.b <= 1
  );
}

function rgbToHex(
  rgb: {
    r: number;
    g: number;
    b: number;
  }
) {
  const red =
    linearToByte(
      rgb.r
    );

  const green =
    linearToByte(
      rgb.g
    );

  const blue =
    linearToByte(
      rgb.b
    );

  return (
    '#' +
    red +
    green +
    blue
  );
}

function linearToByte(
  value: number
) {
  const srgb =
    linearToSrgb(
      clamp(
        value,
        0,
        1
      )
    );

  return Math.round(
    clamp(
      srgb,
      0,
      1
    ) *
      255
  )
    .toString(16)
    .padStart(
      2,
      '0'
    )
    .toUpperCase();
}

function getContrastRatio(
  first: string,
  second: string
) {
  const firstLum =
    getRelativeLuminance(
      first
    );

  const secondLum =
    getRelativeLuminance(
      second
    );

  const lighter =
    Math.max(
      firstLum,
      secondLum
    );

  const darker =
    Math.min(
      firstLum,
      secondLum
    );

  return (
    (
      lighter +
      0.05
    ) /
    (
      darker +
      0.05
    )
  );
}

function getRelativeLuminance(
  hex: string
) {
  const normalized =
    normalizeHex(hex);

  if (!normalized) {
    return 0;
  }

  const values = [
    normalized.slice(
      1,
      3
    ),
    normalized.slice(
      3,
      5
    ),
    normalized.slice(
      5,
      7
    ),
  ].map(
    part =>
      srgbToLinear(
        parseInt(
          part,
          16
        ) /
          255
      )
  );

  return (
    0.2126 *
      values[0] +
    0.7152 *
      values[1] +
    0.0722 *
      values[2]
  );
}