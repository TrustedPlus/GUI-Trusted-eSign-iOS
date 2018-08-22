#ifndef CSP_License_h
#define CSP_License_h

#include "Constants.h"
#include "CSP_Helper.h"

#include "cert.h"

#import "ctlicense.h"

@interface CSP_License : NSObject

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

@end

#endif /* CSP_License_h */
