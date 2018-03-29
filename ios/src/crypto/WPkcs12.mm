#include "WPkcs12.h"

@implementation WPkcs12

RCT_EXPORT_MODULE();

//экспорт pkcs12
RCT_EXPORT_METHOD(exportPFX: (NSString *)serialNumber: (NSString *)category: (BOOL)exportPrivateKey: (NSString *)password: (NSString *)filename: (RCTResponseSenderBlock)callback){
  char *pSerialNumber = (char *) [serialNumber UTF8String];
  char *pCategory = (char *) [category UTF8String];
  char *pPwd = (char *) [password UTF8String];
  //char *pExportPrivateKey = (char *) [exportPrivateKey UTF8String];
  char *pFilename = (char *) [filename UTF8String];
  try{
    OpenSSL::run();
    
    //read cert file
    TrustedHandle<Filter> filterByCert = new Filter();
    
    filterByCert->setSerial(new std::string(pSerialNumber));
    filterByCert->setCategory(new std::string(pCategory));
    
    TrustedHandle<PkiItemCollection> pic = g_storeCrypto->find(filterByCert);
    if (pic->length() <= 0){
      THROW_EXCEPTION(0, WPkcs12, NULL, "This certificate was not found in the 'crypto' store!");
    }
    
    TrustedHandle<PkiItem> pi = new PkiItem();
    pi = pic->items(0);
    
    TrustedHandle<Certificate> hcert = g_storeCrypto->getItemCert(pi);
    
    //findKey
    TrustedHandle<Key> hkey;
    if (exportPrivateKey){
      TrustedHandle<Filter> filterByKey = new Filter();
      filterByKey->setHash(pi->certKey);
      TrustedHandle<PkiItemCollection> picKey = g_storeCrypto->find(filterByKey);
      if (picKey->length() <= 0){
        THROW_EXCEPTION(0, WPkcs12, NULL, "No private key found for this certificate in the 'crypto' store!");
      }
      TrustedHandle<PkiItem> piKey = picKey->items(0);
      hkey = g_storeCrypto->getItemKey(piKey);
    }
    else{
      hkey = new Key();
    }
    
    //find all TRUST certs
    TrustedHandle<Filter> filterByTrustCerts = new Filter();
    filterByTrustCerts->setCategory(new std::string("TRUST"));
    TrustedHandle<PkiItemCollection> picTrustCerts = g_storeCrypto->find(filterByTrustCerts);
    if (picTrustCerts->length() <= 0){
      THROW_EXCEPTION(0, WPkcs12, NULL, "This certificates was not found in the 'crypto' store!");
    }
    TrustedHandle<CertificateCollection> hcerts = new CertificateCollection();
    for (int i = 0; i < picTrustCerts->length(); i++){
      hcerts->push(g_storeCrypto->getItemCert(picTrustCerts->items(i)));
    }

    //построение цепочки сертификатов(chain) по сертификату
    TrustedHandle<Chain> chain = new Chain();
    TrustedHandle<CertificateCollection> ca = chain->buildChain(hcert, hcerts);
    //create pkcs12
    TrustedHandle<Pkcs12> pkcs12 = new Pkcs12();
    pkcs12 = pkcs12->create(hcert, hkey, ca, pPwd, (char *)hcert->getIssuerName()->c_str());
    
    TrustedHandle<Bio> out = new Bio(BIO_TYPE_FILE, pFilename, "wb");
    pkcs12->write(out);
    out->flush();
    
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

//импорт pkcs12 (формат p7b не поддерживает)
RCT_EXPORT_METHOD(importPFX: (NSString *)filename: (NSString *)passwordForPFX: (NSString *)passwordForKey: (RCTResponseSenderBlock)callback){
  char *pFilename = (char *) [filename UTF8String];
  char *pPwdPFX = (char *) [passwordForPFX UTF8String];
  char *pPwdKey = (char *) [passwordForKey UTF8String];
  try{
    OpenSSL::run();
    p12 = new Pkcs12();
    TrustedHandle<Bio> in = NULL;
    in = new Bio(BIO_TYPE_FILE, pFilename, "rb");
    p12->read(in);
    
    //save cert in store
    TrustedHandle<Certificate> cert = p12->getCertificate("12345678");
    TrustedHandle<std::string> folder = new std::string(g_pathToStore);
    g_storeCrypto->addPkiObject(g_prov, new std::string("MY"), cert);
    
    //save key in store
    TrustedHandle<Key> key = p12->getKey(pPwdPFX);
    g_storeCrypto->addPkiObject(g_prov, key, new std::string(pPwdKey));
    
    //save TRUST certs in store
    TrustedHandle<CertificateCollection> certs = p12->getCACertificates(pPwdPFX);
    for (int i = 0; i < certs->length(); i++){
      TrustedHandle<Certificate> cert_i = certs->items(i);
      g_storeCrypto->addPkiObject(g_prov, new std::string("TRUST"), cert);
    }
    
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

@end
