#ifndef CSP_Csp_h
#define CSP_Csp_h

#include "Constants.h"
#include "CSP_Helper.h"

#include "cert.h"
#include "storehelper.h"
#include "pkistore.h"
#import <Foundation/Foundation.h>
#import <CPROCSP/CPROCSP.h>
#import <CPROCSP/CPCrypt.h>

#include <string>
#include <sstream>
#include <iostream>
#include "vector"

@interface CSP_Csp : NSObject {
    struct ProviderProps {
        int type;
        TrustedHandle<std::string> name;
    };
    
    struct ContainerName {
        TrustedHandle<std::string> unique; //CRYPT_UNIQUE
        TrustedHandle<std::wstring> container; //PP_CONTAINER
        TrustedHandle<std::string> fqcnA; //PP_FQCN
        TrustedHandle<std::wstring> fqcnW; //PP_FQCN with mbstowcs
    };
    
    TrustedHandle<PkiItemCollection> providerItemCollection; //содержит список сертификатов в хранилище
}

- (NSMutableArray*) unloadCertsFromStore;
bool cmpCertAndContFP(LPCSTR szContainerName, LPBYTE pbFPCert, DWORD cbFPCert);

-(std::vector<ProviderProps>) enumProvider;
-(std::vector<TrustedHandle<ContainerName>>) enumContainers :(int)provType :(TrustedHandle<std::string>)provName;
-(bool) deleteContainer :(TrustedHandle<std::string>)contName :(int)provType :(TrustedHandle<std::string>)provName;

@end

#endif /* CSP_Csp_h */
