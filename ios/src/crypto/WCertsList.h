#ifndef WCertsList_h
#define WCertsList_h

#include "../globalHelper.h"

#include "cert.h"
#include "openssl.h"
#include "provider_system.h"
#include "pkistore.h"
#include "storehelper.h"

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import <string.h>

@interface WCertsList : NSObject <RCTBridgeModule>{
  NSMutableArray *arrayPkiStore;
}
- (NSMutableArray*) loadStore;

@end

#endif /* WCertsList_h */
