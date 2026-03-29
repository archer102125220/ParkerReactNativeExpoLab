/**
 * 原生 Alert 模組的型別定義
 */

export type NativeAlertButton = {
  /** 按鈕顯示文字 */
  text: string;
  /** 按鈕樣式（僅 iOS 支援） */
  style?: 'default' | 'cancel' | 'destructive';
};

export type NativeAlertOptions = {
  /** Alert 標題 */
  title: string;
  /** Alert 訊息內容（可選） */
  message?: string;
  /** 按鈕列表（可選，預設只有 OK） */
  buttons?: NativeAlertButton[];
};
