#include "Test.h"

@implementation Test

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getCertificates: (RCTResponseSenderBlock)callback){
  try{
    listCerts = [NSMutableArray array];
#ifdef ProvOpenSSL
    NSMutableArray *listCertsCrypto = [NSMutableArray array];
    Ossl_Store *wOSSLStore = [[Ossl_Store alloc] init];
    listCertsCrypto = [wOSSLStore unloadCertsFromStore];//заполнение списка сертификатов из контейнеров crypto модуля
    [listCerts addObjectsFromArray: listCertsCrypto];
#endif
#ifdef ProvCryptoPro
    NSMutableArray *listCertsCSP = [NSMutableArray array];
    CSP_Csp *wCSPStore =[[CSP_Csp alloc] init];
    listCertsCSP = [wCSPStore UnloadCertsFromStore];
    [listCerts addObjectsFromArray: listCertsCSP];
#endif
    callback(@[[NSNull null], [listCerts copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getCountsOfCertsInCryptoStore: (RCTResponseSenderBlock)callback){
    callback(@[[NSNumber numberWithInt: listCerts.count]]);
}

@end
