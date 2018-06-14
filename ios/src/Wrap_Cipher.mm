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
  try {
    char *infile = (char *) [infilename UTF8String];
    char *encfile = (char *) [encfilename UTF8String];
    char *pFormat = (char *) [format UTF8String];
    BOOL b = false;
    
#ifdef ProvOpenSSL
    b = [ossl_Cipher encryptSymmetric:infile :encfile :pFormat];
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

/**
 * дешифрование входного файла
 * @param encFile - файл, который необходимо расшифровать
 * @param decFile - файл, куда производится запись расшифрованных данных
 * @param format - формат входных данных
 * @return true - при успешном завершении, иначе исключение throw.
 */
RCT_EXPORT_METHOD(decryptSymmetric: (NSString *)encFile: (NSString *)decFile: (NSString *)format: (RCTResponseSenderBlock)callback) {
  try {
    char *encfile = (char *) [encFile UTF8String];
    char *decfile = (char *) [decFile UTF8String];
    char *pFormat = (char *) [format UTF8String];
    BOOL b = false;
    
#ifdef ProvOpenSSL
    b = [ossl_Cipher decryptSymmetric:encfile :decfile :pFormat];
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
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
  std::vector<char *> certs;
  for (int i = 0; i < certificates.count; i++){
    certs.push_back((char *) [[certificates objectAtIndex:i] UTF8String]);
  }
  
  char *prov = (char *) [provider UTF8String];
  char *infile = (char *) [inFile UTF8String];
  char *encfile = (char *) [encFile UTF8String];
  char *pFormat = (char *) [format UTF8String];
  try{
    
    BOOL b = false;
#ifdef ProvOpenSSL
    if (strcmp(prov, "SYSTEM") == 0) {
      if (certificates.count >= 2)
        b = [ossl_Cipher encrypt:certs[0] :certs[1] :infile :encfile :pFormat];
    }
#endif
#ifdef ProvCryptoPro
    if (strcmp(prov, "CRYPTOPRO") == 0) {
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
    //if (strcmp(prov, "SYSTEM") == 0) {
      //b = [ossl_Cipher decrypt:pSerialNumber :pCategory :encfile :pFormat :decfile];
    //}
#endif
#ifdef ProvCryptoPro
    //if (strcmp(prov, "CRYPTOPRO") == 0) {
      b = [csp_Cipher decrypt:encfile :pFormat :decfile];
    //}
#endif
    
    callback(@[[NSNull null], [NSNumber numberWithInt: b]]);
  }
  catch (TrustedHandle<Exception> e) {
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

@end
