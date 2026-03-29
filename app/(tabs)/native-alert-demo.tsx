import { useCallback, useState } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { showNativeAlert } from '@/modules/native-alert';

// ─── 示範頁面 ─────────────────────────────────────────────────────────────────

export default function NativeAlertDemoScreen() {
  const [lastResult, setLastResult] = useState<string | null>(null);

  // 範例 1：最簡單的 Alert（只有標題）
  const handleSimpleAlert = useCallback(async () => {
    const result = await showNativeAlert({
      title: '👋 嗨！',
    });
    setLastResult(result);
  }, []);

  // 範例 2：有標題 + 訊息的 Alert
  const handleMessageAlert = useCallback(async () => {
    const result = await showNativeAlert({
      title: '訊息通知',
      message: '這是一則來自原生層的提示訊息！',
    });
    setLastResult(result);
  }, []);

  // 範例 3：有多個按鈕的確認 Alert
  const handleConfirmAlert = useCallback(async () => {
    const result = await showNativeAlert({
      title: '確認操作',
      message: '您確定要繼續嗎？此操作無法復原。',
      buttons: [
        { text: '取消', style: 'cancel' },
        { text: '確認', style: 'default' },
      ],
    });
    setLastResult(result);
  }, []);

  // 範例 4：有危險操作按鈕的 Alert
  const handleDestructiveAlert = useCallback(async () => {
    const result = await showNativeAlert({
      title: '⚠️ 危險操作',
      message: '刪除後資料將無法恢復，請確認。',
      buttons: [
        { text: '取消', style: 'cancel' },
        { text: '刪除', style: 'destructive' },
      ],
    });
    setLastResult(result);
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#2A2D3E', dark: '#1A1B26' }}
      headerImage={
        <IconSymbol
          size={200}
          color="#7C83FD"
          name="bell.fill"
          style={styles.headerIcon}
        />
      }>
      {/* 標題區塊 */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>
          原生 Alert 示範
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Native Module Demo
        </ThemedText>
      </ThemedView>

      {/* 說明 */}
      <ThemedView style={styles.infoBox}>
        <ThemedText style={styles.infoText}>
          目前平台：
          <ThemedText type="defaultSemiBold" style={styles.platformBadge}>
            {' '}{Platform.OS.toUpperCase()}{' '}
          </ThemedText>
        </ThemedText>
        <ThemedText style={styles.infoDesc}>
          以下按鈕會呼叫各平台的原生 Alert API。
          {Platform.OS === 'web' ? '（Web 模式使用 RN Alert fallback）' : ''}
        </ThemedText>
      </ThemedView>

      {/* 按鈕群組 */}
      <ThemedView style={styles.buttonGroup}>
        <DemoButton
          label="簡單 Alert"
          description="只有標題"
          color="#7C83FD"
          onPress={handleSimpleAlert}
        />
        <DemoButton
          label="訊息 Alert"
          description="有標題 + 訊息內容"
          color="#4ECDC4"
          onPress={handleMessageAlert}
        />
        <DemoButton
          label="確認 Alert"
          description="有取消 / 確認按鈕"
          color="#45B7D1"
          onPress={handleConfirmAlert}
        />
        <DemoButton
          label="危險 Alert"
          description="有刪除（destructive）按鈕"
          color="#FF6B6B"
          onPress={handleDestructiveAlert}
        />
      </ThemedView>

      {/* 結果顯示 */}
      {lastResult !== null && (
        <ThemedView style={styles.resultBox}>
          <ThemedText style={styles.resultLabel}>⬆ 上一次點擊的按鈕</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.resultText}>
            「{lastResult}」
          </ThemedText>
        </ThemedView>
      )}

      {/* 程式碼說明 */}
      <ThemedView style={styles.codeSection}>
        <ThemedText type="subtitle" style={styles.codeSectionTitle}>
          使用方式
        </ThemedText>
        <ThemedView style={styles.codeBlock}>
          <ThemedText style={styles.codeText}>{`import { showNativeAlert } from '@/modules/native-alert';\n\nconst result = await showNativeAlert({\n  title: '確認',\n  message: '是否繼續？',\n  buttons: [\n    { text: '取消', style: 'cancel' },\n    { text: '確認' },\n  ],\n});\nconsole.log('點擊了：', result);`}</ThemedText>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

// ─── 子元件：按鈕 ─────────────────────────────────────────────────────────────

type DemoButtonProps = {
  label: string;
  description: string;
  color: string;
  onPress: () => void;
};

function DemoButton({ label, description, color, onPress }: DemoButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, { borderColor: color, opacity: pressed ? 0.7 : 1 }]}
      onPress={onPress}>
      <ThemedView style={[styles.buttonAccent, { backgroundColor: color }]} />
      <ThemedView style={styles.buttonContent}>
        <ThemedText type="defaultSemiBold" style={styles.buttonLabel}>
          {label}
        </ThemedText>
        <ThemedText style={styles.buttonDescription}>{description}</ThemedText>
      </ThemedView>
    </Pressable>
  );
}

// ─── 樣式 ──────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  headerIcon: {
    position: 'absolute',
    bottom: -30,
    alignSelf: 'center',
  },
  titleContainer: {
    gap: 4,
    marginBottom: 8,
  },
  title: {
    fontFamily: Fonts.rounded,
  },
  subtitle: {
    opacity: 0.6,
    fontFamily: Fonts.mono,
    fontSize: 13,
  },
  infoBox: {
    borderRadius: 12,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(124, 131, 253, 0.3)',
    backgroundColor: 'rgba(124, 131, 253, 0.08)',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
  },
  platformBadge: {
    color: '#7C83FD',
    fontFamily: Fonts.mono,
  },
  infoDesc: {
    fontSize: 13,
    opacity: 0.7,
  },
  buttonGroup: {
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
  },
  buttonAccent: {
    width: 4,
    alignSelf: 'stretch',
  },
  buttonContent: {
    flex: 1,
    padding: 16,
    gap: 4,
  },
  buttonLabel: {
    fontSize: 16,
  },
  buttonDescription: {
    fontSize: 13,
    opacity: 0.6,
  },
  resultBox: {
    borderRadius: 12,
    padding: 16,
    gap: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
    backgroundColor: 'rgba(78, 205, 196, 0.08)',
    marginTop: 8,
  },
  resultLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  resultText: {
    fontSize: 18,
    color: '#4ECDC4',
  },
  codeSection: {
    gap: 12,
    marginTop: 8,
  },
  codeSectionTitle: {
    fontFamily: Fonts.rounded,
  },
  codeBlock: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  codeText: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    lineHeight: 20,
    opacity: 0.9,
  },
});
