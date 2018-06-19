#include "Wrap_CertRequest.h"

@implementation Wrap_CertRequest

RCT_EXPORT_MODULE();

/**
 * создание самоподписанного сертификата (CryptoPro)
 * @param nsAlgorithm - адрес сервера
 * @param nsContName - имя контейнера
 * @param nsKeyUsage - тип закрытого ключа
 * @param nsArrayextKeyUsage - использование ключа
 * @param exportableKey - экспортируемый ли ключ
 * @param nsSubjectName - имя пользователя, кому выдается сертификат
 * @param nsEmail - email
 * @param nsOrganization - название организации
 * @param nsLocality - название города
 * @param nsProvince - название региона
 * @param nsCountry - страна
 * @param nsPathCer - путь к файлу для сохранения сертификата
 * @return true - при успешном завершении, иначе исключение throw.
 */
RCT_EXPORT_METHOD(genSelfSignedCertWithoutRequest: (NSString *)nsAlgorithm: (NSString *)nsContName: (NSInteger)nsKeyUsage:  (NSArray *)nsArrayextKeyUsage: (BOOL)exportableKey: (NSString *)nsSubjectName: (NSString *)nsEmail: (NSString *)nsOrganization: (NSString *)nsLocality: (NSString *)nsProvince: (NSString *)nsCountry: (NSString *)nsPathCer: (RCTResponseSenderBlock)callback) {
  try {
    char *pathCer = (char *) [nsPathCer UTF8String];
    
    char *algorithm = (char *) [nsAlgorithm UTF8String];
    char *contName = (char *) [nsContName UTF8String];
    int keyUsage = (int) nsKeyUsage;
    char *subject = (char *) [nsSubjectName UTF8String];
    char *email = (char *) [nsEmail UTF8String];
    char *organization = (char *) [nsOrganization UTF8String];
    char *locality = (char *) [nsLocality UTF8String];
    char *province = (char *) [nsProvince UTF8String];
    char *country = (char *) [nsCountry UTF8String];
    bool b = false;
#ifdef ProvCryptoPro
    extKeyUsageStructure extKey1 = *new extKeyUsageStructure();
    extKey1.server = [[nsArrayextKeyUsage objectAtIndex:0] boolValue];
    extKey1.client = [[nsArrayextKeyUsage objectAtIndex:1] boolValue];
    extKey1.code = [[nsArrayextKeyUsage objectAtIndex:2] boolValue];
    extKey1.email = [[nsArrayextKeyUsage objectAtIndex:3] boolValue];
    b = [csp_CertRequest createSelfSignedCertificateCSP :algorithm :contName :keyUsage :extKey1 :exportableKey :subject :email :organization :locality :province :country :pathCer];
#endif
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

/**
 * создание запроса на сертификат (CryptoPro)
 * @param nsAlgorithm - адрес сервера
 * @param nsContainerName - имя контейнера
 * @param nsKeyUsage - тип закрытого ключа
 * @param nsArrayextKeyUsage - использование ключа
 * @param exportableKey - экспортируемый ли ключ
 * @param nsSubjectName - имя пользователя, кому выдается сертификат
 * @param nsEmail - email
 * @param nsOrganization - название организации
 * @param nsLocality - название города
 * @param nsProvince - название региона
 * @param nsCountry - страна
 * @param nsPathCsr - путь к файлу для сохранения запроса
 * @return true - при успешном завершении, иначе исключение throw.
 */
RCT_EXPORT_METHOD(getRequest: (NSString *)nsAlgorithm: (NSString *)nsContainerName: (NSInteger)nsKeyUsage: (NSArray *)nsArrayextKeyUsage: (BOOL)exportableKey: (NSString *)nsSubjectName: (NSString *)nsEmail: (NSString *)nsOrganization: (NSString *)nsLocality: (NSString *)nsProvince: (NSString *)nsCountry: (NSString *)nsPathCsr: (RCTResponseSenderBlock)callback) {
  try {
    char *algorithm = (char *) [nsAlgorithm UTF8String];
    char *containerName = (char *) [nsContainerName UTF8String];
    int key = (int)nsKeyUsage;
    char *subject = (char *) [nsSubjectName UTF8String];
    char *email = (char *) [nsEmail UTF8String];
    char *organization = (char *) [nsOrganization UTF8String];
    char *locality = (char *) [nsLocality UTF8String];
    char *province = (char *) [nsProvince UTF8String];
    char *country = (char *) [nsCountry UTF8String];
    
    char *pathCsr = (char *) [nsPathCsr UTF8String];
    
    bool b = false;
    
#ifdef ProvCryptoPro
    extKeyUsageStructure extKey1 = *new extKeyUsageStructure();
    extKey1.server = [[nsArrayextKeyUsage objectAtIndex:0] boolValue];
    extKey1.client = [[nsArrayextKeyUsage objectAtIndex:1] boolValue];
    extKey1.code = [[nsArrayextKeyUsage objectAtIndex:2] boolValue];
    extKey1.email = [[nsArrayextKeyUsage objectAtIndex:3] boolValue];
    b = [csp_CertRequest createRequestCSP:algorithm :containerName :key :extKey1 :exportableKey :subject :email :organization :locality :province :country :pathCsr];
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

/**
 * получение информации о запросе на сертификат при создании по шаблону (CryptoPro)
 * @param nsPathCsr - путь к файлу запроса
 * @param nsFormat - формат сохраненных данных
 * @return структура templateInfo - при успешном завершении, иначе исключение throw.
 */
RCT_EXPORT_METHOD(getRequestInfo: (NSString *)nsPathCsr: (NSString *)nsFormat: (RCTResponseSenderBlock)callback) {
  try {
    char *pathCsr = (char *) [nsPathCsr UTF8String];
    char *format = (char *) [nsFormat UTF8String];
    
    templateInfo requestTemplateInfo;
    NSMutableDictionary *arrayPropertyCert = [NSMutableDictionary dictionary];
    
#ifdef ProvCryptoPro
    requestTemplateInfo = [csp_CertRequest getRequestInfo:pathCsr :format ];
    
    arrayPropertyCert[@"subjectName"] = @(requestTemplateInfo.subjectName->c_str());
    arrayPropertyCert[@"pubKey"] = @(requestTemplateInfo.pubKey->c_str());
    arrayPropertyCert[@"extKeyUsage_server"] = (requestTemplateInfo.extKeyUsage->server) ? @(1) : @(0);
    arrayPropertyCert[@"extKeyUsage_client"] = (requestTemplateInfo.extKeyUsage->client) ? @(1) : @(0);
    arrayPropertyCert[@"extKeyUsage_code"] = (requestTemplateInfo.extKeyUsage->code) ? @(1) : @(0);
    arrayPropertyCert[@"extKeyUsage_email"] = (requestTemplateInfo.extKeyUsage->email) ? @(1) : @(0);
    arrayPropertyCert[@"keyUsage"] = @(requestTemplateInfo.keyUsage);
#endif
    
    callback(@[[NSNull null], [arrayPropertyCert copy]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

/**
 * получение информации о сертификате при создании по шаблону (CryptoPro)
 * @param serialNumber - серийный номер сертификата
 * @param category - указывает хранилище сертификата
 * @return структура templateInfo - при успешном завершении, иначе исключение throw.
 */
RCT_EXPORT_METHOD(getCertificateInfo: (NSString *)serialNumber: (NSString *)category: (RCTResponseSenderBlock)callback) {
  try {
    char *pSerialNumber = (char *) [serialNumber UTF8String];
    char *pCategory = (char *) [category UTF8String];
    
    templateInfo certTemplateInfo;
    NSMutableDictionary *arrayPropertyCert = [NSMutableDictionary dictionary];
    
#ifdef ProvCryptoPro
    certTemplateInfo = [csp_CertRequest getCertificateInfo:pSerialNumber :pCategory ];
    arrayPropertyCert[@"subjectName"] = @(certTemplateInfo.subjectName->c_str());
    arrayPropertyCert[@"pubKey"] = @(certTemplateInfo.pubKey->c_str());
    arrayPropertyCert[@"extKeyUsage_server"] = (certTemplateInfo.extKeyUsage->server) ? @(1) : @(0);
    arrayPropertyCert[@"extKeyUsage_client"] = (certTemplateInfo.extKeyUsage->client) ? @(1) : @(0);
    arrayPropertyCert[@"extKeyUsage_code"] = (certTemplateInfo.extKeyUsage->code) ? @(1) : @(0);
    arrayPropertyCert[@"extKeyUsage_email"] = (certTemplateInfo.extKeyUsage->email) ? @(1) : @(0);
    arrayPropertyCert[@"keyUsage"] = @(certTemplateInfo.keyUsage);
#endif
    
    callback(@[[NSNull null], [arrayPropertyCert copy]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

/**
 * получение информации о запросе на сертификат при создании по шаблону (OpenSSL)
 * @param nsPathCsr - путь к файлу запроса
 * @param nsFormat - формат сохраненных данных
 * @return структура templateInfo - при успешном завершении, иначе исключение throw.
 */
RCT_EXPORT_METHOD(getRequestInfo_SSL: (NSString *)path: (NSString *)format: (RCTResponseSenderBlock)callback) {
  try {
    char *pPath = (char *) [path UTF8String];
    char *pformat = (char *) [format UTF8String];
    
    sslTemplateInfo reqTemplateInfo;
    NSMutableDictionary *arrayPropertyCert = [NSMutableDictionary dictionary];
    
    reqTemplateInfo = [ossl_CertRequest getRequestinfo:pPath :pformat ];
    arrayPropertyCert[@"subjectName"] = @(reqTemplateInfo.subjectName->c_str());
    arrayPropertyCert[@"pubKey"] = @(reqTemplateInfo.pubKey->c_str());
    arrayPropertyCert[@"extKeyUsage_server"] = (reqTemplateInfo.extKeyUsage->server) ? @(1) : @(0);
    arrayPropertyCert[@"extKeyUsage_client"] = (reqTemplateInfo.extKeyUsage->client) ? @(1) : @(0);
    arrayPropertyCert[@"extKeyUsage_code"] = (reqTemplateInfo.extKeyUsage->code) ? @(1) : @(0);
    arrayPropertyCert[@"extKeyUsage_email"] = (reqTemplateInfo.extKeyUsage->email) ? @(1) : @(0);
    arrayPropertyCert[@"keyUsage_digitalSignature"] = (reqTemplateInfo.keyUsage->digitalSignature) ? @(1) : @(0);
    arrayPropertyCert[@"keyUsage_nonRepudiation"] = (reqTemplateInfo.keyUsage->nonRepudiation) ? @(1) : @(0);
    arrayPropertyCert[@"keyUsage_keyEncipherment"] = (reqTemplateInfo.keyUsage->keyEncipherment) ? @(1) : @(0);
    arrayPropertyCert[@"keyUsage_dataEncipherment"] = (reqTemplateInfo.keyUsage->dataEncipherment) ? @(1) : @(0);
    arrayPropertyCert[@"keyUsage_keyAgreement"] = (reqTemplateInfo.keyUsage->keyAgreement) ? @(1) : @(0);
    arrayPropertyCert[@"keyUsage_keyCertSign"] = (reqTemplateInfo.keyUsage->keyCertSign) ? @(1) : @(0);
    arrayPropertyCert[@"keyUsage_cRLSign"] = (reqTemplateInfo.keyUsage->cRLSign) ? @(1) : @(0);
    arrayPropertyCert[@"keyUsage_encipherOnly"] = (reqTemplateInfo.keyUsage->encipherOnly) ? @(1) : @(0);
    arrayPropertyCert[@"keyUsage_decipherOnly"] = (reqTemplateInfo.keyUsage->decipherOnly) ? @(1) : @(0);
    
    callback(@[[NSNull null], [arrayPropertyCert copy]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

/**
 * получение информации о сертификате при создании по шаблону (OpenSSL)
 * @param serialNumber - серийный номер сертификата
 * @param category - указывает хранилище сертификата
 * @return структура templateInfo - при успешном завершении, иначе исключение throw.
 */
RCT_EXPORT_METHOD(getCertificateInfo_SSL: (NSString *)serialNumber: (NSString *)category: (RCTResponseSenderBlock)callback) {
  try {
    char *pSerialNumber = (char *) [serialNumber UTF8String];
    char *pCategory = (char *) [category UTF8String];
    
    sslTemplateInfo certTemplateInfo;
    NSMutableDictionary *arrayPropertyCert = [NSMutableDictionary dictionary];
    
    certTemplateInfo = [ossl_CertRequest getCertificateinfoForTemplate:pSerialNumber :pCategory ];
    arrayPropertyCert[@"subjectName"] = @(certTemplateInfo.subjectName->c_str());
    arrayPropertyCert[@"pubKey"] = @(certTemplateInfo.pubKey->c_str());
    arrayPropertyCert[@"extKeyUsage_server"] = (certTemplateInfo.extKeyUsage->server) ? @(1) : @(0);
    arrayPropertyCert[@"extKeyUsage_client"] = (certTemplateInfo.extKeyUsage->client) ? @(1) : @(0);
    arrayPropertyCert[@"extKeyUsage_code"] = (certTemplateInfo.extKeyUsage->code) ? @(1) : @(0);
    arrayPropertyCert[@"extKeyUsage_email"] = (certTemplateInfo.extKeyUsage->email) ? @(1) : @(0);
    arrayPropertyCert[@"keyUsage_digitalSignature"] = (certTemplateInfo.keyUsage->digitalSignature) ? @(1) : @(0);
    arrayPropertyCert[@"keyUsage_nonRepudiation"] = (certTemplateInfo.keyUsage->nonRepudiation) ? @(1) : @(0);
    arrayPropertyCert[@"keyUsage_keyEncipherment"] = (certTemplateInfo.keyUsage->keyEncipherment) ? @(1) : @(0);
    arrayPropertyCert[@"keyUsage_dataEncipherment"] = (certTemplateInfo.keyUsage->dataEncipherment) ? @(1) : @(0);
    arrayPropertyCert[@"keyUsage_keyAgreement"] = (certTemplateInfo.keyUsage->keyAgreement) ? @(1) : @(0);
    arrayPropertyCert[@"keyUsage_keyCertSign"] = (certTemplateInfo.keyUsage->keyCertSign) ? @(1) : @(0);
    arrayPropertyCert[@"keyUsage_cRLSign"] = (certTemplateInfo.keyUsage->cRLSign) ? @(1) : @(0);
    arrayPropertyCert[@"keyUsage_encipherOnly"] = (certTemplateInfo.keyUsage->encipherOnly) ? @(1) : @(0);
    arrayPropertyCert[@"keyUsage_decipherOnly"] = (certTemplateInfo.keyUsage->decipherOnly) ? @(1) : @(0);
    
    callback(@[[NSNull null], [arrayPropertyCert copy]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}
/*
RCT_EXPORT_METHOD(genRequestOnCert: (NSString *)nsAlgorithm: (NSString *)nsUrl: (NSString *)nsContName: (NSString *)nsTemplate: (NSInteger)nsLength: (NSInteger)nsKeyUsage: (NSArray *)nsArrayextKeyUsage: (BOOL)exportableKey: (NSString *)nsSubjectName: (NSString *)nsEmail: (NSString *)nsOrganization: (NSString *)nsLocality: (NSString *)nsProvince: (NSString *)nsCountry: (NSString *)nsPathCsr: (NSString *)nsPathKey: (RCTResponseSenderBlock)callback) {
  try {
    char *algorithm = (char *) [nsAlgorithm UTF8String];
    int length = (int)nsLength;
    int key = (int)nsKeyUsage;
    char *subject = (char *) [nsSubjectName UTF8String];
    char *email = (char *) [nsEmail UTF8String];
    char *organization = (char *) [nsOrganization UTF8String];
    char *locality = (char *) [nsLocality UTF8String];
    char *province = (char *) [nsProvince UTF8String];
    char *country = (char *) [nsCountry UTF8String];
    char *pathCsr = (char *) [nsPathCsr UTF8String];
    char *pathKey = (char *) [nsPathKey UTF8String];
#ifdef ProvOpenSSL
    if (std::string(algorithm) == "RSA") {
      extKeyUsageStruct extKey = *new extKeyUsageStruct();
      extKey.server = [[nsArrayextKeyUsage objectAtIndex:0] boolValue];
      extKey.client = [[nsArrayextKeyUsage objectAtIndex:1] boolValue];
      extKey.code = [[nsArrayextKeyUsage objectAtIndex:2] boolValue];
      extKey.email = [[nsArrayextKeyUsage objectAtIndex:3] boolValue];
      [ossl_CertRequest createRequest:algorithm :length :key :extKey :exportableKey :subject :email :organization :locality :province :country :pathCsr :pathKey];
    }
#endif
#ifdef ProvCryptoPro
    char *templateReq = (char *) [nsTemplate UTF8String];
    int provType;
    if (std::string(algorithm) == publicKeyAlgorithm_GOST_R_3410_2001) {
      provType = PROV_GOST_2001_DH;
    }
    else if (std::string(algorithm) == publicKeyAlgorithm_GOST_R_3410_2012_256) {
      provType = PROV_GOST_2012_256;
    }
    else if (std::string(algorithm) == publicKeyAlgorithm_GOST_R_3410_2012_512) {
      provType = PROV_GOST_2012_512;
    }
    char *url = (char *) [nsUrl UTF8String];
    char *contName = (char *) [nsContName UTF8String];
    //[csp_CertRequest create:url :templateReq :contName :key :provType :exportableKey :pathCsr];
#endif
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(genSelfSignedCert: (NSString *)nsUrl: (NSString *)nsPathCsr: (NSString *)nsPathCer: (NSString *)nsPathKey: (RCTResponseSenderBlock)callback) {
  try {
    char *pathCsr = (char *) [nsPathCsr UTF8String];
    char *pathCer = (char *) [nsPathCer UTF8String];
    char *pathKey = (char *) [nsPathKey UTF8String];
    
#ifdef ProvOpenSSL
    if (std::string(pathKey) != "") {
      [ossl_CertRequest createCertFromRequest:pathCsr :pathCer :pathKey];
    }
#endif
#ifdef ProvCryptoPro
    if (std::string(pathKey) == "") {
      char *url = (char *) [nsUrl UTF8String];
      //[csp_CertRequest getCertFromRequest:url :pathCsr :pathCer];
    }
#endif
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

//регистрация пользователя
RCT_EXPORT_METHOD(userRegistration: (NSString *)nsUrl: (NSString *)nsSubjectName: (NSString *)nsEmail: (NSString *)nsOrganization: (NSString *)nsLocality: (NSString *)nsProvince: (NSString *)nsCountry: (RCTResponseSenderBlock)callback) {
  try {
    char *url = (char *) [nsUrl UTF8String];
    char *subject = (char *) [nsSubjectName UTF8String];
    char *email = (char *) [nsEmail UTF8String];
    char *organization = (char *) [nsOrganization UTF8String];
    char *locality = (char *) [nsLocality UTF8String];
    char *province = (char *) [nsProvince UTF8String];
    char *country = (char *) [nsCountry UTF8String];
    NSMutableDictionary *arrayPropertyCert = [NSMutableDictionary dictionary];
    
   // [csp_Store readRequest_ConvertToBSTR_writeFile];

#ifdef ProvCryptoPro
    //CPCA15UserInfo* userInfo15 = [csp_CertRequest registration:url :subject :organization :locality :province :email :country];
   // arrayPropertyCert[@"tokenID"] = @(userInfo15->TokenID.c_str());
    //arrayPropertyCert[@"password"] = @(userInfo15->sbPassword->ptr());
#endif
    
    callback(@[[NSNull null], [arrayPropertyCert copy]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

//аудентификация пользователя
RCT_EXPORT_METHOD(userAuthentication: (NSString *)nsTokenID: (NSString *)nsPassword: (RCTResponseSenderBlock)callback) {
  try {
    char *tokenID = (char *) [nsTokenID UTF8String];
    char *password = (char *) [nsPassword UTF8String];
    bool b = false;
    
#ifdef ProvCryptoPro
    //b = [csp_CertRequest authentication:tokenID :password];
#endif
    
    if (b) {
      callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
    }
    else {
      callback(@[[NSNull null], [NSNumber numberWithInt: 0]]);
    }
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

//получить список шаблонов для запроса
RCT_EXPORT_METHOD(getListTemplatesForRequest: (NSString *)nsUrl: (RCTResponseSenderBlock)callback) {
  try {
    char *url = (char *) [nsUrl UTF8String];
    std::vector<std::wstring> temp;
    NSMutableArray *myArray = [NSMutableArray array];
    
#ifdef ProvCryptoPro
    //temp = [csp_CertRequest get_templates:url];
#endif
    
    for (int i = 0; i < temp.size(); i++) {
      std::wstring str1 = std::wstring(temp[i].c_str());
      NSString * sObjC = [[NSString alloc] initWithBytes:str1.data() length:str1.size() * sizeof(wchar_t) encoding:NSUTF32LittleEndianStringEncoding];
      [myArray addObject:sObjC];
    }
    
    callback(@[[NSNull null], [myArray copy]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

//генерация запроса и сохранение его в файл, ключ записывается в хранилище криптопро
RCT_EXPORT_METHOD(createRequest: (NSString *)nsUrl: (NSString *)nsTemplate: (NSString *)nsContainerName: (NSInteger)nsKeyUsage: (NSString *)nsAlgorithm: (BOOL)exportableKey: (NSString *)nsPathCsr: (RCTResponseSenderBlock)callback) {
  try {
    char *url = (char *) [nsUrl UTF8String];
    char *templateReq = (char *) [nsTemplate UTF8String];
    char *containerName = (char *) [nsContainerName UTF8String];
    int key = (int)nsKeyUsage;
    char *algorithm = (char *) [nsAlgorithm UTF8String];
    char *pathCsr = (char *) [nsPathCsr UTF8String];
    int provType;
    bool b = false;
    
    if (std::string(algorithm) == publicKeyAlgorithm_GOST_R_3410_2001) {
      provType = PROV_GOST_2001_DH;
    }
    else if (std::string(algorithm) == publicKeyAlgorithm_GOST_R_3410_2012_256) {
      provType = PROV_GOST_2012_256;
    }
    else if (std::string(algorithm) == publicKeyAlgorithm_GOST_R_3410_2012_512) {
      provType = PROV_GOST_2012_512;
    }
    else {
      THROW_EXCEPTION(0, Wrap_CertRequest, NULL, "Incorrect provider type.");
    }
    
#ifdef ProvCryptoPro
    //b = [csp_CertRequest create:url :templateReq :containerName :key :provType :exportableKey :pathCsr];
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

//получить сертификат с УЦ и сохранить его в файл
RCT_EXPORT_METHOD(getCertOnRequestFromTheServer: (NSString *)nsUrl: (NSString *)nsPathCsr: (NSString *)nsPathCer: (RCTResponseSenderBlock)callback) {
  try {
    char *url = (char *) [nsUrl UTF8String];
    char *pathCsr = (char *) [nsPathCsr UTF8String];
    char *pathCer = (char *) [nsPathCer UTF8String];
    bool b = false;
    
#ifdef ProvCryptoPro
    //b = [csp_CertRequest getCertFromRequest:url :pathCsr :pathCer];
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

//получить корневой сертификат УЦ
RCT_EXPORT_METHOD(getCACert: (NSString *)nsUrl: (RCTResponseSenderBlock)callback) {
  try {
    char *url = (char *) [nsUrl UTF8String];
    bool b = false;
    
#ifdef ProvCryptoPro
    //b = [csp_CertRequest getCACert:url];
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}*/

@end

