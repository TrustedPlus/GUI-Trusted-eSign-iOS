//
//  PCipher.h
//  Prototype_Trusted_IOS
//
//  Created by admin on 02/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef PCipher_h
#define PCipher_h

#include "cert.h"
#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import <CPROCSP/CPROCSP.h>
#import <CPROCSP/CPCrypt.h>
#import "stdlib.h"
#import "stdio.h"
#import "map"
#import "vector"
#include "../globalHelper.h"
#include "PHelp.h"

#define MY_ENCODING_TYPE  (PKCS_7_ASN_ENCODING | X509_ASN_ENCODING)
#define TYPE_DER  (PKCS_7_ASN_ENCODING | X509_ASN_ENCODING)

@interface PCipher : NSObject <RCTBridgeModule>

@end

#endif /* PCipher_h */
