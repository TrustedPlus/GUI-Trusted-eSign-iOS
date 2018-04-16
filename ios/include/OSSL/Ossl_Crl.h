#ifndef Ossl_Crl_h
#define Ossl_Crl_h

#import <Foundation/Foundation.h>
#import <string.h>
#include "chain.h"

#include "Ossl_Helper.h"

@interface Ossl_Crl : NSObject {
  TrustedHandle<CRL> crl;
}
-(void) saveCRLToStore :(char *)filename :(char *)inFormat;
-(BOOL) verifyChain :(char *)serialNumber;

@end

#endif /* Ossl_Crl_h */
