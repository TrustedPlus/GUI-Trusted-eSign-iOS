#include "PCipher.h"

@implementation PCipher

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(encFile: (NSString *)serialNumber: (NSString *)category: (NSString *)inputFile: (NSString *)encFile: (NSString *)nsSessionSV: (NSString *)nsSessionEncryptedKey: (NSString *)nsSessionMacKey: (NSString *)nsVector: (NSString *)nsEncryptionParam: (RCTResponseSenderBlock)callback) {
  
  char *pSerialNumber = (char *) [serialNumber UTF8String];
  char *pCategory = (char *) [category UTF8String];
  
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
  
  if(!(source = fopen(in_filename, "rb"))){
    callback(@[[@"Can't open file 'in_filename'" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  printf( "The file 'in_filename' was opened\n" );
  
  if(!(Encrypt = fopen(out_filename, "wb"))){
    callback(@[[@"Can't open file 'out_filename'" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  printf( "The file 'out_filename' was opened\n" );
  
  if(!(session_SV = fopen(sessionSV, "wb"))){
    callback(@[[@"Can't open file 'session_SV.bin'" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  printf( "The file 'session_SV.bin' was opened\n" );
  
  if(!(session_EncryptedKey = fopen(sessionEncryptedKey, "wb"))){
    callback(@[[@"Can't open file 'session_EncryptedKey.bin'" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  printf( "The file 'session_EncryptedKey.bin' was opened\n" );
  
  if(!(session_MacKey = fopen(sessionMacKey, "wb"))){
    callback(@[[@"Can't open file 'session_MacKey.bin'" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  printf( "The file 'session_MacKey.bin' was opened\n" );
  
  if(!(vectorf = fopen(vector, "wb"))){
    callback(@[[@"Can't open file 'vector.bin'" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  printf( "The file 'vector.bin' was opened\n" );
  
  if (!(Encryption_Param = fopen(EncryptionParam, "wb"))){
    callback(@[[@"Can't open file 'EncryptionParam.bin'" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  printf("The file 'EncryptionParam.bin' was opened\n");
  
  CSP_BOOL bResult = FALSE;
  PCCERT_CONTEXT pUserCert = NULL;
  PCCERT_CONTEXT pUserCert_new = NULL;
  HCERTSTORE hCertStore = 0;
  HCRYPTKEY hPubKey;
  
  hCertStore = CertOpenSystemStore(0, pCategory);
  if(!hCertStore){
    callback(@[[@"CertOpenSystemStore failed." copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  TrustedHandle<Filter> filterByCert = new Filter();
  filterByCert->setSerial(new std::string(pSerialNumber));
  TrustedHandle<PkiItemCollection> pic = g_picCSP->find(filterByCert);
  if (pic->length() <= 0){
    callback(@[[@"Not find certificate!" copy], [NSNumber numberWithInt: 0]]);
  }
  TrustedHandle<PkiItem> pi = new PkiItem();
  pi = pic->items(0);
  TrustedHandle<Certificate> cert = pi->certificate;
  
  unsigned char *pData = NULL, *p = NULL;
  int iData;
  if (cert->isEmpty()){
    callback(@[[@"Cert cannot be empty.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  if ((iData = i2d_X509(cert->internal(), NULL)) <= 0) {
    callback(@[[@"Error i2d_X509.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  if (NULL == (pData = (unsigned char*)OPENSSL_malloc(iData))) {
    callback(@[[@"Error malloc.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  p = pData;
  if ((iData = i2d_X509(cert->internal(), &p)) <= 0) {
    callback(@[[@"Error i2d_X509.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  if (NULL == (pUserCert_new = CertCreateCertificateContext(X509_ASN_ENCODING | PKCS_7_ASN_ENCODING, pData, iData))) {
    callback(@[[@"CertCreateCertificateContext() failed.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  OPENSSL_free(pData);
  
  pUserCert = CertFindCertificateInStore(hCertStore, X509_ASN_ENCODING | PKCS_7_ASN_ENCODING, NULL, CERT_FIND_EXISTING, pUserCert_new, NULL);
  if (!pUserCert){
    callback(@[[@"No find exiting certificates.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  DWORD dwSize = 0;
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
    printf("The key container has been acquired. \n");
  }
  else {
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if(!bResult){
    callback(@[[@"No certificates with private key link." copy], [NSNumber numberWithInt: 0]]);
    return;
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
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if(CryptGetUserKey(hProv, AT_KEYEXCHANGE, &hKey)) {
    printf("The private key has been acquired. \n");
  }
  else {
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if(CryptImportKey(hProv, pbKeyBlob, dwBlobLen, hKey, 0, &hAgreeKey)) {
    printf("The responder public key has been imported. \n");
  }
  else {
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if(CryptSetKeyParam(hAgreeKey, KP_ALGID, (LPBYTE)&ke_alg, 0)) {
    printf("PRO12_EXPORT agree key algorithm has been set. \n");
  }
  else {
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if(CryptGenKey(hProv, CALG_G28147, CRYPT_EXPORTABLE, &hSessionKey)) {
    printf("Original session key is created. \n");
  }
  else {
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if(CryptExportKey(hSessionKey, hAgreeKey, SIMPLEBLOB, 0, NULL, &dwBlobLenSimple)) {
    printf("Size of the BLOB for the sender session key determined. \n");
  }
  else {
    callback(@[[@"Size of the BLOB for the sender session key not determined." copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  pbKeyBlobSimple = (BYTE*)malloc(dwBlobLenSimple);
  
  if(!pbKeyBlobSimple){
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if(CryptExportKey(hSessionKey, hAgreeKey, SIMPLEBLOB, 0, pbKeyBlobSimple, &dwBlobLenSimple)) {
    printf("Contents have been written to the BLOB. \n");
  }
  else {
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if(CryptGetKeyParam(hSessionKey, KP_IV, NULL, &dwIV, 0)) {
    printf("Size of the IV for the session key determined. \n");
  }
  else {
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  pbIV = (BYTE*)malloc(dwIV);
  if (!pbIV){
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if(CryptGetKeyParam(hSessionKey, KP_IV, pbIV, &dwIV, 0)){
    printf( "CryptGetKeyParam succeeded. \n");
  }
  else{
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if(fwrite(pbIV, 1, dwIV, vectorf)) {
    printf( "The IV was written to the 'vector.bin'\n" );
  }
  else {
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if(fwrite(((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bSV, 1, SEANCE_VECTOR_LEN, session_SV)) {
    printf( "The session key was written to the 'session_SV.bin'\n" );
  }
  else {
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if(fwrite(((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bEncryptedKey, 1, G28147_KEYLEN, session_EncryptedKey)){
    printf( "The session key was written to the 'session.bin'\n" );
  }
  else {
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if(fwrite(((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bMacKey, 1, EXPORT_IMIT_SIZE, session_MacKey)){
    printf( "The session key was written to the 'session.bin'\n" );
  }
  else {
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if (((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bEncryptionParamSet[0] != 0x30){
    callback(@[[@"pbKeyBlobSimple)->bEncryptionParamSet[0] != 0x30" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  cbEncryptionParamSetStandart = (DWORD)((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bEncryptionParamSet[1] + sizeof((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bEncryptionParamSet[0] + sizeof((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bEncryptionParamSet[1];
  if (fwrite(((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bEncryptionParamSet, 1, cbEncryptionParamSetStandart, Encryption_Param)) {
    printf("The EncryptionParam was written to the 'EncryptionParam.bin'\n");
  }
  else {
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
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
          callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
          return;
        }
      }
      else {
        callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
        return;
      }
    }
    else {
      callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
      return;
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
  
  callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
}

RCT_EXPORT_METHOD(decFile: (NSString *)serialNumber: (NSString *)category: (NSString *)encFile: (NSString *)decFile: (NSString *)nsSessionSV: (NSString *)nsSessionEncryptedKey: (NSString *)nsSessionMacKey: (NSString *)nsVector: (NSString *)nsEncryptionParam: (RCTResponseSenderBlock)callback) {
  char *pSerialNumber = (char *) [serialNumber UTF8String];
  char *pCategory = (char *) [category UTF8String];
  
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
  
  if(!(Encrypt = fopen(enc_filename, "rb" ))){
    callback(@[[@"The file 'encrypt.bin' was not opened" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  printf( "The file 'encrypt.bin' was opened\n" );
  
  if(!(session_SV = fopen(sessionSV, "rb"))){
    callback(@[[@"The file 'session_SV.bin' was not opened" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  printf( "The file 'session_SV.bin' was opened\n" );
  
  if(!(session_EncryptedKey = fopen(sessionEncryptedKey, "rb"))){
    callback(@[[@"The file 'session_EncryptedKey.bin' was not opened" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  printf( "The file 'session_EncryptedKey.bin' was opened\n" );
  
  if(!(session_MacKey = fopen(sessionMacKey, "rb"))){
    callback(@[[@"The file 'session_MacKey.bin' was not opened" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  printf( "The file 'session_MacKey.bin' was opened\n" );
  
  if(!(vectorf = fopen(vector, "rb"))){
    callback(@[[@"The file 'vector.bin' was not opened" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  printf( "The file 'vector.bin' was opened\n" );
  
  if(!(destination = fopen(dec_filename, "wb" ))){
    callback(@[[@"The file 'destination.txt' was not opened" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  printf( "The file 'destination.txt' was opened\n" );
  
  if (!(Encryption_Param = fopen(EncryptionParam, "rb"))){
    callback(@[[@"The file 'EncryptionParam.bin' was not opened" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  printf("The file 'EncryptionParam.bin' was opened\n");
  
  dwIV = (DWORD)fread(pbIV, 1, 100, vectorf);
  if(!dwIV){
    callback(@[[@"The IV was not read from the 'vector.bin'" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  printf( "The IV was read from the 'vector.bin'\n" );
  
  CSP_BOOL bResult = FALSE;
  PCCERT_CONTEXT pUserCert = NULL;
  PCCERT_CONTEXT pUserCert_new = NULL;
  HCERTSTORE hCertStore = 0;
  
  hCertStore = CertOpenSystemStore(0, pCategory);
  if(!hCertStore){
    callback(@[[@"CertOpenSystemStore failed." copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  TrustedHandle<Filter> filterByCert = new Filter();
  filterByCert->setSerial(new std::string(pSerialNumber));
  TrustedHandle<PkiItemCollection> pic = g_picCSP->find(filterByCert);
  if (pic->length() <= 0){
    callback(@[[@"Not find certificate!" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  TrustedHandle<PkiItem> pi = new PkiItem();
  pi = pic->items(0);
  TrustedHandle<Certificate> cert = pi->certificate;
  
  unsigned char *pData = NULL, *p = NULL;
  int iData;
  if (cert->isEmpty()){
    callback(@[[@"Cert cannot be empty.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  if ((iData = i2d_X509(cert->internal(), NULL)) <= 0) {
    callback(@[[@"Error i2d_X509.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  if (NULL == (pData = (unsigned char*)OPENSSL_malloc(iData))) {
    callback(@[[@"Error malloc.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  p = pData;
  if ((iData = i2d_X509(cert->internal(), &p)) <= 0) {
    callback(@[[@"Error i2d_X509.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  if (NULL == (pUserCert_new = CertCreateCertificateContext(X509_ASN_ENCODING | PKCS_7_ASN_ENCODING, pData, iData))) {
    callback(@[[@"CertCreateCertificateContext() failed.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  OPENSSL_free(pData);
  
  pUserCert = CertFindCertificateInStore(hCertStore, X509_ASN_ENCODING | PKCS_7_ASN_ENCODING, NULL, CERT_FIND_EXISTING, pUserCert_new, NULL);
  if (!pUserCert){
    callback(@[[@"No find exiting certificates.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  DWORD dwSize = 0;
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
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  // obtain file size:
  fseek(Encryption_Param, 0, SEEK_END);
  cbEncryptionParamSetStandart = sizeof(char)*ftell(Encryption_Param);
  rewind(Encryption_Param);
  // allocate memory to contain the whole file:
  pbEncryptionParamSetStandart = (BYTE*)malloc(cbEncryptionParamSetStandart);
  if (pbEncryptionParamSetStandart == NULL){
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }

  // copy the file into the buffer:
  dwBytesRead = (DWORD)fread(pbEncryptionParamSetStandart, 1, cbEncryptionParamSetStandart, Encryption_Param);
  if (dwBytesRead != cbEncryptionParamSetStandart){
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  cbBlobLenSimple = cbEncryptionParamSetStandart;
  cbBlobLenSimple += (sizeof(CRYPT_SIMPLEBLOB_HEADER)+SEANCE_VECTOR_LEN + G28147_KEYLEN + EXPORT_IMIT_SIZE);// +sizeof(pbEncryptionParamSetStandart);
  pbKeyBlobSimple = (BYTE *)malloc(cbBlobLenSimple);
  if(!pbKeyBlobSimple){
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  memcpy(&((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->tSimpleBlobHeader, &tSimpleBlobHeaderStandart, sizeof(CRYPT_SIMPLEBLOB_HEADER));
  
  dwBytesRead = (DWORD)fread(((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bSV, 1, SEANCE_VECTOR_LEN, session_SV);
  if(!dwBytesRead){
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  printf( "The session key was read from the 'session_SV.bin'\n" );
  
  dwBytesRead = (DWORD)fread(((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bEncryptedKey, 1, G28147_KEYLEN, session_EncryptedKey);
  if(!dwBytesRead){
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  printf( "The session key was read from the 'session_EncryptedKey.bin'\n" );
  
  memcpy(((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bEncryptionParamSet, pbEncryptionParamSetStandart, cbEncryptionParamSetStandart);
  
  dwBytesRead = (DWORD)fread(((CRYPT_SIMPLEBLOB*)pbKeyBlobSimple)->bMacKey, 1, EXPORT_IMIT_SIZE, session_MacKey);
  if(!dwBytesRead){
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  printf( "The session key was read from the 'session_MacKey.bin'\n" );
  
  HCRYPTKEY hPubKey;
  if (CryptImportPublicKeyInfoEx(hProv, X509_ASN_ENCODING | PKCS_7_ASN_ENCODING, &(pUserCert->pCertInfo->SubjectPublicKeyInfo), 0, 0, NULL, &hPubKey)) {
    printf("Public key imported from cert file\n");
  } else {
    CertFreeCertificateContext(pUserCert);
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  CertFreeCertificateContext(pUserCert);
  
  if (CryptExportKey(hPubKey, 0, PUBLICKEYBLOB, 0, pbKeyBlob, &dwBlobLen)) {
    printf("Public key exported to blob\n");
  }
  else {
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  //LoadPublicKey(pbKeyBlob, &dwBlobLen, "Sender.cer", "Sender.pub");
  
  if(CryptGetUserKey(hProv, AT_KEYEXCHANGE, &hKey)) {
    printf("The private key has been acquired. \n");
  }
  else{
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if(CryptImportKey(hProv, pbKeyBlob, dwBlobLen, hKey, 0, &hAgreeKey)) {
    printf("The sender public key has been imported. \n");
  }
  else {
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if(CryptSetKeyParam(hAgreeKey, KP_ALGID, (LPBYTE)&ke_alg, 0)) {
    printf("PRO12_EXPORT agree key algorithm has been set. \n");
  }
  else {
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if(CryptImportKey(hProv, pbKeyBlobSimple, cbBlobLenSimple, hAgreeKey, 0, &hSessionKey)) {
    printf("The session key has been imported. \n");
  }
  else {
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if(!CryptSetKeyParam( hSessionKey, KP_IV, pbIV, 0)) {
    callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
    return;
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
          callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
          return;
        }
      }
      else {
        callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
        return;
      }
    }
    else {
      callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
      return;
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
  
  callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
}

@end
