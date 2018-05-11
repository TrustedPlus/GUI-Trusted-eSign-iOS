#include "Wrap_CertRequest.h"

@implementation Wrap_CertRequest

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(genRequestOnCert: (NSString *)nsAlgorithm: (NSString *)nsUrl: (NSString *)nsContName: (NSString *)nsTemplate: (NSInteger)nsLength: (NSInteger)nsKeyUsage: (NSArray *)nsArrayextKeyUsage: (NSString *)nsSubjectName: (NSString *)nsEmail: (NSString *)nsOrganization: (NSString *)nsLocality: (NSString *)nsProvince: (NSString *)nsCountry: (NSString *)nsPathCsr: (NSString *)nsPathKey: (RCTResponseSenderBlock)callback) {
  try{
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
    if (std::string(algorithm) == "RSA"){
      extKeyUsageStruct extKey = *new extKeyUsageStruct();
      extKey.server = [[nsArrayextKeyUsage objectAtIndex:0] boolValue];
      extKey.client = [[nsArrayextKeyUsage objectAtIndex:1] boolValue];
      extKey.code = [[nsArrayextKeyUsage objectAtIndex:2] boolValue];
      extKey.email = [[nsArrayextKeyUsage objectAtIndex:3] boolValue];
      [ossl_CertRequest createRequest:algorithm :length :key :extKey :true :subject :email :organization :locality :province :country :pathCsr :pathKey];
    }
#endif
#ifdef ProvCryptoPro
    char *templateReq = (char *) [nsTemplate UTF8String];
    int provType;
    if ((std::string(algorithm) == "GOST P 34.10-2001") || (std::string(algorithm) == "GOST P 34.10-2012 256 bit") || (std::string(algorithm) == "GOST P 34.10-2012 512 bit")){
      if (std::string(algorithm) == "GOST P 34.10-2001"){
        provType = PROV_GOST_2001_DH;
      }
      else if (std::string(algorithm) == "GOST P 34.10-2012 256 bit"){
        provType = PROV_GOST_2012_256;
      }
      else if (std::string(algorithm) == "GOST P 34.10-2012 512 bit"){
        provType = PROV_GOST_2012_512;
      }
      char *url = (char *) [nsUrl UTF8String];
      char *contName = (char *) [nsContName UTF8String];
      [csp_CertRequest create:url :templateReq :contName :key :provType :pathCsr];
      
    }
#endif
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(genSelfSignedCert: (NSString *)nsUrl: (NSString *)nsPathCsr: (NSString *)nsPathCer: (NSString *)nsPathKey: (RCTResponseSenderBlock)callback) {
  try{
    char *pathCsr = (char *) [nsPathCsr UTF8String];
    char *pathCer = (char *) [nsPathCer UTF8String];
    char *pathKey = (char *) [nsPathKey UTF8String];
    
#ifdef ProvOpenSSL
    if (std::string(pathKey) != ""){
      [ossl_CertRequest createCertFromRequest:pathCsr :pathCer :pathKey];
    }
#endif
#ifdef ProvCryptoPro
    if (std::string(pathKey) == ""){
      char *url = (char *) [nsUrl UTF8String];
      [csp_CertRequest getCertFromRequest:url :pathCsr :pathCer];
    }
#endif
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(genSelfSignedCertWithoutRequest: (NSString *)nsAlgorithm: (NSString *)nsContName: (NSInteger)nsKeyUsage:  (NSArray *)nsArrayextKeyUsage: (NSString *)nsSubjectName: (NSString *)nsEmail: (NSString *)nsOrganization: (NSString *)nsLocality: (NSString *)nsProvince: (NSString *)nsCountry: (NSString *)nsPathCer: (RCTResponseSenderBlock)callback) {
  try{
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
#ifdef ProvCryptoPro
    extKeyUsageStructure extKey1 = *new extKeyUsageStructure();
    extKey1.server = [[nsArrayextKeyUsage objectAtIndex:0] boolValue];
    extKey1.client = [[nsArrayextKeyUsage objectAtIndex:1] boolValue];
    extKey1.code = [[nsArrayextKeyUsage objectAtIndex:2] boolValue];
    extKey1.email = [[nsArrayextKeyUsage objectAtIndex:3] boolValue];
    bool i = [csp_CertRequest createSelfSignedCertificateCSP :algorithm :contName :keyUsage :extKey1 :subject :email :organization :locality :province :country :pathCer];
    printf("%d", i);
#endif
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

//регистрация пользователя
RCT_EXPORT_METHOD(userRegistration: (NSString *)nsUrl: (NSString *)nsSubjectName: (NSString *)nsEmail: (NSString *)nsOrganization: (NSString *)nsLocality: (NSString *)nsProvince: (NSString *)nsCountry: (RCTResponseSenderBlock)callback) {
  try{
    char *url = (char *) [nsUrl UTF8String];
    char *subject = (char *) [nsSubjectName UTF8String];
    char *email = (char *) [nsEmail UTF8String];
    char *organization = (char *) [nsOrganization UTF8String];
    char *locality = (char *) [nsLocality UTF8String];
    char *province = (char *) [nsProvince UTF8String];
    char *country = (char *) [nsCountry UTF8String];
    NSMutableDictionary *arrayPropertyCert = [NSMutableDictionary dictionary];

#ifdef ProvCryptoPro
    CPCA15UserInfo* userInfo15 = [csp_CertRequest registration:url :subject :organization :locality :province :email :country];
    arrayPropertyCert[@"tokenID"] = @(userInfo15->TokenID.c_str());
    arrayPropertyCert[@"password"] = @(userInfo15->sbPassword->ptr());
#endif
    
    callback(@[[NSNull null], [arrayPropertyCert copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

//аудентификация пользователя
RCT_EXPORT_METHOD(userAuthentication: (NSString *)nsTokenID: (NSString *)nsPassword: (RCTResponseSenderBlock)callback) {
  try{
    char *tokenID = (char *) [nsTokenID UTF8String];
    char *password = (char *) [nsPassword UTF8String];
    bool b = false;
    
#ifdef ProvCryptoPro
    b = [csp_CertRequest authentication:tokenID :password];
#endif
    
    if (b){
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

//получить список шаблонов для запроса
RCT_EXPORT_METHOD(getListTemplatesForRequest: (NSString *)nsUrl: (RCTResponseSenderBlock)callback) {
  try{
    char *url = (char *) [nsUrl UTF8String];
    std::vector<std::wstring> temp;
    NSMutableArray *myArray = [NSMutableArray array];
    
#ifdef ProvCryptoPro
    temp = [csp_CertRequest get_templates:url];
#endif
    
    for (int i = 0; i < temp.size(); i++){
      std::wstring str1 = std::wstring(temp[i].c_str());
      NSString * sObjC = [[NSString alloc] initWithBytes:str1.data() length:str1.size() * sizeof(wchar_t) encoding:NSUTF32LittleEndianStringEncoding];
      [myArray addObject:sObjC];
    }
    
    callback(@[[NSNull null], [myArray copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

//генерация запроса и сохранение его в файл, ключ записывается в хранилище криптопро
RCT_EXPORT_METHOD(createRequest: (NSString *)nsUrl: (NSString *)nsTemplate: (NSString *)nsContainerName: (NSInteger)nsKeyUsage: (NSString *)nsAlgorithm: (NSString *)nsPathCsr: (RCTResponseSenderBlock)callback) {
  try{
    char *url = (char *) [nsUrl UTF8String];
    char *templateReq = (char *) [nsTemplate UTF8String];
    char *containerName = (char *) [nsContainerName UTF8String];
    int key = (int)nsKeyUsage;
    char *algorithm = (char *) [nsAlgorithm UTF8String];
    char *pathCsr = (char *) [nsPathCsr UTF8String];
    int provType;
    bool b = false;
    
    if (std::string(algorithm) == "GOST P 34.10-2001"){
      provType = PROV_GOST_2001_DH;
    }
    else if (std::string(algorithm) == "GOST P 34.10-2012 256 bit"){
      provType = PROV_GOST_2012_256;
    }
    else if (std::string(algorithm) == "GOST P 34.10-2012 512 bit"){
      provType = PROV_GOST_2012_512;
    }
    else{
      THROW_EXCEPTION(0, Wrap_CertRequest, NULL, "Incorrect provider type.");
    }
    
#ifdef ProvCryptoPro
     b = [csp_CertRequest create:url :templateReq :containerName :key :provType :pathCsr];
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

//получить сертификат с УЦ и сохранить его в файл
RCT_EXPORT_METHOD(getCertOnRequestFromTheServer: (NSString *)nsUrl: (NSString *)nsPathCsr: (NSString *)nsPathCer: (RCTResponseSenderBlock)callback) {
  try{
    char *url = (char *) [nsUrl UTF8String];
    char *pathCsr = (char *) [nsPathCsr UTF8String];
    char *pathCer = (char *) [nsPathCer UTF8String];
    bool b = false;
    
#ifdef ProvCryptoPro
    b = [csp_CertRequest getCertFromRequest:url :pathCsr :pathCer];
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

//получить корневой сертификат УЦ
RCT_EXPORT_METHOD(getCACert: (NSString *)nsUrl: (NSString *)nsPathCer: (RCTResponseSenderBlock)callback) {
  try{
    char *url = (char *) [nsUrl UTF8String];
    char *pathCer = (char *) [nsPathCer UTF8String];
    bool b = false;
    
#ifdef ProvCryptoPro
    b = [csp_CertRequest getCACert:url :pathCer];
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}



@end

