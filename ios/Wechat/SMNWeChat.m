//
//  SMNWeChat.m
//  faya
//
//  Created by simon on 2022/11/4.
//

#import "SMNWeChat.h"

@implementation SMNWeChat

RCT_EXPORT_MODULE(SMNWechat)


RCT_REMAP_METHOD(openMiniProgram,
                 openMiniProgram:(NSDictionary *) option
                 withResolver: (RCTPromiseResolveBlock) resolve
                 andRejecter:(RCTPromiseRejectBlock)reject) {
  WXLaunchMiniProgramReq * req = [WXLaunchMiniProgramReq object];
  req.userName = option[@"userName"];
  req.path = option[@"path"];
//  req.type = option[@"type"];
  NSLog(@"%@", option);
  [WXApi sendReq:req completion:^(BOOL success) {
    resolve(@(success));
  }];
//  req.miniProgramType = @;
}
RCT_EXPORT_METHOD(isWxInstalled: (RCTResponseSenderBlock)callback) {
  BOOL isInstalled =  [WXApi isWXAppInstalled];
  callback(@[[NSNull null], @(isInstalled)]);
}


@end
