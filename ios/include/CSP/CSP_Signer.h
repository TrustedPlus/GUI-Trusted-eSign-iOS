//
//  PSigner.h
//  Prototype_Trusted_IOS
//
//  Created by admin on 01/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef CSP_Signer_h
#define CSP_Signer_h

#include "Constants.h"
#include "CSP_Helper.h"

#include "cert.h"
#import <Foundation/Foundation.h>
#import <CPROCSP/CPROCSP.h>
#import <CPROCSP/CPCrypt.h>

@interface CSP_Signer : NSObject{
    struct infoCSPStruct {
        bool status;
        TrustedHandle<Certificate> cert;
    };
}

-(BOOL)signMessage :(char *)serialNumber :(char *)category :(char *)inputFile :(char *)signFile :(char *)outFileFormat;
-(BOOL)cosignMessage :(char *)serialNumber :(char *)category :(char *)signFile :(char *)format;
-(BOOL)verifyCosignedMessage :(char *)signFile :(char *)format;
-(BOOL)deCosignMessage :(char *)signFile :(char *)inFileFormat :(char *)outFile;
-(std::vector<infoCSPStruct>)getSignInfo :(char *)signFile :(char *)format;

@end

#endif /* CSP_Signer_h */
