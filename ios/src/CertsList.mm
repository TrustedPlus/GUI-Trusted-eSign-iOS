#include "CertsList.h"

@implementation CertsList

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(showCerts: (RCTResponseSenderBlock)callback){
  try{
    NSMutableArray *listCertsCryptoPro = [NSMutableArray array];
    PCsp *csp = [[PCsp alloc] init];
    listCertsCryptoPro = csp.UnloadCertsFromStore; //заполнение списка сертификатов из контейнеров CryptoPro
    countCSPCerts = (int)listCertsCryptoPro.count;
    
    if (g_prov.isEmpty()){
      THROW_EXCEPTION(0, CertsList, NULL, "init provider_system error!");
    }
    NSMutableArray *listCertsCrypto = [NSMutableArray array];
    WStore *wStore = [[WStore alloc] init];
    listCertsCrypto = [wStore UnloadCertsFromStore];//заполнение списка сертификатов из контейнеров crypto модуля
    countCryptoCerts = (int) listCertsCrypto.count;
    
    /* объединение 2-х NSArray */
    [listCerts removeAllObjects];
    listCerts = [NSMutableArray arrayWithArray:listCertsCrypto];
    [listCerts addObjectsFromArray: listCertsCryptoPro];
    
    callback(@[[NSNull null], [listCerts copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(providerInit: (RCTResponseSenderBlock)callback){
  try{
    if (strcmp(g_pathToStore.c_str(), "") == 0){
      THROW_EXCEPTION(0, CertsList, NULL, "init provider error! Input path to store incorrect!");
    }
    else{
      g_prov = new Provider_System(new std::string(g_pathToStore));
      g_storeCrypto = new PkiStore(new std::string(g_pathToStore));
    }
    
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(pathToStore: (NSString *)path: (RCTResponseSenderBlock)callback){
  char *pPath = (char *) [path UTF8String];
  g_pathToStore = *new std::string(pPath);
  
  callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
}

RCT_EXPORT_METHOD(getCountsOfCertsInCryptoStore: (RCTResponseSenderBlock)callback){
  callback(@[[NSNumber numberWithInt: countCryptoCerts]]);
}

RCT_EXPORT_METHOD(getCountsOfCertsInCryptoCSPStore: (RCTResponseSenderBlock)callback){
  callback(@[[NSNumber numberWithInt: countCSPCerts]]);
}

RCT_EXPORT_METHOD(isGostCert: (NSString *)pathCert:  (NSString *)format: (RCTResponseSenderBlock)callback){
  try{
    char *pPathCert = (char *) [pathCert UTF8String];
    char *pFormat = (char *) [format UTF8String];
    TrustedHandle<Certificate> cert = new Certificate();
    TrustedHandle<Bio> in = NULL;
    DataFormat::DATA_FORMAT data_format;
    if (strcmp(pFormat, "DER") == 0)
      data_format = DataFormat::DER;
    else{
      if (strcmp(pFormat, "BASE64") == 0)
        data_format = DataFormat::BASE64;
      else{
        THROW_EXCEPTION(0, CertsList, NULL, "Error input format!");
      }
    }
    in = new Bio(BIO_TYPE_FILE, pPathCert, "rb");
    cert->read(in, data_format);
    
    X509_ALGOR *sigalg = cert->internal()->sig_alg;
    TrustedHandle<OID> str_oid = (new Algorithm(sigalg))->getTypeId();
    TrustedHandle<std::string> str_2 = str_oid->toString();

    if (str_2->c_str() == NULL) {
      THROW_OPENSSL_EXCEPTION(0, CertsList, NULL, "undefined algorithm!");
    }
    if ((strcmp(str_2->c_str(), "1.2.643.7.1.1.3.3") == 0) || (strcmp(str_2->c_str(), "1.2.643.7.1.1.3.2") == 0) || (strcmp(str_2->c_str(), "1.2.643.2.2.3") == 0) || (strcmp(str_2->c_str(), "1.2.643.2.2.3") == 0)){
      callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
    }
    else{
      callback(@[[NSNull null], [NSNumber numberWithInt: 0]]);
    }
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

@end
