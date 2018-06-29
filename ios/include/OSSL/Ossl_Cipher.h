#ifndef Ossl_Cipher_h
#define Ossl_Cipher_h

#import <Foundation/Foundation.h>

#include "cert.h"
#include "key.h"
#include "cipher.h"
#include "openssl.h"

#include "Ossl_Helper.h"

@interface Ossl_Cipher : NSObject {
    struct certStructForEncryptSSL {
        char *serial;
        char *category;
    };
}

//симметричное шифрование входного файла
-(BOOL) encryptSymmetric :(char *)inputFile :(char *)encFile :(char *)format;

//симметричное дешифрование входного файла
-(BOOL) decryptSymmetric :(char *)encFile :(char *)decFile :(char *)format;

//шифрование входного файла
-(BOOL) encrypt:(std::vector<certStructForEncryptSSL>)certs :(char *)inputFile :(char *)encFile :(char *)format;

//дешифрование входного файла
-(BOOL) decrypt :(char *)encFile :(char *)format :(char *)decFile;

@end

#endif /* Ossl_Cipher_h */
