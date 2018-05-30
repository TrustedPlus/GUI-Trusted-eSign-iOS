#ifndef CSP_Csp_h
#define CSP_Csp_h

#include "Constants.h"
#include "CSP_Helper.h"

#include "CSP_CertRequest.h"

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
    TrustedHandle<PkiItemCollection> providerItemCollection; //содержит список сертификатов в хранилище
}

- (NSMutableArray*) unloadCertsFromStore;
bool cmpCertAndContFP(LPCSTR szContainerName, LPBYTE pbFPCert, DWORD cbFPCert);

-(std::vector<ProviderProps>) enumProvider;
-(std::vector<TrustedHandle<ContainerName>>) enumContainers :(int)provType :(TrustedHandle<std::string>)provName;

//получение информации о сертификате из контейнера
-(NSMutableArray*) getInfoAboutCertFromContainer :(TrustedHandle<std::string>)contName;

//установка сертификата из контейнера
-(void) installCertificateFromContainer :(TrustedHandle<std::string>)contName;

//установка сертификата в контейнер
-(void) installCertificateToContainer :(char *)serialNumber :(char *)category :(TrustedHandle<std::string>)contName;

@end

#endif /* CSP_Csp_h */
