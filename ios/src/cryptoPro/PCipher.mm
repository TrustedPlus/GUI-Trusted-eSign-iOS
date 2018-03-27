#include "PCipher.h"

@implementation PCipher

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(encFile: (NSString *)serialNumber: (NSString *)category: (NSString *)inputFile: (NSString *)encFile:  (RCTResponseSenderBlock)callback){
  try{
    static DWORD cbEncryptedBlob;
    static BYTE *pbEncryptedBlob = NULL;
    
    //считать данные из файла в байты
    BYTE *pbContent = NULL;
    DWORD cbContent = 0;
    pbContent = readFile(inputFile, cbContent);
    
    CRYPT_ALGORITHM_IDENTIFIER EncryptAlgorithm;
    CRYPT_ENCRYPT_MESSAGE_PARA EncryptParams;
    
    HCRYPTPROV hCryptProv = 0;
    PCCERT_CONTEXT pUserCert = NULL;
    pUserCert = findCertInCSPStore(serialNumber, category);
    
    // получение дескриптора криптографического провайдера.
    if(!CryptAcquireContext(&hCryptProv, 0, NULL, PROV_GOST_2012_256, CRYPT_VERIFYCONTEXT)){
      THROW_EXCEPTION(0, PCipher, NULL, "Cryptographic context could not be acquired.");
    }
    
    // Инициалиализация структуры с нулем
    memset(&EncryptAlgorithm, 0, sizeof(CRYPT_ALGORITHM_IDENTIFIER));
    //EncryptAlgorithm.pszObjId = OID_CipherVar_Default;
    EncryptAlgorithm.pszObjId = szOID_CP_GOST_28147;
    
    // Инициализация структуры CRYPT_ENCRYPT_MESSAGE_PARA.
    memset(&EncryptParams, 0, sizeof(CRYPT_ENCRYPT_MESSAGE_PARA));
    EncryptParams.cbSize =  sizeof(CRYPT_ENCRYPT_MESSAGE_PARA);
    EncryptParams.dwMsgEncodingType = MY_ENCODING_TYPE;
    EncryptParams.hCryptProv = hCryptProv;
    EncryptParams.ContentEncryptionAlgorithm = EncryptAlgorithm;
    
    if(!CryptEncryptMessage(&EncryptParams, 1, &pUserCert, pbContent, cbContent, NULL, &cbEncryptedBlob)) {
      THROW_EXCEPTION(0, PCipher, NULL, "Getting EncrypBlob size failed.");
    }
    
    // Распределение памяти под возвращаемый BLOB.
    pbEncryptedBlob = (BYTE*)malloc(cbEncryptedBlob);
    
    if(!pbEncryptedBlob){
      THROW_EXCEPTION(0, PCipher, NULL, "Memory allocation error while encrypting.");
    }
    
    // шифрование содержимого
    if(!CryptEncryptMessage(&EncryptParams, 1, &pUserCert, pbContent, cbContent, pbEncryptedBlob, &cbEncryptedBlob)){
      THROW_EXCEPTION(0, PCipher, NULL, "Encryption failed.");
    }
    
    char *outfile = (char *) [encFile UTF8String];
    if (outfile) {
      FILE *out = NULL;
      out = fopen (outfile, "wb");
      if (out) {
        fwrite (pbEncryptedBlob, cbEncryptedBlob, 1, out);
        fclose (out);
      }
      else{
        THROW_EXCEPTION(0, PCipher, NULL, "Cannot open out file.");
      }
    }
    
    free(pbEncryptedBlob);
    free(pbContent);
    
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(decFile: (NSString *)serialNumber: (NSString *)category: (NSString *)encFile: (NSString *)decFile:  (RCTResponseSenderBlock)callback){
  try{
    DWORD cbDecryptedMessage;
    CRYPT_DECRYPT_MESSAGE_PARA  decryptParams;
    
    BYTE*  pbDecryptedMessage = NULL;
    
    //считать данные из файла в байты
    BYTE *pbEncryptedBlob = NULL;
    DWORD cbEncryptedBlob = 0;
    pbEncryptedBlob = readFile(encFile, cbEncryptedBlob);

    PCCERT_CONTEXT pUserCert = NULL;
    pUserCert = findCertInCSPStore(serialNumber, category);
    
    char *pCategory = (char *) [category UTF8String];
    DWORD dwFlags = CERT_SYSTEM_STORE_CURRENT_USER | CERT_STORE_OPEN_EXISTING_FLAG;
    HCERTSTORE hStoreHandle = CertOpenStore(CERT_STORE_PROV_MEMORY, 0, 0, dwFlags, pCategory);
    if(!hStoreHandle){
      THROW_EXCEPTION(0, PCipher, NULL, "CertOpenSystemStore failed.");
    }
    if (!CertAddCertificateContextToStore(hStoreHandle, pUserCert, CERT_STORE_ADD_REPLACE_EXISTING, NULL)){
      THROW_EXCEPTION(0, PCipher, NULL, "CertAddCertificateContextToStore failed: Code: %d", CSP_GetLastError());
    }
    
    memset(&decryptParams, 0, sizeof(CRYPT_DECRYPT_MESSAGE_PARA));
    decryptParams.cbSize = sizeof(CRYPT_DECRYPT_MESSAGE_PARA);
    decryptParams.dwMsgAndCertEncodingType = MY_ENCODING_TYPE;
    decryptParams.cCertStore = 1;
    decryptParams.rghCertStore = &hStoreHandle;
    
    if(!CryptDecryptMessage(&decryptParams, pbEncryptedBlob, cbEncryptedBlob, NULL, &cbDecryptedMessage, NULL)) {
      free(pbEncryptedBlob);
      THROW_EXCEPTION(0, PCipher, NULL, "Error getting decrypted message size.");
    }
    
    pbDecryptedMessage = (BYTE*)malloc(cbDecryptedMessage);
    if(!pbDecryptedMessage) {
      free(pbEncryptedBlob);
      THROW_EXCEPTION(0, PCipher, NULL, "Memory allocation error while decrypting.");
    }

    if(!CryptDecryptMessage(&decryptParams, pbEncryptedBlob, cbEncryptedBlob, pbDecryptedMessage, &cbDecryptedMessage, NULL)) {
      free(pbEncryptedBlob);
      free(pbDecryptedMessage);
      THROW_EXCEPTION(0, PCipher, NULL, "Error decrypting the message.");
    }
    
    char *outfile = (char *) [decFile UTF8String];
    if (outfile) {
      FILE *out = NULL;
      out = fopen (outfile, "wb");
      if (out) {
        fwrite (pbDecryptedMessage, cbDecryptedMessage, 1, out);
        fclose (out);
      }
      else{
        THROW_EXCEPTION(0, PCipher, NULL, "Cannot open out file.");
      }
    }
    
    free(pbEncryptedBlob);
    free(pbDecryptedMessage);
    
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

@end
