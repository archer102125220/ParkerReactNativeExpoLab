# 原生模組示範：NativeAlert

這份文件說明如何在 **Expo Managed Workflow** 裡用 **Expo Modules API** 撰寫一個原生功能，並暴露給 JS/TS 使用。示範功能：呼叫各平台的原生 Alert 對話框。

---

## 整體架構

```
modules/native-alert/
├── native-alert.types.ts   ← TypeScript 型別定義（共用）
├── NativeAlertModule.ts    ← requireNativeModule 橋接
├── index.native.ts         ← iOS / Android 入口（Metro 優先載入）
├── index.ts                ← Web fallback 入口
├── ios/
│   └── NativeAlertModule.swift   ← iOS 原生實作（UIAlertController）
└── android/
    └── NativeAlertModule.kt      ← Android 原生實作（AlertDialog）
```

---

## 核心概念

### 1. Expo Modules API 模式

原生端使用 `Name()` 宣告模組名稱，用 `AsyncFunction()` 宣告可從 JS 呼叫的非同步函數，透過 `Promise` 回傳結果。

```swift
// iOS — NativeAlertModule.swift
public class NativeAlertModule: Module {
  public func definition() -> ModuleDefinition {
    Name("NativeAlert")                    // JS 找模組的名字

    AsyncFunction("showAlert") {           // 暴露給 JS 的 async 函數
      (title: String, message: String?, ..., promise: Promise) in
      // ... 原生 UI 邏輯 ...
      promise.resolve("OK")               // 回傳結果給 JS
    }
  }
}
```

```kotlin
// Android — NativeAlertModule.kt
class NativeAlertModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NativeAlert")

    AsyncFunction("showAlert") {
      title: String, message: String?, ..., promise: Promise ->
      // ... 原生 UI 邏輯 ...
      promise.resolve("OK")
    }
  }
}
```

### 2. JS 橋接（NativeAlertModule.ts）

```ts
import { requireNativeModule } from 'expo';

const NativeAlertNativeModule = requireNativeModule('NativeAlert');
// Metro 會自動根據平台載入對應的 .swift / .kt
```

### 3. 平台分離（Metro 平台解析）

Metro bundler 有內建的平台檔案解析優先順序，利用副檔名即可無縫分離平台邏輯，**不需要** `if (Platform.OS !== 'web')` + 動態 `require()`：

| 副檔名 | 適用平台 |
|---|---|
| `index.ios.ts` | iOS（最優先） |
| `index.android.ts` | Android（最優先） |
| `index.native.ts` | iOS + Android（兩平台共用時） |
| `index.ts` | Web 及所有其他平台（fallback） |

本模組利用這個機制：

- **`index.native.ts`** — 呼叫真正的原生橋接（`requireNativeModule`）
- **`index.ts`** — Web 用 `Alert.alert()` 作為 fallback

### 4. 從 JS/TS 使用

```ts
import { showNativeAlert } from '@/modules/native-alert';

// 簡單 Alert（只有標題）
await showNativeAlert({ title: '嗨！' });

// 有訊息 + 多按鈕
const result = await showNativeAlert({
  title: '確認操作',
  message: '是否繼續？',
  buttons: [
    { text: '取消', style: 'cancel' },
    { text: '確認', style: 'default' },
  ],
});
console.log('使用者點擊了：', result); // → "確認" 或 "取消"
```

---

## 按鈕樣式（`style`）說明

| 值 | iOS 效果 | Android 效果 |
|---|---|---|
| `'default'` | 一般藍色文字 | Positive button |
| `'cancel'` | 粗體（取消語意） | Negative button |
| `'destructive'` | 紅色文字（警示語意） | Neutral button |

---

## 示範頁面

新增了一個示範 Tab 頁面：`app/(tabs)/native-alert-demo.tsx`

- 底部導覽列第三個 tab（🔔 icon）
- 4 個按鈕分別示範不同的 Alert 情境
- 顯示上次點擊的按鈕名稱（驗證 Promise resolve 值）

---

## ⚠️ 重要提醒

**Expo Go 不支援自訂原生模組**，需要建立 native build 才能實際執行：

```bash
# iOS（需要 Mac + Xcode）
yarn ios

# Android（需要 Android Studio）
yarn android
```

執行後會觸發 `expo prebuild`，產生 `ios/` 和 `android/` 原生專案，並自動將 Swift / Kotlin 模組編譯進去。

> **Local Expo Modules**（放在專案 `modules/` 資料夾下的模組）不需要另外 `npm publish`，Expo 編譯時會自動識別並一起建置。

---

## 延伸閱讀

- [Expo Modules API 官方文件](https://docs.expo.dev/modules/overview/)
- [建立 Local Expo Module](https://docs.expo.dev/modules/get-started/)
- [Metro 平台特定副檔名](https://metrobundler.dev/docs/configuration/#platforms)
