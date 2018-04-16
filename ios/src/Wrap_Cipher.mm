#include "Wrap_Cipher.h"

@implementation Wrap_Cipher

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(encryptSymmetric: (NSString *)infilename:(NSString *)encfilename:(RCTResponseSenderBlock)callback) {
  try{
    char *infile = (char *) [infilename UTF8String];
    char *encfile = (char *) [encfilename UTF8String];
    BOOL b = false;
    
#ifdef ProvOpenSSL
    b = [ossl_Cipher encryptSymmetric:infile :encfile];
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(decryptSymmetric: (NSString *)encFile: (NSString *)decFile: (RCTResponseSenderBlock)callback){
  try{
    char *encfile = (char *) [encFile UTF8String];
    char *decfile = (char *) [decFile UTF8String];
    BOOL b = false;
    
#ifdef ProvOpenSSL
    b = [ossl_Cipher decryptSymmetric:encfile :decfile];
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(encrypt: (NSString *)serialNumber: (NSString *)category: (NSString *)provider: (NSString *)inFile: (NSString *)encFile: (RCTResponseSenderBlock)callback){
  char *pSerialNumber = (char *) [serialNumber UTF8String];
  char *pCategory = (char *) [category UTF8String];
  char *prov = (char *) [provider UTF8String];
  char *infile = (char *) [inFile UTF8String];
  char *encfile = (char *) [encFile UTF8String];
  try{
    
    BOOL b = false;
#ifdef ProvOpenSSL
   if (strncmp(prov, "SYSTEM", 6) == 0){
      b = [ossl_Cipher encrypt:pSerialNumber :pCategory :infile :encfile];
    }
#endif
#ifdef ProvCryptoPro
    if (strncmp(prov, "CRYPTOPRO", 9) == 0){
      b = [csp_Cipher encrypt:pSerialNumber :pCategory :infile :encfile];
    }
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(decrypt: (NSString *)serialNumber: (NSString *)category: (NSString *)provider: (NSString *)encFile: (NSString *)decFile:(RCTResponseSenderBlock)callback){
  char *pSerialNumber = (char *) [serialNumber UTF8String];
  char *pCategory = (char *) [category UTF8String];
  char *prov = (char *) [provider UTF8String];
  char *encfile = (char *) [encFile UTF8String];
  char *decfile = (char *) [decFile UTF8String];
  try{
    BOOL b = false;
#ifdef ProvOpenSSL
    if (strncmp(prov, "SYSTEM", 6) == 0){
      b = [ossl_Cipher decrypt:pSerialNumber :pCategory :encfile :decfile];
    }
#endif
#ifdef ProvCryptoPro
    if (strncmp(prov, "CRYPTOPRO", 9) == 0){
      b = [csp_Cipher decrypt:pSerialNumber :pCategory :encfile :decfile];
    }
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

@end
