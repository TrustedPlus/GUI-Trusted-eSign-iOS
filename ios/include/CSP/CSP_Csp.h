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
    //содержит список сертификатов в хранилище
    TrustedHandle<PkiItemCollection> providerItemCollection;
}

//считывание всех сертификатов из всех хранилищ КритоПро
- (NSMutableArray*) unloadCertsFromStore;

//преобразование из TrustedHandle<Certificate> в TrustedHandle<PkiItem>
TrustedHandle<PkiItem> objectToPKIItem(TrustedHandle<Certificate> cert);

//перечисление доступных криптопровайдеров
-(std::vector<ProviderProps>) enumProvider;

//перечисление контейнеров в хранилище
-(std::vector<TrustedHandle<ContainerName>>) enumContainers :(int)provType :(TrustedHandle<std::string>)provName;

//получение информации о сертификате из контейнера
-(NSMutableArray*) getInfoAboutCertFromContainer :(TrustedHandle<std::string>)contName;

//установка сертификата из контейнера
-(void) installCertificateFromContainer :(TrustedHandle<std::string>)contName;

//установка сертификата в контейнер
-(void) installCertificateToContainer :(char *)serialNumber :(char *)category :(TrustedHandle<std::string>)contName;
-(void) installCertificateToContainer :(PCCERT_CONTEXT)pCertContext :(TrustedHandle<std::string>)contName;

@end

#endif /* CSP_Csp_h */
