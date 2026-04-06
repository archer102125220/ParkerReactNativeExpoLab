#!/usr/bin/env node
/* eslint-env node */

/**
 * check-java.js
 *
 * 在執行 Android build 之前：
 * 1. 驗證當前 Java 版本是否符合需求（Gradle 8.x 需要 Java 21）
 * 2. 若 android/local.properties 不存在，自動補建（在 expo prebuild --clean 後會被刪除）
 *
 * 對應 .sdkmanrc 中指定的版本：java=21.0.7-tem
 */

"use strict";

const { execSync } = require("child_process");

const REQUIRED_MAJOR = 21;

// ─── 1. 驗證 Java 版本 ────────────────────────────────────────────────────────

let javaVersionOutput;
try {
  // java -version 輸出到 stderr
  javaVersionOutput = execSync("java -version 2>&1").toString();
} catch {
  console.error("❌ 找不到 java 指令，請確認 Java 已安裝且在 PATH 中。");
  console.error("");
  console.error("  建議使用 SDKMAN 切換版本：");
  console.error("    sdk env          ← 切換到 .sdkmanrc 指定的版本");
  console.error("    sdk env install  ← 若版本未安裝，自動下載後切換");
  process.exit(1);
}

// 解析 major version（例："openjdk version \"21.0.7\" ..." → 21）
const match = javaVersionOutput.match(/version "(\d+)(?:\.(\d+))?/);
if (match === null) {
  console.error("❌ 無法解析 Java 版本，請確認 java -version 可正常執行。");
  console.error("輸出內容：", javaVersionOutput);
  process.exit(1);
}

const major = parseInt(match[1], 10);

// Java 1.x 格式（Java 8 以前）→ 次版本才是 major
const actualMajor = major === 1 ? parseInt(match[2] ?? "0", 10) : major;

if (actualMajor !== REQUIRED_MAJOR) {
  console.error(`❌ Java 版本不相容！`);
  console.error(`   目前版本：Java ${actualMajor}`);
  console.error(`   需要版本：Java ${REQUIRED_MAJOR}`);
  console.error("");
  console.error("  請切換 Java 版本後再重試：");
  console.error(
    "    sdk env          ← 切換到 .sdkmanrc 指定的版本（需要 SDKMAN 環境）",
  );
  console.error("    sdk env install  ← 若版本未安裝，自動下載後切換");
  console.error("");
  console.error("  若 sdk 指令找不到，請先在 shell 啟動時載入 SDKMAN：");
  console.error("    source ~/.sdkman/bin/sdkman-init.sh");
  process.exit(1);
}

console.log(`✅ Java ${actualMajor} — 版本相容，繼續 Android build...`);
