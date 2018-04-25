#ifndef CSP_Csp_h
#define CSP_Csp_h

#include "CSP_Helper.h"

#include "cert.h"
#include "storehelper.h"
#include "pkistore.h"
#import <Foundation/Foundation.h>
#import <CPROCSP/CPROCSP.h>
#import <CPROCSP/CPCrypt.h>
#import "stdlib.h"
#import "stdio.h"

#include <string>
#include <sstream>
#include <iostream>
#include "vector"
#include "map"

@interface CSP_Csp : NSObject {
  TrustedHandle<PkiItemCollection> providerItemCollection; //содержит список сертификатов в хранилище
}

- (NSMutableArray*) UnloadCertsFromStore;
bool cmpCertAndContFP(LPCSTR szContainerName, LPBYTE pbFPCert, DWORD cbFPCert);

@end

#endif /* CSP_Csp_h */
