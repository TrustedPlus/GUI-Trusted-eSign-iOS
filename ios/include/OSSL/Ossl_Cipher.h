#ifndef Ossl_Cipher_h
#define Ossl_Cipher_h

#import <Foundation/Foundation.h>

#include "cert.h"
#include "key.h"
#include "cipher.h"
#include "openssl.h"

#include "Ossl_Helper.h"

@interface Ossl_Cipher : NSObject

-(BOOL) encryptSymmetric :(char *)infilename :(char *)encfilename;
-(BOOL) decryptSymmetric :(char *)encFile :(char *)decFile;
-(BOOL) encrypt :(char *)serialNumber :(char *)category :(char *)inFile :(char *)encFile;
-(BOOL) decrypt :(char *)serialNumber :(char *)category :(char *)encFile :(char *)decFile;

@end

#endif /* Ossl_Cipher_h */
