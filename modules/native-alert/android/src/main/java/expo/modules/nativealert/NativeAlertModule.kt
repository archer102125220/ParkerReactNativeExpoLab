package expo.modules.nativealert

import android.app.AlertDialog
import android.os.Handler
import android.os.Looper
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise

// MARK: - NativeAlertModule

/**
 * 原生 Alert 模組（Android 實作）
 * 使用 AlertDialog 呈現系統原生 Alert
 *
 * 注意：這個 local module 不使用 expo-module-gradle-plugin，
 * 所以無法使用 appContext.mainQueue.launch{}（需要 kotlinx.coroutines）。
 * 改用 Handler(Looper.getMainLooper()).post{} 達到相同的 Main Thread 切換效果。
 */
class NativeAlertModule : Module() {

  // Module 定義
  override fun definition() = ModuleDefinition {
    // 模組名稱：JS 端用這個名字找到此模組
    Name("NativeAlert")

    // 定義 JS 可呼叫的 async function
    AsyncFunction("showAlert") { title: String, message: String?, buttons: List<Map<String, String>>?, promise: Promise ->
      val activity = appContext.currentActivity
      if (activity === null) {
        promise.reject("NO_ACTIVITY", "找不到目前的 Activity", null)
        return@AsyncFunction
      }

      // 所有 UI 操作必須在 Main Thread 執行
      // 使用 Handler + Looper 取代 coroutines（不需要額外依賴）
      Handler(Looper.getMainLooper()).post {
        val builder = AlertDialog.Builder(activity)
        builder.setTitle(title)
        if (!message.isNullOrEmpty()) {
          builder.setMessage(message)
        }

        // 如果有傳入按鈕設定，就逐一設定
        if (!buttons.isNullOrEmpty()) {
          for (buttonConfig in buttons) {
            val buttonText = buttonConfig["text"] ?: "OK"
            val buttonStyle = buttonConfig["style"] ?: "default"

            when (buttonStyle) {
              "cancel" -> builder.setNegativeButton(buttonText) { _, _ ->
                promise.resolve(buttonText)
              }
              "destructive" -> builder.setNeutralButton(buttonText) { _, _ ->
                promise.resolve(buttonText)
              }
              else -> builder.setPositiveButton(buttonText) { _, _ ->
                promise.resolve(buttonText)
              }
            }
          }
        } else {
          // 沒有設定按鈕時，預設加一個 OK
          builder.setPositiveButton("OK") { _, _ ->
            promise.resolve("OK")
          }
        }

        // 取消時也要 resolve，避免 Promise 永遠 pending
        builder.setOnCancelListener {
          promise.resolve(null)
        }

        builder.show()
      }
    }
  }
}
