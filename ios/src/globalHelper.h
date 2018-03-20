#ifndef globalHelper_h
#define globalHelper_h

#include "pkistore.h"
#include "provider_system.h"
#import <Foundation/Foundation.h>

extern std::string g_pathToStore;
extern int countCSPCerts;                                   //количество сертификатов в хранилищах криптоПро
extern int countCryptoCerts;                                //количество сертификатов в хранилищах trusted_crypto
extern TrustedHandle<PkiStore> g_storeCrypto;               //содержит список сертификатов и ключей(?) в хранилище trusted_crypto
extern TrustedHandle<PkiItemCollection> g_picCSP;           //содержит список сертификатов в хранилище cryptoPro
extern TrustedHandle<Provider> g_prov;                      //содержит криптопровайдер. Нужен для инициализации хранилища при первом запуске


#endif /* globalHelper_h */
