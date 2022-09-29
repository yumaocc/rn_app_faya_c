//
//  Util.m
//  faya
//
//  Created by simon on 2022/9/9.
//

#import "Util.h"
#import <AliyunVideoSDKPro/AliyunVideoSDKPro.h>

@implementation Util

+ (void) checkFileExistAtPath: (NSString *) path {
    NSFileManager *manager = [NSFileManager defaultManager];
    if ([manager fileExistsAtPath:path]) {
        NSLog(@"文件存在");
        NSDictionary * dic = [manager attributesOfItemAtPath:path error:nil];
        NSLog(@"file size: %lld", [dic fileSize]);
    } else {
        NSLog(@"文件不存在");
    }
}

+ (void) registerSDK: (void(^)(NSError *))callback {
    NSError * error = nil;
    
    error = [AliyunVideoSDKInfo registerSDK]; // 返回error为nil表示注册成功。
    if (error != nil) {
        callback(error);
        return;
    }
    
    [AliyunVideoLicenseManager CheckSetting:^(NSError *error) {
        callback(error);
    }];
}


+ (NSString*)UUIDString {
    CFUUIDRef puuid = CFUUIDCreate(nil);
    CFStringRef uuidString = CFUUIDCreateString(nil, puuid);
    NSString * result = (NSString *)CFBridgingRelease(CFStringCreateCopy( NULL, uuidString));
    CFRelease(puuid);
    CFRelease(uuidString);
    return result;
}

+ (NSDictionary *) generateDetail: (NSDictionary *)detail {
    return @{
        @"detail": detail
    };
}

+ (NSString *) recordDir {
    NSString *rootPath = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES).firstObject;
    rootPath = [rootPath stringByAppendingPathComponent:@"rn-aliyun-video"];
    return [rootPath stringByAppendingPathComponent:@"record"];
}

+ (NSError*) makeDir: (NSString *)dirPath {
    NSError *error = nil;
    BOOL isDir = NO;
    if ([NSFileManager.defaultManager fileExistsAtPath:dirPath isDirectory:&isDir] && isDir) {
        return error;
    }
    [NSFileManager.defaultManager createDirectoryAtPath:dirPath withIntermediateDirectories:YES attributes:nil error:&error];
    return error;
}
+ (void)checkBundle {
    NSString * path = [[NSBundle mainBundle] bundlePath];
    NSArray * arr = [[NSFileManager defaultManager] subpathsAtPath:path];
    NSLog(@"check bundle");
    NSLog(@"%@", arr);
}

+ (NSString *) defalutVideoCover: (NSString *)videoPath {
  NSURL *path = [NSURL fileURLWithPath:videoPath];
  
  // 获取图片
  AVURLAsset *asset = [[AVURLAsset alloc] initWithURL:path options:nil];
  AVAssetImageGenerator *assetGen = [[AVAssetImageGenerator alloc] initWithAsset:asset];
  assetGen.appliesPreferredTrackTransform = YES;
  CMTime time = CMTimeMakeWithSeconds(0.0, 600);
  NSError *error = nil;
  CMTime actualTime;
  CGImageRef image = [assetGen copyCGImageAtTime:time actualTime:&actualTime error:&error];
  UIImage *videoImage = [[UIImage alloc] initWithCGImage:image];
  CGImageRelease(image);
  
  NSString * cache = [NSTemporaryDirectory() stringByAppendingPathComponent:[Util UUIDString]];
  [Util makeDir:cache];
  NSString * imagePath = [[cache stringByAppendingPathComponent:[Util UUIDString]] stringByAppendingPathExtension:@"png"];
  NSLog(@"路径, %@", imagePath);
  NSLog(@"videoImage, %@", videoImage);
  BOOL result = [UIImagePNGRepresentation(videoImage) writeToFile:imagePath atomically:YES];
  if (result) {
    return imagePath;
  }
  return @"";
}
@end
