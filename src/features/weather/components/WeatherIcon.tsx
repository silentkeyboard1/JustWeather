import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSun,
  Moon,
  Snowflake,
  Sun,
} from 'lucide-react-native';

import type { WeatherIconName } from '../utils/getWeatherCondition';

type WeatherIconProps = {
  name: WeatherIconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function WeatherIcon({
  name,
  size = 24,
  color = '#302F2C',
  strokeWidth = 2,
}: WeatherIconProps) {
  const iconProps = {
    size,
    color,
    strokeWidth,
  };

  switch (name) {
    case 'sun':
      return <Sun {...iconProps} />;

    case 'moon':
      return <Moon {...iconProps} />;

    case 'cloud-sun':
      return <CloudSun {...iconProps} />;

    case 'cloud-moon':
      return <CloudMoon {...iconProps} />;

    case 'cloud':
      return <Cloud {...iconProps} />;

    case 'cloud-fog':
      return <CloudFog {...iconProps} />;

    case 'cloud-drizzle':
      return <CloudDrizzle {...iconProps} />;

    case 'cloud-rain':
      return <CloudRain {...iconProps} />;

    case 'snowflake':
      return <Snowflake {...iconProps} />;

    case 'cloud-lightning':
      return <CloudLightning {...iconProps} />;

    default:
      return <Cloud {...iconProps} />;
  }
}