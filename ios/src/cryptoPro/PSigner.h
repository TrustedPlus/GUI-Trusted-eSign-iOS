//
//  PSigner.h
//  Prototype_Trusted_IOS
//
//  Created by admin on 01/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef PSigner_h
#define PSigner_h

#include "cert.h"
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

@interface PSigner : NSObject <RCTBridgeModule>

@end

#endif /* PSigner_h */
