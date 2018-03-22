#include "WCert.h"

@implementation WCert

RCT_EXPORT_MODULE();

//загрузка из хранилища
RCT_EXPORT_METHOD(Load: (NSString *)serialNumber: (RCTResponseSenderBlock)callback){
  char *pSerialNumber = (char *) [serialNumber UTF8String];
  try{
    TrustedHandle<Filter> filterByCert = new Filter();
    
    filterByCert->setSerial(new std::string(pSerialNumber));
    
    TrustedHandle<PkiItemCollection> pic = g_storeCrypto->find(filterByCert);
    
    TrustedHandle<PkiItem> pi = new PkiItem();
    
    if (pic->length() <= 0){//если сертификат не найден в хранилище trusted_crypto
      pic = g_picCSP->find(filterByCert);
      
      if (pic->length() <= 0){//если сертификат не найден в хранилище cryptoPro
        callback(@[[@"Not find certificate!" copy], [NSNumber numberWithInt: 0]]);
      }
      
      pi = pic->items(0);
      cert = pi->certificate;
      callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
    }
    else{
      pi = pic->items(0);
      cert = g_storeCrypto->getItemCert(pi);
      callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
    }
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}
//загрузка из файла
RCT_EXPORT_METHOD(LoadFromFile: (NSString *)pathCert:  (NSString *)format: (RCTResponseSenderBlock)callback){
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
      else{
        callback(@[[@"Error input format!" copy], [NSNumber numberWithInt: 0]]);
        return;
      }
    }
    in = new Bio(BIO_TYPE_FILE, pPathCert, "rb");
    cert->read(in, data_format);
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}
//сохраниние сертификата в хранилище из файла
RCT_EXPORT_METHOD(saveCertToStore: (NSString *)inCert: (NSString *)inFormat: (NSString *)inCategory: (RCTResponseSenderBlock)callback){
  try{
    OpenSSL::run();
    TrustedHandle<std::string> folder = new std::string(g_pathToStore);
    
    //read cert file
    char *infileCert = (char *) [inCert UTF8String];
    TrustedHandle<Certificate> cert = new Certificate();
    TrustedHandle<Bio> inf = NULL;
    DataFormat::DATA_FORMAT format = NSStringToDataFormat(inFormat);
    inf = new Bio(BIO_TYPE_FILE, infileCert, "rb");
    cert->read(inf, format);
    /*
     добавить. если такой сертификат существует, то: спросить менять ли? или менять, не спрашивая? или не менять?
     */
    char *category = (char *) [inCategory UTF8String];
    g_storeCrypto->addPkiObject(g_prov, new std::string(category), cert);
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}
//сохранение ключа в хранилище из файла
RCT_EXPORT_METHOD(saveKeyToStore: (NSString *)inKey: (NSString *)inFormat: (NSString *)inPassword: (RCTResponseSenderBlock)callback){
  try{
    OpenSSL::run();
    TrustedHandle<std::string> folder = new std::string(g_pathToStore);
    
    //read cert file
    char *infileKey = (char *) [inKey UTF8String];
    TrustedHandle<Key> key = new Key();
    TrustedHandle<Bio> bioInKey = NULL;
    DataFormat::DATA_FORMAT format = NSStringToDataFormat(inFormat);
    bioInKey = new Bio(BIO_TYPE_FILE, infileKey, "rb");
    key->readPrivateKey(bioInKey, format, new std::string(""));
    /*
     добавить. если такой key существует, то: спросить менять ли? или менять, не спрашивая? или не менять?
     */
    char *password = (char *) [inPassword UTF8String];
    g_storeCrypto->addPkiObject(g_prov, key, new std::string(password));
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}
//экспорт сертификата в файл из памяти
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
      else{
        callback(@[[@"Error input format!" copy], [NSNumber numberWithInt: 0]]);
        return;
      }
    }
    TrustedHandle<Bio> out = new Bio(BIO_TYPE_FILE, pPathToSaveCert, "wb");
    if (cert.isEmpty()){
      callback(@[[@"Certificate not loaded." copy], [NSNumber numberWithInt: 0]]);
      return;
    }
    cert->write(out, data_format);
    out->flush();
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}
//удаление сертификата из хранилища
RCT_EXPORT_METHOD(deleteCertInStore: (NSString *)serialNumber: (RCTResponseSenderBlock)callback){
  char *pSerialNumber = (char *) [serialNumber UTF8String];
  try{
    OpenSSL::run();
    TrustedHandle<Filter> filterByCert = new Filter();
    
    filterByCert->setSerial(new std::string(pSerialNumber));
    
    TrustedHandle<PkiItemCollection> pic = g_storeCrypto->find(filterByCert);
    if (pic->length() <= 0){
      callback(@[[@"This certificate was not found in the 'crypto' store!" copy], [NSNumber numberWithInt: 0]]);
      return;
    }
    else{
      TrustedHandle<PkiItem> pi = new PkiItem();
      pi = pic->items(0);
      char * hexHash;
      if (!strcmp(pi->certKey->c_str(), "")){ //если закрытого ключа нет, то ищем hash
        TrustedHandle<Certificate> cert1 = g_storeCrypto->getItemCert(pi);
        EVP_PKEY *pkey;
        LOGGER_OPENSSL(BIO_new);
        BIO * bioBN = BIO_new(BIO_s_mem());
        LOGGER_OPENSSL(X509_get_pubkey);
        pkey = X509_get_pubkey(cert1->internal());
        if (pkey == NULL) {
          THROW_OPENSSL_EXCEPTION(0, PkiStore, NULL, "Modulus=unavailable", NULL);
        }

        if (pkey->type == EVP_PKEY_RSA)
          BN_print(bioBN, pkey->pkey.rsa->n);
        else
          if (pkey->type == EVP_PKEY_DSA)
            BN_print(bioBN, pkey->pkey.dsa->pub_key);

        EVP_PKEY_free(pkey);
              
        int contlen;
        char * cont;
        contlen = BIO_get_mem_data(bioBN, &cont);
              
        unsigned char tmphash[SHA_DIGEST_LENGTH];
        LOGGER_OPENSSL(SHA1);
        SHA1((const unsigned char *)cont, contlen, tmphash);
        
        bin_to_strhex(tmphash, SHA_DIGEST_LENGTH, &hexHash);
        
        BIO_free_all(bioBN);
      }
      else{ //если закрытый ключ присутствует
        hexHash = (char *)pi->certKey->c_str();
      }
      
      std::string pathToCert = *new std::string(g_pathToStore);
      pathToCert = pathToCert + "/" + pi->category->c_str() + "/" + pi->hash->c_str();
      pathToCert = pathToCert + "_" + hexHash + ".crt";
      if(std::remove(pathToCert.c_str()) == 0) {
        callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
      }
      else{
        callback(@[[@"Error removing certificate." copy], [NSNumber numberWithInt: 0]]);
      }
    }
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getVersion: (RCTResponseSenderBlock)callback){
  try{
    if (cert.isEmpty()){
      callback(@[[@"Certificate not loaded." copy], [NSNumber numberWithInt: 0]]);
      return;
    }
    callback(@[[NSNull null], [NSNumber numberWithInt: (cert->getVersion() + 1)]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getSerialNumber: (RCTResponseSenderBlock)callback){
  try{
    if (cert.isEmpty()){
      callback(@[[@"Certificate not loaded." copy], [NSNumber numberWithInt: 0]]);
      return;
    }
    NSString* nsSerialNumber = @(cert->getSerialNumber()->c_str());
    callback(@[[NSNull null], [nsSerialNumber copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getNotBefore: (RCTResponseSenderBlock)callback){
  try{
    if (cert.isEmpty()){
      callback(@[[@"Certificate not loaded." copy], [NSNumber numberWithInt: 0]]);
      return;
    }
    NSString* nsBefore = @(cert->getNotBefore()->c_str());
    callback(@[[NSNull null], [nsBefore copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getNotAfter: (RCTResponseSenderBlock)callback){
  try{
    if (cert.isEmpty()){
      callback(@[[@"Certificate not loaded." copy], [NSNumber numberWithInt: 0]]);
      return;
    }
    NSString* nsAfter = @(cert->getNotAfter()->c_str());
    callback(@[[NSNull null], [nsAfter copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getIssuerFriendlyName: (RCTResponseSenderBlock)callback){
  try{
    if (cert.isEmpty()){
      callback(@[[@"Certificate not loaded." copy], [NSNumber numberWithInt: 0]]);
      return;
    }
    NSString* nsIssuerFriendlyName = @(cert->getIssuerFriendlyName()->c_str());
    callback(@[[NSNull null], [nsIssuerFriendlyName copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getIssuerName: (RCTResponseSenderBlock)callback){
  try{
    if (cert.isEmpty()){
      callback(@[[@"Certificate not loaded." copy], [NSNumber numberWithInt: 0]]);
      return;
    }
    NSString* nsIssuerName = @(cert->getIssuerName()->c_str());
    callback(@[[NSNull null], [nsIssuerName copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getSubjectFriendlyName: (RCTResponseSenderBlock)callback){
  try{
    if (cert.isEmpty()){
      callback(@[[@"Certificate not loaded." copy], [NSNumber numberWithInt: 0]]);
      return;
    }
    NSString* nsSubjectFriendlyName = @(cert->getSubjectFriendlyName()->c_str());
    callback(@[[NSNull null], [nsSubjectFriendlyName copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getSubjectName: (RCTResponseSenderBlock)callback){
  try{
    if (cert.isEmpty()){
      callback(@[[@"Certificate not loaded." copy], [NSNumber numberWithInt: 0]]);
      return;
    }
    NSString* nsSubjectName = @(cert->getSubjectName()->c_str());
    callback(@[[NSNull null], [nsSubjectName copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getThumbprint: (RCTResponseSenderBlock)callback){
  try{
    if (cert.isEmpty()){
      callback(@[[@"Certificate not loaded." copy], [NSNumber numberWithInt: 0]]);
      return;
    }
    NSString* nsThumbprint = @(cert->getThumbprint()->c_str());
    if (nsThumbprint == nil)
      callback(@[[@("Thumbprint is not define") copy], [NSNumber numberWithInt: 0]]);
    else
      callback(@[[NSNull null], [nsThumbprint copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getPublicKeyAlgorithm: (RCTResponseSenderBlock)callback){
  try{
    if (cert.isEmpty()){
      callback(@[[@"Certificate not loaded." copy], [NSNumber numberWithInt: 0]]);
      return;
    }
    NSString* nsPublicKeyAlgorithm = @(cert->getPublicKeyAlgorithm()->c_str());
    callback(@[[NSNull null], [nsPublicKeyAlgorithm copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getSignatureAlgorithm: (RCTResponseSenderBlock)callback){
  try{
    if (cert.isEmpty()){
      callback(@[[@"Certificate not loaded." copy], [NSNumber numberWithInt: 0]]);
      return;
    }
    NSString* nsSignatureAlgorithm = @(cert->getSignatureAlgorithm()->c_str());
    callback(@[[NSNull null], [nsSignatureAlgorithm copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getSignatureDigestAlgorithm: (RCTResponseSenderBlock)callback){
  try{
    if (cert.isEmpty()){
      callback(@[[@"Certificate not loaded." copy], [NSNumber numberWithInt: 0]]);
      return;
    }
    NSString* nsSignatureDigestAlgorithm = @(cert->getSignatureDigestAlgorithm()->c_str());
    callback(@[[NSNull null], [nsSignatureDigestAlgorithm copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getOrganizationName: (RCTResponseSenderBlock)callback){
  try{
    if (cert.isEmpty()){
      callback(@[[@"Certificate not loaded." copy], [NSNumber numberWithInt: 0]]);
      return;
    }
    NSString* nsOrganizationName = @(cert->getOrganizationName()->c_str());
    callback(@[[NSNull null], [nsOrganizationName copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getType: (RCTResponseSenderBlock)callback){
  try{
    if (cert.isEmpty()){
      callback(@[[@"Certificate not loaded." copy], [NSNumber numberWithInt: 0]]);
      return;
    }
    callback(@[[NSNull null], [NSNumber numberWithInt: cert->getType()]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getKeyUsage: (RCTResponseSenderBlock)callback){
  try{
    if (cert.isEmpty()){
      callback(@[[@"Certificate not loaded." copy], [NSNumber numberWithInt: 0]]);
      return;
    }
    callback(@[[NSNull null], [NSNumber numberWithInt: cert->getKeyUsage()]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getSelfSigned: (RCTResponseSenderBlock)callback){
  try{
    if (cert.isEmpty()){
      callback(@[[@"Certificate not loaded." copy], [NSNumber numberWithInt: 0]]);
      return;
    }
    callback(@[[NSNull null], [NSNumber numberWithInt: cert->isSelfSigned()]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(isCA: (RCTResponseSenderBlock)callback){
  try{
    if (cert.isEmpty()){
      callback(@[[@"Certificate not loaded." copy], [NSNumber numberWithInt: 0]]);
      return;
    }
    callback(@[[NSNull null], [NSNumber numberWithInt: cert->isCA()]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}
//проверка наличия у сертификата закрытого ключа (1 - есть, 0 - нет)
-(int) hasCertInStore: (TrustedHandle<Certificate>) cert{
  try {
    TrustedHandle<Filter> filterByCert = new Filter();
    filterByCert->setSerial(cert->getSerialNumber());
    TrustedHandle<PkiItemCollection> pic = g_storeCrypto->find(filterByCert);
    if (pic->length() == 0)
      return 0;
    else
      return 1;
  } catch (TrustedHandle<Exception> e) {
    throw e;
  }
}
//высчитывание хэша
void bin_to_strhex(unsigned char *bin, unsigned int binsz, char **result){
  char hex_str[] = "0123456789abcdef";
  unsigned int  i;
  
  *result = (char *)malloc(binsz * 2 + 1);
  (*result)[binsz * 2] = 0;
  
  if (!binsz)  return;
  
  for (i = 0; i < binsz; i++){
    (*result)[i * 2 + 0] = hex_str[(bin[i] >> 4) & 0x0F];
    (*result)[i * 2 + 1] = hex_str[(bin[i]) & 0x0F];
  }
}

@end
