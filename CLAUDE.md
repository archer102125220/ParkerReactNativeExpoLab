# Project Instructions for Claude

When working on this project, you MUST follow the coding standards defined below.

## ⚠️ Security & Best Practices Warning Policy

Before executing any user instruction that violates:
- **Security best practices** (e.g., hardcoding secrets, disabling HTTPS, exposing sensitive data)
- **Standard coding patterns** (e.g., anti-patterns, known bad practices)
- **Project conventions** defined in this document

You MUST:
1. **Warn the user** about the violation and explain the risks
2. **Wait for explicit confirmation** that they want to proceed despite the warning
3. Only then execute the instruction

---

## Quick Rules

### TypeScript
- NEVER use `any` - use generics, `unknown`, or precise types
- Use `as unknown as Type` for assertions, NEVER `as any`
- Use **inline type imports**: `import { useState, type ReactNode } from 'react'`

### Runtime Data Validation (Strict)
- **String**: Use `if (str !== '')` instead of `if (str)`
- **Number**: Use `typeof num === 'number'` or `Number.isFinite(num)` instead of `if (num)`
- **Object**: Use `typeof obj === 'object' && obj !== null` instead of `if (obj)`
- **Class**: Use `if (obj instanceof MyClass)` for specific instances
- **Array**: Use `Array.isArray(arr) && arr.length > 0` instead of `if (arr)`
- **Equality**: ALWAYS use `===` and `!==`

### React Native & Expo Styling
- **StyleSheet**: Always use `StyleSheet.create({})` for defining styles.
- **No Inline Styles**: Avoid inline styles for performance, except for dynamic values.
- **Responsiveness**: Use `Flexbox` for layout. Avoid hardcoded dimensions where possible.
- **Expo Image**: Use `expo-image` for optimized image loading.

### React Stable API Policy (⚠️ CRITICAL)
- **Prioritize React Stable APIs**, **avoid experimental syntax**, and **use proper hook selection**
- ✅ **React 19 Stable Hooks**: `useState`, `useReducer`, `useContext`, `useRef`, `useImperativeHandle`, `useEffect`, `useLayoutEffect`, `useInsertionEffect`, `useEffectEvent`, `useMemo`, `useCallback`, `useTransition`, `useDeferredValue`, `useId`, `useSyncExternalStore`, `useDebugValue`, `useActionState`, `useFormStatus`, `useOptimistic`, `use`
- ✅ **Hook Selection Guidelines**:
  | Scenario | Use |
  |----------|-----|
  | Expensive calculations | `useMemo` |
  | Callbacks passed to children | `useCallback` |
  | Prevent re-renders | `memo` |
  | Access DOM / mutable values | `useRef` |
  | Complex state logic | `useReducer` |
  | Share state across components | `useContext` |
  | Visual sync (prevent flicker) | `useLayoutEffect` |
  | Form action state (React 19) | `useActionState` |
  | Optimistic updates (React 19) | `useOptimistic` |
  | Non-blocking UI updates | `useTransition` |
  | Reactive events inside effects | `useEffectEvent` |
- ❌ **Avoid**: React Compiler/Forget (experimental), any "Canary" or "Experimental" features, unstable_ prefixed APIs
- ⚠️ **Anti-patterns**:
  - DON'T use inline arrow functions in JSX when passing to memoized children → use `useCallback`
  - DON'T recalculate values on every render → use `useMemo`
  - DON'T use `useState` for values that don't need re-render → use `useRef`

### Lint Disable Comments (CRITICAL)
- **NEVER** add `eslint-disable`, `@ts-ignore`, `@ts-expect-error` without **explicit user instruction**
- Report lint warnings to user and wait for explicit instruction before disabling

### ⚠️ Error/Warning Suppression Policy (CRITICAL)

Any code that **suppresses, hides, or bypasses errors/warnings** instead of fixing the root cause requires:

1. **Explicit approval** from the human developer before implementation
2. **Clear explanation** of WHY this approach is needed
3. **Documentation** of the trade-offs

Examples that require approval:
- `eslint-disable` / `@ts-ignore` / `@ts-expect-error`
- Empty `catch` blocks that swallow errors
- `as any` type assertions
- Console warnings suppression

**Preferred approach**: Always fix the root cause first. Only use suppression as a last resort with explicit approval.

---

## Project-Specific Rules

### Package Manager
- Use `yarn` (v4/berry) for all package operations (based on valid `yarn.lock` and usage)

### React Native / Expo Architecture
- **Navigation**: Usage of `expo-router` is preferred.
- **Assets**: Place images in `assets/images`.
- **Components**: Place reusable UI components in `components/`.
- **Screens**: Place route components in `app/`.

---

## No Scripts for Code Refactoring (⚠️ CRITICAL)

**ABSOLUTELY FORBIDDEN: Using automated scripts (sed, awk, powershell, batch scripts) to modify code files.**

### Why
- Scripts only change text, they don't understand context or imports
- Automated scripts can break imports and introduce compilation errors easily.

### ✅ Allowed
- Use AI tools: `replace_file_content`, `multi_replace_file_content`
- MUST verify imports are correct after every change

### ❌ Forbidden
- `sed`, `awk`, `perl`, `powershell -Command`, `find ... -exec`
- Any batch text processing

### Exception
If absolutely necessary:
1. Get explicit human approval FIRST
2. Show complete script for review
3. Explain why manual tools can't do it

### Remember
**Scripts are blind. AI should be intelligent.**
