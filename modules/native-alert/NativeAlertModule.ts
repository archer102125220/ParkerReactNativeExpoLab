import { NativeModule, requireOptionalNativeModule } from 'expo';

import { type NativeAlertOptions } from './native-alert.types';

// ─── requireNativeModule vs requireOptionalNativeModule ───────────────────────
//
// requireNativeModule('NativeAlert')
//   → 找不到模組時【立即拋出例外】並讓 App 崩潰
//   → 適合：確定已編譯進原生 App、絕對不能缺少的核心模組
//
// requireOptionalNativeModule('NativeAlert')
//   → 找不到模組時【回傳 null】，不崩潰
//   → 適合：示範用、漸進增強、Expo Go 相容、或有 JS fallback 的場景
//
// 本專案選用 requireOptionalNativeModule 的理由：
//   1. 在 Expo Go 環境中，自訂原生模組不存在，但 App 不應崩潰
//   2. 在尚未執行 `expo prebuild` / `yarn ios / android` 時，同樣不應崩潰
//   3. index.native.ts 已提供原生呼叫，index.ts 提供 JS fallback
//      → 這層只負責「橋接」，需要能安全地返回 null 讓上層決定如何處理
//
// 若要強制要求原生模組存在（生產環境核心功能），請改回 requireNativeModule
// ──────────────────────────────────────────────────────────────────────────────

type NativeAlertNativeModuleType = NativeModule & {
  showAlert: (
    title: string,
    message: string | undefined,
    buttons: { text: string; style?: string }[] | undefined
  ) => Promise<string | null>;
};

// 找不到原生模組時回傳 null（不崩潰），由 index.native.ts 的呼叫端處理 null 情境
const NativeAlertNativeModule =
  requireOptionalNativeModule<NativeAlertNativeModuleType>('NativeAlert');

export { NativeAlertNativeModule };
export type { NativeAlertOptions };
