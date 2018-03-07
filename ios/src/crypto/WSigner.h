#ifndef WSigner_h
#define WSigner_h

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

#include "cert.h"
#include "signed_data.h"
#include "key.h"
#include "cipher.h"
#include "openssl.h"
#include "signers.h"

@interface WSigner : NSObject <RCTBridgeModule>

@end

#endif /* WSigner_h */
