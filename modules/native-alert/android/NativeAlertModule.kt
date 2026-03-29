package expo.modules.nativealert

import android.app.AlertDialog
import android.content.Context
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise

// MARK: - NativeAlertModule

/**
 * 原生 Alert 模組（Android 實作）
 * 使用 AlertDialog 呈現系統原生 Alert
 */
class NativeAlertModule : Module() {

  // Module 定義
  override fun definition() = ModuleDefinition {
    // 模組名稱：JS 端用這個名字找到此模組
    Name("NativeAlert")

    // 定義 JS 可呼叫的 async function
    AsyncFunction("showAlert") { title: String, message: String?, buttons: List<Map<String, String>>?, promise: Promise ->
      val context: Context = appContext.reactContext
        ?: run {
          promise.reject("NO_CONTEXT", "找不到 Android Context", null)
          return@AsyncFunction
        }

      // 所有 UI 操作必須在 Main Thread 執行
      appContext.mainQueue.launch {
        val activity = appContext.currentActivity
          ?: run {
            promise.reject("NO_ACTIVITY", "找不到目前的 Activity", null)
            return@launch
          }

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
