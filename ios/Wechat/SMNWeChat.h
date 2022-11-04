//
//  SMNWeChat.h
//  faya
//
//  Created by simon on 2022/11/4.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <WXApi.h>

NS_ASSUME_NONNULL_BEGIN

@interface SMNWeChat : NSObject <RCTBridgeModule, WXApiDelegate>

@end

NS_ASSUME_NONNULL_END
