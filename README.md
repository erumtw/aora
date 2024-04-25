# Initial

### create projects 
```bash
npx create-expo-app ./dir
```

### install expo dependencies 
```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

### edit package.json
`"main": "expo-router/entry",`

### add in app.json for app name
`"scheme": "aora",`

### install NativeWind
```bash
npm install nativewind
npm install --save-dev tailwindcss@3.3.2
npx tailwindcss init
```