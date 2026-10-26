
import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const plugins: NonNullable<ExpoConfig["plugins"]> = [
    ...(config.plugins ?? []),
  ];

  if (process.env.JUSTWEATHER_ABI === "arm64-v8a") {
    plugins.push([
      "expo-build-properties",
      {
        android: {
          buildArchs: ["arm64-v8a"],
          useLegacyPackaging: true,
          enableMinifyInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
        },
      },
    ]);
  }

  return {
    ...config,
    name: config.name ?? "JustWeather",
    slug: config.slug ?? "justweather",
    plugins,
  };
};
