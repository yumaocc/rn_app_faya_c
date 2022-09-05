// 具体变量请参考ant-theme.ts

import {globalStyleVariables} from './styles';

export const primary = globalStyleVariables.COLOR_PRIMARY;
export const primaryTap = globalStyleVariables.COLOR_PRIMARY_TAP;
export default {
  // 全局
  brand_primary: primary,
  brand_primary_tap: primaryTap,
  // button
  primary_button_fill: primary,
  primary_button_fill_tap: primaryTap,
  button_height: 40,
  button_font_size: 15,

  // input
  input_font_size: 15,

  // switch
  switch_fill: primary,
  switch_checked_disabled: primaryTap, // switch_unchecked的40%透明度
};
