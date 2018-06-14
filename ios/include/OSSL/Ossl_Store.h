#ifndef Ossl_Store_h
#define Ossl_Store_h

#include "cert.h"
#include "openssl.h"
#include "provider_system.h"
#include "pkistore.h"
#include "storehelper.h"
#include "chain.h"

#import <Foundation/Foundation.h>

#include "Ossl_Helper.h"

@interface Ossl_Store : NSObject {
  NSMutableArray *arrayPkiStore;
}
- (NSMutableArray*) unloadCertsFromStore;

@end

#endif /* Ossl_Store_h */
