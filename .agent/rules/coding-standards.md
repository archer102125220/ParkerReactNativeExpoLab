---
description: Project coding standards and conventions
globs: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"]
alwaysApply: true
---

# Project Coding Standards

## TypeScript
- Never use `any` type - use generics, `unknown`, or precise types
- Use `as unknown as Type` for assertions
- Use inline type imports: `import { useState, type ReactNode } from 'react'`

## React Native / Expo Styling
- **StyleSheet**: Always use `StyleSheet.create({})`
- **No Inline Styles**: Avoid unless dynamic values
- **Flexbox**: Use Flexbox for layout
- **Expo Image**: Use `expo-image`

## React/Hooks (React 19) (CRITICAL)
- **Stable APIs ONLY**: useState, useEffect, useLayoutEffect, useMemo, useCallback, useRef, useContext, useReducer, useActionState, useOptimistic, useTransition, useFormStatus, useSyncExternalStore, useId, useDebugValue, useInsertionEffect
- **Use `useEffectEvent`** for reactive events inside effects
- **useLayoutEffect**: Visual sync (sliders, position)
- **useEffect**: Data fetching, subscriptions, timers
- ❌ **Anti-patterns**: 
  - Inline arrow fn to memoized children → `useCallback`
  - Recalculating every render → `useMemo`
  - `useState` for non-render values → `useRef`

## Package Manager
- Use `yarn` (v4/berry)

## Lint Comments
- NEVER add `eslint-disable` or `@ts-ignore` without explicit user instruction

## Error/Warning Suppression (CRITICAL)
- Any code that suppresses errors (eslint-disable, @ts-ignore, empty catch blocks, as any) requires:
  1. Explicit approval from human developer
  2. Clear explanation of WHY
  3. Always fix root cause first
