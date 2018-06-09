#include "Wrap_Signer.h"

@implementation Wrap_Signer

RCT_EXPORT_MODULE();
//подпись 
RCT_EXPORT_METHOD(sign: (NSString *)serialNumber: (NSString *)category: (NSString *)provider: (NSString *)infilename: (NSString *)outfilename: (NSString *)format: (BOOL)isDetached: (RCTResponseSenderBlock)callback) {
  try{
    char *pSerialNumber = (char *) [serialNumber UTF8String];
    char *pCategory = (char *) [category UTF8String];
    char *prov = (char *) [provider UTF8String];
    char *infile = (char *) [infilename UTF8String];
    char *outfile = (char *) [outfilename UTF8String];
    char *pFormat = (char *) [format UTF8String];
    BOOL b = false;
#ifdef ProvOpenSSL
    if (strcmp(prov, "SYSTEM") == 0){
      b = [ossl_Signer sign:pSerialNumber :pCategory :infile :outfile :pFormat];
    }
#endif
#ifdef ProvCryptoPro
    if (strcmp(prov, "CRYPTOPRO") == 0){
      b = [csp_Signer signMessage:pSerialNumber :pCategory :infile :outfile :pFormat :isDetached];
    }
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(coSign: (NSString *)serialNumber: (NSString *)category: (NSString *)provider: (NSString *)inputFile: (NSString *)signFile: (NSString *)format: (BOOL)isDetached: (RCTResponseSenderBlock)callback) {
  try{
    char *pSerialNumber = (char *) [serialNumber UTF8String];
    char *pCategory = (char *) [category UTF8String];
    char *prov = (char *) [provider UTF8String];
    char *inputfile = (char *) [inputFile UTF8String];
    char *signfile = (char *) [signFile UTF8String];
    char *pFormat = (char *) [format UTF8String];
    
    BOOL b = false;
#ifdef ProvOpenSSL
    if (strcmp(prov, "SYSTEM") == 0){
      b = [ossl_Signer coSignMessage:pSerialNumber :pCategory :signfile :pFormat];
    }
#endif
#ifdef ProvCryptoPro
    if (strcmp(prov, "CRYPTOPRO") == 0){
      b = [csp_Signer cosignMessage:pSerialNumber :pCategory :inputfile :signfile :pFormat :isDetached];
    }
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

//+-
RCT_EXPORT_METHOD(unSign: (NSString *)infilename: (NSString *)format: (NSString *)outfilename:(RCTResponseSenderBlock)callback) {
  try{
    char *infile = (char *) [infilename UTF8String];
    char *outfile = (char *) [outfilename UTF8String];
    char *pFormat = (char *) [format UTF8String];
    BOOL b = false;
    
    b = [csp_Signer isDetachedSignMessage:infile :pFormat];
    if (!b){
      b = [csp_Signer deCosignMessage:infile :pFormat :outfile];
      callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
    }
    else{
      callback(@[[@("Error. The input file is a detached signature.") copy], [NSNumber numberWithInt: 0]]);
    }
/*
#ifdef ProvOpenSSL
    try{
      b = [ossl_Signer unSign:infile :pFormat :outfile];
    }
    catch (TrustedHandle<Exception> e){
#endif
#ifdef ProvCryptoPro
      b = [csp_Signer deCosignMessage:infile :pFormat :outfile];
#endif
    }
*/
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}
//+-
RCT_EXPORT_METHOD(verify: (NSString *)inputfilename: (NSString *)checkfilename: (NSString *)format: (BOOL)isDetached: (RCTResponseSenderBlock)callback) {
  try{
    char *inputName = (char *) [inputfilename UTF8String];
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
      b = [csp_Signer verifyCosignedMessage:inputName :inFileName :inFormat :isDetached];
#endif
    }
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}
//+-
RCT_EXPORT_METHOD(getSignInfo: (NSString *)inputfilename: (NSString *)checkfilename: (NSString *)format: (BOOL)isDetached: (RCTResponseSenderBlock)callback) {
  try{
    char *inputFileName = (char *) [inputfilename UTF8String];
    char *inFileName = (char *) [checkfilename UTF8String];
    char *inFormat = (char *) [format UTF8String];
    NSMutableArray *arrayInfoAboutSigners = [NSMutableArray array];
#ifdef ProvOpenSSL
    try{
      std::vector<infoStruct> vec = [ossl_Signer getSignInfo:inFileName :inFormat ];
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
    }
    catch (TrustedHandle<Exception> e){
#endif
#ifdef ProvCryptoPro
      [arrayInfoAboutSigners removeAllObjects];
      std::vector<infoCSPStruct> vec = [csp_Signer getSignInfo:inputFileName :inFileName :inFormat :isDetached];
      for (int i = 0; i < vec.size(); i++){
        NSMutableDictionary *arrayInfoAboutSigner = [NSMutableDictionary dictionary];
        if (vec[i].status)
          arrayInfoAboutSigner[@"status"] = @("1");
        else
          arrayInfoAboutSigner[@"status"] = @("0");
        
        if (strcmp(vec[i].signingTime->c_str(), std::string("").c_str()) == 0)
          arrayInfoAboutSigner[@"signingTime"] = @("");
        else
          arrayInfoAboutSigner[@"signingTime"] = @(vec[i].signingTime->c_str());
        
        if ((!(strcmp(vec[i].cert->getSignatureAlgorithm()->c_str(), "1.2.643.7.1.1.3.3") == 0)) && (!(strcmp(vec[i].cert->getSignatureAlgorithm()->c_str(), "1.2.643.7.1.1.3.2") == 0))){
          arrayInfoAboutSigner[@"signatureAlgorithm"] = @(vec[i].cert->getSignatureAlgorithm()->c_str());
        }
        else{
          if (strcmp(vec[i].cert->getSignatureAlgorithm()->c_str(), "1.2.643.7.1.1.3.3") == 0){
            arrayInfoAboutSigner[@"signatureAlgorithm"] = @(publicKeyAlgorithm_GOST_R_3410_2012_512);
          }
          else{
            arrayInfoAboutSigner[@"signatureAlgorithm"] = @(publicKeyAlgorithm_GOST_R_3410_2012_256);
          }
        }
        arrayInfoAboutSigner[@"SubjectName"] = @(vec[i].cert->getSubjectName()->c_str());
        arrayInfoAboutSigner[@"issuerName"] = @(vec[i].cert->getIssuerName()->c_str());
        arrayInfoAboutSigner[@"notAfter"] = @(vec[i].cert->getNotAfter()->c_str());
        
        [arrayInfoAboutSigners addObject: arrayInfoAboutSigner];
      }
#endif
    }
    
    callback(@[[NSNull null], [arrayInfoAboutSigners copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(isDetachedSignMessage: (NSString *)signFile: (NSString *)format: (RCTResponseSenderBlock)callback) {
  try{
    char *pSignFile = (char *) [signFile UTF8String];
    char *inFormat = (char *) [format UTF8String];
    BOOL b = false;
    
#ifdef ProvCryptoPro
      b = [csp_Signer isDetachedSignMessage:pSignFile :inFormat];
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}


@end
