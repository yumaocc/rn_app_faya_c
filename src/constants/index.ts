import {Platform} from 'react-native';
import {BoolEnum, WeekDay} from '../fst/models';
import {AppInstallCheckType, WorkVisibleAuth} from '../models';

export const ERROR_SHOW_TIME = 1500; // 错误提示框显示时间
export const REQUEST_TIMEOUT = 3 * 60 * 1e3; // 请求超时时间, 3分钟
export const DEFAULT_PAGE_SIZE = 10; // 默认分页大小
export const MOCK_API_DELAY = 500; // mock api延迟时间

// 时间处理相关
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'; // 统一的时间格式
export const DEFAULT_START_DATE = '1970-01-01 00:00:00'; // 默认的开始时间
export const DEFAULT_END_DATE = '2099-12-31 23:59:59'; // 默认的结束时间

export const APP_SCHEMES: {[key in AppInstallCheckType]: string} = {
  // 添加这个scheme，iOS需要在info.plist中添加LSApplicationQueriesSchemes
  alipay: 'alipays://',
  wechat: 'weixin://',
  baidumap: 'baidumap://',
  qqmap: 'qqmap://',
  amap: Platform.select({
    ios: 'iosamap://',
    android: 'androidamap://',
  }),
};

export const noop = () => {}; // 空函数

export const BoolOptions = [
  {label: '是', value: BoolEnum.TRUE},
  {label: '否', value: BoolEnum.FALSE},
];

export const WorkVisibleAuthOptions = [
  {label: '公开·大家都可以看', value: WorkVisibleAuth.Public},
  {label: '私密·仅自己可见', value: WorkVisibleAuth.Private},
  {label: '朋友·互相关注可见', value: WorkVisibleAuth.Friend},
];

export const ALL_WEEK_START_WITH_SUNDAY = [
  {label: '周日', labelSimple: '日', value: WeekDay.Sunday},
  {label: '周一', labelSimple: '一', value: WeekDay.Monday},
  {label: '周二', labelSimple: '二', value: WeekDay.Tuesday},
  {label: '周三', labelSimple: '三', value: WeekDay.Wednesday},
  {label: '周四', labelSimple: '四', value: WeekDay.Thursday},
  {label: '周五', labelSimple: '五', value: WeekDay.Friday},
  {label: '周六', labelSimple: '六', value: WeekDay.Saturday},
];

export const ALL_WEEK_START_WITH_MONDAY = [
  {label: '周一', labelSimple: '一', value: WeekDay.Monday},
  {label: '周二', labelSimple: '二', value: WeekDay.Tuesday},
  {label: '周三', labelSimple: '三', value: WeekDay.Wednesday},
  {label: '周四', labelSimple: '四', value: WeekDay.Thursday},
  {label: '周五', labelSimple: '五', value: WeekDay.Friday},
  {label: '周六', labelSimple: '六', value: WeekDay.Saturday},
  {label: '周日', labelSimple: '日', value: WeekDay.Sunday},
];

export {getBaseURL, getAliPayUrl, getWechatPayUrl, USER_AGREEMENT_URL, PRIVACY_POLICY_URL} from './url';

// 小程序配置
export const FAYA_MINI_PROGRAM_ORIGIN = 'gh_a89c093854cb'; // 小程序原始ID
export const FAYA_MINI_PROGRAM_PAY_PATH = '/pages/fromH5Pay/index'; // 小程序支付页面路径
