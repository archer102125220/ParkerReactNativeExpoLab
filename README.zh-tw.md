# ParkerReactNativeExpoLab

這是一個使用 [`create-expo-app`](https://www.npmjs.com/package/create-expo-app) 建立的 [Expo](https://expo.dev) 專案，目前配置使用 **Yarn 3**。

[**English Version**](README.md)

## 開始使用

1. 安裝依賴套件

   ```bash
   yarn install
   ```

2. 啟動應用程式

   ```bash
   yarn start
   ```

   或者在特定平台上執行：
   - `yarn android`
   - `yarn ios`
   - `yarn web`

在輸出訊息中，你會看到開啟應用程式的選項：

- [開發版本 (development build)](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android 模擬器](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS 模擬器](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)，一個用於嘗試 Expo 應用程式開發的受限沙盒環境

## 專案結構

你可以編輯 **app** 目錄下的檔案來開始開發。本專案使用 [檔案式路由 (file-based routing)](https://docs.expo.dev/router/introduction)。

## 腳本

- `yarn reset-project`：將專案重置為空白狀態（將初始程式碼移動到 `app-example`）。

## 了解更多

要了解更多關於使用 Expo 開發專案的資訊，請參考以下資源：

- [Expo 文件](https://docs.expo.dev/)：學習基礎知識，或透過我們的 [指南](https://docs.expo.dev/guides) 深入了解進階主題。
- [學習 Expo 教學](https://docs.expo.dev/tutorial/introduction/)：跟隨逐步教學，建立一個可在 Android、iOS 和 Web 上執行的專案。

## 加入社群

加入我們的開發者社群，一起創造通用應用程式。

- [Expo GitHub](https://github.com/expo/expo)：查看我們的開源平台並參與貢獻。
- [Discord 社群](https://chat.expo.dev)：與 Expo 使用者聊天並提問。

## AI 規則與設定

本專案包含從 `pos-switch-ai-agent` 改編的 AI 編碼規則。

### ⚠️ 已知問題 / 缺少設定

- **i18n (國際化)**：
  - 原始 AI 規則包含 `next-intl` 特定設定，因與此 React Native 專案不相容已被移除。
  - **狀態**：尚未新增 i18n 相關的 AI 規則（例如使用 `i18next` 或 `expo-localization`）。
  - 在要求 AI 執行翻譯任務之前，請手動設定 i18n 或提供偏好函式庫的具體說明。

## 📘 開發者指南

關於 AI 規則如何對應到不同模型，以及給人類開發者的通用開發準則，請閱讀：

👉 [**Development Rules & AI Configuration Guide**](docs/development_rules.zh-tw.md)
