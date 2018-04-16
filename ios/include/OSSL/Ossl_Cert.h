#ifndef Ossl_Cert_h
#define Ossl_Cert_h

#import <Foundation/Foundation.h>

#include "cert.h"
#include "storehelper.h"

#include "Ossl_Helper.h"

@interface Ossl_Cert : NSObject {
    TrustedHandle<Certificate> cert;
}

-(bool) load :(char *)serialNumber;                                                 //загрузка из хранилища
-(bool) loadFromFile :(char *)pathCert: (char *)format;                             //загрузка из файла
-(bool) saveCertToStore :(char *)infileCert: (char *)inFormat: (char *)category;    //сохраниние сертификата в хранилище из файла
-(bool) saveKeyToStore :(char *)infileKey: (char *)inFormat: (char *)password;      //сохранение ключа в хранилище из файла
-(bool) save :(char *)pathToSaveCert: (char *)inFormat: (char *)category;           //экспорт сертификата в файл из памяти
-(bool) deleteCertInStore :(char *)serialNumber: (char *)category;                  //удаление сертификата из хранилища
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
