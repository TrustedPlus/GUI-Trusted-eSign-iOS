#include "Wrap_CertRequest.h"

@implementation Wrap_CertRequest

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(genRequestOnCert: (NSString *)nsAlgorithm: (NSInteger)nsLength: (NSArray *)nsArrayKeyUsage: (NSArray *)nsArrayextKeyUsage: (NSString *)nsSubjectName: (NSString *)nsEmail: (NSString *)nsOrganization: (NSString *)nsLocality: (NSString *)nsProvince: (NSString *)nsCountry: (NSString *)nsPathCsr: (NSString *)nsPathKey: (RCTResponseSenderBlock)callback) {
  try{
    char *algorithm = (char *) [nsAlgorithm UTF8String];
    int length = (int)nsLength;
    char *subject = (char *) [nsSubjectName UTF8String];
    char *email = (char *) [nsEmail UTF8String];
    char *organization = (char *) [nsOrganization UTF8String];
    char *locality = (char *) [nsLocality UTF8String];
    char *province = (char *) [nsProvince UTF8String];
    char *country = (char *) [nsCountry UTF8String];
    char *pathCsr = (char *) [nsPathCsr UTF8String];
    char *pathKey = (char *) [nsPathKey UTF8String];
#ifdef ProvOpenSSL
    keyUsageStruct key = *new keyUsageStruct();
    key.dataEncipherment = [[nsArrayKeyUsage objectAtIndex:0] boolValue];
    key.keyAgreement = [[nsArrayKeyUsage objectAtIndex:1] boolValue];
    key.keyCertSign = [[nsArrayKeyUsage objectAtIndex:2] boolValue];
    key.decipherOnly = [[nsArrayKeyUsage objectAtIndex:3] boolValue];
    key.encipherOnly = [[nsArrayKeyUsage objectAtIndex:4] boolValue];
    key.digitalSignature = [[nsArrayKeyUsage objectAtIndex:5] boolValue];
    key.nonRepudiation =[[nsArrayKeyUsage objectAtIndex:6] boolValue];
    key.cRLSign = [[nsArrayKeyUsage objectAtIndex:7] boolValue];
    key.keyEncipherment = [[nsArrayKeyUsage objectAtIndex:8] boolValue];
    
    extKeyUsageStruct extKey = *new extKeyUsageStruct();
    extKey.server = [[nsArrayextKeyUsage objectAtIndex:0] boolValue];
    extKey.client = [[nsArrayextKeyUsage objectAtIndex:1] boolValue];
    extKey.code = [[nsArrayextKeyUsage objectAtIndex:2] boolValue];
    extKey.email = [[nsArrayextKeyUsage objectAtIndex:3] boolValue];
    [ossl_CertRequest createRequest:algorithm :length :key :extKey :true :subject :email :organization :locality :province :country :pathCsr :pathKey];
#endif
#ifdef ProvCryptoPro
#endif
    callback(@[[NSNull null], [NSNull null]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(genSelfSignedCert: (NSString *)nsPathCsr: (NSString *)nsPathCer: (NSString *)nsPathKey: (RCTResponseSenderBlock)callback) {
  try{
    char *pathCsr = (char *) [nsPathCsr UTF8String];
    char *pathCer = (char *) [nsPathCer UTF8String];
    char *pathKey = (char *) [nsPathKey UTF8String];
#ifdef ProvOpenSSL
    [ossl_CertRequest createCertFromRequest:pathCsr :pathCer :pathKey];
#endif
#ifdef ProvCryptoPro
   // [csp_CertRequest main];
#endif
    callback(@[[NSNull null], [NSNull null]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}


@end

