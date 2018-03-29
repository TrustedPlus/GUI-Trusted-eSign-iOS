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
#include "cert.h"
#include "storehelper.h"
#include "../globalHelper.h"

@interface WHelp : NSObject <RCTBridgeModule>

DataFormat::DATA_FORMAT NSStringToDataFormat(NSString *nsformat);
int hasCertInStore(TrustedHandle<Certificate> cert);                      //проверка наличия сертификата в хранилище.
void bin_to_strhex(unsigned char *bin, unsigned int binsz, char **result);//высчитывание хэша

@end

#endif /* WHelp_h */
