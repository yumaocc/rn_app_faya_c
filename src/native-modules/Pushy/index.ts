import {NativeEventEmitter, NativeModules, PermissionsAndroid, Platform} from 'react-native';
import {DownloadEventListener, DownloadProgressData, LocalHashInfo, UpdateCheck, UpdateInfo} from './type';

function getCheckUrl() {
  return 'https://m.faya.life/debug/hot-update/check.json?_t=' + Date.now();
}

async function request(url: string, config: RequestInit) {
  let resp = await fetch(url, config);
  const result = await resp.json();
  if (resp.status !== 200) {
    throw new Error(result.message);
  }
  return result;
}

let Pushy = NativeModules.Pushy;

if (!Pushy) {
  throw new Error('react-native-update模块无法加载，请对照安装文档检查配置。');
}

export const downloadRootDir = Pushy.downloadRootDir;
export const packageVersion = Pushy.packageVersion;
export const currentVersion = Pushy.currentVersion;
export const isFirstTime = Pushy.isFirstTime;
const rolledBackVersion = Pushy.rolledBackVersion;
export const isRolledBack = typeof rolledBackVersion === 'string';

if (Platform.OS === 'android' && !Pushy.isUsingBundleUrl) {
  throw new Error('react-native-update模块无法加载，请对照文档检查Bundle URL的配置');
}

function setLocalHashInfo(hash: string, info: LocalHashInfo) {
  Pushy.setLocalHashInfo(hash, JSON.stringify(info));
}

async function getLocalHashInfo(hash: string) {
  return JSON.parse(await Pushy.getLocalHashInfo(hash));
}

export async function getCurrentVersionInfo() {
  return currentVersion ? (await getLocalHashInfo(currentVersion)) || {} : {};
}

const eventEmitter = new NativeEventEmitter(Pushy);

function assertRelease() {
  if (__DEV__) {
    throw new Error('react-native-update 只能在 RELEASE 版本中运行.');
  }
}

let checkingThrottling = false;
export async function checkUpdateInfo(isRetry = false): Promise<UpdateInfo> {
  assertRelease();
  if (checkingThrottling) {
    return;
  }
  checkingThrottling = true;
  setTimeout(() => {
    checkingThrottling = false;
  }, 3000);

  let resp;
  try {
    resp = await request(getCheckUrl(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    if (isRetry) {
      throw new Error('无法连接更新服务器，请检查网络连接后重试');
    }
    return checkUpdateInfo(true);
  }
  return resp;
}
export async function checkUpdate(): Promise<UpdateCheck> {
  const info = await checkUpdateInfo();
  return checkNeedUpdate(info);
}

export function checkNeedUpdate(info: UpdateInfo): UpdateCheck {
  const needFullUpdate = !isSameOrNewVersion(packageVersion, info.minVersion);
  const canFullUpdate = !isSameOrNewVersion(packageVersion, info.latestVersion);
  let needPatchUpdate = false;
  if (info.versionHash && info.updateUrl) {
    if (currentVersion) {
      needPatchUpdate = currentVersion === info.versionHash;
    } else {
      needPatchUpdate = true;
    }
  } else {
    needPatchUpdate = false;
  }
  return {
    ...info,
    needFullUpdate,
    canFullUpdate,
    needPatchUpdate,
  };
}

export function isSameOrNewVersion(current: string, newVersion: string) {
  try {
    let currentCodes = current.split('.');
    let newCodes = newVersion.split('.');
    for (let i = 0; i < 2; i++) {
      const nowCode = Number(currentCodes[i]);
      const newCode = Number(newCodes[i]);
      if (nowCode < newCode) {
        return false;
      }
    }
  } catch (error) {
    // console.log('error', error);
    return true;
  }
  return true;
}

let downloadingThrottling = false;
let downloadedHash: string;
export async function downloadAndInstallPatch(options: UpdateCheck, listener?: DownloadEventListener) {
  assertRelease();
  if (rolledBackVersion === options.versionHash) {
    return;
  }
  if (downloadedHash === options.versionHash) {
    return;
  }
  if (downloadingThrottling) {
    return;
  }
  downloadingThrottling = true;
  setTimeout(() => {
    downloadingThrottling = false;
  }, 3000);
  let progressHandler;
  if (listener) {
    if (listener.onDownloadProgress) {
      const downloadCallback = listener.onDownloadProgress;
      progressHandler = eventEmitter.addListener('RCTPushyDownloadProgress', progressData => {
        if (progressData.hash === options.versionHash) {
          downloadCallback(progressData);
        }
      });
    }
  }
  let succeeded = false;
  try {
    await Pushy.downloadFullUpdate({
      updateUrl: options.updateUrl,
      hash: options.versionHash,
    });
    succeeded = true;
  } catch (error) {
    // 下载失败
  }
  progressHandler && progressHandler.remove();
  if (!succeeded) {
    throw new Error('下载更新包失败');
  }
  setLocalHashInfo(options.versionHash, {
    name: options.versionName,
    description: options.versionName,
    metaInfo: options.versionName,
  });
  console.log('设置downloadedHash:', options.versionHash);
  downloadedHash = options.versionHash;
  return options.versionHash;
}

function assertHash(hash: string) {
  if (!downloadedHash) {
    // logger(`no downloaded hash`);
    return;
  }
  if (hash !== downloadedHash) {
    // logger(`use downloaded hash ${downloadedHash} first`);
    return;
  }
  return true;
}

export function switchVersion(hash: string) {
  console.log('切换版本了，hash', hash);
  assertRelease();
  if (assertHash(hash)) {
    // logger('switchVersion: ' + hash);
    Pushy.reloadUpdate({hash});
  }
}

export function switchVersionLater(hash: string) {
  assertRelease();
  if (assertHash(hash)) {
    // logger('switchVersionLater: ' + hash);
    Pushy.setNeedUpdate({hash});
  }
}

let marked = false;
export function markSuccess() {
  assertRelease();
  if (marked) {
    // logger('repeated markSuccess, ignored');
    return;
  }
  marked = true;
  Pushy.markSuccess();
  // report(currentVersion, 'success');
}

export async function downloadAndInstallApk(url: string, listener?: (data: DownloadProgressData) => void) {
  // logger('downloadAndInstallApk');
  if (Platform.OS === 'android' && Platform.Version <= 23) {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        return;
      }
    } catch (err) {
      console.warn(err);
    }
  }
  let hash = Date.now().toString();
  let progressHandler;
  if (listener) {
    progressHandler = eventEmitter.addListener('RCTPushyDownloadProgress', progressData => {
      if (progressData.hash === hash) {
        listener(progressData);
      }
    });
  }
  await Pushy.downloadAndInstallApk({
    url,
    target: 'update.apk',
    hash,
  });
  progressHandler && progressHandler.remove();
}
