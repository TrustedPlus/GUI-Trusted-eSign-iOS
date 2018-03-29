#ifndef PHelp_h
#define PHelp_h

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import <CPROCSP/CPROCSP.h>
#import <CPROCSP/CPCrypt.h>
#include "../globalHelper.h"

#include <vector>

PCCERT_CONTEXT findCertInCSPStore(NSString *serialNumber, NSString *category);
BYTE *readFile(NSString *file, DWORD &cbContent);

#endif /* PHelp_h */
