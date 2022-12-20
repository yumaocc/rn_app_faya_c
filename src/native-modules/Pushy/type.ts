export interface UpdateInfo {
  minVersion: string;
  latestVersion: string;
  updateUrl: string;
  versionHash: string;
  versionName: string;
  iosUrl: string; // 苹果商店下载地址
  androidUrl: string; // apk地址或者应用宝地址
}

export interface UpdateCheck extends UpdateInfo {
  needFullUpdate: boolean;
  canFullUpdate: boolean;
  needPatchUpdate: boolean;
}

export interface DownloadProgressData {
  received: number;
  total: number;
  hash: string;
}

export interface DownloadEventListener {
  onDownloadProgress: (data: DownloadProgressData) => void;
}

export interface LocalHashInfo {
  name: string;
  description: string;
  metaInfo: string;
}
