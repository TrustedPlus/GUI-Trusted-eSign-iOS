#include "Wrap_License.h"

@implementation Wrap_License

RCT_EXPORT_MODULE();

/**
 * чтение лицензии для показа пользователю
 * @return установленную лицензию, иначе исключение throw.
 */
RCT_EXPORT_METHOD(getLicense: (RCTResponseSenderBlock)callback) {
#ifdef ProvCryptoPro
  try {
    char * token = [csp_License getLicense];
    callback(@[[NSNull null], [@(token) copy]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
#endif
#ifndef ProvCryptoPro
  callback(@[[@"Provider CryptoPro not defined." copy], [NSNumber numberWithInt: 0]]);
#endif
}

/**
 * проверка введенной пользователем лицензии на корректность и в случае успеха - запись в файл
 * @param textLicense - лицензия
 * @return true - если лицензия корректна и запись в файл  прошла успешно, иначе false
 */
RCT_EXPORT_METHOD(checkValidateInputLicense: (NSString *)textLicense: (RCTResponseSenderBlock)callback) {
#ifdef ProvCryptoPro
  try {
    char *pTextLicense = (char *) [textLicense UTF8String];
    BOOL b = false;
    b = [csp_License checkValidateInputLicense:pTextLicense];
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
#endif
#ifndef ProvCryptoPro
  callback(@[[@"Provider CryptoPro not defined." copy], [NSNumber numberWithInt: 0]]);
#endif
}

/**
 * возвращает время, до которого действует лицензия
 * @return время, до которого действует лицензия, либо 0 - если лицензия постоянная
 */
RCT_EXPORT_METHOD(getValidityTimeOfLicense: (RCTResponseSenderBlock)callback) {
#ifdef ProvCryptoPro
  try {
    int count = [csp_License getExpTimeCSP];
    callback(@[[NSNull null], [NSNumber numberWithInt: count]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
#endif
#ifndef ProvCryptoPro
  callback(@[[@"Provider CryptoPro not defined." copy], [NSNumber numberWithInt: 0]]);
#endif
}

/**
 * проверка лицензии КриптоПРО
 * @return TRUE, если она бессрочная или ещё не истекла и FALSE, если она повреждена или истекла
 */
RCT_EXPORT_METHOD(CSPLicenseCheck: (RCTResponseSenderBlock)callback) {
#ifdef ProvCryptoPro
  try {
    BOOL b = [csp_License validateCPCSPLicense];
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
#endif
#ifndef ProvCryptoPro
  callback(@[[@"Provider CryptoPro not defined." copy], [NSNumber numberWithInt: 0]]);
#endif
}

/**
 * отображение установленной лицензиии КриптоПРО
 * @return лицензию в виде строки
 */
RCT_EXPORT_METHOD(getCSPLicense: (RCTResponseSenderBlock)callback) {
#ifdef ProvCryptoPro
  try {
    TrustedHandle<std::string> license = [csp_License getCPCSPLicense];
    callback(@[[NSNull null], [@(license->c_str()) copy]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
#endif
#ifndef ProvCryptoPro
  callback(@[[@"Provider CryptoPro not defined." copy], [NSNumber numberWithInt: 0]]);
#endif
}

/**
 * установка лицензиии КриптоПРО
 * @return true если лицензия валидна, иначе false
 */
RCT_EXPORT_METHOD(setCSPLicense: (NSString *)textLicense: (RCTResponseSenderBlock)callback) {
#ifdef ProvCryptoPro
  try {
    char *pTextLicense = (char *) [textLicense UTF8String];
    bool res = [csp_License setCSPLicense:pTextLicense];
    callback(@[[NSNull null], [NSNumber numberWithInt: res]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
#endif
#ifndef ProvCryptoPro
  callback(@[[@"Provider CryptoPro not defined." copy], [NSNumber numberWithInt: 0]]);
#endif
}

/**
 * отображение времени действия установленной лицензиии КриптоПРО
 * @return время действия лицензии
 */
RCT_EXPORT_METHOD(getCSPLicenseTime: (RCTResponseSenderBlock)callback) {
#ifdef ProvCryptoPro
  try {
    licenseValidityPeriod licenseTime = [csp_License getCSPLicenseTime];
    NSMutableDictionary *mutableLicenseTime = [NSMutableDictionary dictionary];
    mutableLicenseTime[@"code"] = @(licenseTime.code);
    mutableLicenseTime[@"description"] = @(licenseTime.description->c_str());
    callback(@[[NSNull null], [mutableLicenseTime copy]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
#endif
#ifndef ProvCryptoPro
  callback(@[[@"Provider CryptoPro not defined." copy], [NSNumber numberWithInt: 0]]);
#endif
}


@end
