#ifndef CertsList_h
#define CertsList_h

#include "crypto/WCertsList.h"
#include "cert.h"
#include "storehelper.h"
#include "pkistore.h"
#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import <CPROCSP/CPROCSP.h>
#import <CPROCSP/CPCrypt.h>
#import "stdlib.h"
#import "stdio.h"

#include "cryptoPro/PCsp.h"
#include <string>
#include <sstream>
#include <iostream>
#include "vector"
#include "map"

@interface CertsList : NSObject <RCTBridgeModule>{
  NSMutableArray *listCerts;//содержит список сертификатов во всех хранилищах(cryptoPro + trusted_crypto)
  TrustedHandle<PkiItemCollection> providerItemCollection; //содержит список сертификатов в выбранном хранилище
}

@end

#endif /* CertsList_h */
