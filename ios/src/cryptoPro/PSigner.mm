#include "PSigner.h"

@implementation PSigner

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(signFile: (NSString *)serialNumber: (NSString *)category: (NSString *)inputFile: (NSString *)outputFile: (RCTResponseSenderBlock)callback) {
  char *pSerialNumber = (char *) [serialNumber UTF8String];
  char *pCategory = (char *) [category UTF8String];
  
  char *infile = (char *) [inputFile UTF8String];
  char *outfile = (char *) [outputFile UTF8String];

  CRYPT_SIGN_MESSAGE_PARA stSignMessagePara;
  DWORD MessageSizeArray[1];
  const BYTE *MessageArray[1];
  
  DWORD dwSignatureSize = 0;
  BYTE *pbSignatureData = NULL;
  
  FILE *tbs = NULL;
  BYTE *mem_tbs = NULL;
  DWORD mem_len = 0;
  //read input file
  tbs = fopen (infile, "rb");
  if (!tbs) {
    callback(@[[@"Cannot open input file\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  mem_len = 0;
  while (!feof(tbs)) {
    int r = 0;
    BYTE tmp[1024];
    r = fread(tmp, 1, 1024, tbs);
    mem_tbs = (BYTE *)realloc(mem_tbs, mem_len+r);
    memcpy (&mem_tbs[mem_len], tmp, r);
    mem_len += r;
  }
  fclose (tbs);
  tbs = NULL;
  
  CSP_BOOL bResult = FALSE;
  CRYPT_KEY_PROV_INFO *pProvInfo = NULL;
  HCERTSTORE hCertStore = 0;
  DWORD ret = 0;
  HCRYPTPROV hCryptProv = 0;               // CSP handle
  PCCERT_CONTEXT pUserCert = NULL;        // User certificate to be used
  PCCERT_CONTEXT pUserCert_new = NULL;
  ALG_ID hash_alg_id = 0;
  DWORD dwSize;
  DWORD keytype = 0;
  CSP_BOOL should_release_ctx = FALSE;
    
  hCertStore = CertOpenSystemStore(0, pCategory);
  if(!hCertStore){
    callback(@[[@"CertOpenSystemStore failed.\n" copy], [NSNumber numberWithInt: 0]]);
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
  
  bResult = CertGetCertificateContextProperty(pUserCert, CERT_KEY_PROV_INFO_PROP_ID, NULL, &dwSize);
  if (bResult) {
    free(pProvInfo);
    pProvInfo = (CRYPT_KEY_PROV_INFO *)malloc(dwSize);
    if (pProvInfo) {
      bResult = CertGetCertificateContextProperty(pUserCert, CERT_KEY_PROV_INFO_PROP_ID, pProvInfo, &dwSize);
    }
  }
  
  if(!bResult){
    callback(@[[@"No certificates with private key link.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
    
  if (! infile){
    callback(@[[@"No input file was specified.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
    
  if (CryptAcquireCertificatePrivateKey(pUserCert, 0, NULL, &hCryptProv, &keytype, &should_release_ctx)) {
    printf("A CSP has been acquired. \n");
  }
  else {
    callback(@[[@"Cryptographic context could not be acquired.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
    
  hash_alg_id = CPCryptGetProviderHashAlgId(hCryptProv, pUserCert->pCertInfo->SubjectPublicKeyInfo.Algorithm.pszObjId);
    
  if (!hash_alg_id){
    callback(@[[@"Cannot determine hash algorithm.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
    
  // Fill CRYPT_SIGN_MESSAGE_PARA structure
  ZeroMemory(&stSignMessagePara, sizeof(CRYPT_SIGN_MESSAGE_PARA));
  stSignMessagePara.cbSize = sizeof(CRYPT_SIGN_MESSAGE_PARA);
  stSignMessagePara.dwMsgEncodingType = X509_ASN_ENCODING | PKCS_7_ASN_ENCODING;
  stSignMessagePara.pSigningCert = pUserCert;
  stSignMessagePara.HashAlgorithm.pszObjId = (LPSTR)CertAlgIdToOID(hash_alg_id);
  stSignMessagePara.rgpMsgCert = &pUserCert;
  stSignMessagePara.cMsgCert = 1;
    
  MessageArray[0] = mem_tbs;
  MessageSizeArray[0] = mem_len;
  //CryptSignMessage: parameter true - detached signature, false - not detached signature
  if (!CryptSignMessage(&stSignMessagePara, TRUE, 1, MessageArray, MessageSizeArray, NULL, &dwSignatureSize)) {
    callback(@[[@"Can't sign file.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
    
  pbSignatureData = (BYTE*)malloc(dwSignatureSize * sizeof(BYTE));
    
  if (pbSignatureData == NULL) {
    callback(@[[@"Can't allocate memory for signature data.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
    
  if (!CryptSignMessage(&stSignMessagePara, TRUE, 1, MessageArray, MessageSizeArray, pbSignatureData, &dwSignatureSize)) {
    callback(@[[@"Can't sign file.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  else {
    _tprintf(_TEXT("File '%s' successfully signed.\n"), infile);
  }
    
  if (outfile) {
    FILE *out = NULL;
    out = fopen (outfile, "wb");
    if (out) {
      fwrite (pbSignatureData, dwSignatureSize, 1, out);
      fclose (out);
      printf ("Output file (%s) has been saved\n", outfile);
    }
    else{
      callback(@[[@"Cannot open out file.\n" copy], [NSNumber numberWithInt: 0]]);
      return;
    }
  }
  
  if (pUserCert) { CertFreeCertificateContext(pUserCert); }
  if (mem_tbs) { free(mem_tbs); }
  if (pbSignatureData) { free(pbSignatureData); }
  
  callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
}

DWORD VerifyCertificate(PCCERT_CONTEXT pCert,DWORD *CheckResult)
{
  CERT_CHAIN_PARA ChainPara;
  PCCERT_CHAIN_CONTEXT Chain=NULL;
  
  ChainPara.cbSize=sizeof(ChainPara);
  ChainPara.RequestedUsage.dwType=USAGE_MATCH_TYPE_AND;
  ChainPara.RequestedUsage.Usage.cUsageIdentifier=0;
  ChainPara.RequestedUsage.Usage.rgpszUsageIdentifier=NULL;
  
  if(!CertGetCertificateChain(NULL, pCert, NULL, NULL, &ChainPara, CERT_CHAIN_REVOCATION_CHECK_CHAIN_EXCLUDE_ROOT, NULL, &Chain))
    return CSP_GetLastError();
  *CheckResult=Chain->TrustStatus.dwErrorStatus;
  if(Chain)
    CertFreeCertificateChain(Chain);
  return 0;
}

RCT_EXPORT_METHOD(verifySign: (NSString *)inputFile: (NSString *)signFile: (RCTResponseSenderBlock)callback) {
  char *infile = (char *) [inputFile UTF8String];
  char *signfile = (char *) [signFile UTF8String];
  
  CRYPT_VERIFY_MESSAGE_PARA stVerifyMessagePara;
  DWORD MessageSizeArray[1];
  const BYTE *MessageArray[1];
  
  PCCERT_CONTEXT pSignerCertCtx = NULL;
  
  FILE *tbs = NULL;
  BYTE *mem_tbs = NULL;
  DWORD mem_len = 0;
  
  tbs = fopen (infile, "rb");
  if (!tbs) {
    callback(@[[@"Cannot open input file.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  mem_len = 0;
  while (!feof(tbs)) {
    int r = 0;
    BYTE tmp[1024];
    r = fread (tmp, 1, 1024, tbs);
    mem_tbs = (BYTE *)realloc (mem_tbs, mem_len+r);
    memcpy (&mem_tbs[mem_len], tmp, r);
    mem_len += r;
  }
  fclose (tbs);
  tbs = NULL;
  
  FILE *signtbs = NULL;
  BYTE *signmem_tbs = NULL;
  DWORD signmem_len = 0;
  
  signtbs = fopen (signfile, "rb");
  if (!signtbs) {
    callback(@[[@"Cannot open signed file.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  signmem_len = 0;
  while (!feof(signtbs)) {
    int r = 0;
    BYTE tmp[1024];
    r = fread (tmp, 1, 1024, signtbs);
    signmem_tbs = (BYTE *)realloc (signmem_tbs, signmem_len+r);
    memcpy (&signmem_tbs[signmem_len], tmp, r);
    signmem_len += r;
  }
  fclose (signtbs);
  signtbs = NULL;
  
  // Fill structure
  ZeroMemory(&stVerifyMessagePara, sizeof(CRYPT_VERIFY_MESSAGE_PARA));
  stVerifyMessagePara.cbSize = sizeof(CRYPT_VERIFY_MESSAGE_PARA);
  stVerifyMessagePara.dwMsgAndCertEncodingType = X509_ASN_ENCODING | PKCS_7_ASN_ENCODING;
  stVerifyMessagePara.pfnGetSignerCertificate = NULL;
  stVerifyMessagePara.pvGetArg = NULL;
  
  MessageArray[0] = mem_tbs;
  MessageSizeArray[0] = mem_len;
  
  if (!CryptVerifyDetachedMessageSignature(&stVerifyMessagePara, 0, signmem_tbs, signmem_len, 1, MessageArray, MessageSizeArray, &pSignerCertCtx)) {
    callback(@[[@"Verify file's signature failed.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  else {
    DWORD errCode=0;
    bool err=VerifyCertificate(pSignerCertCtx,&errCode);
    if (err) {
      callback(@[[@"Subject cert verification failed.\n" copy], [NSNumber numberWithInt: 0]]);
      return;
      //printf("Subject cert verification failed: err=%x\n",err);
    }
    /*if (errCode)
     {
     printf("Subject cert BAD: errCode=%x\n",errCode);
     return errCode;
     }*/
  }

  if (mem_tbs) { free(mem_tbs); }
  if (signmem_tbs) { free(signmem_tbs); }
  
  callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
}


RCT_EXPORT_METHOD(attachSign: (NSString *)serialNumber: (NSString *)category:(NSString *)inputFile: (NSString *)outputFile: (RCTResponseSenderBlock)callback) {
  char *pSerialNumber = (char *) [serialNumber UTF8String];
  char *pCategory = (char *) [category UTF8String];
  
  char *infile = (char *) [inputFile UTF8String];
  char *outfile = (char *) [outputFile UTF8String];
  CRYPT_SIGN_MESSAGE_PARA stSignMessagePara;
  DWORD MessageSizeArray[1];
  const BYTE *MessageArray[1];
  DWORD dwSignatureSize = 0;
  BYTE *pbSignatureData = NULL;
  
  FILE *tbs = NULL;
  BYTE *mem_tbs = NULL;
  DWORD mem_len = 0;
  //read input file
  tbs = fopen (infile, "rb");
  if (!tbs) {
    callback(@[[@"Cannot open input file\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  mem_len = 0;
  while (!feof(tbs)) {
    int r = 0;
    BYTE tmp[1024];
    r = fread (tmp, 1, 1024, tbs);
    mem_tbs = (BYTE *)realloc(mem_tbs, mem_len+r);
    memcpy (&mem_tbs[mem_len], tmp, r);
    mem_len += r;
  }
  fclose (tbs);
  tbs = NULL;
  
  CSP_BOOL bResult = FALSE;
  CRYPT_KEY_PROV_INFO *pProvInfo = NULL;
  HCERTSTORE hCertStore = 0;
  HCRYPTPROV hCryptProv = 0;               // CSP handle
  PCCERT_CONTEXT pUserCert = NULL;        // User certificate to be used
  PCCERT_CONTEXT pUserCert_new = NULL;
  ALG_ID hash_alg_id = 0;
  DWORD dwSize;
  DWORD keytype = 0;
  CSP_BOOL should_release_ctx = FALSE;
  
  hCertStore = CertOpenSystemStore(0, pCategory);
  if(!hCertStore){
    callback(@[[@"CertOpenSystemStore failed.\n" copy], [NSNumber numberWithInt: 0]]);
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
  
  bResult = CertGetCertificateContextProperty(pUserCert, CERT_KEY_PROV_INFO_PROP_ID, NULL, &dwSize);
  if (bResult) {
    free(pProvInfo);
    pProvInfo = (CRYPT_KEY_PROV_INFO *)malloc(dwSize);
    if (pProvInfo) {
      bResult = CertGetCertificateContextProperty(pUserCert, CERT_KEY_PROV_INFO_PROP_ID, pProvInfo, &dwSize);
    }
  }
  
  if(!bResult){
    callback(@[[@"No certificates with private key link.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if (! infile) {
    callback(@[[@"No input file was specified.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if (CryptAcquireCertificatePrivateKey(pUserCert, 0, NULL, &hCryptProv, &keytype, &should_release_ctx)) {
    printf("A CSP has been acquired. \n");
  }
  else {
    callback(@[[@"Cryptographic context could not be acquired.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  hash_alg_id = CPCryptGetProviderHashAlgId(hCryptProv, pUserCert->pCertInfo->SubjectPublicKeyInfo.Algorithm.pszObjId);
  
  if (!hash_alg_id) {
    callback(@[[@"Cannot determine hash algorithm.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  // Fill CRYPT_SIGN_MESSAGE_PARA structure
  ZeroMemory(&stSignMessagePara, sizeof(CRYPT_SIGN_MESSAGE_PARA));
  stSignMessagePara.cbSize = sizeof(CRYPT_SIGN_MESSAGE_PARA);
  stSignMessagePara.dwMsgEncodingType = X509_ASN_ENCODING | PKCS_7_ASN_ENCODING;
  stSignMessagePara.pSigningCert = pUserCert;
  stSignMessagePara.HashAlgorithm.pszObjId = (LPSTR)CertAlgIdToOID(hash_alg_id);
  stSignMessagePara.rgpMsgCert = &pUserCert;
  stSignMessagePara.cMsgCert = 1;
  
  MessageArray[0] = mem_tbs;
  MessageSizeArray[0] = mem_len;
  //CryptSignMessage: parameter true - detached signature, false - not detached signature
  if (!CryptSignMessage(&stSignMessagePara, FALSE, 1, MessageArray, MessageSizeArray, NULL, &dwSignatureSize)) {
    callback(@[[@"Can't sign file.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  pbSignatureData = (BYTE*)malloc(dwSignatureSize * sizeof(BYTE));
  
  if (pbSignatureData == NULL) {
    callback(@[[@"Can't allocate memory for signature data.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if (!CryptSignMessage(&stSignMessagePara, FALSE, 1, MessageArray, MessageSizeArray, pbSignatureData, &dwSignatureSize)) {
    callback(@[[@"Can't sign file.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  else {
    _tprintf(_TEXT("File '%s' successfully signed.\n"), infile);
  }
  
  if (outfile) {
    FILE *out = NULL;
    out = fopen (outfile, "wb");
    if (out) {
      fwrite (pbSignatureData, dwSignatureSize, 1, out);
      fclose (out);
      printf ("Output file (%s) has been saved\n", outfile);
    }
    else{
      callback(@[[@"Cannot open out file.\n" copy], [NSNumber numberWithInt: 0]]);
      return;
    }
  }
  
  if (pUserCert) { CertFreeCertificateContext(pUserCert); }
  if (mem_tbs) { free(mem_tbs); }
  if (pbSignatureData) { free(pbSignatureData); }
  if (hCertStore){ CertCloseStore(hCertStore, 0); hCertStore = HCRYPT_NULL; }
  
  callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
}

RCT_EXPORT_METHOD(verify: (NSString *)inputFile: (RCTResponseSenderBlock)callback) {
  char *signfile = (char *) [inputFile UTF8String];
  
  CRYPT_VERIFY_MESSAGE_PARA stVerifyMessagePara;
  PCCERT_CONTEXT pSignerCertCtx = NULL;
  
  FILE *signtbs = NULL;
  BYTE *signmem_tbs = NULL;
  DWORD signmem_len = 0;
  
  signtbs = fopen (signfile, "rb");
  if (!signtbs) {
    callback(@[[@"Cannot open input file.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  signmem_len = 0;
  while (!feof(signtbs)) {
    int r = 0;
    BYTE tmp[1024];
    r = fread (tmp, 1, 1024, signtbs);
    signmem_tbs = (BYTE *)realloc (signmem_tbs, signmem_len+r);
    memcpy (&signmem_tbs[signmem_len], tmp, r);
    signmem_len += r;
  }
  fclose (signtbs);
  signtbs = NULL;
  
  // Fill structure
  ZeroMemory(&stVerifyMessagePara, sizeof(CRYPT_VERIFY_MESSAGE_PARA));
  stVerifyMessagePara.cbSize = sizeof(CRYPT_VERIFY_MESSAGE_PARA);
  stVerifyMessagePara.dwMsgAndCertEncodingType = X509_ASN_ENCODING | PKCS_7_ASN_ENCODING;
  stVerifyMessagePara.pfnGetSignerCertificate = NULL;
  stVerifyMessagePara.pvGetArg = NULL;
  
  BYTE *pbDecodedMessageBlob = NULL;
  DWORD cbDecodedMessageBlob = 0;
  
  if (!CryptVerifyMessageSignature(&stVerifyMessagePara, 0, signmem_tbs, signmem_len, pbDecodedMessageBlob, &cbDecodedMessageBlob,  &pSignerCertCtx)) {
    callback(@[[@"Verify file's signature failed.\n" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  else {
    pbDecodedMessageBlob = new BYTE[cbDecodedMessageBlob];
    if (!CryptVerifyMessageSignature(&stVerifyMessagePara, 0, signmem_tbs, signmem_len, pbDecodedMessageBlob, &cbDecodedMessageBlob,  &pSignerCertCtx)) {
      callback(@[[@"Verify file's signature failed.\n" copy], [NSNumber numberWithInt: 0]]);
      return;
    }
    DWORD errCode=0;
    bool err=VerifyCertificate(pSignerCertCtx,&errCode);
    if (err){
      callback(@[[@"Subject cert verification failed.\n" copy], [NSNumber numberWithInt: 0]]);
      return;
    }
    /*if (errCode)
     {
     printf("Subject cert BAD: errCode=%x\n",errCode);
     return errCode;
     }*/
  }
  if (signmem_tbs) { free(signmem_tbs);}
  
  callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
}

@end
  
