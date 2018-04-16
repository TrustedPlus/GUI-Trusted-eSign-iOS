#include "Wrap_Signer.h"

@implementation Wrap_Signer

RCT_EXPORT_MODULE();
//+
RCT_EXPORT_METHOD(sign: (NSString *)serialNumber: (NSString *)category: (NSString *)provider: (NSString *)infilename: (NSString *)outfilename: (RCTResponseSenderBlock)callback) {
  try{
    char *pSerialNumber = (char *) [serialNumber UTF8String];
    char *pCategory = (char *) [category UTF8String];
    char *prov = (char *) [provider UTF8String];
    char *infile = (char *) [infilename UTF8String];
    char *outfile = (char *) [outfilename UTF8String];
    BOOL b = false;
#ifdef ProvOpenSSL
    if (strncmp(prov, "SYSTEM", 6) == 0){
      b = [ossl_Signer sign:pSerialNumber :pCategory :infile :outfile ];
    }
#endif
#ifdef ProvCryptoPro
    if (strncmp(prov, "CRYPTOPRO", 9) == 0){
      b = [csp_Signer doSign:pSerialNumber :pCategory :infile :outfile :FALSE];
    }
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

//-
RCT_EXPORT_METHOD(unSign: (NSString *)infilename: (NSString *)outfilename: (NSString *)format:(RCTResponseSenderBlock)callback) {
  try{
    char *infile = (char *) [infilename UTF8String];
    char *outfile = (char *) [outfilename UTF8String];
    char *pFormat = (char *) [format UTF8String];
    BOOL b = false;

#ifdef ProvOpenSSL
    b = [ossl_Signer unSign:infile :outfile :pFormat ];
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}
//-
RCT_EXPORT_METHOD(verify: (NSString *)checkfilename: (NSString *)format: (RCTResponseSenderBlock)callback) {
  try{
    char *inFileName = (char *) [checkfilename UTF8String];
    char *inFormat = (char *) [format UTF8String];
    BOOL b = false;
    
#ifdef ProvOpenSSL
    try{
      b = [ossl_Signer verify:inFileName :inFormat ];
    }
    catch (TrustedHandle<Exception> e){
#endif
#ifdef ProvCryptoPro
      b = [csp_Signer doVerifyAttach:inFileName];
#endif
    }
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}
//-
RCT_EXPORT_METHOD(getSignInfo: (NSString *)checkfilename: (NSString *)format: (RCTResponseSenderBlock)callback) {
  try{
    char *inFileName = (char *) [checkfilename UTF8String];
    char *inFormat = (char *) [format UTF8String];
    std::vector<infoStruct> vec = [ossl_Signer getSignInfo:inFileName :inFormat ];
    NSMutableArray *arrayInfoAboutSigners = [NSMutableArray array];
#ifdef ProvOpenSSL
      for (int i = 0; i < vec.size(); i++){
        NSMutableDictionary *arrayInfoAboutSigner = [NSMutableDictionary dictionary];
        if (vec[i].status)
          arrayInfoAboutSigner[@"status"] = @("1");
        else
          arrayInfoAboutSigner[@"status"] = @("0");
        arrayInfoAboutSigner[@"signatureAlgorithm"] = @(vec[i].cert->getSignatureAlgorithm()->c_str());
        arrayInfoAboutSigner[@"SubjectName"] = @(vec[i].cert->getSubjectName()->c_str());
        arrayInfoAboutSigner[@"issuerName"] = @(vec[i].cert->getIssuerName()->c_str());
        arrayInfoAboutSigner[@"notAfter"] = @(vec[i].cert->getNotAfter()->c_str());
        
        [arrayInfoAboutSigners addObject: arrayInfoAboutSigner];
      }
#endif
    
    callback(@[[NSNull null], [arrayInfoAboutSigners copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}


@end
