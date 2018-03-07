#include "WCert.h"

@implementation WCert

RCT_EXPORT_MODULE();

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
    cert.read(in, data_format);
    callback(@[[NSNull null], [NSNull null]]);
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
        return;//error input format
    }
    TrustedHandle<Bio> out = new Bio(BIO_TYPE_FILE, pPathToSaveCert, "wb");
    cert.write(out, data_format);
    out->flush();
    callback(@[[NSNull null], [NSNull null]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getVersion: (RCTResponseSenderBlock)callback){
  try{
    callback(@[[NSNull null], [NSNumber numberWithInt: (cert.getVersion() + 1)]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getSerialNumber: (RCTResponseSenderBlock)callback){
  try{
    NSString* nsSerialNumber = @(cert.getSerialNumber()->c_str());
    callback(@[[NSNull null], [nsSerialNumber copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getNotBefore: (RCTResponseSenderBlock)callback){
  try{
    NSString* nsBefore = @(cert.getNotBefore()->c_str());
    callback(@[[NSNull null], [nsBefore copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getNotAfter: (RCTResponseSenderBlock)callback){
  try{
    NSString* nsAfter = @(cert.getNotAfter()->c_str());
    callback(@[[NSNull null], [nsAfter copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getIssuerFriendlyName: (RCTResponseSenderBlock)callback){
  try{
    NSString* nsIssuerFriendlyName = @(cert.getIssuerFriendlyName()->c_str());
    callback(@[[NSNull null], [nsIssuerFriendlyName copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getIssuerName: (RCTResponseSenderBlock)callback){
  try{
    NSString* nsIssuerName = @(cert.getIssuerName()->c_str());
    callback(@[[NSNull null], [nsIssuerName copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getSubjectFriendlyName: (RCTResponseSenderBlock)callback){
  try{
    NSString* nsSubjectFriendlyName = @(cert.getSubjectFriendlyName()->c_str());
    callback(@[[NSNull null], [nsSubjectFriendlyName copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getSubjectName: (RCTResponseSenderBlock)callback){
  try{
    NSString* nsSubjectName = @(cert.getSubjectName()->c_str());
    callback(@[[NSNull null], [nsSubjectName copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getThumbprint: (RCTResponseSenderBlock)callback){
  try{
    NSString* nsThumbprint = @(cert.getThumbprint()->c_str());
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
    NSString* nsPublicKeyAlgorithm = @(cert.getPublicKeyAlgorithm()->c_str());
    callback(@[[NSNull null], [nsPublicKeyAlgorithm copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getSignatureAlgorithm: (RCTResponseSenderBlock)callback){
  try{
    NSString* nsSignatureAlgorithm = @(cert.getSignatureAlgorithm()->c_str());
    callback(@[[NSNull null], [nsSignatureAlgorithm copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getSignatureDigestAlgorithm: (RCTResponseSenderBlock)callback){
  try{
    NSString* nsSignatureDigestAlgorithm = @(cert.getSignatureDigestAlgorithm()->c_str());
    callback(@[[NSNull null], [nsSignatureDigestAlgorithm copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getOrganizationName: (RCTResponseSenderBlock)callback){
  try{
    NSString* nsOrganizationName = @(cert.getOrganizationName()->c_str());
    callback(@[[NSNull null], [nsOrganizationName copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getType: (RCTResponseSenderBlock)callback){
  try{
    callback(@[[NSNull null], [NSNumber numberWithInt: cert.getType()]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getKeyUsage: (RCTResponseSenderBlock)callback){
  try{
    callback(@[[NSNull null], [NSNumber numberWithInt: cert.getKeyUsage()]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getSelfSigned: (RCTResponseSenderBlock)callback){
  try{
    callback(@[[NSNull null], [NSNumber numberWithInt: cert.isSelfSigned()]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(isCA: (RCTResponseSenderBlock)callback){
  try{
    callback(@[[NSNull null], [NSNumber numberWithInt: cert.isCA()]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

//save in Store cert and key && read
RCT_EXPORT_METHOD(saveInStore: (NSString *)pathToStore: (NSString *)inCert: (NSString *)inKey: (RCTResponseSenderBlock)callback){
  try{
    OpenSSL::run();
    char *pStore = (char *) [pathToStore UTF8String];
    TrustedHandle<std::string> folder = new std::string(pStore);
    
    TrustedHandle<PkiStore> store = new PkiStore(folder);
    
    TrustedHandle<Provider> prov = new Provider_System(folder);
    
    //read cert file
    char *infileCert = (char *) [inCert UTF8String];
    TrustedHandle<Certificate> cert = new Certificate();
    TrustedHandle<Bio> inf = NULL;
    DataFormat::DATA_FORMAT format = DataFormat::BASE64;
    inf = new Bio(BIO_TYPE_FILE, infileCert, "rb");
    cert->read(inf, format);
    //add cert in Store
    store->addPkiObject(prov, new std::string("MY"), cert);
    
    //read key file
    char *infileKey = (char *) [inKey UTF8String];
    TrustedHandle<Key> key = new Key();
    TrustedHandle<Bio> bioInKey = NULL;
    format = DataFormat::BASE64;
    bioInKey = new Bio(BIO_TYPE_FILE, infileKey, "rb");
    key->readPrivateKey(bioInKey, format, new std::string(""));
    //add key in Store
    store->addPkiObject(prov, key, new std::string(""));
    store->addProvider(prov);
    
    //set search params
    TrustedHandle<Filter> filterForCert = new Filter();
    NSLog(@"Issuer name - %s", cert->getIssuerName()->c_str());
    NSLog(@"serial number - %s", cert->getSerialNumber()->c_str());
    filterForCert->setIssuerName(new std::string("/2.5.4.6=AU/2.5.4.8=Some-State/2.5.4.10=Organization name/2.5.4.3=Test RSA SHA-256 cert/1.2.840.113549.1.9.1=example@example.org"));
    filterForCert->setSerial(new std::string("FE0CE497DB678389"));
    
    TrustedHandle<PkiItemCollection> pic = new PkiItemCollection();
    pic = store->find(filterForCert);
    
    TrustedHandle<PkiItem> pi = new PkiItem();
    pi = pic->items(0);
    
    //find Cert;
    TrustedHandle<Certificate> findCert = new Certificate();
    findCert = store->getItemCert(pi);
    NSLog(@"Subject Name - %s", findCert->getSubjectName()->c_str());
    
    //TrustedHandle<Key> findKey = new Key();
    //findKey = store->getItemKey(pic->items(1));
    //find key
    TrustedHandle<Filter> filterForKey = new Filter();
    filterForKey->setType(new std::string("CERTIFICATE"));
    filterForKey->setProvider(new std::string("SYSTEM"));
    filterForKey->setCategory(new std::string("MY"));
    filterForKey->setHash(new std::string("9411a862691c1846b24da3c89299799856876404"));
    
    TrustedHandle<PkiItem> piKey = new PkiItem();
    piKey = store->findKey(filterForKey);
    
    NSLog(@"hash - %s", piKey->hash->c_str());
    NSLog(@"provider - %s", piKey->provider->c_str());
    NSLog(@"uri - %s", piKey->uri->c_str());
    
    callback(@[[NSNull null], [NSNumber numberWithInt:(true)]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

@end
