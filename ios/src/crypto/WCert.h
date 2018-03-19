#ifndef WCert_h
#define WCert_h

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import <string.h>

#include "cert.h"
#include "signed_data.h"
#include "key.h"
#include "cipher.h"
#include "openssl.h"
#include "signers.h"
#include "provider_system.h"
#include "pkistore.h"
#include "storehelper.h"

@interface WCert : NSObject <RCTBridgeModule>{
  TrustedHandle<Certificate> cert;
}

@end

#endif /* WCert_h */
