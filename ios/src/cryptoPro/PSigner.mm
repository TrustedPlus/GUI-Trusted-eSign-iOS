#include "PSigner.h"
#include "../globalHelper.h"

@implementation PSigner

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(signFile: (NSString *)issuerName: (NSString *)serialNumber: (NSString *)inputFile: (NSString *)outputFile: (RCTResponseSenderBlock)callback) {
  char *pIssuerName = (char *) [issuerName UTF8String];
  char *pSerialNumber = (char *) [serialNumber UTF8String];
  
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
  if (!tbs) { fprintf (stderr, "Cannot open input file\n"); }
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
  ALG_ID hash_alg_id = 0;
  DWORD dwSize;
  DWORD keytype = 0;
  CSP_BOOL should_release_ctx = FALSE;
    
  hCertStore = CertOpenSystemStore(0, "My");
  if(!hCertStore){
    ret = CSP_GetLastError();
    fprintf (stderr, "CertOpenSystemStore failed.");
    goto err;
  }
    
  while( !bResult){
    pUserCert= CertEnumCertificatesInStore(hCertStore, pUserCert);
    if(!pUserCert){ break; }
    
    X509 *cert =NULL;
    const unsigned char *p;
    p = pUserCert->pbCertEncoded;
    if (!(cert = d2i_X509(NULL, &p, pUserCert->cbCertEncoded))){
      throw new std::string("'d2i_X509' Error decode len bytes");
    }
    //i2d_X509(<#X509 *a#>, <#unsigned char **out#>)
    //TrustedHandle<Certificate> ->internal() <->x509
    TrustedHandle<Certificate> hcert = new Certificate(cert);
    std::string str_1 = hcert->getIssuerName()->c_str();
    std::string str_2 = hcert->getSerialNumber()->c_str();
    if ((str_1 == pIssuerName) && (str_2 == pSerialNumber)){
      bResult = CertGetCertificateContextProperty(pUserCert, CERT_KEY_PROV_INFO_PROP_ID, NULL, &dwSize);
      if (bResult) {
        free(pProvInfo);
        pProvInfo = (CRYPT_KEY_PROV_INFO *)malloc(dwSize);
        if (pProvInfo) {
          bResult = CertGetCertificateContextProperty(pUserCert, CERT_KEY_PROV_INFO_PROP_ID, pProvInfo, &dwSize);
        }
      }
    }
  }
  if(!bResult){
    fprintf (stderr, "No certificates with private key link.");
    goto err;
  }
    
  if (! infile) {
    fprintf (stderr, "No input file was specified\n");
    goto err;
  }
    
  if (CryptAcquireCertificatePrivateKey(pUserCert, 0, NULL, &hCryptProv, &keytype, &should_release_ctx)) {
    printf("A CSP has been acquired. \n");
  }
  else {
    ret = CSP_GetLastError();
    fprintf (stderr, "Cryptographic context could not be acquired.");
    goto err;
  }
    
  hash_alg_id = CPCryptGetProviderHashAlgId(hCryptProv, pUserCert->pCertInfo->SubjectPublicKeyInfo.Algorithm.pszObjId);
    
  if (!hash_alg_id)
  {
    ret = CSP_GetLastError();
    fprintf (stderr, "Cannot determine hash algorithm.");
    goto err;
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
    ret = CSP_GetLastError();//(_TEXT("Can't sign file '%s'.\n"), szFile);
  }
    
  pbSignatureData = (BYTE*)malloc(dwSignatureSize * sizeof(BYTE));
    
  if (pbSignatureData == NULL) {
    ret = CSP_GetLastError();//(_TEXT("Can't allocate memory for signature data.\n"));
  }
    
  if (!CryptSignMessage(&stSignMessagePara, TRUE, 1, MessageArray, MessageSizeArray, pbSignatureData, &dwSignatureSize)) {
    ret = CSP_GetLastError();//(_TEXT("Can't sign file '%s'.\n"), szFile);
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
    else
      perror ("Cannot open out file\n");
  }
    
  err:
    if (pUserCert) { CertFreeCertificateContext(pUserCert); }
    if (mem_tbs) { free(mem_tbs); }
    if (pbSignatureData) { free(pbSignatureData); }
  
  callback(@[[NSNull null], [NSNumber numberWithInt: ret]]);
}

DWORD VerifyCertificate(PCCERT_CONTEXT pCert,DWORD *CheckResult)
{
  CERT_CHAIN_PARA ChainPara;
  PCCERT_CHAIN_CONTEXT Chain=NULL;
  
  ChainPara.cbSize=sizeof(ChainPara);
  ChainPara.RequestedUsage.dwType=USAGE_MATCH_TYPE_AND;
  ChainPara.RequestedUsage.Usage.cUsageIdentifier=0;
  ChainPara.RequestedUsage.Usage.rgpszUsageIdentifier=NULL;
  //ChainPara.RequestedIssuancePolicy=NULL;
  //ChainPara.fCheckRevocationFreshnessTime=FALSE;
  //ChainPara.dwUrlRetrievalTimeout=0;
  
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
    fprintf (stderr, "Cannot open input file\n");
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
    fprintf (stderr, "Cannot open input file\n");
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
  DWORD ret = 0;
  
  // Fill structure
  ZeroMemory(&stVerifyMessagePara, sizeof(CRYPT_VERIFY_MESSAGE_PARA));
  stVerifyMessagePara.cbSize = sizeof(CRYPT_VERIFY_MESSAGE_PARA);
  stVerifyMessagePara.dwMsgAndCertEncodingType = X509_ASN_ENCODING | PKCS_7_ASN_ENCODING;
  stVerifyMessagePara.pfnGetSignerCertificate = NULL;
  stVerifyMessagePara.pvGetArg = NULL;
  
  MessageArray[0] = mem_tbs;
  MessageSizeArray[0] = mem_len;
  
  if (!CryptVerifyDetachedMessageSignature(&stVerifyMessagePara, 0, signmem_tbs, signmem_len, 1, MessageArray, MessageSizeArray, &pSignerCertCtx)) {
    ret = CSP_GetLastError();//(_TEXT("Verify file's '%s' signature failed.\n"), szFile);
  }
  else {
    DWORD errCode=0;
    bool err=VerifyCertificate(pSignerCertCtx,&errCode);
    if (err) {
      printf("Subject cert verification failed: err=%x\n",err);
      callback(@[[NSNull null], [NSNumber numberWithInt: ret]]);
    }
    /*if (errCode)
     {
     printf("Subject cert BAD: errCode=%x\n",errCode);
     return errCode;
     }*/
    ret = 0;
  }
err:
  if (mem_tbs) { free(mem_tbs); }
  if (signmem_tbs) { free(signmem_tbs); }
  
  callback(@[[NSNull null], [NSNumber numberWithInt: ret]]);
}


RCT_EXPORT_METHOD(attachSign: (NSString *)inputFile: (NSString *)outputFile: (RCTResponseSenderBlock)callback) {
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
  if (!tbs) { fprintf (stderr, "Cannot open input file\n"); }
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
  DWORD ret = 0;
  HCRYPTPROV hCryptProv = 0;               // CSP handle
  PCCERT_CONTEXT pUserCert = NULL;        // User certificate to be used
  ALG_ID hash_alg_id = 0;
  DWORD dwSize;
  DWORD keytype = 0;
  CSP_BOOL should_release_ctx = FALSE;
  
  hCertStore = CertOpenSystemStore(0, "My");
  if(!hCertStore){
    ret = CSP_GetLastError();
    fprintf (stderr, "CertOpenSystemStore failed.");
    goto err;
  }
  
  while( !bResult){
    pUserCert= CertEnumCertificatesInStore(hCertStore, pUserCert);
    if(!pUserCert){ break; }
    bResult = CertGetCertificateContextProperty(pUserCert, CERT_KEY_PROV_INFO_PROP_ID, NULL, &dwSize);
    if (bResult) {
      free(pProvInfo);
      pProvInfo = (CRYPT_KEY_PROV_INFO *)malloc(dwSize);
      if (pProvInfo) {
        bResult = CertGetCertificateContextProperty(pUserCert, CERT_KEY_PROV_INFO_PROP_ID, pProvInfo, &dwSize);
      }
    }
  }
  if(!bResult){
    fprintf (stderr, "No certificates with private key link.");
    goto err;
  }
  
  if (! infile) {
    fprintf (stderr, "No input file was specified\n");
    goto err;
  }
  
  if (CryptAcquireCertificatePrivateKey(pUserCert, 0, NULL, &hCryptProv, &keytype, &should_release_ctx)) {
    printf("A CSP has been acquired. \n");
  }
  else {
    ret = CSP_GetLastError();
    fprintf (stderr, "Cryptographic context could not be acquired.");
    goto err;
  }
  
  hash_alg_id = CPCryptGetProviderHashAlgId(hCryptProv, pUserCert->pCertInfo->SubjectPublicKeyInfo.Algorithm.pszObjId);
  
  if (!hash_alg_id) {
    ret = CSP_GetLastError();
    fprintf (stderr, "Cannot determine hash algorithm.");
    goto err;
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
    ret = CSP_GetLastError();//(_TEXT("Can't sign file '%s'.\n"), szFile);
  }
  
  pbSignatureData = (BYTE*)malloc(dwSignatureSize * sizeof(BYTE));
  
  if (pbSignatureData == NULL) {
    ret = CSP_GetLastError();//(_TEXT("Can't allocate memory for signature data.\n"));
  }
  
  if (!CryptSignMessage(&stSignMessagePara, FALSE, 1, MessageArray, MessageSizeArray, pbSignatureData, &dwSignatureSize)) {
    ret = CSP_GetLastError();//(_TEXT("Can't sign file '%s'.\n"), szFile);
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
    else
      perror ("Cannot open out file\n");
  }
  
err:
  if (pUserCert) { CertFreeCertificateContext(pUserCert); }
  if (mem_tbs) { free(mem_tbs); }
  if (pbSignatureData) { free(pbSignatureData); }
  
  callback(@[[NSNull null], [NSNumber numberWithInt: ret]]);
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
    fprintf (stderr, "Cannot open input file\n");
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
  DWORD ret = 0;
  
  // Fill structure
  ZeroMemory(&stVerifyMessagePara, sizeof(CRYPT_VERIFY_MESSAGE_PARA));
  stVerifyMessagePara.cbSize = sizeof(CRYPT_VERIFY_MESSAGE_PARA);
  stVerifyMessagePara.dwMsgAndCertEncodingType = X509_ASN_ENCODING | PKCS_7_ASN_ENCODING;
  stVerifyMessagePara.pfnGetSignerCertificate = NULL;
  stVerifyMessagePara.pvGetArg = NULL;
  
  BYTE *pbDecodedMessageBlob = NULL;
  DWORD cbDecodedMessageBlob = 0;
  
  if (!CryptVerifyMessageSignature(&stVerifyMessagePara, 0, signmem_tbs, signmem_len, pbDecodedMessageBlob, &cbDecodedMessageBlob,  &pSignerCertCtx)) {
    ret = CSP_GetLastError();//(_TEXT("Verify file's '%s' signature failed.\n"), szFile);
  }
  else {
    pbDecodedMessageBlob = new BYTE[cbDecodedMessageBlob];
    if (!CryptVerifyMessageSignature(&stVerifyMessagePara, 0, signmem_tbs, signmem_len, pbDecodedMessageBlob, &cbDecodedMessageBlob,  &pSignerCertCtx)) {
      ret = CSP_GetLastError();//(_TEXT("Verify file's '%s' signature failed.\n"), szFile);
      goto err;
    }
    DWORD errCode=0;
    bool err=VerifyCertificate(pSignerCertCtx,&errCode);
    if (err){
      printf("Subject cert verification failed: err=%x\n",err);
      callback(@[[NSNull null], [NSNumber numberWithInt: ret]]);
    }
    /*if (errCode)
     {
     printf("Subject cert BAD: errCode=%x\n",errCode);
     return errCode;
     }*/
    ret = 0;
  }
err:
  if (signmem_tbs) { free(signmem_tbs);}
  
  callback(@[[NSNull null], [NSNumber numberWithInt: ret]]);
}

@end
  
