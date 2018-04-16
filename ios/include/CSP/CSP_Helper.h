#ifndef CSP_Helper_h
#define CSP_Helper_h

#import <Foundation/Foundation.h>
#import <CPROCSP/CPROCSP.h>
#import <CPROCSP/CPCrypt.h>

#include <vector>

#include "storehelper.h"
#include "pkistore.h"

extern TrustedHandle<PkiItemCollection> g_picCSP;

PCCERT_CONTEXT findCertInCSPStore(char *serialNumber, char *category);
BYTE *readFile(char *file, DWORD &cbContent);
PCCERT_CONTEXT findCertInCSPStore_1(char *hash, char *category);

#endif /* CSP_Helper_h */
