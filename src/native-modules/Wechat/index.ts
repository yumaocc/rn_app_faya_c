import {NativeModules} from 'react-native';
import {WxLaunchMiniProgramOptions} from './types';
const NativeSMNWechat = NativeModules.SMNWechat;

const Wechat = {
  isWxInstalled: () => {
    return new Promise(resolve => {
      NativeSMNWechat.isWxInstalled((error: never, installed: boolean) => {
        resolve(installed);
      });
    });
  },
  openMiniProgram: (config: WxLaunchMiniProgramOptions): Promise<any> => NativeSMNWechat.openMiniProgram(config),
};

export default Wechat;

export type {WxLaunchMiniProgramOptions} from './types';
export {WxLaunchMiniProgramType} from './types';
