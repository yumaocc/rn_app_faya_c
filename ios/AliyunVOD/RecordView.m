//
//  RecordView.m
//  faya
//
//  Created by simon on 2022/9/9.
//
#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import <AliyunVideoSDKPro/AliyunVideoSDKPro.h>
//#import "RecordView.h"
#import "Util.h"
#import "SMNView.h"

@interface RecordView : RCTViewManager

// 回调函数


//@end

//@interface RecordVieW <>
@property (nonatomic, strong) AliyunIRecorder *recorder;

//@property (nonatomic, strong) NSDictionary* errorInfo;
//@property (nonatomic) BOOL sendReady;

@end

@implementation RecordView

RCT_EXPORT_MODULE(SMNRecordView)

// 导出所有事件
RCT_EXPORT_VIEW_PROPERTY(onRecorderError, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRecorderReady, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPreviewStart, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPreviewStop, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRecordStart, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRecordProgress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRecordStop, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRecordFinish, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRecordFinishWithMaxDuration, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRecorderStateChange, RCTBubblingEventBlock)


RCT_EXPORT_METHOD(sendAction: (nonnull NSNumber *)reactTag action:(NSDictionary *) action) {
  [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,SMNView *> *viewRegistry) {
    SMNView *view = viewRegistry[reactTag];
    if (!view || ![view isKindOfClass:[SMNView class]]) {
      NSLog(@"view类型：%@", view);
      RCTLogError(@"类型错误， 请检查您的ref(reactTag)");
    } else {
      NSLog(@"去调用方法");
      dispatch_async(dispatch_get_main_queue(), ^{
        [view sentAction:action];
      });
    }
  }];
}

//RCT_EXPORT_VIEW_PROPERTY(onHello, NSString)
//RCT_EXPORT_VIEW_PROPERTY(onHello2, RCTBubblingEventBlock)
//RCT_EXPORT_VIEW_PROPERTY(onRecordReady, RCTBubblingEventBlock)

//RCT_CUSTOM_VIEW_PROPERTY(onRecordError, RCTBubblingEventBlock, UIView) {
//  self.onRecordError = json;
//  if (self.errorInfo != nil) {
//    NSLog(@"cb: %@, type: %@", json, [json class]);
//    [self callbackError:self.errorInfo[@"message"] withCode:0];
//  }
//  self.errorInfo = nil;
//}
//
//RCT_CUSTOM_VIEW_PROPERTY(onRecordReady, RCTBubblingEventBlock, UIView) {
//  self.onRecordReady = json;
//  if (self.errorInfo == nil && self.sendReady != YES) {
//    if (self.onRecordReady) {
//      self.onRecordReady(@{@"detail": @{
//        @"code": @0,
//        @"message": @"ok",
//      }});
//    }
//  self.sendReady = YES;
//  }
//}

//RCT_CUSTOM_VIEW_PROPERTY(color, NSString, UIView)
//{
//  NSLog(@"color, %@", json);
//  [view setBackgroundColor:[self hexStringToColor:json]];
//}
//
//-(UIColor *) hexStringToColor:(NSString *)stringToConvert
//{
//  NSString *noHashString = [stringToConvert stringByReplacingOccurrencesOfString:@"#" withString:@""];
//  NSScanner *stringScanner = [NSScanner scannerWithString:noHashString];
//
//  unsigned hex;
//  if (![stringScanner scanHexInt:&hex]) return nil;
//  int r = (hex >> 16) & 0xFF;
//  int g = (hex >> 8) & 0xFF;
//  int b = (hex) & 0xFF;
//
//  return [UIColor colorWithRed:r / 255.0f green:g / 255.0f blue:b / 255.0f alpha:1.0f];
//}

- (UIView *)view
{
  return [SMNView new];
}

@end
