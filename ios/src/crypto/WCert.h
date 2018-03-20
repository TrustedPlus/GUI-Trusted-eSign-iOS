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
#include "WStore.h"
#include "WHelp.h"
#include "../CertsList.h"
#include "../globalHelper.h"

@interface WCert : NSObject <RCTBridgeModule>{
  TrustedHandle<Certificate> cert;
}
-(int) hasCertInStore: (TrustedHandle<Certificate>) cert; //проверка наличия сертификата в хранилище.

void bin_to_strhex(unsigned char *bin, unsigned int binsz, char **result);

@end

#endif /* WCert_h */
