#import <React/RCTBridgeModule.h>

// Khai báo module Swift `WidgetBridge` cho React Native (dùng qua NativeModules.WidgetBridge).
@interface RCT_EXTERN_MODULE(WidgetBridge, NSObject)

RCT_EXTERN_METHOD(setSnapshot:(NSString *)json
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
