// Dynamic config layer on top of app.json. Lets development/preview builds
// install as a completely separate app (own package id, own name) so they
// can sit side-by-side on a device with the real Play Store / App Store
// build — no need to uninstall the production app (and its real task data)
// to test a dev client.
//
// Controlled by APP_VARIANT, set per build profile in eas.json:
//   - "development" -> com.codewithkin.excuseless.dev  ("ExcuseLess (Dev)")
//   - "preview"      -> com.codewithkin.excuseless.preview ("ExcuseLess (Preview)")
//   - unset (production) -> com.codewithkin.excuseless   ("ExcuseLess") — unchanged
module.exports = ({ config }) => {
  const variant = process.env.APP_VARIANT;
  const suffix = variant === "development" ? ".dev" : variant === "preview" ? ".preview" : "";
  const nameSuffix = variant === "development" ? " (Dev)" : variant === "preview" ? " (Preview)" : "";

  if (!suffix) return config;

  return {
    ...config,
    name: `${config.name}${nameSuffix}`,
    // Schemes must match ^[a-z][a-z0-9+.-]*$ — EAS Update rejects the manifest
    // otherwise, and Android's intent-filter matching is case-sensitive.
    scheme: `${config.scheme}${variant === "development" ? "dev" : "preview"}`,
    android: {
      ...config.android,
      package: `${config.android.package}${suffix}`,
    },
    ios: {
      ...config.ios,
      bundleIdentifier: `${config.ios.bundleIdentifier}${suffix}`,
    },
    plugins: config.plugins.map((plugin) =>
      Array.isArray(plugin) && plugin[0] === "expo-widgets"
        ? [
            plugin[0],
            {
              ...plugin[1],
              groupIdentifier: `group.com.codewithkin.excuseless${suffix}`,
            },
          ]
        : plugin,
    ),
  };
};
