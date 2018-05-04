#include "Wrap_CertRequest.h"

@implementation Wrap_CertRequest

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(genRequestOnCert: (NSString *)nsAlgorithm: (NSString *)nsUrl: (NSString *)nsContName: (NSInteger)nsNumberTemplates: (NSInteger)nsLength: (NSInteger)nsKeyUsage: (NSArray *)nsArrayextKeyUsage: (NSString *)nsSubjectName: (NSString *)nsEmail: (NSString *)nsOrganization: (NSString *)nsLocality: (NSString *)nsProvince: (NSString *)nsCountry: (NSString *)nsPathCsr: (NSString *)nsPathKey: (RCTResponseSenderBlock)callback) {
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
    if (std::string(algorithm) == "GOST"){
      std::vector<std::string> temp;
      int numTemplates = (int)nsNumberTemplates;
      char *url = (char *) [nsUrl UTF8String];
      char *contName = (char *) [nsContName UTF8String];
      //char *url = "https://cryptopro.ru:5555/ui";
      //char *contName = "ContainerName125";
      [csp_CertRequest get_templates:url :temp];
      if ((numTemplates > -1) && (temp.size() > numTemplates)){
        [csp_CertRequest create:url :(char *)temp[0].c_str() :contName :subject :organization :locality :province :email :country :pathCsr];
      }
      else{
        callback(@[[@"A template with this number does not exist." copy], [NSNull null]]);
      }
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
      //char *url = "https://cryptopro.ru:5555/ui";
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
    [csp_CertRequest createSelfSignedCertificateCSP :algorithm :contName :keyUsage :extKey1 :subject :email :organization :locality :province :country :pathCer];
#endif
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

@end

