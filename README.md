# ParkerReactNativeExpoLab

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app), currently configured to use **Yarn 3**.

[**繁體中文版本**](README.zh-tw.md)

## Get started

1. Install dependencies

   ```bash
   yarn install
   ```

2. Start the app

   ```bash
   yarn start
   ```

   Or run on specific platforms:
   - `yarn android`
   - `yarn ios`
   - `yarn web`

In the output, you'll find options to open the app in a:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Project Structure

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Scripts

- `yarn reset-project`: Resets the project to a blank state (moves starter code to `app-example`).

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## AI Rules & Configuration

This project includes AI coding rules adapted from `pos-switch-ai-agent`.

### ⚠️ Known Issues / Missing Configuration

- **i18n (Internationalization)**:
  - The original AI rules contained `next-intl` specific configurations which were removed as they are not compatible with this React Native project.
  - **Status**: AI rules for i18n (e.g., using `i18next` or `expo-localization`) have **NOT** yet been added.
  - Please configure i18n manually or provide specific instructions for the preferred library before asking AI to work on translation tasks.
