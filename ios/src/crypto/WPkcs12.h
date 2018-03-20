#ifndef WPkcs12_h
#define WPkcs12_h

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import <string.h>

#include "pki/pkcs12.h"
#include "cert.h"
#include "signed_data.h"
#include "key.h"
#include "openssl.h"
#include "signers.h"
#include "provider_system.h"
#include "storehelper.h"
#include "chain.h"
#include "WStore.h"
#include "WHelp.h"
#include "../CertsList.h"
#include "../globalHelper.h"

@interface WPkcs12 : NSObject <RCTBridgeModule>{
  TrustedHandle<Pkcs12> p12;
}

@end

#endif /* WPkcs12_h */
