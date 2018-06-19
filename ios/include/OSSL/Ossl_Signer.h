#ifndef Ossl_Signer_h
#define Ossl_Signer_h

#import <Foundation/Foundation.h>

#include "cert.h"
#include "signed_data.h"
#include "key.h"
#include "cipher.h"
#include "openssl.h"
#include "signers.h"
#include "chain.h"

#include "Ossl_Helper.h"

@interface Ossl_Signer : NSObject{
    struct infoStruct {
        bool status;
        TrustedHandle<Certificate> cert;
    };
}

-(BOOL) sign :(char *)serialNumber :(char *)category :(char *)infilename :(char *)outfilename :(char *)format :(bool)isDetached;
-(BOOL) coSignMessage :(char *)serial :(char *)category :(char *)inputfilename :(char *)signfilename :(char *)format :(bool)isDetached;
-(BOOL) unSign :(char *)checkfilename :(char *)format :(char *)outfilename;
-(BOOL) verify :(char *)inputfilename :(char *)checkfilename :(char *)format;
-(std::vector<infoStruct>) getSignInfo :(char *)inputfilename :(char *)checkfilename :(char *)format;

@end

#endif /* Ossl_Signer_h */
