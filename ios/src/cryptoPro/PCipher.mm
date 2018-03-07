#include "PCipher.h"

@implementation PCipher

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(encFile: (NSString *)inputFile: (NSString *)encFile: (NSString *)nsSessionSV: (NSString *)nsSessionEncryptedKey: (NSString *)nsSessionMacKey: (NSString *)nsVector: (NSString *)nsEncryptionParam: (RCTResponseSenderBlock)callback) {
  
  char *in_filename = (char *) [inputFile UTF8String];
  char *out_filename = (char *) [encFile UTF8String];
  
  char *sessionSV = (char *) [nsSessionSV UTF8String];
  char *sessionEncryptedKey = (char *) [nsSessionEncryptedKey UTF8String];
  char *sessionMacKey = (char *) [nsSessionMacKey UTF8String];
  char *vector = (char *) [nsVector UTF8String];
  char *EncryptionParam = (char *) [nsEncryptionParam UTF8String];
  
  static HCRYPTPROV hProv = 0;
  static HCRYPTKEY hKey = 0;
  static HCRYPTKEY hSessionKey = 0;
  static HCRYPTKEY hAgreeKey = 0;
  
  static FILE *certf=NULL;
  static FILE *publicf=NULL;
  static FILE *source=NULL;
  static FILE *Encrypt=NULL;
  static FILE *session_SV=NULL;
  static FILE *session_EncryptedKey=NULL;
  static FILE *session_MacKey=NULL;
  static FILE *vectorf=NULL;
  static FILE *Encryption_Param;
  
  static BYTE *pbKeyBlobSimple = NULL;
  static BYTE *pbIV = NULL;
  
#define MAX_PUBLICKEYBLOB_SIZE 200
#define BLOCK_LENGTH 4096
  BYTE  pbKeyBlob[MAX_PUBLICKEYBLOB_SIZE];
  DWORD dwBlobLen = MAX_PUBLICKEYBLOB_SIZE;
  DWORD dwBlobLenSimple;
  
  BYTE pbContent[BLOCK_LENGTH];
  DWORD cbContent = 0;
  DWORD dwIV = 0;
  DWORD bufLen = sizeof(pbContent);
  ALG_ID ke_alg = CALG_PRO12_EXPORT;
  DWORD cbEncryptionParamSetStandart;
  DWORD result = 0;
  
  if(!(source = fopen(in_filename, "rb")))
    result = CSP_GetLastError();
  printf( "The file 'in_filename' was opened\n" );
  
  if(!(Encrypt = fopen(out_filename, "wb")))
    result = CSP_GetLastError();
  printf( "The file 'out_filename' was opened\n" );
  
  if(!(session_SV = fopen(sessionSV, "wb")))
    result = CSP_GetLastError();
  printf( "The file 'session_SV.bin' was opened\n" );
  
  if(!(session_EncryptedKey = fopen(sessionEncryptedKey, "wb")))
    result = CSP_GetLastError();
  printf( "The file 'session_EncryptedKey.bin' was opened\n" );
  
  if(!(session_MacKey = fopen(sessionMacKey, "wb")))
    result = CSP_GetLastError();
  printf( "The file 'session_MacKey.bin' was opened\n" );
  
  if(!(vectorf = fopen(vector, "wb")))
    result = CSP_GetLastError();
  printf( "The file 'vector.bin' was opened\n" );
  
  if (!(Encryption_Param = fopen(EncryptionParam, "wb")))
    result = CSP_GetLastError();
  printf("The file 'EncryptionParam.bin' was opened\n");
  
  /*if(CryptAcquireContext(&hProv, "\\\\.\\HDIMAGE\\fa40.000\\5982", NULL, 75, 0)) {
   printf("The key container \"HDIMAGE\\fa40.000\5982\" has been acquired. \n");
   }
   else {
   result = CSP_GetLastError();
   }*/
  //hProv = L"Crypto-Pro GOST R 34.10-2001 KC1 CSP";
  
  CSP_BOOL bResult = FALSE;
  PCCERT_CONTEXT pUserCert = NULL;
  HCERTSTORE hCertStore = 0;
  HCRYPTKEY hPubKey;
  
  hCertStore = CertOpenSystemStore(0, "My");
  if(!hCertStore){
    fprintf (stderr, "CertOpenSystemStore failed.");
  }
  pUserCert= CertEnumCertificatesInStore(hCertStore, pUserCert);
  DWORD dwSize;
  CRYPT_KEY_PROV_INFO *pProvInfo = NULL;
  bResult = CertGetCertificateContextProperty(pUserCert, CERT_KEY_PROV_INFO_PROP_ID, NULL, &dwSize);
  if (bResult) {
    free(pProvInfo);
    pProvInfo = (CRYPT_KEY_PROV_INFO *)malloc(dwSize);
    if (pProvInfo) {
      bResult = CertGetCertificateContextProperty(pUserCert, CERT_KEY_PROV_INFO_PROP_ID, pProvInfo, &dwSize);
    }
  }
  char contName[100];
  wcstombs(contName, pProvInfo->pwszContainerName, 100);
  if(CryptAcquireContext(&hProv, contName, NULL, 75, 0)) {
    printf("The key container \"HDIMAGE\\fa40.000\5982\" has been acquired. \n");
  }
  else {
    result = CSP_GetLastError();
  }
  
  if(!bResult){
    fprintf (stderr, "No certificates with private key link.");
  }
  if (CryptImportPublicKeyInfoEx(hProv, X509_ASN_ENCODING | PKCS_7_ASN_ENCODING, &(pUserCert->pCertInfo->SubjectPublicKeyInfo), 0, 0, NULL, &hPubKey)){
    printf("Public key imported from cert file\n");
  } else {
    CertFreeCertificateContext(pUserCert);
  }
  CertFreeCertificateContext(pUserCert);
  if (CryptExportKey(hPubKey, 0, PUBLICKEYBLOB, 0, pbKeyBlob, &dwBlobLen)){
    printf("Public key exported to blob\n");
  }
  else {
    result = CSP_GetLastError();
  }
  
  if(CryptGetUserKey(hProv, AT_KEYEXCHANGE, &hKey)) {
    printf("The private key has been acquired. \n");
  }
  else {
    result = CSP_GetLastError();
  }
  
  if(CryptImportKey(hProv, pbKeyBlob, dwBlobLen, hKey, 0, &hAgreeKey)) {
    printf("The responder public key has been imported. \n");
  }
  else {
    result = CSP_GetLastError();
  }
  
  if(CryptSetKeyParam(hAgreeKey, KP_ALGID, (LPBYTE)&ke_alg, 0)) {
    printf("PRO12_EXPORT agree key algorithm has been set. \n");
  }
  else {
    result = CSP_GetLastError();
  }
  
  if(CryptGenKey(hProv, CALG_G28147, CRYPT_EXPORTABLE, &hSessionKey)) {
    printf("Original session key is created. \n");
  }
  else {
    result = CSP_GetLastError();
  }
  
  if(CryptExportKey(hSessionKey, hAgreeKey, SIMPLEBLOB, 0, NULL, &dwBlobLenSimple)) {
    printf("Size of the BLOB for the sender session key determined. \n");
  }
  else {
    result = CSP_GetLastError();
  }
  
  pbKeyBlobSimple = (BYTE*)malloc(dwBlobLenSimple);
  
  if(!pbKeyBlobSimple)
    result = CSP_GetLastError();
  
  if(CryptExportKey(hSessionKey, hAgreeKey, SIMPLEBLOB, 0, pbKeyBlobSimple, &dwBlobLenSimple)) {
    printf("Contents have been written to the BLOB. \n");
  }
  else {
    result = CSP_GetLastError();
  }
  
  if(CryptGetKeyParam(hSessionKey, KP_IV, NULL, &dwIV, 0)) {
    printf("Size of the IV for the session key determined. \n");
  }
  else {
    result = CSP_GetLastError();
  }
  
  pbIV = (BYTE*)malloc(dwIV);
  if (!pbIV)
    result = CSP_GetLastError();
  
  if(CryptGetKeyParam(hSessionKey, KP_IV, pbIV, &dwIV, 0)){
    printf( "CryptGetKeyParam succeeded. \n");
  }
  else{
    result = CSP_GetLastError();
  }
  
  if(fwrite(pbIV, 1, dwIV, vectorf)) {
    printf( "The IV was written to the 'vector.bin'\n" );
  }
  else {
    result = CSP_GetLastError();
  }
  
  if(fwrite(((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bSV, 1, SEANCE_VECTOR_LEN, session_SV)) {
    printf( "The session key was written to the 'session_SV.bin'\n" );
  }
  else {
    result = CSP_GetLastError();
  }
  
  if(fwrite(((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bEncryptedKey, 1, G28147_KEYLEN, session_EncryptedKey)){
    printf( "The session key was written to the 'session.bin'\n" );
  }
  else {
    result = CSP_GetLastError();
  }
  
  if(fwrite(((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bMacKey, 1, EXPORT_IMIT_SIZE, session_MacKey)){
    printf( "The session key was written to the 'session.bin'\n" );
  }
  else {
    result = CSP_GetLastError();
  }
  
  if (((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bEncryptionParamSet[0] != 0x30)
    result = CSP_GetLastError();
  cbEncryptionParamSetStandart = (DWORD)((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bEncryptionParamSet[1] + sizeof((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bEncryptionParamSet[0] + sizeof((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bEncryptionParamSet[1];
  if (fwrite(((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bEncryptionParamSet, 1, cbEncryptionParamSetStandart, Encryption_Param)) {
    printf("The EncryptionParam was written to the 'EncryptionParam.bin'\n");
  }
  else {
    result = CSP_GetLastError();
  }
  
  do{
    cbContent = (DWORD)fread(pbContent, 1, BLOCK_LENGTH, source);
    if(cbContent) {
      bool bFinal = feof(source);
      if(CryptEncrypt(hSessionKey, 0, bFinal, 0, pbContent, &cbContent, bufLen)) {
        printf( "Encryption succeeded. \n");
        if(fwrite(pbContent, 1, cbContent, Encrypt)) {
          printf( "The encrypted content was written to the 'encrypt.bin'\n" );
        }
        else {
          result = CSP_GetLastError();
        }
      }
      else {
        result = CSP_GetLastError();
      }
    }
    else {
      result = CSP_GetLastError();
    }
  }
  while (!feof(source));
  
  if(source)
    fclose (source);
  if(Encrypt)
    fclose (Encrypt);
  if(session_SV)
    fclose (session_SV);
  if(session_EncryptedKey)
    fclose (session_EncryptedKey);
  if(session_MacKey)
    fclose (session_MacKey);
  if(vectorf)
    fclose (vectorf);
  if(certf)
    fclose (certf);
  if(publicf)
    fclose (publicf);
  if (EncryptionParam)
    fclose(Encryption_Param);
  
  if(hKey)
    CryptDestroyKey(hKey);
  
  if(hSessionKey)
    CryptDestroyKey(hSessionKey);
  
  if(hAgreeKey)
    CryptDestroyKey(hAgreeKey);
  
  if(hProv)
    CryptReleaseContext(hProv, 0);
  
  if(pbKeyBlobSimple)
    free(pbKeyBlobSimple);
  if(pbIV)
    free(pbIV);
  
  callback(@[[NSNull null], [NSNumber numberWithInt: result]]);
}

RCT_EXPORT_METHOD(decFile: (NSString *)encFile: (NSString *)decFile: (NSString *)nsSessionSV: (NSString *)nsSessionEncryptedKey: (NSString *)nsSessionMacKey: (NSString *)nsVector: (NSString *)nsEncryptionParam: (RCTResponseSenderBlock)callback) {
  char *enc_filename = (char *) [encFile UTF8String];
  char *dec_filename = (char *) [decFile UTF8String];
  
  char *sessionSV = (char *) [nsSessionSV UTF8String];
  char *sessionEncryptedKey = (char *) [nsSessionEncryptedKey UTF8String];
  char *sessionMacKey = (char *) [nsSessionMacKey UTF8String];
  char *vector = (char *) [nsVector UTF8String];
  char *EncryptionParam = (char *) [nsEncryptionParam UTF8String];
  
  static HCRYPTPROV hProv = 0;
  static HCRYPTKEY hKey = 0;
  static HCRYPTKEY hSessionKey = 0;
  static HCRYPTKEY hAgreeKey = 0;
  
  static FILE *Encrypt=NULL;
  static FILE *certf=NULL;
  static FILE *publicf=NULL;
  static FILE *session_SV=NULL;
  static FILE *session_EncryptedKey=NULL;
  static FILE *session_MacKey=NULL;
  static FILE *vectorf=NULL;
  static FILE *destination=NULL;
  static FILE *Encryption_Param=NULL;
  
#define MAX_PUBLICKEYBLOB_SIZE 200
  
  BYTE  pbKeyBlob[MAX_PUBLICKEYBLOB_SIZE];
  DWORD dwBlobLen = MAX_PUBLICKEYBLOB_SIZE;
  BYTE *pbKeyBlobSimple = NULL;
  DWORD cbBlobLenSimple;
  BYTE pbIV[100];
  DWORD dwIV = 0;
  BYTE pbContent[BLOCK_LENGTH];
  DWORD cbContent = 0;
  ALG_ID ke_alg = CALG_PRO12_EXPORT;
  CRYPT_SIMPLEBLOB_HEADER tSimpleBlobHeaderStandart;
  DWORD dwBytesRead;
  BYTE *pbEncryptionParamSetStandart;
  DWORD cbEncryptionParamSetStandart;
  
  tSimpleBlobHeaderStandart.BlobHeader.aiKeyAlg = CALG_G28147;
  tSimpleBlobHeaderStandart.BlobHeader.bType = SIMPLEBLOB;
  tSimpleBlobHeaderStandart.BlobHeader.bVersion = BLOB_VERSION;
  tSimpleBlobHeaderStandart.BlobHeader.reserved = 0;
  tSimpleBlobHeaderStandart.EncryptKeyAlgId = CALG_G28147;
  tSimpleBlobHeaderStandart.Magic = G28147_MAGIC;
  
  DWORD result = 0;
  
  if(!(Encrypt = fopen(enc_filename, "rb" )))
    result = CSP_GetLastError();
  printf( "The file 'encrypt.bin' was opened\n" );
  
  if(!(session_SV = fopen(sessionSV, "rb")))
    result = CSP_GetLastError();
  printf( "The file 'session_SV.bin' was opened\n" );
  
  if(!(session_EncryptedKey = fopen(sessionEncryptedKey, "rb")))
    result = CSP_GetLastError();
  printf( "The file 'session_EncryptedKey.bin' was opened\n" );
  
  if(!(session_MacKey = fopen(sessionMacKey, "rb")))
    result = CSP_GetLastError();
  printf( "The file 'session_MacKey.bin' was opened\n" );
  
  if(!(vectorf = fopen(vector, "rb")))
    result = CSP_GetLastError();
  printf( "The file 'vector.bin' was opened\n" );
  
  if(!(destination = fopen(dec_filename, "wb" )))
    result = CSP_GetLastError();
  printf( "The file 'destination.txt' was opened\n" );
  
  if (!(Encryption_Param = fopen(EncryptionParam, "rb")))
    result = CSP_GetLastError();
  printf("The file 'EncryptionParam.bin' was opened\n");
  
  dwIV = (DWORD)fread(pbIV, 1, 100, vectorf);
  if(!dwIV)
    result = CSP_GetLastError();
  printf( "The IV was read from the 'vector.bin'\n" );
  
  CSP_BOOL bResult = FALSE;
  PCCERT_CONTEXT pUserCert = NULL;
  HCERTSTORE hCertStore = 0;
  
  hCertStore = CertOpenSystemStore(0, "My");
  if(!hCertStore){
    fprintf (stderr, "CertOpenSystemStore failed.");
  }
  pUserCert= CertEnumCertificatesInStore(hCertStore, pUserCert);
  DWORD dwSize;
  CRYPT_KEY_PROV_INFO *pProvInfo = NULL;
  bResult = CertGetCertificateContextProperty(pUserCert, CERT_KEY_PROV_INFO_PROP_ID, NULL, &dwSize);
  if (bResult) {
    free(pProvInfo);
    pProvInfo = (CRYPT_KEY_PROV_INFO *)malloc(dwSize);
    if (pProvInfo) {
      bResult = CertGetCertificateContextProperty(pUserCert, CERT_KEY_PROV_INFO_PROP_ID, pProvInfo, &dwSize);
    }
  }
  char contName[100];
  wcstombs(contName, pProvInfo->pwszContainerName, 100);
  if(CryptAcquireContext(&hProv, contName, NULL, 75, 0)) {
    printf("The key container \"HDIMAGE\\fa40.000\5982\" has been acquired. \n");
  }
  else {
    result = CSP_GetLastError();
  }
  
  /*if(!CryptAcquireContext(&hProv, "Responder", NULL, PROV_GOST_2012_256, 0)){
   result = CSP_GetLastError();
   }
   printf("The key container \"Responder\" has been acquired. \n");*/
  
  // obtain file size:
  fseek(Encryption_Param, 0, SEEK_END);
  cbEncryptionParamSetStandart = sizeof(char)*ftell(Encryption_Param);
  rewind(Encryption_Param);
  // allocate memory to contain the whole file:
  pbEncryptionParamSetStandart = (BYTE*)malloc(cbEncryptionParamSetStandart);
  if (pbEncryptionParamSetStandart == NULL)
    result = CSP_GetLastError();
  // copy the file into the buffer:
  dwBytesRead = (DWORD)fread(pbEncryptionParamSetStandart, 1, cbEncryptionParamSetStandart, Encryption_Param);
  if (dwBytesRead != cbEncryptionParamSetStandart)
    result = CSP_GetLastError();
  
  cbBlobLenSimple = cbEncryptionParamSetStandart;
  cbBlobLenSimple += (sizeof(CRYPT_SIMPLEBLOB_HEADER)+SEANCE_VECTOR_LEN + G28147_KEYLEN + EXPORT_IMIT_SIZE);// +sizeof(pbEncryptionParamSetStandart);
  pbKeyBlobSimple = (BYTE *)malloc(cbBlobLenSimple);
  if(!pbKeyBlobSimple)
    result = CSP_GetLastError();
  
  memcpy(&((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->tSimpleBlobHeader, &tSimpleBlobHeaderStandart, sizeof(CRYPT_SIMPLEBLOB_HEADER));
  
  dwBytesRead = (DWORD)fread(((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bSV, 1, SEANCE_VECTOR_LEN, session_SV);
  if(!dwBytesRead)
    result = CSP_GetLastError();
  printf( "The session key was read from the 'session_SV.bin'\n" );
  
  dwBytesRead = (DWORD)fread(((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bEncryptedKey, 1, G28147_KEYLEN, session_EncryptedKey);
  if(!dwBytesRead)
    result = CSP_GetLastError();
  printf( "The session key was read from the 'session_EncryptedKey.bin'\n" );
  
  memcpy(((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bEncryptionParamSet, pbEncryptionParamSetStandart, cbEncryptionParamSetStandart);
  
  dwBytesRead = (DWORD)fread(((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bMacKey, 1, EXPORT_IMIT_SIZE, session_MacKey);
  if(!dwBytesRead)
    result = CSP_GetLastError();
  printf( "The session key was read from the 'session_MacKey.bin'\n" );
  
  HCRYPTKEY hPubKey;
  if (CryptImportPublicKeyInfoEx(hProv, X509_ASN_ENCODING | PKCS_7_ASN_ENCODING, &(pUserCert->pCertInfo->SubjectPublicKeyInfo), 0, 0, NULL, &hPubKey)) {
    printf("Public key imported from cert file\n");
  } else {
    CertFreeCertificateContext(pUserCert);
    result = CSP_GetLastError();
  }
  CertFreeCertificateContext(pUserCert);
  
  if (CryptExportKey(hPubKey, 0, PUBLICKEYBLOB, 0, pbKeyBlob, &dwBlobLen)) {
    printf("Public key exported to blob\n");
  }
  else {
    result = CSP_GetLastError();
  }
  
  //LoadPublicKey(pbKeyBlob, &dwBlobLen, "Sender.cer", "Sender.pub");
  
  if(CryptGetUserKey(hProv, AT_KEYEXCHANGE, &hKey)) {
    printf("The private key has been acquired. \n");
  }
  else{
    result = CSP_GetLastError();
  }
  
  if(CryptImportKey(hProv, pbKeyBlob, dwBlobLen, hKey, 0, &hAgreeKey)) {
    printf("The sender public key has been imported. \n");
  }
  else {
    result = CSP_GetLastError();
  }
  
  if(CryptSetKeyParam(hAgreeKey, KP_ALGID, (LPBYTE)&ke_alg, 0)) {
    printf("PRO12_EXPORT agree key algorithm has been set. \n");
  }
  else {
    result = CSP_GetLastError();
  }
  
  if(CryptImportKey(hProv, pbKeyBlobSimple, cbBlobLenSimple, hAgreeKey, 0, &hSessionKey)) {
    printf("The session key has been imported. \n");
  }
  else {
    result = CSP_GetLastError();
  }
  
  if(!CryptSetKeyParam( hSessionKey, KP_IV, pbIV, 0)) {
    result = CSP_GetLastError();
  }
  printf( "CryptSetKeyParam succeeded. \n");
  
  do
  {
    cbContent = (DWORD)fread(pbContent, 1, BLOCK_LENGTH, Encrypt);
    if(cbContent)
    {
      bool bFinal = feof(Encrypt);
      if(CryptDecrypt(hSessionKey, 0, bFinal, 0, pbContent, &cbContent)) {
        printf( "Decryption succeeded. \n");
        if(fwrite( pbContent, 1, cbContent, destination)) {
          printf( "The decrypted content was written to the 'destination.txt'\n" );
        }
        else {
          result = CSP_GetLastError();
        }
      }
      else {
        result = CSP_GetLastError();
      }
    }
    else {
      result = CSP_GetLastError();
    }
  }
  while(!feof(Encrypt));
  
  if(Encrypt)
    fclose (Encrypt);
  if(session_SV)
    fclose (session_SV);
  if(session_EncryptedKey)
    fclose (session_EncryptedKey);
  if(session_MacKey)
    fclose (session_MacKey);
  if(vectorf)
    fclose (vectorf);
  if(destination)
    fclose (destination);
  if(certf)
    fclose (certf);
  if(publicf)
    fclose (publicf);
  if (EncryptionParam)
    fclose (Encryption_Param);
  
  if(hKey)
    CryptDestroyKey(hKey);
  
  if(hSessionKey)
    CryptDestroyKey(hSessionKey);
  
  if(hAgreeKey)
    CryptDestroyKey(hAgreeKey);
  
  if(hProv)
    CryptReleaseContext(hProv, 0);
  
  printf("The program ran to completion without error. \n");
  free(pbEncryptionParamSetStandart);
  free(pbKeyBlobSimple);
  
  callback(@[[NSNull null], [NSNumber numberWithInt: result]]);
}

@end
