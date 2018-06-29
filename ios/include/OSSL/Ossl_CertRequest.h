#ifndef Ossl_CertRequest_h
#define Ossl_CertRequest_h

#import <Foundation/Foundation.h>

#include "cert_request.h"
#include "cert_request_info.h"
#include "exts.h"
#include "ext.h"
#include "oid.h"
#include "chain.h"

#include "Ossl_Helper.h"

@interface Ossl_CertRequest : NSObject

struct extKeyUsageStruct{
    BOOL server;
    BOOL client;
    BOOL code;
    BOOL email;
};

struct keyUsageStruct {
    bool digitalSignature;
    bool nonRepudiation;
    bool keyEncipherment;
    bool dataEncipherment;
    bool keyAgreement;
    bool keyCertSign;
    bool cRLSign;
    bool encipherOnly;
    bool decipherOnly;
};

struct sslTemplateInfo {
    TrustedHandle<std::string> subjectName;
    TrustedHandle<std::string> pubKey;
    TrustedHandle<extKeyUsageStruct> extKeyUsage;
    TrustedHandle<keyUsageStruct> keyUsage;
};

struct sslRequestFileInfo {
    TrustedHandle<std::string> subjectName;
    TrustedHandle<std::string> pubKey;
    BOOL hasInstallCert;
    BOOL buildChain;
    BOOL hasPrivateKey;
};

//создание запроса на сертификат
-(void) createRequest :(char *)algorithm :(int)length :(int)keyUsage :(extKeyUsageStruct)extKeyUsage :(BOOL)exportableKey :(char *)cn :(char *)email :(char *)organization :(char *)locality :(char *)province :(char *)country :(char *)pathToCsr :(char *)pathToKey;

//создание самоподписанного сертификата
-(void) createCertFromRequest :(char *)pathToCsr :(char *)pathToCer  :(char *)outPathKey;

//получение информации о запросе на сертификат при создании по шаблону
-(sslTemplateInfo) getRequestinfo :(char *)pathToCsr :(char *)format;

//получение информации о сертификате при создании по шаблону
-(sslTemplateInfo) getCertificateInfo :(char *)serialNumber :(char *)category;

//поиск установленного сертификата и закрытого ключа для запроса
-(sslRequestFileInfo) getRequestFileInfo :(char *)reqFile :(char *)format;

@end

#endif /* Ossl_CertRequest_h */
