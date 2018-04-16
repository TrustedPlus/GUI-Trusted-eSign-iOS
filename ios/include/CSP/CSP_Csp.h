#ifndef CSP_Csp_h
#define CSP_Csp_h

#include "cert.h"
#include "storehelper.h"
#include "pkistore.h"
#import <Foundation/Foundation.h>
#import <CPROCSP/CPROCSP.h>
#import <CPROCSP/CPCrypt.h>
#import "stdlib.h"
#import "stdio.h"

#include "CSP_Helper.h"

#include <string>
#include <sstream>
#include <iostream>
#include "vector"
#include "map"

@interface CSP_Csp : NSObject {
  struct Cont{
    std::string unique;
    std::string fqcnA;
    std::wstring fqcnW;
    std::wstring container;
  };
  
  struct ProviderProps {
    int type;
    TrustedHandle<std::string> name;
  };

  std::vector<Cont> vec_item;               //перечисление контейнеров
  std::map<int, std::string> providerProps; //перечисление криптопровайдеров
  PCCERT_CONTEXT pcert;                     //при поиске сертификата в таком контейнере, имени криптопровайдера и типе записывается сюда
  TrustedHandle<PkiItemCollection> providerItemCollection; //содержит список сертификатов в хранилище
}
- (NSMutableArray*) UnloadCertsFromStore;
bool cmpCertAndContFP(LPCSTR szContainerName, LPBYTE pbFPCert, DWORD cbFPCert);

@end

#endif /* CSP_Csp_h */
