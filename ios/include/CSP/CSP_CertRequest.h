//
//  CSP_CertRequest.h
//  CSP
//
//  Created by admin on 23/04/2018.
//  Copyright © 2018 digt. All rights reserved.
//

#ifndef CSP_CertRequest_h
#define CSP_CertRequest_h

#include "Constants.h"
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

@interface CSP_CertRequest : NSObject{
    struct extKeyUsageStructure{
        BOOL server;
        BOOL client;
        BOOL code;
        BOOL email;
    };
    
    CPCA15UserInfo* userInfo15;
    UnixRequest * pRequest;
    char* charRequest;
}

-(CPCA15UserInfo *) registration :(const char *)url :(char *)CN :(char *)org :(char *)city :(char *)region :(char *)email :(char *)country;
-(bool) authentication :(char *)tokenID :(char *)password;
-(std::vector<std::wstring>) get_templates :(char *)url;
-(bool) create :(char *)url :(char *)temp :(char *)containerName :(int)keySpec :(int)ProvType :(char *)outPathToCsr;
-(bool) getCertFromRequest :(char *)url :(char *)outPathToCsr :(char *)outPathToCert;
-(bool) getCACert :(char *)url :(char *)outPathToCert;

-(bool) createSelfSignedCertificateCSP :(char *)algorithm :(char *)containerName :(int)keyType :(extKeyUsageStructure)extKeyUsage :(char *)cn :(char *)email :(char *)organization :(char *)locality :(char *)province :(char *)country :(char *)file;
    
@end

#endif /* CSP_CertRequest_h */
