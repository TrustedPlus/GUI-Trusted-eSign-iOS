#include "Wrap_Cipher.h"

@implementation Wrap_Cipher

RCT_EXPORT_MODULE();

/**
 * шифрование входного файла
 * @param infilename - файл, который необходимо зашифровать
 * @param encfilename - файл, куда производится запись зашифрованных данных
 * @param format - формат сохраняемых данных
 * @return true - при успешном завершении, иначе исключение throw.
 */
RCT_EXPORT_METHOD(encryptSymmetric: (NSString *)infilename:(NSString *)encfilename: (NSString *)format: (RCTResponseSenderBlock)callback) {
#ifdef ProvOpenSSL
  try {
    char *infile = (char *) [infilename UTF8String];
    char *encfile = (char *) [encfilename UTF8String];
    char *pFormat = (char *) [format UTF8String];
    BOOL b = false;
    
    b = [ossl_Cipher encryptSymmetric:infile :encfile :pFormat];
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
#endif
#ifndef ProvOpenSSL
  callback(@[[@"Provider OpenSSL not defined." copy], [NSNumber numberWithInt: 0]]);
#endif
}

/**
 * дешифрование входного файла
 * @param encFile - файл, который необходимо расшифровать
 * @param decFile - файл, куда производится запись расшифрованных данных
 * @param format - формат входных данных
 * @return true - при успешном завершении, иначе исключение throw.
 */
RCT_EXPORT_METHOD(decryptSymmetric: (NSString *)encFile: (NSString *)decFile: (NSString *)format: (RCTResponseSenderBlock)callback) {
#ifdef ProvOpenSSL
  try {
    char *encfile = (char *) [encFile UTF8String];
    char *decfile = (char *) [decFile UTF8String];
    char *pFormat = (char *) [format UTF8String];
    BOOL b = false;
    
    b = [ossl_Cipher decryptSymmetric:encfile :decfile :pFormat];
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
#endif
#ifndef ProvOpenSSL
  callback(@[[@"Provider OpenSSL not defined." copy], [NSNumber numberWithInt: 0]]);
#endif
}

/**
 * шифрование входного файла
 * @param certificates - массив сертификатов для шифрования в адрес нескольких получателей (1.serialNumber 2.category 3.serialNumber 4.category etc)
 * @param provider - провайдер
 * @param inFile - файл, который необходимо зашифровать
 * @param encFile - файл, куда производится запись зашифрованных данных
 * @param format - формат сохраняемых данных
 * @return true - при успешном завершении, иначе исключение throw.
 */
RCT_EXPORT_METHOD(encrypt: (NSArray *)certificates: (NSString *)provider: (NSString *)inFile: (NSString *)encFile: (NSString *)format: (RCTResponseSenderBlock)callback) {
  if ((certificates.count % 2) != 0) {
    THROW_EXCEPTION(0, Wrap_Cipher, NULL, "Certificates for encryption are not specified correctly.");
  }
  if (certificates.count == 0) {
    THROW_EXCEPTION(0, Wrap_Cipher, NULL, "Certificates for encryption not downloaded.");
  }
  
  char *prov = (char *) [provider UTF8String];
  char *infile = (char *) [inFile UTF8String];
  char *encfile = (char *) [encFile UTF8String];
  char *pFormat = (char *) [format UTF8String];
  
  try {
    BOOL b = false;
#ifdef ProvOpenSSL
    if (strcmp(prov, "SYSTEM") == 0) {
      std::vector<certStructForEncryptSSL> certsSSL;
      for (int i = 0; i < certificates.count; i++) {
        certStructForEncryptSSL cert;
        cert.serial = (char *) [[certificates objectAtIndex:i] UTF8String];
        cert.category = (char *) [[certificates objectAtIndex:i+1] UTF8String];
        certsSSL.push_back(cert);
        i++;
      }
      b = [ossl_Cipher encrypt:certsSSL :infile :encfile :pFormat];
    }
#endif
#ifdef ProvCryptoPro
    if (strcmp(prov, "CRYPTOPRO") == 0) {
      std::vector<certStructForEncrypt> certs;
      for (int i = 0; i < certificates.count; i++) {
        certStructForEncrypt cert;
        cert.serial = (char *) [[certificates objectAtIndex:i] UTF8String];
        cert.category = (char *) [[certificates objectAtIndex:i+1] UTF8String];
        certs.push_back(cert);
        i++;
      }
      
      b = [csp_Cipher encrypt:certs :infile :encfile :pFormat];
    }
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

/**
 * дешифрование входного файла
 * @param serialNumber - серийный номер сертификата
 * @param category - указывает хранилище сертификата
 * @param provider - провайдер
 * @param encFile - файл, который необходимо расшифровать
 * @param format - формат входных данных
 * @param decFile - файл, куда производится запись расшифрованных данных
 * @return true - при успешном завершении, иначе исключение throw.
 */
RCT_EXPORT_METHOD(decrypt: (NSString *)encFile: (NSString *)format: (NSString *)decFile:(RCTResponseSenderBlock)callback) {
  char *encfile = (char *) [encFile UTF8String];
  char *decfile = (char *) [decFile UTF8String];
  char *pFormat = (char *) [format UTF8String];
  try {
    BOOL b = false;
#ifdef ProvOpenSSL
    try {
      b = [ossl_Cipher decrypt:encfile :pFormat :decfile];
    }
    catch (TrustedHandle<Exception> e) {
#endif
#ifdef ProvCryptoPro
      b = [csp_Cipher decrypt:encfile :pFormat :decfile];
#endif
   // }
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

@end
