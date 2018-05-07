# Пример приложения на React Native ##

----------
## Сборка:
Установить node и зависимостей
```
brew install node
npm install -g react-native-cli
npm install
react-native link

Удалить папку node_modules/@types/node
```


## Запуск приложения:

### IOS:
```
npm run start:ios

```

### Android:
```
npm run start:android

```

### На реальном android устройстве:
```
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

npm run start:android