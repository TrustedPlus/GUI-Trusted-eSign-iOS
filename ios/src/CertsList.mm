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

@end
