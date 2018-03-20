//
//  WHelp.h
//  Prototype_Trusted_IOS
//
//  Created by admin on 05/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef WHelp_h
#define WHelp_h

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#include "pki.h"

@interface WHelp : NSObject <RCTBridgeModule>

DataFormat::DATA_FORMAT NSStringToDataFormat(NSString *nsformat);
  
@end

#endif /* WHelp_h */
