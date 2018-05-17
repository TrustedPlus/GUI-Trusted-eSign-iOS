#include "Wrap_Main.h"

@implementation Wrap_Main

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(init: (NSString *)path: (RCTResponseSenderBlock)callback) {
  try{
#ifdef ProvOpenSSL
      char *pPath = (char *) [path UTF8String];
      [ossl_Main init:pPath];
#endif
#ifdef ProvCryptoPro
      [csp_Main initialization];
#endif
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

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
    listCertsCSP = [csp_Store unloadCertsFromStore];
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

RCT_EXPORT_METHOD(getProviders: (RCTResponseSenderBlock)callback){
  try{
    std::vector<ProviderProps> prov = [csp_Store enumProvider];
    
    NSMutableArray *arrayProviders = [NSMutableArray array];
    for (int i = 0; i < prov.size(); i++){
      NSMutableDictionary *provider = [NSMutableDictionary dictionary];
      
      provider[@"type"] = @(prov[i].type);
      provider[@"name"] = @(prov[i].name->c_str());
      
      [arrayProviders addObject: provider];
    }
    
    callback(@[[NSNull null], [arrayProviders copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getContainers: (NSInteger)nsType: (NSString *)nsName: (RCTResponseSenderBlock)callback){
  try{
    int type = (int)nsType;
    char *name = (char *) [nsName UTF8String];
    
    TrustedHandle<std::string> hName = new std::string(name);
    
    std::vector<TrustedHandle<ContainerName>> providerContainers = [csp_Store enumContainers:type :hName];
    
    NSMutableArray *arrayContainers = [NSMutableArray array];
    for (int i = 0; i < providerContainers.size(); i++){
      NSMutableDictionary *container = [NSMutableDictionary dictionary];
      
      std::wstring wstrContainer = providerContainers[i]->container->c_str();
      std::string strContainer( wstrContainer.begin(), wstrContainer.end() );
      
      std::wstring wstrFqcnW = providerContainers[i]->fqcnW->c_str();
      std::string strFqcnW( wstrFqcnW.begin(), wstrFqcnW.end() );
      
      container[@"container"] = @(strContainer.c_str());
      container[@"fqcnA"] = @(providerContainers[i]->fqcnA->c_str());
      container[@"fqcnW"] = @(strFqcnW.c_str());
      container[@"unique"] = @(providerContainers[i]->unique->c_str());
      
      [arrayContainers addObject: container];
    }
    
    callback(@[[NSNull null], [arrayContainers copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(deleteContainer: (NSString *)nsContName: (NSInteger)nsType: (NSString *)nsName: (RCTResponseSenderBlock)callback){
  try{
    char *contName = (char *) [nsContName UTF8String];
    int type = (int)nsType;
    char *name = (char *) [nsName UTF8String];
    
    TrustedHandle<std::string> hContName = new std::string(contName);
    TrustedHandle<std::string> hName = new std::string(name);
    
    [csp_Store deleteContainer:hContName :type :hName];
    
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}


@end
