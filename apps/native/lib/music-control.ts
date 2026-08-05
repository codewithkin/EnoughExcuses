import MusicControl, { Command } from "react-native-music-control";
import { Platform } from "react-native";

// Stable, arbitrary id for the persistent focus-timer media notification.
const LIVE_TIMER_NOTIFICATION_ID = 1001;
const LIVE_TIMER_CHANNEL_ID = "live-timer";

export function showTimerControls(
  remaining: number,
  total: number,
  taskTitle: string,
  goalTitle?: string,
) {
  MusicControl.enableBackgroundMode(true);
  if (Platform.OS === "android") {
    // Native signature is (notificationId: number, channelId: string) —
    // passing a string for the id throws "Expected argument 0 ... to be a
    // number". The id is an arbitrary stable int; the channel is the string.
    MusicControl.setNotificationId(LIVE_TIMER_NOTIFICATION_ID, LIVE_TIMER_CHANNEL_ID);
  }

  MusicControl.setNowPlaying({
    title: taskTitle,
    artist: goalTitle ?? "ExcuseLess",
    duration: total,
    elapsedTime: total - remaining,
  });

  MusicControl.enableControl(Command.play, true);
  MusicControl.enableControl(Command.pause, true);
  MusicControl.enableControl(Command.skipForward, true);
  MusicControl.enableControl(Command.nextTrack, true);

  MusicControl.updatePlayback({
    state: MusicControl.STATE_PLAYING,
    elapsedTime: total - remaining,
  });
}

export function updateTimerControls(remaining: number, paused: boolean) {
  MusicControl.updatePlayback({
    state: paused ? MusicControl.STATE_PAUSED : MusicControl.STATE_PLAYING,
    elapsedTime: undefined,
  });
}

export function hideTimerControls() {
  MusicControl.resetNowPlaying();
  MusicControl.stopControl();
}

export function onTimerControl(
  handlers: {
    onPlay: () => void;
    onPause: () => void;
    onSkipForward: () => void;
    onNextTrack: () => void;
  },
): () => void {
  MusicControl.on(Command.play, handlers.onPlay);
  MusicControl.on(Command.pause, handlers.onPause);
  MusicControl.on(Command.skipForward, handlers.onSkipForward);
  MusicControl.on(Command.nextTrack, handlers.onNextTrack);
  return () => {
    MusicControl.off(Command.play);
    MusicControl.off(Command.pause);
    MusicControl.off(Command.skipForward);
    MusicControl.off(Command.nextTrack);
  };
}