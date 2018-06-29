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


//содержит путь к хранилищу
extern std::string g_pathToStore;

//содержит список сертификатов, ключей и CRL в хранилище trusted_crypto
extern TrustedHandle<PkiStore> g_storeCrypto;

//содержит криптопровайдер. Нужен для инициализации хранилища при первом запуске
extern TrustedHandle<Provider> g_prov;

//преобразование из char * в DataFormat::DATA_FORMAT
DataFormat::DATA_FORMAT charToDataFormat(char *format);

//проверка наличия сертификата в хранилище.
int hasCertInStore(TrustedHandle<Certificate> cert);

//возвращает список CRL файлов
TrustedHandle<CrlCollection> getCrls();

//возвращает список доверенных сертификатов
TrustedHandle<CertificateCollection> getTrustCerts();

#endif /* Ossl_Helper_h */
