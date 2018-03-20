#include "CertsList.h"
#include "globalHelper.h"

@implementation CertsList

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(showCerts: (RCTResponseSenderBlock)callback){
  NSMutableArray *listCertsCryptoPro = [NSMutableArray array];
  PCsp *csp = [[PCsp alloc] init];
  listCertsCryptoPro = csp.UnloadCertsFromStore; //заполнение списка сертификатов из контейнеров CryptoPro
  countCSPCerts = (int)listCertsCryptoPro.count;
  
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

RCT_EXPORT_METHOD(pathToStore: (NSString *)path: (RCTResponseSenderBlock)callback){
  char *pPath = (char *) [path UTF8String];
  g_pathToStore = pPath;
  
  callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
}

RCT_EXPORT_METHOD(getCountsOfCertsInCryptoStore: (RCTResponseSenderBlock)callback){
  callback(@[[NSNumber numberWithInt: countCryptoCerts]]);
}

RCT_EXPORT_METHOD(getCountsOfCertsInCryptoCSPStore: (RCTResponseSenderBlock)callback){
  callback(@[[NSNumber numberWithInt: countCSPCerts]]);
}

@end
