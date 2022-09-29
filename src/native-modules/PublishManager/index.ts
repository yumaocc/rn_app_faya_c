import {NativeEventEmitter, NativeModules} from 'react-native';
import {VODPublishManager} from './types';

const NativePublishManager = NativeModules.SMNPublishManager;

const EventEmitter = new NativeEventEmitter(NativePublishManager);
console.log(NativePublishManager);
console.log(EventEmitter);

const PublishManager: VODPublishManager = {
  onProgress: callback => {
    EventEmitter.addListener('progress', callback);
  },
  removeProgressListener: () => {
    EventEmitter.removeAllListeners('progress');
  },
  uploadVideo: config => NativePublishManager.uploadVideo(config),
  uploadPhoto: config => NativePublishManager.uploadPhoto(config),
  getVideoCover: config => NativePublishManager.getVideoCover(config),
};

export default PublishManager;
