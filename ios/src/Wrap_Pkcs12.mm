#include "Wrap_Pkcs12.h"

@implementation Wrap_Pkcs12

RCT_EXPORT_MODULE();

//экспорт pkcs12
RCT_EXPORT_METHOD(exportPFX: (NSString *)serialNumber: (NSString *)category: (NSString *)provider:  (BOOL)exportPrivateKey: (NSString *)password: (NSString *)filename: (RCTResponseSenderBlock)callback){
  char *pSerialNumber = (char *) [serialNumber UTF8String];
  char *pCategory = (char *) [category UTF8String];
  char *prov = (char *) [provider UTF8String];
  char *pPwd = (char *) [password UTF8String];
  char *pFilename = (char *) [filename UTF8String];
  try{
    
#ifdef ProvOpenSSL
    if (strncmp(prov, "SYSTEM", 6) == 0){
      [ossl_Pkcs12 exportPFX:pSerialNumber :pCategory :exportPrivateKey :pPwd :pFilename ];
    }
#endif
#ifdef ProvCryptoPro
    if (strncmp(prov, "CRYPTOPRO", 9) == 0){
      [csp_Certs exportPFX:pSerialNumber :pCategory :exportPrivateKey :pPwd :pFilename];
    }
#endif

    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

//импорт pkcs12
RCT_EXPORT_METHOD(importPFX: (NSString *)filename: (NSString *)passwordForPFX: (NSString *)passwordForKey: (RCTResponseSenderBlock)callback){
  char *pFilename = (char *) [filename UTF8String];
  char *pPwdPFX = (char *) [passwordForPFX UTF8String];
  char *pPwdKey = (char *) [passwordForKey UTF8String];
  try{
    try{
      [ossl_Pkcs12 importPFX:pFilename :pPwdPFX :pPwdKey ];
    }
    catch (TrustedHandle<Exception> e){
      [csp_Certs importPFX:pFilename :pPwdPFX];
    }
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

@end

