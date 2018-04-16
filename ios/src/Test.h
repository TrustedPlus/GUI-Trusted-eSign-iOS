//
//  Test.h
//  libWrap
//
//  Created by admin on 06/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef Test_h
#define Test_h

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

#include "helper.h"

@interface Test : NSObject <RCTBridgeModule>{
  NSMutableArray *listCerts;//содержит список сертификатов
}

@end

#endif /* Test_h */
