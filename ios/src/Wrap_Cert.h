//
//  Wrap_Cert.h
//  libWrap
//
//  Created by admin on 09/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef Wrap_Cert_h
#define Wrap_Cert_h

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

#include "helper.h"

@interface Wrap_Cert : NSObject <RCTBridgeModule>{
  int typeProv; //определяет какой провайдер последним загрузил в память сертификат
}

@end

#endif /* Wrap_Cert_h */
