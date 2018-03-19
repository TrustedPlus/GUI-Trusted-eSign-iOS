//
//  PCert.h
//  Prototype_Trusted_IOS
//
//  Created by admin on 01/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef PCert_h
#define PCert_h

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import <CPROCSP/CPROCSP.h>
#import <CPROCSP/CPCrypt.h>
#import "stdlib.h"
#import "stdio.h"
#import "map"
#import "vector"

#define MY_ENCODING_TYPE  (PKCS_7_ASN_ENCODING | X509_ASN_ENCODING)
#define TYPE_DER  (PKCS_7_ASN_ENCODING | X509_ASN_ENCODING)

@interface PCert : NSObject <RCTBridgeModule>
//функция получения содержимого сертификата, на входе имя_хранилища и сертификат.

@end

#endif /* PCert_h */
