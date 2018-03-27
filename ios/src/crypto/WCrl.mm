#include "WCrl.h"

@implementation WCrl

RCT_EXPORT_MODULE()
//сохранение CRL в хранилище из файла
RCT_EXPORT_METHOD(saveCRLToStore: (NSString *)filename: (NSString *)inFormat: (RCTResponseSenderBlock)callback){
  char *pFilename = (char *)  [filename UTF8String];
  try{
    crl = new CRL();
    TrustedHandle<Bio> in = new Bio(BIO_TYPE_FILE, pFilename, "rb");
    DataFormat::DATA_FORMAT format = NSStringToDataFormat(inFormat);
    crl->read(in, format);
    g_storeCrypto->addPkiObject(g_prov, new std::string("CRL"), crl);
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(save: (NSString *)filename: (NSString *)inFormat: (RCTResponseSenderBlock)callback){
  char *pFilename = (char *)  [filename UTF8String];
  try{
    crl = new CRL();
    TrustedHandle<Bio> out = new Bio(BIO_TYPE_FILE, pFilename, "wb");
    DataFormat::DATA_FORMAT format = NSStringToDataFormat(inFormat);
    crl->write(out, format);
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(verifyChain: (NSString *)serialNumber: (RCTResponseSenderBlock)callback){
  try{
    char *pSerialNumber = (char *) [serialNumber UTF8String];
    //read cert file
    TrustedHandle<Filter> filterByCert = new Filter();
    
    filterByCert->setSerial(new std::string(pSerialNumber));
    
    TrustedHandle<PkiItemCollection> pic = g_storeCrypto->find(filterByCert);
    if (pic->length() <= 0){
      THROW_EXCEPTION(0, WCrl, NULL, "This certificate was not found in the 'crypto' store!");
    }
    
    TrustedHandle<PkiItem> pi = new PkiItem();
    pi = pic->items(0);
    
    TrustedHandle<Certificate> cert = g_storeCrypto->getItemCert(pi);
    
    TrustedHandle<Chain> chain = new Chain();

    //find all TRUST certs
    TrustedHandle<Filter> filterByTrustCerts = new Filter();
    filterByTrustCerts->setCategory(new std::string("TRUST"));
    TrustedHandle<PkiItemCollection> picTrustCerts = g_storeCrypto->find(filterByTrustCerts);
    if (picTrustCerts->length() <= 0){
      THROW_EXCEPTION(0, WCrl, NULL, "This certificate was not found in the 'crypto' store!");
    }
    TrustedHandle<CertificateCollection> hcerts = new CertificateCollection();
    for (int i = 0; i < picTrustCerts->length(); i++){
      hcerts->push(g_storeCrypto->getItemCert(picTrustCerts->items(i)));
    }
    
    TrustedHandle<CertificateCollection> ca = chain->buildChain(cert, hcerts);
    for (int i = 0; i < ca->length(); i++){
      TrustedHandle<Certificate> cert_123 = ca->items(i);
      TrustedHandle<std::string> issuername = cert_123->getIssuerName();
      TrustedHandle<std::string> subjectname = cert_123->getSubjectName();
    }
    
    TrustedHandle<CrlCollection> crt_123 = new CrlCollection();
    bool b = chain->verifyChain(ca, crt_123);//getCrls());
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

TrustedHandle<CrlCollection> getCrls(){
  try{
    TrustedHandle<CrlCollection> crls = new CrlCollection();
    
    TrustedHandle<Filter> filterForCrl = new Filter();
    filterForCrl->setCategory(new std::string("CRL"));
    TrustedHandle<PkiItemCollection> pic = g_storeCrypto->find(filterForCrl);

    for(int i = 0; i < pic->length(); i++){
      crls->push(g_storeCrypto->getItemCrl(pic->items(i)));
    }
    
    return crls;
  }
  catch (TrustedHandle<Exception> e){
    throw e;
  }
}

@end
