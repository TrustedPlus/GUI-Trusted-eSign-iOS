#include "Wrap_Main.h"

@implementation Wrap_Main

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(choiceProviders: (NSString *)providers: (RCTResponseSenderBlock)callback) {
  try{
    /*char *pProviders = (char *) [providers UTF8String];
    std::string prov = "";
    BOOL b = FALSE;
    if (pProviders == nil)
      THROW_EXCEPTION(0, Wrap_Main, NULL, "Incorrect provider!");
    BOOL bb = true;
    int i = 0;
    while (bb)
    //for ( size_t i = -1; i <= sizeof( pProviders ) / sizeof( *pProviders ); i++ )
    {
      if ((pProviders[i] == ' ') || (pProviders[i] == NULL)){
        if (providerOpenSSL == prov){
          #define ProvOpenSSL
        }
        else if (providerCryptoPro == prov){
          #define ProvCryptoPro
        }
        else if (providerIOS == prov){
          #define ProvIOS
        }
        prov = "";
        bb = false;
        b = TRUE;
      }
      else{
        prov += pProviders[i];
      }
      i++;
    }
    if (!b){
      THROW_EXCEPTION(0, Wrap_Main, NULL, "Incorrect provider!");
    }*/
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

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


@end
