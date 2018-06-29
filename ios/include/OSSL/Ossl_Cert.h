#ifndef Ossl_Cert_h
#define Ossl_Cert_h

#import <Foundation/Foundation.h>

#include "cert.h"
#include "storehelper.h"

#include "Ossl_Helper.h"

@interface Ossl_Cert : NSObject {
    TrustedHandle<Certificate> cert;
}

//загрузка из хранилища
-(bool) load :(char *)serialNumber;

//загрузка из файла
-(bool) loadFromFile :(char *)pathCert :(char *)format;

//сохранение сертификата в хранилище из файла (выбор за пользователем "куда?")
-(bool) saveCertToStore :(char *)pathToFile :(char *)format :(char *)category;

//сохранение сертификата в хранилище из файла (автоматическое распределение)
-(bool) saveCertToStore :(char *)pathToFile :(char *)format;

//сохранение ключа в хранилище из файла
-(bool) saveKeyToStore :(char *)infileKey :(char *) inFormat :(char *)password;

//экспорт сертификата в файл из памяти
-(bool) save :(char *)pathToSaveCert :(char *)inFormat :(char *)category;

//удаление сертификата из хранилища
-(bool) deleteCertInStore :(char *)serialNumber :(char *)category :(bool)deleteWithKey;

/* свойства */
-(long) getVersion;
-(TrustedHandle<std::string>) getSerialNumber;
-(TrustedHandle<std::string>) getNotBefore;
-(TrustedHandle<std::string>) getNotAfter;
-(TrustedHandle<std::string>) getIssuerFriendlyName;
-(TrustedHandle<std::string>) getIssuerName;
-(TrustedHandle<std::string>) getSubjectFriendlyName;
-(TrustedHandle<std::string>) getSubjectName;
-(TrustedHandle<std::string>) getThumbprint;
-(TrustedHandle<std::string>) getPublicKeyAlgorithm;
-(TrustedHandle<std::string>) getSignatureAlgorithm;
-(TrustedHandle<std::string>) getSignatureDigestAlgorithm;
-(TrustedHandle<std::string>) getOrganizationName;
-(int) getType;
-(int) getKeyUsage;
-(int) getSelfSigned;
-(int) isCA;

@end

#endif /* Ossl_Cert_h */
