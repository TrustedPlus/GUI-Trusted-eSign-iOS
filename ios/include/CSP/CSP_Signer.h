//
//  PSigner.h
//  Prototype_Trusted_IOS
//
//  Created by admin on 01/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef CSP_Signer_h
#define CSP_Signer_h

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

@interface CSP_Signer : NSObject{
    struct infoCSPStruct {
        bool status;
        TrustedHandle<Certificate> cert;
    };
}
/*
-(BOOL)sign :(char *)serialNumber :(char *)category :(char *)inputFile :(char *)signFile;
-(BOOL)verify :(char *)serialNumber :(char *)category :(char *)signFile;

//attached/detached подпись, в зависимости от detached
-(BOOL)doSign :(char *)serialNumber :(char *)category :(char *)inputFile :(char *)signFile :(BOOL)detached;
//проверка detached подписи
-(BOOL)doVerify :(char *)inputFile :(char *)signFile;
//проверка attached подписи
-(BOOL)doVerifyAttach :(IN char *)szSignatureFile;
-(BOOL)unSign :(char *)signFile :(char *)outFile;*/

-(BOOL)SignMessage :(char *)serialNumber :(char *)category :(char *)inputFile :(char *)signFile :(char *)outFileFormat;
-(BOOL)CosignMessage :(char *)serialNumber :(char *)category :(char *)signFile :(char *)format;
-(BOOL)VerifyCosignedMessage :(char *)signFile :(char *)format;
-(BOOL)DeCosignMessage :(char *)signFile :(char *)inFileFormat :(char *)outFile;
-(std::vector<infoCSPStruct>)GetSignInfo :(char *)signFile :(char *)format;

@end

#endif /* CSP_Signer_h */
