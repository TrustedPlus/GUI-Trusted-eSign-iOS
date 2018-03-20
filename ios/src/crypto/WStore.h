#ifndef WStore_h
#define WStore_h

#include "../globalHelper.h"

#include "cert.h"
#include "openssl.h"
#include "provider_system.h"
#include "pkistore.h"
#include "storehelper.h"

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import <string.h>

@interface WStore : NSObject <RCTBridgeModule>{
  NSMutableArray *arrayPkiStore;
}
- (NSMutableArray*) UnloadCertsFromStore;

@end

#endif /* WStore_h */
