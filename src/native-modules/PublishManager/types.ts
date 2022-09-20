export interface PublishVideoConfig {
  uploadAuth: string;
  uploadAddress: string;
  path: string;
}

export interface PublishPhotoConfig {
  uploadAuth: string;
  uploadAddress: string;
  path: string;
}

export interface UploadProgress {
  uploaded: number;
  total: number;
}

export interface VODPublishManager {
  onProgress: (callback: (progress: UploadProgress) => void) => void;
  removeProgressListener: () => void;
  uploadVideo: (config: PublishVideoConfig) => Promise<boolean>;
  uploadPhoto: (config: PublishPhotoConfig) => Promise<boolean>;
}
