#ifndef CSP_License_h
#define CSP_License_h

#include "Constants.h"
#include "CSP_Helper.h"

#include "cert.h"

#import "ctlicense.h"

#ifndef __SET_LICENSE_H__
#define __SET_LICENSE_H__
#ifdef __cplusplus
extern "C" {
#endif
    bool GetCurrentLicenseInfo(int * lic_type, int * expired);
#ifdef __cplusplus
}
#endif
#define LC_EXPIRED (-1)
#define LC_INVALID_SN (-2)
#define LC_NOT_SET (-4)
#define LC_PERMANENT 0x10000000
#define LC_BAD_PRODUCTID (-5)
#endif

@interface CSP_License : NSObject{
    struct licenseValidityPeriod {
        int code;
        TrustedHandle<std::string> description;
    };
}

//чтение лицензии для показа пользователю
-(char *)getLicense;

//проверка введенной пользователем лицензии на коррекность и в случае успеха - запись в файл
-(BOOL)checkValidateInputLicense :(char *)textLicense;

//функция возвращает время, до которого действует лицензия
-(int)getExpTimeCSP; //если 0, то лицензия без срока годности

//функция проверяет файл лицензии для разрешения выполнения функций
-(BOOL)licenseValidate;

//проверяет файл лицензии для разрешения выполнения функций CSP
-(BOOL)validateCPCSPLicense;

//чтение лицензии CSP для показа пользователю
-(TrustedHandle<std::string>)getCPCSPLicense;

-(BOOL)setCSPLicense :(char *)textLicense;

-(licenseValidityPeriod)getCSPLicenseTime;

@end

#endif /* CSP_License_h */
