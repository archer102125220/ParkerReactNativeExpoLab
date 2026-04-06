# Expo Native Module 開發指南

> 本文件說明如何使用 **Expo Modules API** 撰寫 iOS（Swift）與 Android（Kotlin）的原生模組，並透過 TypeScript 在 React Native 中呼叫。
>
> 參考範例：本專案 [`modules/native-alert`](../modules/native-alert/)
> 官方文件：[Expo Modules API Overview](https://docs.expo.dev/modules/overview/) ｜ [Module API Reference](https://docs.expo.dev/modules/module-api/)

---

## 目錄

1. [什麼是 Expo Modules API](#1-什麼是-expo-modules-api)
2. [目錄結構](#2-目錄結構)
3. [Step 1｜建立模組的 package.json](#3-step-1建立模組的-packagejson)
4. [Step 2｜設定 expo-module.config.json](#4-step-2設定-expo-moduleconfigjson)
5. [Step 3｜定義 TypeScript 型別](#5-step-3定義-typescript-型別)
6. [Step 4｜iOS 實作（Swift）](#6-step-4ios-實作swift)
7. [Step 5｜Android 實作（Kotlin）](#7-step-5android-實作kotlin)
8. [Step 6｜TypeScript 橋接層](#8-step-6typescript-橋接層)
9. [Step 7｜平台進入點（Metro 解析規則）](#9-step-7平台進入點metro-解析規則)
10. [Step 8｜在主專案中引用模組](#10-step-8在主專案中引用模組)
11. [Expo Modules API 速查表](#11-expo-modules-api-速查表)
12. [常見問題與注意事項](#12-常見問題與注意事項)

---

## 1. 什麼是 Expo Modules API

Expo Modules API 是建立在 JSI（JavaScript Interface）之上的原生橋接層，讓你用 **Swift** 和 **Kotlin** 撰寫原生功能並暴露給 TypeScript / JavaScript 使用。

相比 React Native 的舊架構 Bridge（JSON message queue），Expo Modules API：

- **效能接近 Turbo Modules**，同樣使用 JSI
- **支援 New Architecture** 並向下相容舊架構
- **API 設計一致**，iOS / Android 用法幾乎相同
- **Autolinking 支援**，不需要手動連結原生程式
- **Boilerplate 少**，比 Turbo Modules 更容易上手

> **適用時機**：不需要 C++ 的場景。若需要底層 C++ 存取，才考慮 Turbo Modules。

---

## 2. 目錄結構

以 `native-alert` 為例，一個完整的 local native module 結構如下：

```
modules/
└── native-alert/
    ├── package.json                  # 模組套件描述（local package）
    ├── expo-module.config.json       # Expo autolinking 設定
    ├── native-alert.types.ts         # TypeScript 型別定義
    ├── NativeAlertModule.ts          # TS 橋接層（requireNativeModule）
    ├── index.native.ts               # iOS / Android 進入點（走原生橋接）
    ├── index.ts                      # Web fallback 進入點
    ├── ios/
    │   ├── NativeAlert.podspec       # CocoaPods 套件描述
    │   └── NativeAlertModule.swift   # iOS 原生實作
    └── android/
        ├── build.gradle              # Android Gradle 建構設定
        └── src/main/java/expo/modules/nativealert/
            └── NativeAlertModule.kt  # Android 原生實作
```

---

## 3. Step 1｜建立模組的 `package.json`

Local module 需要一個 `package.json` 讓主專案的 Yarn workspaces / Metro 能夠識別。

```json
{
  "name": "native-alert",
  "version": "0.0.1",
  "description": "Local native module demo — NativeAlert（UIAlertController / AlertDialog）",
  "main": "index",
  "types": "index",
  "private": true
}
```

> **`"main": "index"`**：Metro 會根據平台自動選擇 `index.native.ts`（iOS/Android）或 `index.ts`（Web）。

接著在主專案的 `package.json` 中加入 workspaces 或路徑別名，讓 TypeScript 能找到這個模組：

```json
// 主專案 package.json（確認 workspaces 包含 modules/*）
{
  "workspaces": ["modules/*"]
}
```

---

## 4. Step 2｜設定 `expo-module.config.json`

告訴 Expo Autolinking 要在哪個平台連結哪個模組類別。

```json
{
  "platforms": ["ios", "android"],
  "ios": {
    "podspecDir": "ios",
    "modules": ["NativeAlertModule"]
  },
  "android": {
    "modules": ["expo.modules.nativealert.NativeAlertModule"]
  }
}
```

| 欄位 | 說明 |
|------|------|
| `platforms` | 支援的平台清單 |
| `ios.podspecDir` | `.podspec` 檔案所在目錄（相對於模組根目錄） |
| `ios.modules` | 要自動連結的 Swift 模組類別名稱 |
| `android.modules` | 要自動連結的 Kotlin 完整類別路徑（含 package） |

---

## 5. Step 3｜定義 TypeScript 型別

在 `native-alert.types.ts` 中集中定義型別，供各層共用：

```typescript
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
```

> **最佳實踐**：將型別獨立成一個檔案，可避免循環依賴，並讓 `index.ts`、`index.native.ts`、`NativeAlertModule.ts` 都能共用同一份型別。

---

## 6. Step 4｜iOS 實作（Swift）

### 6.1 建立 podspec

`ios/NativeAlert.podspec`：

```ruby
require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'NativeAlert'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = { :type => 'MIT' }
  s.author         = 'YourName'
  s.homepage       = 'https://github.com/your-repo'
  s.platforms      = { :ios => '15.1' }
  s.swift_version  = '5.9'
  s.source         = { :path => '.' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'         # 必須依賴

  s.source_files = 'NativeAlertModule.swift'
end
```

### 6.2 Swift 模組實作

`ios/NativeAlertModule.swift`：

```swift
import ExpoModulesCore
import UIKit

public class NativeAlertModule: Module {

  public func definition() -> ModuleDefinition {
    // 模組名稱：JS 端用這個字串找到此模組（需與 requireNativeModule 的參數一致）
    Name("NativeAlert")

    // 定義非同步函數，最後一個參數為 Promise 時，函數會等待 resolve/reject
    AsyncFunction("showAlert") { (title: String, message: String?, buttons: [[String: String]]?, promise: Promise) in
      // UI 操作必須在 Main Thread 執行
      DispatchQueue.main.async {
        let alert = UIAlertController(
          title: title,
          message: message,
          preferredStyle: .alert
        )

        if let buttons = buttons, !buttons.isEmpty {
          for buttonConfig in buttons {
            let buttonText = buttonConfig["text"] ?? "OK"
            let buttonStyle = buttonConfig["style"] ?? "default"

            let actionStyle: UIAlertAction.Style
            switch buttonStyle {
            case "cancel":      actionStyle = .cancel
            case "destructive": actionStyle = .destructive
            default:            actionStyle = .default
            }

            let action = UIAlertAction(title: buttonText, style: actionStyle) { _ in
              promise.resolve(buttonText)   // ✅ resolve 回傳被點擊的按鈕文字
            }
            alert.addAction(action)
          }
        } else {
          alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
            promise.resolve("OK")
          })
        }

        // 取得最頂層的 ViewController 來呈現 Alert
        if let rootVC = UIApplication.shared.windows.first?.rootViewController {
          var topVC = rootVC
          while let presented = topVC.presentedViewController {
            topVC = presented
          }
          topVC.present(alert, animated: true)
        } else {
          promise.reject("NO_VIEW_CONTROLLER", "找不到可以呈現 Alert 的 ViewController")
        }
      }
    }
  }
}
```

**關鍵 API 說明：**

| Swift DSL | 說明 |
|-----------|------|
| `Name("模組名稱")` | 設定 JS 端識別這個模組的字串 |
| `Function("名稱") { ... }` | 同步函數，在 JS Thread 上執行 |
| `AsyncFunction("名稱") { ... }` | 非同步函數，預設在背景 Thread；最後參數為 `Promise` 時等待手動 resolve/reject |
| `AsyncFunction(...).runOnQueue(.main)` | 強制在 Main Thread 執行整個閉包 |
| `promise.resolve(value)` | 成功回傳值給 JS |
| `promise.reject("CODE", "message")` | 拋出錯誤給 JS |
| `Constant("名稱") { value }` | 定義 JS 可讀取的常數 |
| `Events("eventName")` | 定義可從 Native 發送到 JS 的事件名稱 |

---

## 7. Step 5｜Android 實作（Kotlin）

### 7.1 建立 build.gradle

`android/build.gradle`：

```groovy
// ⚠️ Local module 不使用 expo-module-gradle-plugin
// 原因：該 plugin 在子專案 context 中需要 gradle.ext.expoAutolinkingManager，
// 子專案啟動時該值尚未設定，會導致 "Autolinking is not set up in settings.gradle" 的錯誤。
// 改為直接定義 Android library 並手動依賴 expo-modules-core。

plugins {
  id 'com.android.library'
  id 'org.jetbrains.kotlin.android'
}

android {
  namespace "expo.modules.nativealert"   // 需與 package 名稱一致
  compileSdk 36

  defaultConfig {
    minSdk 24
    targetSdk 36
  }

  compileOptions {
    sourceCompatibility JavaVersion.VERSION_17
    targetCompatibility JavaVersion.VERSION_17
  }

  kotlinOptions {
    jvmTarget = '17'
  }
}

dependencies {
  // 提供 Module、ModuleDefinition、AsyncFunction 等 API
  implementation project(':expo-modules-core')
}
```

### 7.2 Kotlin 模組實作

`android/src/main/java/expo/modules/nativealert/NativeAlertModule.kt`：

```kotlin
package expo.modules.nativealert

import android.app.AlertDialog
import android.os.Handler
import android.os.Looper
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise

class NativeAlertModule : Module() {

  override fun definition() = ModuleDefinition {
    // 模組名稱：JS 端用這個字串找到此模組
    Name("NativeAlert")

    // 定義非同步函數（最後一個參數為 Promise -> 手動 resolve/reject）
    AsyncFunction("showAlert") { title: String, message: String?, buttons: List<Map<String, String>>?, promise: Promise ->
      val activity = appContext.currentActivity
      if (activity === null) {
        promise.reject("NO_ACTIVITY", "找不到目前的 Activity", null)
        return@AsyncFunction
      }

      // UI 操作必須在 Main Thread 執行
      // 使用 Handler + Looper（無需額外的 coroutines 依賴）
      Handler(Looper.getMainLooper()).post {
        val builder = AlertDialog.Builder(activity)
        builder.setTitle(title)
        if (!message.isNullOrEmpty()) {
          builder.setMessage(message)
        }

        if (!buttons.isNullOrEmpty()) {
          for (buttonConfig in buttons) {
            val buttonText = buttonConfig["text"] ?: "OK"
            val buttonStyle = buttonConfig["style"] ?: "default"

            when (buttonStyle) {
              "cancel"      -> builder.setNegativeButton(buttonText) { _, _ -> promise.resolve(buttonText) }
              "destructive" -> builder.setNeutralButton(buttonText)  { _, _ -> promise.resolve(buttonText) }
              else          -> builder.setPositiveButton(buttonText) { _, _ -> promise.resolve(buttonText) }
            }
          }
        } else {
          builder.setPositiveButton("OK") { _, _ -> promise.resolve("OK") }
        }

        // 取消時 resolve null，避免 Promise 永遠 pending
        builder.setOnCancelListener { promise.resolve(null) }

        builder.show()
      }
    }
  }
}
```

**Android Kotlin DSL 說明：**

| Kotlin DSL | 說明 |
|------------|------|
| `Name("模組名稱")` | 設定 JS 端識別這個模組的字串 |
| `Function("名稱") { ... }` | 同步函數 |
| `AsyncFunction("名稱") { ..., promise: Promise -> }` | 非同步函數（手動 resolve/reject） |
| `AsyncFunction(...) Coroutine { ... }` | 非同步函數（Kotlin coroutine suspend 寫法） |
| `AsyncFunction(...).runOnQueue(Queues.MAIN)` | 強制在 Main Thread 執行 |
| `promise.resolve(value)` | 成功回傳值給 JS |
| `promise.reject("CODE", "message", exception)` | 拋出錯誤給 JS |
| `appContext.currentActivity` | 取得目前的 Android Activity |

> **⚠️ Android Main Thread 注意**：AlertDialog 等 UI 元件必須在 Main Thread 上建立。若 `AsyncFunction` 的主體不在 Main Thread 上，需用 `Handler(Looper.getMainLooper()).post {}` 切換。

---

## 8. Step 6｜TypeScript 橋接層

`NativeAlertModule.ts` 是 TypeScript 與原生模組之間的橋接：

```typescript
import { NativeModule, requireOptionalNativeModule } from 'expo';

import { type NativeAlertOptions } from './native-alert.types';

// ─── 定義原生模組的型別簽名 ───────────────────────────────────────────────────
// 繼承 NativeModule，並列出所有原生暴露的方法
type NativeAlertNativeModuleType = NativeModule & {
  showAlert: (
    title: string,
    message: string | undefined,
    buttons: { text: string; style?: string }[] | undefined
  ) => Promise<string | null>;
};

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
const NativeAlertNativeModule =
  requireOptionalNativeModule<NativeAlertNativeModuleType>('NativeAlert');

export { NativeAlertNativeModule };
export type { NativeAlertOptions };
```

**`requireNativeModule` vs `requireOptionalNativeModule` 選擇指南：**

| 情境 | 建議 |
|------|------|
| 核心功能，模組缺少 App 無法運作 | `requireNativeModule`（崩潰優於靜默失敗） |
| 漸進增強、有 JS fallback | `requireOptionalNativeModule`（回傳 null） |
| 開發階段示範或 Expo Go 環境 | `requireOptionalNativeModule` |

---

## 9. Step 7｜平台進入點（Metro 解析規則）

Metro bundler 根據副檔名自動選擇平台進入點：

```
index.native.ts   → iOS / Android（優先）
index.ios.ts      → 僅 iOS（最優先）
index.android.ts  → 僅 Android（最優先）
index.ts          → Web 及其他平台（fallback）
```

### `index.native.ts`（iOS / Android 原生路徑）

```typescript
import { type NativeAlertOptions } from './native-alert.types';
import { NativeAlertNativeModule } from './NativeAlertModule';

/**
 * 呼叫原生 Alert 對話框（iOS / Android 原生實作）
 *
 * ⚠️ 需要原生 build 才能使用（Expo Go 不支援自訂原生模組）：
 * ```bash
 * yarn ios      # iOS（需要 Mac + Xcode）
 * yarn android  # Android（需要 Android Studio）
 * ```
 */
export async function showNativeAlert(options: NativeAlertOptions): Promise<string | null> {
  const { title, message, buttons } = options;

  // 原生模組不存在時，拋出明確錯誤而非靜默降級
  // 確保開發者知道此功能需要原生 build
  if (NativeAlertNativeModule === null) {
    throw new Error(
      '[NativeAlert] 原生模組未載入。\n' +
        '請執行原生 build 後再使用此功能：\n' +
        '  yarn ios      ← iOS\n' +
        '  yarn android  ← Android\n' +
        '注意：Expo Go 不支援自訂原生模組。'
    );
  }

  return NativeAlertNativeModule.showAlert(title, message, buttons);
}

export type { NativeAlertOptions, NativeAlertButton } from './native-alert.types';
```

### `index.ts`（Web fallback）

```typescript
import { Alert } from 'react-native';
import { type NativeAlertOptions } from './native-alert.types';

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
```

> **設計決策**：`index.native.ts` 刻意不 fallback 到 `Alert.alert`。這樣可確保開發者能清楚辨別「原生橋接確實有效」vs「靜默降級到 RN Alert」。

---

## 10. Step 8｜在主專案中引用模組

### 10.1 設定路徑別名（tsconfig.json / babel.config.js）

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/modules/native-alert": ["./modules/native-alert/index"]
    }
  }
}
```

### 10.2 在 React Native 元件中使用

```typescript
import { showNativeAlert } from '@/modules/native-alert';

export function MyComponent() {
  const handlePress = useCallback(async () => {
    try {
      const clicked = await showNativeAlert({
        title: '確認操作',
        message: '是否要繼續？',
        buttons: [
          { text: '取消', style: 'cancel' },
          { text: '繼續', style: 'default' },
        ],
      });
      console.log('使用者點擊了：', clicked);
    } catch (error) {
      // 在 Expo Go 或未完成 prebuild 時會進入這裡
      console.error('原生模組未載入', error);
    }
  }, []);

  return <Button title="顯示 Alert" onPress={handlePress} />;
}
```

### 10.3 執行原生 build

自訂 local native module **無法在 Expo Go** 中執行，需要原生 build：

```bash
# iOS（需要 Mac + Xcode）
yarn ios

# Android（需要 Android Studio + Android SDK）
yarn android

# 或使用 expo prebuild 先產生原生專案，再用 Xcode / Android Studio 執行
yarn expo prebuild --clean
```

---

## 11. Expo Modules API 速查表

### DSL 組件一覽

| DSL 組件 | Swift | Kotlin | 說明 |
|----------|-------|--------|------|
| `Name` | `Name("ModuleName")` | `Name("ModuleName")` | 設定 JS 端識別名稱 |
| `Constant` | `Constant("PI") { Double.pi }` | `Constant("PI") { Math.PI }` | 定義唯讀常數 |
| `Function` | `Function("fn") { (arg: String) in ... }` | `Function("fn") { arg: String -> ... }` | 同步函數（JS Thread 上執行） |
| `AsyncFunction` | `AsyncFunction("fn") { (arg: String, promise: Promise) in ... }` | `AsyncFunction("fn") { arg: String, promise: Promise -> ... }` | 非同步函數（支援 Promise） |
| `Property` | `Property("foo") { "bar" }` | `Property("foo") { return@Property "bar" }` | 定義屬性（getter/setter） |
| `Events` | `Events("onEvent")` | `Events("onEvent")` | 宣告可發送的事件名稱 |
| `OnCreate` | `OnCreate { ... }` | `OnCreate { ... }` | 模組初始化時呼叫 |
| `OnDestroy` | `OnDestroy { ... }` | `OnDestroy { ... }` | 模組銷毀時呼叫 |

### 支援的 Argument Types

Expo Modules API 支援以下型別自動轉換（Swift ↔ JS ↔ Kotlin）：

| JS / TypeScript | Swift | Kotlin |
|-----------------|-------|--------|
| `string` | `String` | `String` |
| `number` | `Int`, `Double`, `Float` | `Int`, `Double`, `Float` |
| `boolean` | `Bool` | `Boolean` |
| `null` / `undefined` | `Optional<T>` | `T?` |
| `object` | `[String: Any]` | `Map<String, Any>` |
| `array` | `[T]` | `List<T>` |
| `Promise` | `Promise` | `Promise` |

### 執行緒控制

```swift
// Swift：強制在 Main Thread 執行
AsyncFunction("fn") { ... }.runOnQueue(.main)
```

```kotlin
// Kotlin：強制在 Main Thread 執行
AsyncFunction("fn") { ... }.runOnQueue(Queues.MAIN)

// Kotlin：使用 Coroutine suspend function
AsyncFunction("fn") Coroutine { message: String ->
  delay(1000) // 可以 await 其他 suspend function
  return@Coroutine message
}
```

---

## 12. 常見問題與注意事項

### ❓ 為什麼 Local Module 的 Android 不用 `expo-module-gradle-plugin`？

`expo-module-gradle-plugin` 在子專案（subproject）的 context 中，會嘗試讀取 `gradle.ext.expoAutolinkingManager`，但這個值在子專案啟動時尚未設定，導致：

```
Autolinking is not set up in settings.gradle
```

**解法**：Local module 直接使用 `com.android.library` + `org.jetbrains.kotlin.android` plugin，並手動加入 `implementation project(':expo-modules-core')` 依賴。Expo Autolinking 仍會正確把模組類別注冊到 `ExpoModulesPackageList`。

---

### ❓ `requireNativeModule` vs `requireOptionalNativeModule` 如何選？

```typescript
// ✅ 核心功能 → 找不到就崩潰（fail fast）
const NativeAlertNativeModule = requireNativeModule<ModuleType>('NativeAlert');

// ✅ 有 fallback / 開發階段 → 找不到回傳 null（需自行處理 null）
const NativeAlertNativeModule = requireOptionalNativeModule<ModuleType>('NativeAlert');
```

---

### ❓ 為什麼 `index.native.ts` 不 fallback 到 `Alert.alert`？

若原生模組不存在時靜默降級（fallback）至 `Alert.alert`，開發者會無法分辨：

- 「原生模組真的有運作」
- 「其實在走 RN Alert 的 fallback 路徑」

**最佳實踐**：在 `index.native.ts` 拋出明確錯誤，讓問題立即可見。在 `index.ts`（Web）才提供 fallback。

---

### ❓ 自訂 local native module 在 Expo Go 能使用嗎？

**不能。** Expo Go 是預先編譯好的 App，無法動態載入你的自訂原生程式碼。自訂 native module 必須透過以下方式執行：

```bash
yarn ios       # 重新編譯並以 iOS Simulator 執行
yarn android   # 重新編譯並以 Android Emulator / 裝置執行
```

---

### ❓ 如何發送 Native → JS 事件？

```swift
// Swift：宣告事件
Events("onDataReceived")

// Swift：在任意時間點發送事件
self.sendEvent("onDataReceived", ["data": "hello"])
```

```typescript
// TypeScript：監聽事件
import { EventEmitter } from 'expo-modules-core';

const emitter = new EventEmitter(NativeModule);
const subscription = emitter.addListener('onDataReceived', (event) => {
  console.log(event.data);
});

// 元件卸載時記得移除監聽
subscription.remove();
```

---

## 參考資料

- [Expo Modules API: Overview](https://docs.expo.dev/modules/overview/)
- [Expo Modules API: Get Started](https://docs.expo.dev/modules/get-started/)
- [Expo Modules API: Reference](https://docs.expo.dev/modules/module-api/)
- [expo-module.config.json Reference](https://docs.expo.dev/modules/module-config/)
- [Expo Modules API: Autolinking](https://docs.expo.dev/modules/autolinking/)
- [Tutorial: Creating a native module](https://docs.expo.dev/modules/native-module-tutorial/)
- 本專案範例：[`modules/native-alert`](../modules/native-alert/)
