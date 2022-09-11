//
//  Util.h
//  faya
//
//  Created by simon on 2022/9/9.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface Util : NSObject
+ (void) checkFileExistAtPath: (NSString *) path;
+ (void) registerSDK: (void(^)(NSError *))callback;
+ (NSString*)UUIDString;
+ (NSDictionary *) generateDetail: (NSDictionary *)detail;
+ (NSString *) recordDir;
+ (NSError*) makeDir: (NSString *)dirPath;
+ (void)checkBundle;
@end

NS_ASSUME_NONNULL_END
