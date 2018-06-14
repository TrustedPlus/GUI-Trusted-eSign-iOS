#ifndef CSP_Signer_h
#define CSP_Signer_h

#include "Constants.h"
#include "CSP_Helper.h"

#include "cert.h"
#import <Foundation/Foundation.h>
#import <CPROCSP/CPROCSP.h>
#import <CPROCSP/CPCrypt.h>

@interface CSP_Signer : NSObject{
    struct signInfoStruct {
        bool status;
        TrustedHandle<std::string> signingTime;
        TrustedHandle<Certificate> cert;
    };
}

//генерация подписи для входного файла
-(BOOL) signMessage :(char *)serialNumber :(char *)category :(char *)inputFile :(char *)signFile :(char *)outFileFormat :(bool)isDetached;

//добавление соподписи к входному файлу
-(BOOL) cosignMessage :(char *)serialNumber :(char *)category :(char *)inputFile :(char *)signFile :(char *)format :(bool)isDetached;

//верификация подписи
-(BOOL) verifyCosignedMessage :(char *)inputFile :(char *)signFile :(char *)format :(bool)isDetached;

//снятие подписи(подписей)
-(BOOL) deCosignMessage :(char *)signFile :(char *)inFileFormat :(char *)outFile;

//проверяет, является ли входной файл отсоединенной подписью
-(BOOL) isDetachedSignMessage :(char *)signFile :(char *)inFileFormat;

//получение информации о подписавших
-(std::vector<signInfoStruct>) getSignInfo :(char *)inputFile :(char *)signFile :(char *)format :(bool)isDetached;

@end

#endif /* CSP_Signer_h */
