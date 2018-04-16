#ifndef Ossl_Pkcs12_h
#define Ossl_Pkcs12_h

#import <Foundation/Foundation.h>
#import <string.h>

#include "pkcs12.h"
#include "cert.h"
#include "signed_data.h"
#include "key.h"
#include "openssl.h"
#include "signers.h"
#include "provider_system.h"
#include "storehelper.h"
#include "chain.h"
#include "Ossl_Store.h"

@interface Ossl_Pkcs12 : NSObject {
  TrustedHandle<Pkcs12> p12;
}
-(void) exportPFX :(char *)serialNumber :(char *)category :(BOOL)exportPrivateKey :(char *)password :(char *)filename;   //экспорт pkcs12
-(void) importPFX :(char *)filename :(char *)passwordForPFX :(char *)passwordForKey; //импорт pkcs12

@end

#endif /* Ossl_Pkcs12_h */
