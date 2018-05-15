//
//  PCerts.h
//  Prototype_Trusted_IOS
//
//  Created by admin on 05/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

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

#include <string>
#include <sstream>
#include <iostream>
#include "vector"
#include "map"

@interface CSP_Certs : NSObject{
  std::map<std::string, std::vector<PCCERT_CONTEXT>> allCerts;
}

-(void)importPFX :(char *)pathToPFX :(char *)password;
-(void)exportPFX :(char *)serialNumber :(char *)category :(BOOL)exportPrivateKey :(char *)password :(char *)pathToFile;
    
@end

#endif /* CSP_Certs_h */
