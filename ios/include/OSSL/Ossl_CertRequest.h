#ifndef Ossl_CertRequest_h
#define Ossl_CertRequest_h

#import <Foundation/Foundation.h>

#include "cert_request.h"
#include "cert_request_info.h"
#include "exts.h"
#include "ext.h"
#include "oid.h"

#include "Ossl_Helper.h"

@interface Ossl_CertRequest : NSObject

struct extKeyUsageStruct{
    BOOL server;
    BOOL client;
    BOOL code;
    BOOL email;
};

-(void) createRequest :(char *)algorithm :(int)length :(int)keyUsage :(extKeyUsageStruct)extKeyUsage :(BOOL)exportableKey :(char *)cn :(char *)email :(char *)organization :(char *)locality :(char *)province :(char *)country :(char *)outPathCsr :(char *)outPathKey;
-(void) createCertFromRequest :(char *)outPathCsr :(char *)outPathCer  :(char *)outPathKey;
-(void) getRequestinfo :(char *)outPathCsr :(char *)format;
@end

#endif /* Ossl_CertRequest_h */
