#ifndef WCrl_h
#define WCrl_h

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import <string.h>
#include "crl.h"
#include "crls.h"
#include "chain.h"

#include "../globalHelper.h"
#include "WHelp.h"

@interface WCrl : NSObject <RCTBridgeModule>{
  TrustedHandle<CRL> crl;
}

TrustedHandle<CrlCollection> getCrls();

@end

#endif /* WCrl_h */
