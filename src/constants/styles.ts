import {StyleSheet} from 'react-native';

export const globalStyleVariables = {
  COLOR_PRIMARY: '#546DAD',
  COLOR_WARNING: '#FFC107',
  COLOR_DANGER: '#F44336',
  TEXT_COLOR_PRIMARY: '#333',
  TEXT_COLOR_SECONDARY: '#666',
  TEXT_COLOR_TERTIARY: '#999',
  BORDER_COLOR: '#0000001A',
  MODULE_SPACE: 10,
  COLOR_PAGE_BACKGROUND: '#f4f4f4',
};

export const globalStyles = StyleSheet.create({
  containerForTmp: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerLR: {
    // 左右结构容器
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexCenter: {
    alignContent: 'center',
    justifyContent: 'center',
  },
  width100: {
    width: '100%',
  },
  fontPrimary: {
    // 主要字体样式
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
    fontSize: 15,
    fontWeight: '500',
  },
  fontSecondary: {
    // 次要字体样式
    color: globalStyleVariables.TEXT_COLOR_SECONDARY,
    fontSize: 15,
    fontWeight: '500',
  },
  fontTertiary: {
    // 辅助字体样式
    color: globalStyleVariables.TEXT_COLOR_TERTIARY,
    fontSize: 12,
    fontWeight: '500',
  },
  primaryColor: {
    color: globalStyleVariables.COLOR_PRIMARY,
  },
  primaryBGColor: {
    backgroundColor: globalStyleVariables.COLOR_PRIMARY,
  },
  moduleMarginTop: {
    // 模块上间距
    marginTop: globalStyleVariables.MODULE_SPACE,
  },
  moduleMarginLeft: {
    // 模块左间距
    marginLeft: globalStyleVariables.MODULE_SPACE,
  },
  moduleSpaceWidth: {
    // 模块间距
    width: globalStyleVariables.MODULE_SPACE,
  },
  moduleSpaceHeight: {
    // 模块间距
    height: globalStyleVariables.MODULE_SPACE,
  },
  flexNormal: {
    flexDirection: 'row',
  },
  textColorPrimary: {
    color: globalStyleVariables.TEXT_COLOR_PRIMARY,
  },
  textColorSecondary: {
    color: globalStyleVariables.TEXT_COLOR_SECONDARY,
  },
  // icon
  iconRight: {
    fontSize: 15,
    color: globalStyleVariables.TEXT_COLOR_SECONDARY,
  },
  lineHorizontal: {
    height: 1,
    backgroundColor: globalStyleVariables.BORDER_COLOR,
  },
  lineVertical: {
    width: 1,
    backgroundColor: globalStyleVariables.BORDER_COLOR,
  },
  borderTop: {
    borderTopWidth: 0.3,
    borderTopColor: globalStyleVariables.BORDER_COLOR,
  },
  borderBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: globalStyleVariables.BORDER_COLOR,
  },
  tagWrapper: {
    padding: 5,
    flexDirection: 'row',
    backgroundColor: '#FFB44333',
    alignSelf: 'flex-start',
    alignItems: 'center',
    borderRadius: 3,
  },
  tag: {
    fontSize: 12,
    color: '#FFB443',
  },
});
