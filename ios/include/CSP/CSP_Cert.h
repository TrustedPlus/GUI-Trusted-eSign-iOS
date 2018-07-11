#ifndef CSP_Cert_h
#define CSP_Cert_h

#include "Constants.h"
#include "CSP_Helper.h"

#include "CSP_Csp.h"

#include "provider_system.h"

#import <Foundation/Foundation.h>
#import <CPROCSP/CPROCSP.h>
#import <CPROCSP/CPCrypt.h>
#import "stdlib.h"
#import "stdio.h"
#import "map"
#import "vector"

@interface CSP_Cert : NSObject{
@public
    TrustedHandle<Certificate> cert;
}

//загрузка из хранилища
-(bool) load :(char *)serialNumber;

//загрузка из файла
-(bool) loadFromFile :(char *)pathCert :(char *)format;

//сохранение сертификата в хранилище из файла (автоматическое распределение)
-(bool) saveCertToStore :(char *)pathToFile :(char *)format;

//сохранение сертификата в хранилище из файла (выбор за пользователем "куда?")
-(bool) saveCertToStore :(char *)pathToFile :(char *)format :(char *)category;

//удаление сертификата из хранилища
-(bool) deleteCertInStore :(char *)serialNumber :(char *)category :(bool)deleteCont;

//экспорт сертификата в файл из памяти
-(bool) save :(char *)pathToSaveCert :(char *)format :(char *)category;

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

-(std::vector<chainCertStruct>) getChainCerts :(char *)serialNumber :(char *)category;

@end

#endif /* CSP_Cert_h */
