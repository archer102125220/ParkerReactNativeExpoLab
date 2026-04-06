import { type NativeAlertOptions } from './native-alert.types';
import { NativeAlertNativeModule } from './NativeAlertModule';

// ─── iOS / Android 原生實作 ───────────────────────────────────────────────────
//
// 這個檔案（index.native.ts）只在 iOS / Android 上被 Metro 打包。
// Web 平台會 fallback 到 index.ts。
//
// Metro bundler 的平台解析規則：
//   index.native.ts  → iOS / Android（優先）
//   index.ts         → Web（及所有其他平台）
//
// 關於 NativeAlertNativeModule 為 null 的情境：
//   原生 build（yarn ios / yarn android）→ 模組存在，走原生橋接路徑
//   Expo Go / 尚未 prebuild               → 模組為 null，拋出明確錯誤
//
// ⚠️ 這裡刻意不 fallback 到 Alert.alert，目的是確保原生橋接真正有效。
//    若 fallback 到 RN Alert，無法區分「原生模組有效」vs「靜默降級」。
// ──────────────────────────────────────────────────────────────────────────────

/**
 * 呼叫原生 Alert 對話框（iOS / Android 原生實作）
 *
 * ⚠️ 需要原生 build 才能使用，Expo Go 不支援自訂原生模組：
 * ```bash
 * yarn ios      # iOS（需要 Mac + Xcode）
 * yarn android  # Android（需要 Android Studio）
 * ```
 *
 * @example
 * ```ts
 * import { showNativeAlert } from '@/modules/native-alert';
 *
 * const clicked = await showNativeAlert({
 *   title: '確認',
 *   message: '是否繼續？',
 *   buttons: [
 *     { text: '取消', style: 'cancel' },
 *     { text: '繼續' },
 *   ],
 * });
 * console.log('使用者點擊了：', clicked);
 * ```
 */
export async function showNativeAlert(options: NativeAlertOptions): Promise<string | null> {
  const { title, message, buttons } = options;

  // 原生模組不存在時，拋出明確錯誤而非靜默降級
  // 這確保開發者能清楚知道：此功能需要執行原生 build（yarn ios / yarn android）
  if (NativeAlertNativeModule === null) {
    throw new Error(
      '[NativeAlert] 原生模組未載入。\n' +
        '請執行原生 build 後再使用此功能：\n' +
        '  yarn ios      ← iOS\n' +
        '  yarn android  ← Android\n' +
        '注意：Expo Go 不支援自訂原生模組。'
    );
  }

  // ✅ 原生模組存在（已完成 prebuild）→ 走真正的原生橋接
  return NativeAlertNativeModule.showAlert(title, message, buttons);
}

export type { NativeAlertOptions, NativeAlertButton } from './native-alert.types';
