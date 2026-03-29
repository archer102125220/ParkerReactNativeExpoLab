import { Alert } from 'react-native';

import { type NativeAlertOptions } from './native-alert.types';

// ─── Web Fallback ─────────────────────────────────────────────────────────────
//
// 這個檔案（index.ts）是 Web 平台的實作。
// iOS / Android 平台會優先使用 index.native.ts。
//
// Metro bundler 的平台解析規則：
//   index.native.ts  → iOS / Android
//   index.ts         → Web（及所有其他平台）
// ──────────────────────────────────────────────────────────────────────────────

/**
 * 呼叫 Alert 對話框（Web fallback：使用 React Native Alert.alert）
 */
export async function showNativeAlert(options: NativeAlertOptions): Promise<string | null> {
  const { title, message, buttons } = options;

  return new Promise<string | null>((resolve) => {
    const rnButtons = (buttons ?? [{ text: 'OK' }]).map((btn) => ({
      text: btn.text,
      onPress: () => resolve(btn.text),
      style: btn.style as 'cancel' | 'default' | 'destructive' | undefined,
    }));
    Alert.alert(title, message, rnButtons);
  });
}

export type { NativeAlertOptions, NativeAlertButton } from './native-alert.types';
