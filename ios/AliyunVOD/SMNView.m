//
//  SMNView.m
//  faya
//
//  Created by simon on 2022/9/10.
//

#import "SMNView.h"
#import "Util.h"

@interface SMNView()
@property (nonatomic, strong) AliyunIRecorder *recorder;

@end

@implementation SMNView

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

-(instancetype)init {
  if (self = [super init]) {
    [self setupSDK];
  }
  NSLog(@"初始化view");
  return self;
}

-(void) setupSDK{
  AliyunVideoLicenseManager.EventDelegate = self;
  [Util registerSDK:^(NSError * error) {
    if(error != nil) {
      NSLog(@"注册失败, %@", error.localizedDescription);
      [self callbackError:error.localizedDescription withCode:0];
    } else {
      NSLog(@"注册成功！");
//      NSDictionary *state = [self checkRecorderState];
      if (self.onRecorderReady) {
        self.onRecorderReady(@{});
      }
    }
  }];
}

- (void) emitRecorderStateChange {
  AliyunIRecorderTorchMode torchMode = self.recorder.torchMode;
  NSString * torchModeStr = torchMode == AliyunIRecorderTorchModeAuto ? @"auto" : torchMode == AliyunIRecorderTorchModeOn ? @"on" : @"off";
  NSDictionary * state =  @{
    @"isRecording": @(self.recorder.isRecording),
    @"torchMode": torchModeStr,
  };
  if (self.onRecorderStateChange) {
    self.onRecorderStateChange(state);
  }
}
//
//// 检查状态，返回给前端的状态
//- (NSDictionary *) checkRecorderState {
//  AliyunIRecorderTorchMode torchMode = self.recorder.torchMode;
//  NSString * torchModeStr = torchMode == AliyunIRecorderTorchModeAuto ? @"auto" : torchMode == AliyunIRecorderTorchModeOn ? @"on" : @"off";
//  return @{
//    @"isRecording": @(self.recorder.isRecording),
//    @"torchMode": torchModeStr,
//  };
//}

- (void) sentAction:(NSDictionary *) action {
  NSLog(@"call action. %@", action);
  NSString *type = action[@"type"];
//  NSDictionary *payload = action[@"payload"];

  if ([@"switchCamera" isEqualToString:type]) {
    [self.recorder switchCameraPosition];
  } else if ([@"startPreview" isEqualToString:type]) {
    [self.recorder startPreview];
  } else if ([@"stopPreview" isEqualToString:type]) {
    [self.recorder stopPreview];
  } else if ([@"startRecord" isEqualToString:type]) {
    NSLog(@"开始录制");
    [self.recorder startRecording];
  } else if ([@"pauseRecord" isEqualToString:type]) {
    [self.recorder stopRecording];
  } else if ([@"finishRecord" isEqualToString:type]) {
    [self.recorder finishRecording];
//    if (self.onRecordFinish) {
//      self.onRecordFinish(@{
//        @"path": [[NSBundle mainBundle] pathForResource:@"moment" ofType:@"mp4"],
//      });
//    }
  } else if ([@"torchOn" isEqualToString:type]) {
    [self.recorder switchTorchWithMode:AliyunIRecorderTorchModeOn];
  } else if ([@"torchOff" isEqualToString:type]) {
    [self.recorder switchTorchWithMode:AliyunIRecorderTorchModeOff];
  } else if ([@"muteOn" isEqualToString:type]) {
    [self.recorder setMute:YES];
  } else if ([@"muteOff" isEqualToString:type]) {
    [self.recorder setMute:NO];
  } else if ([@"checkState" isEqualToString:type]) {
  }
  //TODO: 只要有action就触发state change
  NSLog(@"=====触发状态变更");
  [self emitRecorderStateChange];
//  else if ([@"focus" isEqualToString:type]) {
//    [self.recorder focusAtPoint:CGPointMake(0.5, 0.5)];
// } else if ([@"zoom" isEqualToString:type]) {
//    [self.recorder zoom:action[@"payload"]];
// } else if ([@"switchBeauty" isEqualToString:type]) {
//    [self.recorder toggleBeauty];
// } else if ([@"switchBeauty" isEqualToString:type]) {
//    [self.recorder toggleBeauty];
// } else if ([@"switchBeauty" isEqualToString:type]) {
//    [self.recorder toggleBeauty];
// } else if ([@"switchBeauty" isEqualToString:type]) {
//    [self.recorder toggleBeauty];
// } else if ([@"switchBeauty" isEqualToString:type]) {
//    [self.recorder toggleBeauty];
// }
}

- (AliyunIRecorder *)recorder {
    if(!_recorder) {
        NSLog(@"初始化recorder");
        NSString *dirPath = [Util recordDir];
        NSError *error = [Util makeDir:dirPath];
        if (error != nil) {
            [self callbackError:error.localizedDescription withCode:1];
        } else {
            NSString *taskPath = [dirPath stringByAppendingPathComponent:[Util UUIDString]];
            NSString *videoPath = [[taskPath stringByAppendingPathComponent:[Util UUIDString]] stringByAppendingPathExtension:@"mp4"];
            CGSize resolution = CGSizeMake(720, 1280);
            _recorder =[[AliyunIRecorder alloc] initWithDelegate:self videoSize:resolution];
            _recorder.preview = self;
            _recorder.outputType = AliyunIRecorderVideoOutputPixelFormatType420f;
            _recorder.useFaceDetect = YES;
            _recorder.faceDetectCount = 2;
            _recorder.faceDectectSync = NO;
            _recorder.frontCaptureSessionPreset = AVCaptureSessionPreset1280x720;
            _recorder.encodeMode = 1;// 0软编  1硬编  iOS强制硬编
            _recorder.recordFps = 30;
            _recorder.GOP = _recorder.recordFps * 3;
            _recorder.videoQuality = AliyunVideoQualityMedium;
            
            _recorder.outputPath = videoPath;
            
            _recorder.taskPath = taskPath;
            _recorder.beautifyStatus = YES;
            _recorder.videoFlipH = YES;
            _recorder.frontCameraSupportVideoZoomFactor = YES;
            //录制片段设置
            _recorder.clipManager.deleteVideoClipsOnExit = YES;
            _recorder.clipManager.maxDuration = 15;
            _recorder.clipManager.minDuration = 1;
        }
      NSLog(@"初始化成功");
    }
    return _recorder;
}

// 回调error
- (void)callbackError:(NSString *)message withCode:(int)code {
    if (self.onRecorderError) {
        self.onRecorderError(@{
          @"code": @(code),
          @"message": message,
      });
    } else {
      NSLog(@"no error handle");
    }
}


-(void) stopPreview {
    [self.recorder stopPreview];
    if (self.onPreviewStop) {
        self.onPreviewStop(@{});
    }
}

-(NSDictionary *) videoInfo {
  NSString * videoPath = self.recorder.outputPath;
  NSString * coverPath = [Util defalutVideoCover: videoPath];
  return @{
    @"duration": @(self.recorder.clipManager.duration),
    @"path": videoPath,
    @"coverPath": coverPath,
  };
}

#pragma mark - 阿里云视频回调函数
- (void)recorderDeviceAuthorization:(AliyunIRecorderDeviceAuthor)status {
    dispatch_async(dispatch_get_main_queue(), ^{
        if (status == AliyunIRecorderDeviceAuthorAudioDenied) {
            [self callbackError:@"麦克风未授权" withCode:2];
        } else if (status == AliyunIRecorderDeviceAuthorVideoDenied) {
            [self callbackError:@"相机未授权" withCode:2];
        }
    });
}

// 录制进度
- (void)recorderVideoDuration:(CGFloat)duration {
    
    if (self.onRecordProgress) {
      self.onRecordProgress(@{@"duration": @(duration)});
    }
}
// 录制停止
- (void)recorderDidStopRecording{
    if (self.onRecordStop) {
      self.onRecordStop(@{@"duration": @(self.recorder.clipManager.duration)});
    }
  [self emitRecorderStateChange];
}

- (void)recorderDidFinishRecording {
  [self stopPreview];
  if (self.onRecordFinish) {
    NSDictionary * dict = [self videoInfo];
    NSLog(@"视频信息: %@", dict);
    self.onRecordFinish(dict);
  }
  [self emitRecorderStateChange];
}

//当录至最大时长时回调
- (void)recorderDidStopWithMaxDuration {
  NSLog(@"录制到最大时长");
  if (self.onRecordFinishWithMaxDuration) {
    self.onRecordFinishWithMaxDuration([self videoInfo]);
  }
  [self emitRecorderStateChange];
}

- (void)recorderDidStartPreview{
    NSLog(@"-------->开始预览");
    if (self.onPreviewStart) {
      self.onPreviewStart(@{});
    }
  [self emitRecorderStateChange];
}
// 录制异常
- (void)recoderError:(NSError *)error {
  NSLog(@"recoderError%@",error);
  [self callbackError:error.localizedDescription withCode:3];
  [self emitRecorderStateChange];
}

# pragma mark - 证书回调
- (void)onAliyunVideoLicenseCheckError:(AliyunVideoLicenseResultCode)errCode {
  NSLog(@"证书回调code, %@", @(errCode));
  switch (errCode) {
    case AliyunVideoLicenseResultCodeSuccess:
//      NSLog(@"成功");
      break;
    case AliyunVideoLicenseResultCodeExpired:
      [self callbackError:@"证书已失效" withCode:1];
    default:
      break;
  }
}

#pragma mark - 处理view生命周期

- (void)dealloc {
  NSLog(@"释放view实例");
  [_recorder stopPreview];
  [_recorder destroyRecorder];
  _recorder = nil;
//  [super dealloc];
}

@end
