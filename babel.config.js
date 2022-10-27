module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['import', {libraryName: '@ant-design/react-native'}],
    ['react-native-reanimated/plugin', {globals: ['__scanCodes']}],
  ],
};
