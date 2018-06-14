#ifndef CSP_Certs_h
#define CSP_Certs_h

#include "Constants.h"
#include "CSP_Helper.h"

#include "cert.h"
#include "pkcs12.h"

#import <Foundation/Foundation.h>
#import <CPROCSP/CPROCSP.h>
#import <CPROCSP/CPCrypt.h>
#import "stdlib.h"
#import "stdio.h"

@interface CSP_Certs : NSObject{
  std::map<std::string, std::vector<PCCERT_CONTEXT>> allCerts;
}

//импорт PFX файла
-(void) importPFX :(char *)pathToPFX :(char *)password;

//экспорт PFX файла
-(void) exportPFX :(char *)serialNumber :(char *)category :(BOOL)exportPrivateKey :(char *)password :(char *)pathToFile;
    
@end

#endif /* CSP_Certs_h */
