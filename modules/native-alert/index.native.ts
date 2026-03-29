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
// ──────────────────────────────────────────────────────────────────────────────

/**
 * 呼叫原生 Alert 對話框（iOS / Android 原生實作）
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
  return NativeAlertNativeModule.showAlert(title, message, buttons);
}

export type { NativeAlertOptions, NativeAlertButton } from './native-alert.types';
