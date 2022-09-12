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

// 检查状态，返回给前端的状态
- (NSDictionary *) checkRecorderState {
  AliyunIRecorderTorchMode torchMode = self.recorder.torchMode;
  NSString * torchModeStr = torchMode == AliyunIRecorderTorchModeAuto ? @"auto" : torchMode == AliyunIRecorderTorchModeOn ? @"on" : @"off";
  return @{
    @"isRecording": @(self.recorder.isRecording),
    @"torchMode": torchModeStr,
  };
}

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
    [self.recorder startRecording];
  } else if ([@"pauseRecord" isEqualToString:type]) {
    [self.recorder stopRecording];
  } else if ([@"finishRecord" isEqualToString:type]) {
    [self.recorder finishRecording];
    // TODO: debug代码，请删除
    if (self.onRecordFinish) {
      self.onRecordFinish(@{
        @"path": [[NSBundle mainBundle] pathForResource:@"moment" ofType:@"mp4"],
      });
    }
  } else if ([@"torchOn" isEqualToString:type]) {
    [self.recorder switchTorchWithMode:AliyunIRecorderTorchModeOn];
  } else if ([@"torchOff" isEqualToString:type]) {
    [self.recorder switchTorchWithMode:AliyunIRecorderTorchModeOff];
  } else if ([@"muteOn" isEqualToString:type]) {
    [self.recorder setMute:YES];
  } else if ([@"muteOff" isEqualToString:type]) {
    [self.recorder setMute:NO];
  } else if ([@"checkState" isEqualToString:type]) {
    NSDictionary * state = [self checkRecorderState];
    NSLog(@"当前状态 = %@", state);
    if (self.onRecorderStateChange) {
      NSLog(@"有回调");
      self.onRecorderStateChange(state);
    } else {
      NSLog(@"没有回调");
    }
  }
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
            NSString *taskPath = [dirPath stringByAppendingString:[Util UUIDString]];
            NSString *videoPath = [[taskPath stringByAppendingString:[Util UUIDString]] stringByAppendingPathExtension:@"mp4"];
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
}

- (void)recorderDidFinishRecording {
    [self stopPreview];
    
    if (self.onRecordFinish) {
        self.onRecordFinish(@{
          @"duration": @(self.recorder.clipManager.duration),
          @"path": self.recorder.outputPath,
      });
    }
}


//当录至最大时长时回调
- (void)recorderDidStopWithMaxDuration {
    NSLog(@"录制到最大时长");
//    onRecordFinishWithMaxDuration
    if (self.onRecordFinishWithMaxDuration) {
        self.onRecordFinishWithMaxDuration(@{
          @"duration": @(self.recorder.clipManager.duration),
          @"path": self.recorder.outputPath,
      });
    }
}
- (void)recorderDidStartPreview{
    NSLog(@"-------->开始预览");
    if (self.onPreviewStart) {
      self.onPreviewStart(@{});
    }
}
// 录制异常
- (void)recoderError:(NSError *)error {
    NSLog(@"recoderError%@",error);
    [self callbackError:error.localizedDescription withCode:3];
}

# pragma mark - 证书回调
- (void)onAliyunVideoLicenseCheckError:(AliyunVideoLicenseResultCode)errCode {
  NSLog(@"证书回调code, %@", @(errCode));
  switch (errCode) {
    case AliyunVideoLicenseResultCodeSuccess:
      NSLog(@"成功");
      break;
    case AliyunVideoLicenseResultCodeExpired:
      [self callbackError:@"证书已失效" withCode:1];
    default:
      break;
  }
}

- (void)onAliyunVideoLicenseFeatureCheck:(AliyunVideoFeatureType)featureType error:(AliyunVideoLicenseResultCode)errCode {
  NSLog(@"增值服务回调错误");
  switch (errCode) {
    case AliyunVideoLicenseResultCodeSuccess:
      NSLog(@"成功");
      break;
    case AliyunVideoLicenseResultCodeExpired:
      [self callbackError:@"证书已失效" withCode:1];
    default:
      break;
  }
}

@end
