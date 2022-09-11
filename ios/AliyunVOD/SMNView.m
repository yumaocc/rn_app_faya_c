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
  [Util registerSDK:^(NSError * error) {
    if(error != nil) {
      NSLog(@"注册失败, %@", error.localizedDescription);
    } else {
      NSLog(@"注册成功！");
//      [self.recorder startPreview];
    }
  }];
}

-(void) sentAction:(NSDictionary *) action {
//  NSLog(@"call me start preview");
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
    }
    return _recorder;
}

// 回调error
- (void)callbackError:(NSString *)message withCode:(int)code {
    if (self.onRecordError) {
        self.onRecordError([Util generateDetail:@{
            @"code": @(code),
            @"message": message,
        }]);
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
        self.onRecordProgress([Util generateDetail:@{@"duration": @(duration)}]);
    }
}
// 录制停止
- (void)recorderDidStopRecording{
    if (self.onRecordStop) {
        self.onRecordStop([Util generateDetail:@{@"duration": @(self.recorder.clipManager.duration)}]);
    }
}

- (void)recorderDidFinishRecording {
    //停止预览
    [self stopPreview];
    
    if (self.onRecordFinish) {
        self.onRecordFinish([Util generateDetail:@{
            @"duration": @(self.recorder.clipManager.duration),
            @"path": self.recorder.outputPath,
        }]);
    }
}


//当录至最大时长时回调
- (void)recorderDidStopWithMaxDuration {
    NSLog(@"录制到最大时长");
//    onRecordFinishWithMaxDuration
    if (self.onRecordFinishWithMaxDuration) {
        self.onRecordFinishWithMaxDuration([Util generateDetail:@{
            @"duration": @(self.recorder.clipManager.duration),
            @"path": self.recorder.outputPath,
        }]);
    }
}
- (void)recorderDidStartPreview{
    NSLog(@"-------->开始预览");
    if (self.onPreviewStart) {
        self.onPreviewStart([Util generateDetail:@{}]);
    }
}
// 录制异常
- (void)recoderError:(NSError *)error {
    NSLog(@"recoderError%@",error);
    [self callbackError:error.localizedDescription withCode:3];
}
@end
