// Custom entry point.
//
// We still boot expo-router exactly as before (this used to be the `main`
// field directly), but Android home screen widgets additionally need a task
// handler registered at the top level — outside React — so the OS can ask
// the app to render a widget when one is added, resized, or refreshed.
// Without this, newly added widgets render as empty transparent boxes and
// Metro logs "No task registered for key RNWidgetBackgroundTask".
import "expo-router/entry";

import { Platform } from "react-native";

if (Platform.OS === "android") {
  const { registerWidgetTaskHandler } = require("react-native-android-widget");
  const { widgetTaskHandler } = require("./widgets/widget-task-handler");
  registerWidgetTaskHandler(widgetTaskHandler);
}
