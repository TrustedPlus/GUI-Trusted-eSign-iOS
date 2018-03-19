#include "WCert.h"
#include "WCertsList.h"
#include "../globalHelper.h"

@implementation WCert

RCT_EXPORT_MODULE();

//загрузка из хранилища
RCT_EXPORT_METHOD(Load: (NSString *)issuerName: (NSString *)serialNumber: (RCTResponseSenderBlock)callback){
  char *pIssuerName = (char *) [issuerName UTF8String];
  char *pSerialNumber = (char *) [serialNumber UTF8String];
  try{
    TrustedHandle<Filter> filterByCert = new Filter();
    
    filterByCert->setIssuerName(new std::string(pIssuerName));
    filterByCert->setSerial(new std::string(pSerialNumber));
    
    TrustedHandle<PkiItemCollection> pic = g_storeCrypto->find(filterByCert);
    
    TrustedHandle<PkiItem> pi = new PkiItem();
    
    if (pic->length() <= 0){//если сертификат не найден в хранилище trusted_crypto
      pic = g_picCSP->find(filterByCert);
      
      if (pic->length() <= 0){//если сертификат не найден в хранилище cryptoPro
        callback(@[[@"Not find certificate!" copy], [NSNull null]]);
      }
      
      pi = pic->items(0);
      cert = pi->certificate;
      callback(@[[NSNull null], [NSNull null]]);
    }
    else{
      pi = pic->items(0);
      cert = g_storeCrypto->getItemCert(pi);
      callback(@[[NSNull null], [NSNull null]]);
    }
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(Save: (NSString *)pathToSaveCert:  (NSString *)format:  (RCTResponseSenderBlock)callback){
  try{
    char *pPathToSaveCert = (char *) [pathToSaveCert UTF8String];
    char *pFormat = (char *) [format UTF8String];
    DataFormat::DATA_FORMAT data_format;
    if (strncmp(pFormat, "DER", 3) == 0)
      data_format = DataFormat::DER;
    else{
      if (strncmp(pFormat, "BASE64", 6) == 0)
        data_format = DataFormat::BASE64;
      else
        callback(@[[@"Error input format!" copy], [NSNull null]]);
    }
    TrustedHandle<Bio> out = new Bio(BIO_TYPE_FILE, pPathToSaveCert, "wb");
    cert->write(out, data_format);
    out->flush();
    callback(@[[NSNull null], [NSNull null]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getVersion: (RCTResponseSenderBlock)callback){
  try{
    callback(@[[NSNull null], [NSNumber numberWithInt: (cert->getVersion() + 1)]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getSerialNumber: (RCTResponseSenderBlock)callback){
  try{
    NSString* nsSerialNumber = @(cert->getSerialNumber()->c_str());
    callback(@[[NSNull null], [nsSerialNumber copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getNotBefore: (RCTResponseSenderBlock)callback){
  try{
    NSString* nsBefore = @(cert->getNotBefore()->c_str());
    callback(@[[NSNull null], [nsBefore copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getNotAfter: (RCTResponseSenderBlock)callback){
  try{
    NSString* nsAfter = @(cert->getNotAfter()->c_str());
    callback(@[[NSNull null], [nsAfter copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getIssuerFriendlyName: (RCTResponseSenderBlock)callback){
  try{
    NSString* nsIssuerFriendlyName = @(cert->getIssuerFriendlyName()->c_str());
    callback(@[[NSNull null], [nsIssuerFriendlyName copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getIssuerName: (RCTResponseSenderBlock)callback){
  try{
    NSString* nsIssuerName = @(cert->getIssuerName()->c_str());
    callback(@[[NSNull null], [nsIssuerName copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getSubjectFriendlyName: (RCTResponseSenderBlock)callback){
  try{
    NSString* nsSubjectFriendlyName = @(cert->getSubjectFriendlyName()->c_str());
    callback(@[[NSNull null], [nsSubjectFriendlyName copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getSubjectName: (RCTResponseSenderBlock)callback){
  try{
    NSString* nsSubjectName = @(cert->getSubjectName()->c_str());
    callback(@[[NSNull null], [nsSubjectName copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getThumbprint: (RCTResponseSenderBlock)callback){
  try{
    NSString* nsThumbprint = @(cert->getThumbprint()->c_str());
    if (nsThumbprint == nil)
      callback(@[[@("Thumbprint is not define") copy], [NSNull null]]);
    else
      callback(@[[NSNull null], [nsThumbprint copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getPublicKeyAlgorithm: (RCTResponseSenderBlock)callback){
  try{
    NSString* nsPublicKeyAlgorithm = @(cert->getPublicKeyAlgorithm()->c_str());
    callback(@[[NSNull null], [nsPublicKeyAlgorithm copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getSignatureAlgorithm: (RCTResponseSenderBlock)callback){
  try{
    NSString* nsSignatureAlgorithm = @(cert->getSignatureAlgorithm()->c_str());
    callback(@[[NSNull null], [nsSignatureAlgorithm copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getSignatureDigestAlgorithm: (RCTResponseSenderBlock)callback){
  try{
    NSString* nsSignatureDigestAlgorithm = @(cert->getSignatureDigestAlgorithm()->c_str());
    callback(@[[NSNull null], [nsSignatureDigestAlgorithm copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getOrganizationName: (RCTResponseSenderBlock)callback){
  try{
    NSString* nsOrganizationName = @(cert->getOrganizationName()->c_str());
    callback(@[[NSNull null], [nsOrganizationName copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getType: (RCTResponseSenderBlock)callback){
  try{
    callback(@[[NSNull null], [NSNumber numberWithInt: cert->getType()]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getKeyUsage: (RCTResponseSenderBlock)callback){
  try{
    callback(@[[NSNull null], [NSNumber numberWithInt: cert->getKeyUsage()]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getSelfSigned: (RCTResponseSenderBlock)callback){
  try{
    callback(@[[NSNull null], [NSNumber numberWithInt: cert->isSelfSigned()]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(isCA: (RCTResponseSenderBlock)callback){
  try{
    callback(@[[NSNull null], [NSNumber numberWithInt: cert->isCA()]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

//добавить сохранить сертификат в хранилище (save in store)
/*
//загрузка из файла
RCT_EXPORT_METHOD(Load: (NSString *)pathCert:  (NSString *)format: (RCTResponseSenderBlock)callback){
  try{
    char *pPathCert = (char *) [pathCert UTF8String];
    char *pFormat = (char *) [format UTF8String];
    TrustedHandle<Bio> in = NULL;
    DataFormat::DATA_FORMAT data_format;
    if (strncmp(pFormat, "DER", 3) == 0)
      data_format = DataFormat::DER;
    else{
      if (strncmp(pFormat, "BASE64", 6) == 0)
        data_format = DataFormat::BASE64;
      else
        return;//error input format
    }
    in = new Bio(BIO_TYPE_FILE, pPathCert, "rb");
    cert->read(in, data_format);
    callback(@[[NSNull null], [NSNull null]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}
*/
@end
