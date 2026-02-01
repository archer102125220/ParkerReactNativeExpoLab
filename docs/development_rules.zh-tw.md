# 開發規則與 AI 設定指南

[**English Version**](development_rules.md)

本文件定義了人類開發者的開發規則，並說明這些規則如何在不同的 AI 工具中強制執行。

## 🤖 AI 設定對照表

我們維護特定的設定檔案，以確保不同 AI 程式碼助理之間的行為一致。

| AI 工具 / 模型       | 設定檔案 / 路徑                   | 說明                            |
| -------------------- | --------------------------------- | ------------------------------- |
| **Anthropic Claude** | `CLAUDE.md`                       | Claude 互動的根指令檔案。       |
| **Google Gemini**    | `GEMINI.md`                       | Gemini 互動的根指令檔案。       |
| **GitHub Copilot**   | `.github/copilot-instructions.md` | GitHub Copilot Chat 的指令。    |
| **Cursor IDE**       | `.cursor/rules/*.mdc`             | Cursor AI 上下文的語意規則。    |
| **Windsurf / Agent** | `.agent/rules/*.md`               | Windsurf 或通用 AI 代理的規則。 |

> **注意**：這些檔案是同步的。如果您更新了 `CLAUDE.md`，請確保變更也反映在其他設定中。

## 👨‍💻 人類開發者指南

人類開發者應遵循我們 AI 工具所強制的相同標準。

### 1. 技術堆疊

- **框架**：React Native 搭配 Expo
- **語言**：TypeScript (Strict mode)
- **套件管理器**：Yarn 3 (Berry)
- **路由**：`expo-router` (檔案式路由)
- **樣式**：`StyleSheet.create` (避免使用 inline styles)

### 2. 編碼標準

- **嚴格型別**：絕不使用 `any`。使用 `unknown` 或精確的型別。
- **React Hooks**：
  - 優先使用穩定 API (`useState`, `useEffect` 等)。
  - 除非經明確核准，否則避免使用實驗性功能。
  - 適當地使用 `useCallback` 和 `useMemo` 以提升效能。
- **驗證**：
  - 在執行時驗證資料 (例如：使用 `if (str !== '')` 而非 `if (str)`)。
  - 使用絕對相等 `===`。

### 3. 架構

- **畫面 (Screens)**：`app/`
- **元件 (Components)**：`components/`
- **資產 (Assets)**：`assets/images`

### 4. ⛔ 禁止行為

- **禁止重構腳本**：請勿使用 `sed`、`awk` 或批次腳本來修改程式碼。
- **禁止抑制錯誤**：在沒有記錄原因與核准的情況下，請勿使用 `eslint-disable` 或 `@ts-ignore`。

如需詳細技術規則，請參閱 `CLAUDE.md`，它是唯一的真理來源 (Single Source of Truth)。
