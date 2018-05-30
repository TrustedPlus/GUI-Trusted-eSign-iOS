//
//  Wrap_Cert.m
//  libWrap
//
//  Created by admin on 09/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#include "Wrap_Cert.h"

@implementation Wrap_Cert

-(id)init{
  self = [super init];
  if (self) {
#ifdef ProvOpenSSL
    typeProv = 1;
#endif
#ifdef ProvCryptoPro
    typeProv = 2;
#endif
  }
  return self;
}

RCT_EXPORT_MODULE();
//загрузка сертификата в память из файла
RCT_EXPORT_METHOD(loadFromFile: (NSString *)pathCert:(NSString *)format:(RCTResponseSenderBlock)callback) {
  try{
    char *pPathCert = (char *) [pathCert UTF8String];
    char *pFormat = (char *) [format UTF8String];
    
    BOOL bResult = isGostCert(pPathCert, pFormat);
    BOOL b = false;
    
#ifdef ProvOpenSSL
    if (!bResult){
      b = [ossl_Cert loadFromFile:(pPathCert) :(pFormat)];
      typeProv = 1;
    }
#endif
#ifdef ProvCryptoPro
    if (bResult){
      b = [csp_Cert loadFromFile:(pPathCert) :(pFormat)];
      typeProv = 2;
    }
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}
//экспорт сертификата в файл из памяти
RCT_EXPORT_METHOD(save: (NSString *)pathCert:(NSString *)format:(RCTResponseSenderBlock)callback) {
  try{
    char *pPathCert = (char *) [pathCert UTF8String];
    char *pFormat = (char *) [format UTF8String];
    BOOL b = false;
    
#ifdef ProvOpenSSL
    if (typeProv == 1){
      b = [ossl_Cert save:(pPathCert) :(pFormat) :(char *)std::string("My").c_str()];
    }
#endif
#ifdef ProvCryptoPro
    if (typeProv == 2){
      b = [csp_Cert save:(pPathCert) :(pFormat) :(char *)std::string("My").c_str()];
    }
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}
//загрузка из хранилища
RCT_EXPORT_METHOD(load: (NSString *)serialNumber: (NSString *)provider: (RCTResponseSenderBlock)callback){
  char *pSerialNumber = (char *) [serialNumber UTF8String];
  char *prov = (char *) [provider UTF8String];
  try{
    BOOL b = false;
    
#ifdef ProvOpenSSL
    if (strcmp(prov, "SYSTEM") == 0){
      b = [ossl_Cert load:pSerialNumber];
      typeProv = 1;
    }
#endif
#ifdef ProvCryptoPro
    if (strcmp(prov, "CRYPTOPRO") == 0){
      b = [csp_Cert load:pSerialNumber];
      typeProv = 2;
    }
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}
//сохраниние сертификата в хранилище из файла
RCT_EXPORT_METHOD(saveCertToStore: (NSString *)inCert: (NSString *)inFormat: (NSString *)inCategory: (RCTResponseSenderBlock)callback){
  try{
    char *infileCert = (char *) [inCert UTF8String];
    char *format = (char *) [inFormat UTF8String];
    char *category = (char *) [inCategory UTF8String];
    
    BOOL bResult = isGostCert(infileCert, format);
    BOOL b = false;
    
#ifdef ProvOpenSSL
    if (!bResult){
      b = [ossl_Cert saveCertToStore:infileCert :format :category];
    }
#endif
#ifdef ProvCryptoPro
    if (bResult){
      b = [csp_Cert saveCertToStore:infileCert :format];
    }
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}
//сохранение ключа в хранилище из файла
RCT_EXPORT_METHOD(saveKeyToStore: (NSString *)inKey: (NSString *)inFormat: (NSString *)inPassword: (RCTResponseSenderBlock)callback){
  try{
    char *infileKey = (char *) [inKey UTF8String];
    char *format = (char *) [inFormat UTF8String];
    char *password = (char *) [inPassword UTF8String];
    BOOL b = false;
    
#ifdef ProvOpenSSL
    b = [ossl_Cert saveKeyToStore: infileKey :format :password];
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}
//удаление сертификата из хранилища
RCT_EXPORT_METHOD(deleteCertInStore: (NSString *)serialNumber: (NSString *)category: (NSString *)provider: (BOOL)deleteCont :(RCTResponseSenderBlock)callback){
  char *pSerialNumber = (char *) [serialNumber UTF8String];
  char *pCategory = (char *) [category UTF8String];
  char *prov = (char *) [provider UTF8String];
  try{
    BOOL b = false;
    
#ifdef ProvOpenSSL
    if (strcmp(prov, "SYSTEM") == 0){
      b = [ossl_Cert deleteCertInStore:pSerialNumber :pCategory];
    }
#endif
#ifdef ProvCryptoPro
    if (strcmp(prov, "CRYPTOPRO") == 0){
      b = [csp_Cert deleteCertInStore:pSerialNumber :pCategory :deleteCont];
    }
#endif

    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getVersion: (RCTResponseSenderBlock)callback){
  try{
    long version;
#ifdef ProvOpenSSL
    if (typeProv == 1){
      version = [ossl_Cert getVersion];
    }
#endif
#ifdef ProvCryptoPro
    if (typeProv == 2){
      version = [csp_Cert getVersion];
    }
#endif

    callback(@[[NSNull null], [NSNumber numberWithInt: version]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getSerialNumber: (RCTResponseSenderBlock)callback){
  try{
    TrustedHandle<std::string> serialNumber;
    
#ifdef ProvOpenSSL
    if (typeProv == 1){
      serialNumber = [ossl_Cert getSerialNumber];
    }
#endif
#ifdef ProvCryptoPro
    if (typeProv == 2){
      serialNumber = [csp_Cert getSerialNumber];
    }
#endif

    NSString* nsSerialNumber = @(serialNumber->c_str());
    callback(@[[NSNull null], [nsSerialNumber copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getNotBefore: (RCTResponseSenderBlock)callback){
  try{
    TrustedHandle<std::string> before;

#ifdef ProvOpenSSL
    if (typeProv == 1){
      before = [ossl_Cert getNotBefore];
    }
#endif
#ifdef ProvCryptoPro
    if (typeProv == 2){
      before = [csp_Cert getNotBefore];
    }
#endif

    NSString* nsBefore = @(before->c_str());
    callback(@[[NSNull null], [nsBefore copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getNotAfter: (RCTResponseSenderBlock)callback){
  try{
    TrustedHandle<std::string> after;

#ifdef ProvOpenSSL
    if (typeProv == 1){
      after = [ossl_Cert getNotAfter];
    }
#endif
#ifdef ProvCryptoPro
    if (typeProv == 2){
      after = [csp_Cert getNotAfter];
    }
#endif
    
    NSString* nsAfter = @(after->c_str());
    callback(@[[NSNull null], [nsAfter copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getIssuerFriendlyName: (RCTResponseSenderBlock)callback){
  try{
    TrustedHandle<std::string> issuerFriendlyName;

#ifdef ProvOpenSSL
    if (typeProv == 1){
      issuerFriendlyName = [ossl_Cert getIssuerFriendlyName];
    }
#endif
#ifdef ProvCryptoPro
    if (typeProv == 2){
      issuerFriendlyName = [csp_Cert getIssuerFriendlyName];
    }
#endif

    NSString* nsIssuerFriendlyName = @(issuerFriendlyName->c_str());
    callback(@[[NSNull null], [nsIssuerFriendlyName copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getIssuerName: (RCTResponseSenderBlock)callback){
  try{
    TrustedHandle<std::string> issuerName;
    
#ifdef ProvOpenSSL
    if (typeProv == 1){
      issuerName = [ossl_Cert getIssuerName];
    }
#endif
#ifdef ProvCryptoPro
    if (typeProv == 2){
      issuerName = [csp_Cert getIssuerName];
    }
#endif

    NSString* nsIssuerName = @(issuerName->c_str());
    callback(@[[NSNull null], [nsIssuerName copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getSubjectFriendlyName: (RCTResponseSenderBlock)callback){
  try{
    TrustedHandle<std::string> subjectFriendlyName;

#ifdef ProvOpenSSL
    if (typeProv == 1){
      subjectFriendlyName = [ossl_Cert getSubjectFriendlyName];
    }
#endif
#ifdef ProvCryptoPro
    if (typeProv == 2){
      subjectFriendlyName = [csp_Cert getSubjectFriendlyName];
    }
#endif

    NSString* nsSubjectFriendlyName = @(subjectFriendlyName->c_str());
    callback(@[[NSNull null], [nsSubjectFriendlyName copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getSubjectName: (RCTResponseSenderBlock)callback){
  try{
    TrustedHandle<std::string> subjectName;

#ifdef ProvOpenSSL
    if (typeProv == 1){
      subjectName = [ossl_Cert getSubjectName];
    }
#endif
#ifdef ProvCryptoPro
    if (typeProv == 2){
      subjectName = [csp_Cert getSubjectName];
    }
#endif
    
    NSString* nsSubjectName = @(subjectName->c_str());
    callback(@[[NSNull null], [nsSubjectName copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getThumbprint: (RCTResponseSenderBlock)callback){
  try{
    TrustedHandle<std::string> thumbprint;

#ifdef ProvOpenSSL
    if (typeProv == 1){
      thumbprint = [ossl_Cert getThumbprint];
    }
#endif
#ifdef ProvCryptoPro
    if (typeProv == 2){
      thumbprint = [csp_Cert getThumbprint];
    }
#endif

    NSString* nsThumbprint = @(thumbprint->c_str());
    callback(@[[NSNull null], [nsThumbprint copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getPublicKeyAlgorithm: (RCTResponseSenderBlock)callback){
  try{
    TrustedHandle<std::string> publicKeyAlgorithm;

#ifdef ProvOpenSSL
    if (typeProv == 1){
      publicKeyAlgorithm = [ossl_Cert getPublicKeyAlgorithm];
    }
#endif
#ifdef ProvCryptoPro
    if (typeProv == 2){
      publicKeyAlgorithm = [csp_Cert getPublicKeyAlgorithm];
    }
#endif
    
    NSString* nsPublicKeyAlgorithm = @(publicKeyAlgorithm->c_str());
    callback(@[[NSNull null], [nsPublicKeyAlgorithm copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getSignatureAlgorithm: (RCTResponseSenderBlock)callback){
  try{
    TrustedHandle<std::string> signatureAlgorithm;

#ifdef ProvOpenSSL
    if (typeProv == 1){
      signatureAlgorithm = [ossl_Cert getSignatureAlgorithm];
    }
#endif
#ifdef ProvCryptoPro
    if (typeProv == 2){
      signatureAlgorithm = [csp_Cert getSignatureAlgorithm];
    }
#endif
    
    NSString* nsSignatureAlgorithm = @(signatureAlgorithm->c_str());
    callback(@[[NSNull null], [nsSignatureAlgorithm copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getSignatureDigestAlgorithm: (RCTResponseSenderBlock)callback){
  try{
    TrustedHandle<std::string> signatureDigestAlgorithm;

#ifdef ProvOpenSSL
    if (typeProv == 1){
      signatureDigestAlgorithm = [ossl_Cert getSignatureDigestAlgorithm];
    }
#endif
#ifdef ProvCryptoPro
    if (typeProv == 2){
      signatureDigestAlgorithm = [csp_Cert getSignatureDigestAlgorithm];
    }
#endif

    NSString* nsSignatureDigestAlgorithm = @(signatureDigestAlgorithm->c_str());
    callback(@[[NSNull null], [nsSignatureDigestAlgorithm copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getOrganizationName: (RCTResponseSenderBlock)callback){
  try{
    TrustedHandle<std::string> organizationName;

#ifdef ProvOpenSSL
    if (typeProv == 1){
      organizationName = [ossl_Cert getOrganizationName];
    }
#endif
#ifdef ProvCryptoPro
    if (typeProv == 2){
      organizationName = [csp_Cert getOrganizationName];
    }
#endif

    NSString* nsOrganizationName = @(organizationName->c_str());
    callback(@[[NSNull null], [nsOrganizationName copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getType: (RCTResponseSenderBlock)callback){
  try{
    int type;

#ifdef ProvOpenSSL
    if (typeProv == 1){
      type = [ossl_Cert getType];
    }
#endif
#ifdef ProvCryptoPro
    if (typeProv == 2){
      type = [csp_Cert getType];
    }
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: type]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getKeyUsage: (RCTResponseSenderBlock)callback){
  try{
    int keyUsage;
    
#ifdef ProvOpenSSL
    if (typeProv == 1){
      keyUsage = [ossl_Cert getKeyUsage];
    }
#endif
#ifdef ProvCryptoPro
    if (typeProv == 2){
      keyUsage = [csp_Cert getKeyUsage];
    }
#endif

    callback(@[[NSNull null], [NSNumber numberWithInt: keyUsage]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getSelfSigned: (RCTResponseSenderBlock)callback){
  try{
    int selfSigned;

#ifdef ProvOpenSSL
    if (typeProv == 1){
      selfSigned = [ossl_Cert getSelfSigned];
    }
#endif
#ifdef ProvCryptoPro
    if (typeProv == 2){
      selfSigned = [csp_Cert getSelfSigned];
    }
#endif

    callback(@[[NSNull null], [NSNumber numberWithInt: selfSigned]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(isCA: (RCTResponseSenderBlock)callback){
  try{
    int ca;

#ifdef ProvOpenSSL
    if (typeProv == 1){
      ca = [ossl_Cert isCA];
    }
#endif
#ifdef ProvCryptoPro
    if (typeProv == 2){
      ca = [csp_Cert isCA];
    }
#endif

    callback(@[[NSNull null], [NSNumber numberWithInt: ca]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

@end
