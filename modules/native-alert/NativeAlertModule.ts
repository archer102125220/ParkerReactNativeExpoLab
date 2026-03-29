import { NativeModule, requireNativeModule } from 'expo';

import { type NativeAlertOptions } from './native-alert.types';

// 取得原生模組實例
// requireNativeModule 會根據平台自動載入對應的原生程式碼
// 若平台不支援（如 Web），會在 index.ts 的 fallback 中處理
const NativeAlertNativeModule: NativeModule & {
  showAlert: (
    title: string,
    message: string | undefined,
    buttons: { text: string; style?: string }[] | undefined
  ) => Promise<string | null>;
} = requireNativeModule('NativeAlert');

export { NativeAlertNativeModule };
export type { NativeAlertOptions };
