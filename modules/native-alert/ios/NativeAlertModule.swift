import ExpoModulesCore
import UIKit

// MARK: - NativeAlertModule

/// 原生 Alert 模組（iOS 實作）
/// 使用 UIAlertController 呈現系統原生 Alert
public class NativeAlertModule: Module {

  // MARK: - Module Definition

  public func definition() -> ModuleDefinition {
    // 模組名稱：JS 端會用這個名字找到此模組
    Name("NativeAlert")

    // 定義 JS 可呼叫的 async function
    AsyncFunction("showAlert") { (title: String, message: String?, buttons: [[String: String]]?, promise: Promise) in
      // 所有 UI 操作必須在 Main Thread 執行
      DispatchQueue.main.async {
        let alert = UIAlertController(
          title: title,
          message: message,
          preferredStyle: .alert
        )

        // 如果有傳入按鈕設定，就逐一加入
        if let buttons = buttons, !buttons.isEmpty {
          for buttonConfig in buttons {
            let buttonText = buttonConfig["text"] ?? "OK"
            let buttonStyle = buttonConfig["style"] ?? "default"

            let actionStyle: UIAlertAction.Style
            switch buttonStyle {
            case "cancel":
              actionStyle = .cancel
            case "destructive":
              actionStyle = .destructive
            default:
              actionStyle = .default
            }

            let action = UIAlertAction(title: buttonText, style: actionStyle) { _ in
              // resolve 時回傳被點擊的按鈕文字
              promise.resolve(buttonText)
            }
            alert.addAction(action)
          }
        } else {
          // 沒有設定按鈕時，預設加一個 OK
          alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
            promise.resolve("OK")
          })
        }

        // 找到最頂層的 ViewController 來呈現 Alert
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
