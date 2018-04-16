//
//  PSigner.h
//  Prototype_Trusted_IOS
//
//  Created by admin on 01/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef CSP_Signer_h
#define CSP_Signer_h

#include "cert.h"
#import <Foundation/Foundation.h>
#import <CPROCSP/CPROCSP.h>
#import <CPROCSP/CPCrypt.h>
#import "stdlib.h"
#import "stdio.h"
#import "map"
#import "vector"

#include "CSP_Helper.h"

#define MY_ENCODING_TYPE  (PKCS_7_ASN_ENCODING | X509_ASN_ENCODING)
#define TYPE_DER  (PKCS_7_ASN_ENCODING | X509_ASN_ENCODING)

@interface CSP_Signer : NSObject

-(BOOL)sign :(char *)serialNumber :(char *)category :(char *)inputFile :(char *)signFile;
-(BOOL)verify :(char *)serialNumber :(char *)category :(char *)signFile;


-(BOOL)doSign :(char *)serialNumber :(char *)category :(char *)inputFile :(char *)signFile :(BOOL)detached;
-(BOOL)doVerify :(IN char *)szFile :(IN char *)szSignatureFile;
-(BOOL)doVerifyAttach :(IN char *)szSignatureFile;


@end

#endif /* CSP_Signer_h */
