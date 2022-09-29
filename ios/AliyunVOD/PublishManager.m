//
//  PublishManager.m
//  faya
//
//  Created by simon on 2022/9/19.
//

#import "PublishManager.h"
#import <VODUpload/VODUploadClient.h>
#import "Util.h"


@interface PublishManager()
@property(nonatomic, strong) VODUploadClient *uploader;
@property(nonatomic, copy) RCTPromiseResolveBlock resolve;
@property(nonatomic, copy) RCTPromiseRejectBlock reject;
@property(nonatomic, assign) BOOL isUploading;

@property(nonatomic, copy) NSString *uploadAuth;
@property(nonatomic, copy) NSString *uploadAddress;

@end

@implementation PublishManager

RCT_EXPORT_MODULE(SMNPublishManager)

- (instancetype)init {
  if (self = [super init]) {
    [self setup];
  }
  return self;
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"progress"];
}

RCT_REMAP_METHOD(uploadVideo,
                 uploadVideo:(NSDictionary *) option
                 withResolver: (RCTPromiseResolveBlock) resolve
                 andRejecter:(RCTPromiseRejectBlock)reject) {
  self.uploadAuth = option[@"uploadAuth"];
  self.uploadAddress = option[@"uploadAddress"];
  self.resolve = resolve;
  self.reject = reject;
  VodInfo * info = [VodInfo new];
  [self.uploader addFile:option[@"path"] vodInfo:info];
  [self.uploader start];
}

RCT_REMAP_METHOD(uploadPhoto,
                 uploadPhoto:(NSDictionary *) option
                 withResolver: (RCTPromiseResolveBlock) resolve
                 andRejecter:(RCTPromiseRejectBlock)reject) {
  self.uploadAuth = option[@"uploadAuth"];
  self.uploadAddress = option[@"uploadAddress"];
  self.resolve = resolve;
  self.reject = reject;
  VodInfo * info = [VodInfo new];
  [self.uploader addFile:option[@"path"] vodInfo:info];
  [self.uploader start];
}

RCT_REMAP_METHOD(getVideoCover,
                 getVideoCover:(NSDictionary *) option
                 withResolver: (RCTPromiseResolveBlock) resolve
                 andRejecter:(RCTPromiseRejectBlock)reject) {
  NSString * videoPath = option[@"path"];
  if (!videoPath) {
    reject(@"error", @"参数错误", nil);
    return;
  }
  NSString * coverPath = [Util defalutVideoCover:videoPath];
  if(!coverPath) {
    reject(@"error", @"生成封面失败", nil);
    return;
  }
  resolve(coverPath);
}

-(void) setup {
    self.uploader = [VODUploadClient new];
    __weak typeof(self) weakSelf = self;
    
    OnUploadFinishedListener FinishCallbackFunc = ^(UploadFileInfo* fileInfo, VodUploadResult* result){
        NSLog(@"上传完成\n videoid:%@\nimageurl:%@\nbucket: %@\nendpoint: %@", result.videoId, result.imageUrl, result.bucket, result.endpoint);
      if (weakSelf.resolve) {
        weakSelf.resolve(@{});
      }
    };
    OnUploadFailedListener FailedCallbackFunc = ^(UploadFileInfo* fileInfo, NSString *code, NSString* message){
        NSLog(@"上传失败\n code = %@, error message = %@", code, message);
//        if (self.delegate && [self.delegate respondsToSelector:@selector(uploadError:withCode:)]) {
//            [self.delegate uploadError:message withCode:code];
//        }
      if (weakSelf.reject) {
        weakSelf.reject(code, message, nil);
      }
    };
    OnUploadProgressListener ProgressCallbackFunc = ^(UploadFileInfo* fileInfo, long uploadedSize, long totalSize) {
      NSLog(@"进度 ===== uploadedSize : %li, totalSize : %li", uploadedSize, totalSize);
      [weakSelf sendEventWithName:@"progress" body: @{@"uploaded": @(uploadedSize), @"total": @(totalSize)}];
    };
  
    OnUploadTokenExpiredListener TokenExpiredCallbackFunc = ^{
//        NSLog(@"upload token expired callback.");
        //token过期，设置新的上传凭证，继续上传
//        [weakSelf.uploader resumeWithAuth:`new upload auth`];
    };
    OnUploadRertyListener RetryCallbackFunc = ^{
//        NSLog(@"upload retry begin callback.");
    };
    OnUploadRertyResumeListener RetryResumeCallbackFunc = ^{
//        NSLog(@"upload retry end callback.");
    };
    OnUploadStartedListener UploadStartedCallbackFunc = ^(UploadFileInfo* fileInfo) {
        NSLog(@"阿里云VOD，开始上传");
        //设置上传地址和上传凭证
        [weakSelf.uploader setUploadAuthAndAddress:fileInfo uploadAuth: weakSelf.uploadAuth uploadAddress:weakSelf.uploadAddress];
    };
    VODUploadListener *listener = [[VODUploadListener alloc] init];
    listener.finish = FinishCallbackFunc;
    listener.failure = FailedCallbackFunc;
    listener.progress = ProgressCallbackFunc;
    listener.expire = TokenExpiredCallbackFunc;
    listener.retry = RetryCallbackFunc;
    listener.retryResume = RetryResumeCallbackFunc;
    listener.started = UploadStartedCallbackFunc;
    
    [self.uploader setListener:listener];
}

@end
