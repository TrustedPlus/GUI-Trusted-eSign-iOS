//
//  Ossl_Main.h
//  OSSL
//
//  Created by admin on 09/04/2018.
//  Copyright © 2018 digt. All rights reserved.
//

#ifndef Ossl_Main_h
#define Ossl_Main_h

#include "Ossl_Helper.h"

@interface Ossl_Main : NSObject

-(void) init :(char *)pathToStore;
-(void) clear;

@end

#endif /* Ossl_Main_h */
