export interface UpdateInfo {
  minVersion: string;
  latestVersion: string;
  updateUrl: string;
  versionHash: string;
  versionName: string;
  downloadUrl: string;
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
