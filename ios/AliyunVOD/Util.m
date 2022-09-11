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
@end
