# 发芽联盟

***推荐使用yarn来管理此项目依赖。***

## 搭建开发环境

需要安装 cocoapods、xcode、node、yarn(推荐)

```bash
$ brew install cocoapods
```

## 开发启动项目步骤

先执行命令：

```bash
$ cd 项目根目录
$ yarn install
$ cd ios
$ pod install
```

在Xcode中点击run，启动项目
## 相关文档/资料


1. [RN中文文档](https://reactnative.cn/docs/getting-started)
2. [导航器react-navigation](https://reactnavigation.org/docs/getting-started) [仓库地址（含demo）](https://github.com/react-navigation/react-navigation/blob/main/example/index.js)
3. [调试器react-native-debugger](https://github.com/jhen0409/react-native-debugger/blob/master/docs/getting-started.md)
4. [redux副作用管理 redux-saga](https://github.com/redux-saga/redux-saga)
5. [UI库 ant-design-rn](http://rn.mobile.ant.design/docs/react/introduce-cn)


## 一些问题
- `ant-design-rn`安装时，少了亿些依赖，文档在[这里](http://rn.mobile.ant.design/docs/react/upgrade-notes-cn)。 而且也不齐全。所以综上，除了`yarn add @ant-design/react-native`之外，还需要安装以下：（已添加到此项目的依赖中，此项目不用单独安装）

```bash
yarn add @react-native-community/cameraroll @react-native-picker/picker @react-native-community/segmented-control @react-native-community/slider react-native-pager-view react-native-gesture-handler classnames fbjs rc-util

```
