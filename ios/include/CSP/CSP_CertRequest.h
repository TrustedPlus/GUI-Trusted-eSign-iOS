//
//  CSP_CertRequest.h
//  CSP
//
//  Created by admin on 23/04/2018.
//  Copyright © 2018 digt. All rights reserved.
//

#ifndef CSP_CertRequest_h
#define CSP_CertRequest_h

#include "CSP_Helper.h"

#import <Foundation/Foundation.h>
#import <CPROCSP/UnixRequest.h>
#import <CPROCSP/UnixEnroll.h>
#import <CPROCSP/WinCryptEx.h>
#import <CPROCSP/CPCA15UserInfo.h>
#import <CPROCSP/SecureBuffer.h>

#include <cstdio>
#include <cstring>
#include <time.h>

#define ENCODE X509_ASN_ENCODING | PKCS_7_ASN_ENCODING

@interface CSP_CertRequest : NSObject{
    struct extKeyUsageStructure{
        BOOL server;
        BOOL client;
        BOOL code;
        BOOL email;
    };
    
    CPCA15UserInfo *cpca15UserInfo;
    UnixRequest * pRequest;
    char* charRequest;
}

-(long) get_templates :(char *)url :(std::vector<std::string>&)templates;
-(int) create :(char *)url :(char *)temp :(char *)containerName :(char *)CN :(char *)org :(char *)city :(char *)region :(char *)email :(char *)country :(char *)outPathToCsr;
-(int)getCertFromRequest :(char *)url :(char *)outPathToCsr :(char *)outPathToCert;

-(int) createSelfSignedCertificateCSP :(char *)algorithm :(char *)containerName :(int)keyType :(extKeyUsageStructure)extKeyUsage :(char *)cn :(char *)email :(char *)organization :(char *)locality :(char *)province :(char *)country :(char *)file;
    
@end

#endif /* CSP_CertRequest_h */
