# Development Rules & AI Configuration Guide

[**繁體中文版本**](development_rules.zh-tw.md)

This document defines the development rules for human developers and explains how these rules are enforced across different AI tools.

## 🤖 AI Configuration Mapping

We maintain specific configuration files to ensure consistent behavior across different AI coding assistants.

| AI Tool / Model      | Configuration File / Path         | Description                                          |
| -------------------- | --------------------------------- | ---------------------------------------------------- |
| **Anthropic Claude** | `CLAUDE.md`                       | Root instruction file for Claude-based interactions. |
| **Google Gemini**    | `GEMINI.md`                       | Root instruction file for Gemini-based interactions. |
| **GitHub Copilot**   | `.github/copilot-instructions.md` | Instructions for GitHub Copilot Chat.                |
| **Cursor IDE**       | `.cursor/rules/*.mdc`             | Semantic rules for Cursor's AI context.              |
| **Windsurf / Agent** | `.agent/rules/*.md`               | Rules for Windsurf or generic AI agents.             |

> **Note**: These files are synchronized. If you update `CLAUDE.md`, ensure changes are reflected in other configurations.

## 👨‍💻 Human Developer Guidelines

Human developers are expected to follow the same standards enforced by our AI tools.

### 1. Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript (Strict mode)
- **Package Manager**: Yarn 3 (Berry)
- **Routing**: `expo-router` (File-based routing)
- **Styling**: `StyleSheet.create` (Avoid inline styles)

### 2. Coding Standards

- **Strict Types**: Never use `any`. Use `unknown` or precise types.
- **React Hooks**:
  - Prefer stable APIs (`useState`, `useEffect`, etc.).
  - Avoid experimental features unless explicitly approved.
  - Use `useCallback` and `useMemo` appropriately for performance.
- **Validation**:
  - Validate data at runtime (e.g., `if (str !== '')` instead of `if (str)`).
  - Use absolute equality `===`.

### 3. Architecture

- **Screens**: `app/`
- **Components**: `components/`
- **Assets**: `assets/images`

### 4. ⛔ Forbidden Actions

- **No Refactoring Scripts**: Do not use `sed`, `awk`, or batch scripts to modify code.
- **No Error Suppression**: Do not use `eslint-disable` or `@ts-ignore` without a documented reason and approval.

For detailed technical rules, refer to `CLAUDE.md` which serves as the single source of truth.
