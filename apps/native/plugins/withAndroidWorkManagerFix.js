const { withAppBuildGradle } = require("expo/config-plugins");

// Fixes a Gradle "Duplicate class androidx.work.*" build failure.
// react-native-android-widget uses AndroidX WorkManager internally for
// periodic widget refresh; some other dependency in the tree transitively
// pulls an older androidx.work:work-runtime-ktx version, and the two
// conflicting copies of compiled classes (OneTimeWorkRequestKt,
// PeriodicWorkRequestKt) can't coexist in one APK. Forcing a single
// consistent version across the whole dependency graph resolves it.
//
// Since apps/native/android is generated fresh by prebuild on every build
// (no committed native folder), this has to be injected via a config
// plugin rather than hand-edited into build.gradle directly, or the fix
// would be silently lost on the next prebuild.
const WORK_VERSION = "2.8.1";

const withAndroidWorkManagerFix = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language !== "groovy") {
      throw new Error("withAndroidWorkManagerFix only supports Groovy build.gradle files");
    }
    if (config.modResults.contents.includes("androidx.work:work-runtime")) {
      return config; // already applied
    }
    config.modResults.contents += `
configurations.all {
    resolutionStrategy {
        force 'androidx.work:work-runtime:${WORK_VERSION}'
        force 'androidx.work:work-runtime-ktx:${WORK_VERSION}'
    }
}
`;
    return config;
  });
};

module.exports = withAndroidWorkManagerFix;
