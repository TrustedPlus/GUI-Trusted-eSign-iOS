//
//  PCipher.h
//  Prototype_Trusted_IOS
//
//  Created by admin on 02/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef CSP_Cipher_h
#define CSP_Cipher_h

#include "CSP_Helper.h"

#include "cert.h"
#import <Foundation/Foundation.h>
#import <CPROCSP/CPROCSP.h>
#import <CPROCSP/CPCrypt.h>
#import "stdlib.h"
#import "stdio.h"
#import "map"
#import "vector"

#define MY_ENCODING_TYPE  (PKCS_7_ASN_ENCODING | X509_ASN_ENCODING)
#define TYPE_DER  (PKCS_7_ASN_ENCODING | X509_ASN_ENCODING)

@interface CSP_Cipher : NSObject

-(BOOL)encrypt :(char *)serialNumber :(char *)category :(char *)inputFile :(char *)encFile :(char *)format;
-(BOOL)decrypt :(char *)serialNumber :(char *)category :(char *)encFile :(char *)format :(char *)decFile;

@end

#endif /* CSP_Cipher_h */
