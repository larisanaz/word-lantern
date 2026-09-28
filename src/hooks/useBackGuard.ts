import { useEffect } from 'react';
import { BackHandler } from 'react-native';

/**
 * Keeps hardware back INSIDE the app.
 *
 * The single Activity finishes on the default back press, so the capture
 * harness photographed the Android launcher instead of the next round. The
 * listener always returns true: game/result step back to the menu, loader and
 * menu swallow the press.
 *
 * This lives under src/ on purpose — build-apk-cloud.sh hashes src/ but not the
 * root App.tsx, so an App.tsx-only edit is silently dropped by the APK cache.
 */
export function useBackGuard(
  screen: string,
  onEscape: () => void,
): void {
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'game' || screen === 'result') {
        onEscape();
      }
      return true;
    });
    return () => sub.remove();
  }, [screen, onEscape]);
}

export default useBackGuard;
