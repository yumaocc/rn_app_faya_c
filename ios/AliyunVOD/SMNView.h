//
//  SMNView.h
//  faya
//
//  Created by simon on 2022/9/10.
//

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>
#import <AliyunVideoSDKPro/AliyunVideoSDKPro.h>

NS_ASSUME_NONNULL_BEGIN

@interface SMNView : UIView <AliyunIRecorderDelegate>

@property (nonatomic, copy) RCTBubblingEventBlock onRecordReady;
@property (nonatomic, copy) RCTBubblingEventBlock onRecordError;
@property (nonatomic, copy) RCTBubblingEventBlock onRecordFinish;
@property (nonatomic, copy) RCTBubblingEventBlock onRecordStop;

@property (nonatomic, copy) RCTBubblingEventBlock onRecordProgress;
@property (nonatomic, copy) RCTBubblingEventBlock onRecordFinishWithMaxDuration;

@property (nonatomic, copy) RCTBubblingEventBlock onPreviewStop;
@property (nonatomic, copy) RCTBubblingEventBlock onPreviewStart;


-(void) sentAction:(NSDictionary *) action;

@end

NS_ASSUME_NONNULL_END
