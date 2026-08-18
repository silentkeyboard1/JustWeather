import type {
  WeatherIconName,
} from '../../weather/utils/getWeatherCondition';

export function getWidgetWeatherIconSvg(
  icon: WeatherIconName,
  color: string
) {
  const paths =
    getPaths(icon);

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${color}"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      ${paths}
    </svg>
  `;
}

export function getRefreshIconSvg(
  color: string
) {
  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${color}"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M20 11a8 8 0 1 0-2.34 5.66" />
      <path d="M20 4v7h-7" />
    </svg>
  `;
}

function getPaths(
  icon: WeatherIconName
) {
  switch (icon) {
    case 'sun':
      return `
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      `;

    case 'moon':
      return `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
      `;

    case 'cloud-sun':
      return `
        <path d="M12 2v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="M2 12h2" />
        <circle cx="12" cy="10" r="4" />
        <path d="M17.5 19H9a5 5 0 1 1 4.9-6h3.6a3 3 0 1 1 0 6Z" />
      `;

    case 'cloud-moon':
      return `
        <path d="M16 3a6 6 0 0 0 5 9" />
        <path d="M17.5 19H9a5 5 0 1 1 4.9-6h3.6a3 3 0 1 1 0 6Z" />
      `;

    case 'cloud':
      return `
        <path d="M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 1 1 0 9Z" />
      `;

    case 'cloud-fog':
      return `
        <path d="M17.5 15H9a5 5 0 1 1 4.9-6h3.6a3 3 0 1 1 0 6Z" />
        <path d="M5 19h14" />
        <path d="M8 22h8" />
      `;

    case 'cloud-drizzle':
      return `
        <path d="M17.5 15H9a5 5 0 1 1 4.9-6h3.6a3 3 0 1 1 0 6Z" />
        <path d="M8 19v1" />
        <path d="M12 19v1" />
        <path d="M16 19v1" />
      `;

    case 'cloud-rain':
      return `
        <path d="M17.5 15H9a5 5 0 1 1 4.9-6h3.6a3 3 0 1 1 0 6Z" />
        <path d="m8 19-1 2" />
        <path d="m12 19-1 2" />
        <path d="m16 19-1 2" />
      `;

    case 'snowflake':
      return `
        <path d="M12 2v20" />
        <path d="m4.93 6 14.14 12" />
        <path d="m4.93 18 14.14-12" />
        <path d="m9 4 3 3 3-3" />
        <path d="m9 20 3-3 3 3" />
      `;

    case 'cloud-lightning':
      return `
        <path d="M17.5 14H9a5 5 0 1 1 4.9-6h3.6a3 3 0 1 1 0 6Z" />
        <path d="m13 16-3 4h3l-2 3" />
      `;

    default:
      return `
        <path d="M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 1 1 0 9Z" />
      `;
  }
}