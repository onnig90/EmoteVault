# Emote Vault

Emote Vault is a cross-platform Expo app for discovering, saving, and organizing emotes. Search the 7TV catalog, save emotes to your local vault, or add custom emotes with an image URL and tags.

## API

Remote emotes are loaded from the [7TV GraphQL API](https://7tv.io/v3/gql). The app searches the API as you type and loads additional results while you scroll. An internet connection is required to browse and search remote emotes.

Saved emotes are stored locally on the device. Custom emotes are added directly to the local vault and do not require a 7TV account.

## Run locally

### Prerequisites

- Node.js and npm
- Expo Go, an Android emulator, an iOS simulator, or a development build

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run start
```

Then use the options shown by Expo to open the app in Expo Go, an emulator, a simulator, or a web browser.

You can also start a specific platform directly:

```bash
npm run android
npm run ios
npm run web
```

## Development

The app uses Expo Router for file-based navigation and TypeScript throughout the source. Run the linter with:

```bash
npm run lint
```
