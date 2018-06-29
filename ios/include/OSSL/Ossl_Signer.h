#ifndef Ossl_Signer_h
#define Ossl_Signer_h

#import <Foundation/Foundation.h>

#include "cert.h"
#include "signed_data.h"
#include "key.h"
#include "cipher.h"
#include "openssl.h"
#include "signers.h"
#include "chain.h"

#include "Ossl_Helper.h"

@interface Ossl_Signer : NSObject{
    struct infoStruct {
        bool status;
        TrustedHandle<Certificate> cert;
    };
}

//генерация подписи для входного файла
-(BOOL) sign :(char *)serialNumber :(char *)category :(char *)inputFile :(char *)signFile :(char *)outFileFormat :(bool)isDetached;

//добавление соподписи к входному файлу
-(BOOL) coSignMessage :(char *)serialNumber :(char *)category :(char *)inputFile :(char *)signFile :(char *)format :(bool)isDetached;

//снятие подписи(подписей)
-(BOOL) unSign :(char *)signFile :(char *)inFileFormat :(char *)outFile;

//верификация подписи
-(BOOL) verify :(char *)inputFile :(char *)signFile :(char *)format;

//получение информации о подписавших
-(std::vector<infoStruct>) getSignInfo :(char *)inputFile :(char *)signFile :(char *)format;

@end

#endif /* Ossl_Signer_h */
