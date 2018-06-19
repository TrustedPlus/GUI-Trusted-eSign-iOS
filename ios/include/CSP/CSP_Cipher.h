#ifndef CSP_Cipher_h
#define CSP_Cipher_h

#include "Constants.h"
#include "CSP_Helper.h"

#include "cert.h"
#import <Foundation/Foundation.h>
#import <CPROCSP/CPROCSP.h>
#import <CPROCSP/CPCrypt.h>

@interface CSP_Cipher : NSObject{
    struct certStructForEncrypt {
        char *serial;
        char *category;
    };
}

//шифрование входного файла
-(BOOL)encrypt :(std::vector<certStructForEncrypt>)certs :(char *)inputFile :(char *)encFile :(char *)format;

//дешифрование входного файла
-(BOOL) decrypt :(char *)encFile :(char *)format :(char *)decFile;

@end

#endif /* CSP_Cipher_h */
