#include "CertsList.h"
#include "globalHelper.h"

@implementation CertsList

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(showCerts: (RCTResponseSenderBlock)callback){
  NSMutableArray *listCertsCryptoPro = [NSMutableArray array];
  PCsp *csp = [[PCsp alloc] init];
  listCertsCryptoPro = csp.showCerts; //заполнение списка сертификатов из контейнеров CryptoPro
  countCSPCerts = (int)listCertsCryptoPro.count;
  
  NSMutableArray *listCertsCrypto = [NSMutableArray array];
  WCertsList *wCertsList = [[WCertsList alloc] init];
  listCertsCrypto = [wCertsList loadStore];//заполнение списка сертификатов из контейнеров crypto модуля
  countCryptoCerts = (int) listCertsCrypto.count;
  
  /* объединение 2-х NSArray */
  listCerts = [NSMutableArray arrayWithArray:listCertsCrypto];
  [listCerts addObjectsFromArray: listCertsCryptoPro];
  
  callback(@[[NSNull null], [listCerts copy]]);
}

@end
