#include "Wrap_Main.h"

@implementation Wrap_Main

RCT_EXPORT_MODULE();

/**
 * инициализация первоначальных настроек
 */
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

/**
 * возвращает список сертификатов загруженных в память
 * @return NSMutableArray * - при успешном завершении, иначе throw
 */
RCT_EXPORT_METHOD(getCertificates: (RCTResponseSenderBlock)callback) {
  try {
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
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

/**
 * получить количество сертификатов загруженных в память
 * @return NSMutableArray * - при успешном завершении, иначе throw
 */
RCT_EXPORT_METHOD(getCountsOfCertsInCryptoStore: (RCTResponseSenderBlock)callback) {
  callback(@[[NSNumber numberWithInt: listCerts.count]]);
}

/**
 * получить список провайдеров
 * @return NSMutableArray * - при успешном завершении, иначе throw
 */
RCT_EXPORT_METHOD(getProviders: (RCTResponseSenderBlock)callback) {
  try {
    std::vector<ProviderProps> prov = [csp_Store enumProvider];
    
    NSMutableArray *arrayProviders = [NSMutableArray array];
    for (int i = 0; i < prov.size(); i++) {
      NSMutableDictionary *provider = [NSMutableDictionary dictionary];
      
      provider[@"type"] = @(prov[i].type);
      provider[@"name"] = @(prov[i].name->c_str());
      
      [arrayProviders addObject: provider];
    }
    
    callback(@[[NSNull null], [arrayProviders copy]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

/**
 * получить список контейнеров
 * @param nsType - тип провайдера
 * @param nsName - имя провайдера
 * @return NSMutableArray * - при успешном завершении, иначе throw
 */
RCT_EXPORT_METHOD(getContainers: (NSInteger)nsType: (NSString *)nsName: (RCTResponseSenderBlock)callback) {
  try {
    int type = (int)nsType;
    char *name = (char *) [nsName UTF8String];
    
    TrustedHandle<std::string> hName = new std::string(name);
    
    std::vector<TrustedHandle<ContainerName>> providerContainers = [csp_Store enumContainers:type :hName];
    
    NSMutableArray *arrayContainers = [NSMutableArray array];
    for (int i = 0; i < providerContainers.size(); i++) {
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
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

/**
 * получение информации о сертификате из контейнера
 * @param contName - имя контейнера
 * @return NSMutableArray * - при успешном завершении, иначе throw
 */
RCT_EXPORT_METHOD(getCertInfoFromContainer: (NSString *)nsContName: (RCTResponseSenderBlock)callback) {
  try {
    NSMutableArray *listCertsCrypto = [NSMutableArray array];
    char *contName = (char *) [nsContName UTF8String];
    
    TrustedHandle<std::string> hContName = new std::string(contName);
    listCertsCrypto = [csp_Store getInfoAboutCertFromContainer:hContName];
    
    callback(@[[NSNull null], [listCertsCrypto copy]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

/**
 * установка сертификата ИЗ контейнера
 * @param contName - имя контейнера
 * @return true - при успешном завершении, иначе throw
 */
RCT_EXPORT_METHOD(installCertFromContainer: (NSString *)nsContName: (RCTResponseSenderBlock)callback) {
  try {
    char *contName = (char *) [nsContName UTF8String];
    
    TrustedHandle<std::string> hContName = new std::string(contName);
    [csp_Store installCertificateFromContainer:hContName];
    
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

/**
 * установка сертификата В контейнер
 * @param serialNumber - серийный номер сертификата
 * @param category - указывает хранилище сертификата
 * @param contName - имя контейнера
 * @return true - при успешном завершении, иначе throw
 */
RCT_EXPORT_METHOD(installCertToCont: (NSString *)serialNumber: (NSString *)category: (NSString *)nsContName: (RCTResponseSenderBlock)callback) {
  try {
    char *pSerialNumber = (char *) [serialNumber UTF8String];
    char *pCategory = (char *) [category UTF8String];
    char *contName = (char *) [nsContName UTF8String];
    
    TrustedHandle<std::string> hContName = new std::string(contName);
    
    [csp_Store installCertificateToContainer:pSerialNumber :pCategory :hContName];
    
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

/**
 * загрузка в iCloud входного файла
 * @param nsUrl - путь до локального файла
 * @return true - если загрузка прошла успешно, иначе throw
 */
RCT_EXPORT_METHOD(loadToICloud: (NSString *)nsUrl: (RCTResponseSenderBlock)callback) {
  try {
    NSURL *src = [NSURL fileURLWithPath:nsUrl];
    NSFileManager *filemgr = [[NSFileManager alloc] init];
    NSError *error;
    NSURL *ubiq = [filemgr URLForUbiquityContainerIdentifier:@"iCloud.com.digt.CryptoARMGOST"];
    NSURL *ubiquitousPackage = [ubiq URLByAppendingPathComponent:@"Documents" isDirectory:YES];
    if ([filemgr fileExistsAtPath:[ubiquitousPackage path]] == NO)
      [filemgr createDirectoryAtURL:ubiquitousPackage withIntermediateDirectories:YES attributes:nil error:nil];
    NSURL *cloudURL = [ubiquitousPackage URLByAppendingPathComponent: [src lastPathComponent]];
    
    BOOL success = [filemgr setUbiquitous:YES itemAtURL:src destinationURL:cloudURL error:&error];
    callback(@[[NSNull null], [NSNumber numberWithInt: success]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}


@end
