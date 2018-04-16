//
//  Ossl_Helper.h
//  OpenSSL
//
//  Created by admin on 06/04/2018.
//  Copyright © 2018 digt. All rights reserved.
//

#ifndef Ossl_Helper_h
#define Ossl_Helper_h

#import <Foundation/Foundation.h>
#include "pkistore.h"
#include "pki.h"
#include "cert.h"
#include "storehelper.h"
#include "provider_system.h"
#include "crl.h"
#include "crls.h"

extern std::string g_pathToStore;
extern TrustedHandle<PkiStore> g_storeCrypto; //содержит список сертификатов и ключей(?) в хранилище trusted_crypto
extern TrustedHandle<Provider> g_prov;        //содержит криптопровайдер. Нужен для инициализации хранилища при первом запуске

DataFormat::DATA_FORMAT charToDataFormat(char *format);
int hasCertInStore(TrustedHandle<Certificate> cert); //проверка наличия сертификата в хранилище.
TrustedHandle<CrlCollection> getCrls();
TrustedHandle<CertificateCollection> getTrustCerts();

#endif /* Ossl_Helper_h */
