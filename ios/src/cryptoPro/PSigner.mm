#include "PSigner.h"

@implementation PSigner

RCT_EXPORT_MODULE();
//THROW_EXCEPTION(0, PSigner, NULL, "CertDeleteCertificateFromStore failed: Code: %d", CSP_GetLastError());
RCT_EXPORT_METHOD(signFile: (NSString *)serialNumber: (NSString *)category: (NSString *)inputFile: (NSString *)outputFile: (RCTResponseSenderBlock)callback) {
  try{
    char *outfile = (char *) [outputFile UTF8String];

    CRYPT_SIGN_MESSAGE_PARA stSignMessagePara;
    DWORD MessageSizeArray[1];
    const BYTE *MessageArray[1];
    
    DWORD dwSignatureSize = 0;
    BYTE *pbSignatureData = NULL;
    
    BYTE *mem_tbs = NULL;
    DWORD mem_len = 0;
    mem_tbs = readFile(inputFile, mem_len);
    
    CSP_BOOL bResult = FALSE;
    CRYPT_KEY_PROV_INFO *pProvInfo = NULL;
    HCRYPTPROV hCryptProv = 0;
    ALG_ID hash_alg_id = 0;
    DWORD dwSize;
    DWORD keytype = 0;
    CSP_BOOL should_release_ctx = FALSE;
    
    PCCERT_CONTEXT pUserCert = NULL;
    pUserCert = findCertInCSPStore(serialNumber, category);
    
    bResult = CertGetCertificateContextProperty(pUserCert, CERT_KEY_PROV_INFO_PROP_ID, NULL, &dwSize);
    if (bResult) {
      free(pProvInfo);
      pProvInfo = (CRYPT_KEY_PROV_INFO *)malloc(dwSize);
      if (pProvInfo) {
        bResult = CertGetCertificateContextProperty(pUserCert, CERT_KEY_PROV_INFO_PROP_ID, pProvInfo, &dwSize);
      }
    }
    
    if(!bResult){
      THROW_EXCEPTION(0, PSigner, NULL, "No certificates with private key link.");
    }
    
    if (!CryptAcquireCertificatePrivateKey(pUserCert, 0, NULL, &hCryptProv, &keytype, &should_release_ctx)) {
      THROW_EXCEPTION(0, PSigner, NULL, "Cryptographic context could not be acquired.");
    }
    
    hash_alg_id = CPCryptGetProviderHashAlgId(hCryptProv, pUserCert->pCertInfo->SubjectPublicKeyInfo.Algorithm.pszObjId);
    
    if (!hash_alg_id){
      THROW_EXCEPTION(0, PSigner, NULL, "Cannot determine hash algorithm.");
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
      THROW_EXCEPTION(0, PSigner, NULL, "Can't sign file.");
    }
    
    pbSignatureData = (BYTE*)malloc(dwSignatureSize * sizeof(BYTE));
    
    if (pbSignatureData == NULL) {
      THROW_EXCEPTION(0, PSigner, NULL, "Can't allocate memory for signature data.");
    }
    
    if (!CryptSignMessage(&stSignMessagePara, TRUE, 1, MessageArray, MessageSizeArray, pbSignatureData, &dwSignatureSize)) {
      THROW_EXCEPTION(0, PSigner, NULL, "Can't sign file.");
    }
    
    if (outfile) {
      FILE *out = NULL;
      out = fopen (outfile, "wb");
      if (out) {
        fwrite (pbSignatureData, dwSignatureSize, 1, out);
        fclose (out);
      }
      else{
        THROW_EXCEPTION(0, PSigner, NULL, "Cannot open out file.");
      }
    }
    
    if (pUserCert) { CertFreeCertificateContext(pUserCert); }
    if (mem_tbs) { free(mem_tbs); }
    if (pbSignatureData) { free(pbSignatureData); }
    
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
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
  try{
    CRYPT_VERIFY_MESSAGE_PARA stVerifyMessagePara;
    DWORD MessageSizeArray[1];
    const BYTE *MessageArray[1];
    
    PCCERT_CONTEXT pSignerCertCtx = NULL;
    
    BYTE *mem_tbs = NULL;
    DWORD mem_len = 0;
    mem_tbs = readFile(inputFile, mem_len);
    
    BYTE *signmem_tbs = NULL;
    DWORD signmem_len = 0;
    signmem_tbs = readFile(signFile, signmem_len);
    
    // Fill structure
    ZeroMemory(&stVerifyMessagePara, sizeof(CRYPT_VERIFY_MESSAGE_PARA));
    stVerifyMessagePara.cbSize = sizeof(CRYPT_VERIFY_MESSAGE_PARA);
    stVerifyMessagePara.dwMsgAndCertEncodingType = X509_ASN_ENCODING | PKCS_7_ASN_ENCODING;
    stVerifyMessagePara.pfnGetSignerCertificate = NULL;
    stVerifyMessagePara.pvGetArg = NULL;
    
    MessageArray[0] = mem_tbs;
    MessageSizeArray[0] = mem_len;
    
    if (!CryptVerifyDetachedMessageSignature(&stVerifyMessagePara, 0, signmem_tbs, signmem_len, 1, MessageArray, MessageSizeArray, &pSignerCertCtx)) {
      THROW_EXCEPTION(0, PSigner, NULL, "Verify file's signature failed.");
    }
    else {
      DWORD errCode=0;
      bool err=VerifyCertificate(pSignerCertCtx,&errCode);
      if (err) {
        THROW_EXCEPTION(0, PSigner, NULL, "Subject cert verification failed.");
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
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(attachSignFile: (NSString *)serialNumber: (NSString *)category: (NSString *)inputFile: (NSString *)signFile: (RCTResponseSenderBlock)callback){
  try{
    static DWORD cbEncodedBlob;
    static BYTE *pbEncodedBlob = NULL;
    
    //считать данные из файла в байты
    BYTE *pbContent = NULL;
    DWORD cbContent = 0;
    pbContent = readFile(inputFile, cbContent);
    
    //найти сертификат и проверить наличие у него закрытого ключа
    PCCERT_CONTEXT pUserCert = NULL;
    pUserCert = findCertInCSPStore(serialNumber, category);
    
    HCRYPTPROV hCryptProv;
    DWORD keyType = AT_KEYEXCHANGE;
    CSP_BOOL bReleaseContext;
    //получение приватного ключа
    if (!CryptAcquireCertificatePrivateKey(pUserCert, 0, NULL, &hCryptProv, &keyType, &bReleaseContext)){
      THROW_EXCEPTION(0, PSigner, NULL, "Cannot acquire the certificate private key.");
    }
    
    CRYPT_ALGORITHM_IDENTIFIER hashAlgorithm;
    memset(&hashAlgorithm, 0, sizeof(hashAlgorithm));
    
    HCRYPTKEY hKey;
    ALG_ID key_algid;
    DWORD dwAlgidLen = sizeof(ALG_ID);
    LPCSTR hash_oid = NULL;
    if (!CryptGetUserKey(hCryptProv, keyType, &hKey)){
      THROW_EXCEPTION(0, PSigner, NULL, "CryptGetUserKey failed: Code: %d", CSP_GetLastError());
    }
    if (!CryptGetKeyParam(hKey, KP_ALGID, (BYTE *)&key_algid, &dwAlgidLen, 0)){
      THROW_EXCEPTION(0, PSigner, NULL, "CryptGetKeyParam failed: Code: %d", CSP_GetLastError());
    }
    switch (key_algid) {
      case CALG_DH_EL_SF:
      case CALG_GR3410EL:
        hash_oid = szOID_CP_GOST_R3411;
        break;
      case CALG_DH_GR3410_12_256_SF:
      case CALG_GR3410_12_256:
        hash_oid = szOID_CP_GOST_R3411_12_256;
        break;
      case CALG_DH_GR3410_12_512_SF:
      case CALG_GR3410_12_512:
        hash_oid = szOID_CP_GOST_R3411_12_512;
        break;
      default:
        break;
    }
    if (!CryptDestroyKey(hKey)){
      THROW_EXCEPTION(0, PSigner, NULL, "CryptDestroyKey failed: Code: %d", CSP_GetLastError());
    }
    hashAlgorithm.pszObjId = (LPSTR)hash_oid;
    
    CMSG_SIGNER_ENCODE_INFO signerEncodeInfo;
    memset(&signerEncodeInfo, 0, sizeof(CMSG_SIGNER_ENCODE_INFO));
    signerEncodeInfo.cbSize = sizeof(CMSG_SIGNER_ENCODE_INFO);
    signerEncodeInfo.pCertInfo = pUserCert->pCertInfo;
    signerEncodeInfo.hCryptProv = hCryptProv;
    signerEncodeInfo.dwKeySpec = keyType;
    signerEncodeInfo.HashAlgorithm = hashAlgorithm;
    signerEncodeInfo.pvHashAuxInfo = NULL;
    
    CMSG_SIGNER_ENCODE_INFO SignerEncodeInfoArray[1];
    SignerEncodeInfoArray[0] = signerEncodeInfo;
    
    CMSG_SIGNED_ENCODE_INFO SignedMsgEncodeInfo;
    memset(&SignedMsgEncodeInfo, 0, sizeof(CMSG_SIGNED_ENCODE_INFO));
    SignedMsgEncodeInfo.cbSize = sizeof(CMSG_SIGNED_ENCODE_INFO);
    SignedMsgEncodeInfo.cSigners = 1;
    SignedMsgEncodeInfo.rgSigners = SignerEncodeInfoArray;
    SignedMsgEncodeInfo.cCertEncoded = 0;
    SignedMsgEncodeInfo.rgCertEncoded = NULL;
    SignedMsgEncodeInfo.rgCrlEncoded = NULL;
    //создание дескриптора сообщения
    HCRYPTMSG hMsg = CryptMsgOpenToEncode(TYPE_DER, 0, CMSG_SIGNED, &SignedMsgEncodeInfo, NULL, NULL);
    if(!hMsg){
      THROW_EXCEPTION(0, PSigner, NULL, "CryptMsgOpenToEncode failed: Code: %d", CSP_GetLastError());
    }
    
    if(!CryptMsgUpdate(hMsg, pbContent, cbContent, TRUE)){
      THROW_EXCEPTION(0, PSigner, NULL, "CryptMsgUpdate failed: Code: %d", CSP_GetLastError());
    }
    //определение длины подписанного сообщения
    if(!CryptMsgGetParam(hMsg, CMSG_CONTENT_PARAM, 0, NULL, &cbEncodedBlob)){
      THROW_EXCEPTION(0, PSigner, NULL, "CryptMsgGetParam failed: Code: %d", CSP_GetLastError());
    }
    
    pbEncodedBlob = (BYTE *)malloc(cbEncodedBlob);
    if(!pbEncodedBlob){
      THROW_EXCEPTION(0, PSigner, NULL, "malloc failed.");
    }
    //подписание сообщения
    if(!CryptMsgGetParam(hMsg, CMSG_CONTENT_PARAM, 0, pbEncodedBlob, &cbEncodedBlob)){
      THROW_EXCEPTION(0, PSigner, NULL, "CryptMsgGetParam failed: Code: %d", CSP_GetLastError());
    }
    //освобождение ресурсов
    CryptMsgClose(hMsg);
    if(bReleaseContext)
      CryptReleaseContext(hCryptProv, 0);
    CertFreeCertificateContext(pUserCert);
    //запись в файл подписанного сообщения
    char *outfile = (char *) [signFile UTF8String];
    if (outfile) {
      FILE *out = NULL;
      out = fopen (outfile, "wb");
      if (out) {
        fwrite (pbEncodedBlob, cbEncodedBlob, 1, out);
        fclose (out);
      }
      else{
        THROW_EXCEPTION(0, PSigner, NULL, "Cannot open out file.");
      }
    }
    
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(verifyAttachSignFile: (NSString *)serialNumber: (NSString *)category: (NSString *)signFile: (RCTResponseSenderBlock)callback){
  try{
    //найти сертификат и проверить наличие у него закрытого ключа
    PCCERT_CONTEXT pUserCert = NULL;
    pUserCert = findCertInCSPStore(serialNumber, category);
    
    //считать данные из файла в байты
    BYTE *pbEncodedBlob = NULL;
    DWORD cbEncodedBlob = 0;
    pbEncodedBlob = readFile(signFile, cbEncodedBlob);
    
    HCRYPTPROV hCryptProv;
    if(!CryptAcquireContext(&hCryptProv, NULL, NULL, PROV_GOST_2012_256, CRYPT_VERIFYCONTEXT)){
      THROW_EXCEPTION(0, PSigner, NULL, "Cryptographic context could not be acquired.");
    }
    
    HCRYPTMSG hMsg = CryptMsgOpenToDecode(TYPE_DER, CMSG_CRYPT_RELEASE_CONTEXT_FLAG, 0, hCryptProv, NULL, NULL);
    if(!hMsg){
      THROW_EXCEPTION(0, PSigner, NULL, "OpenToDecode failed.");
    }
    //промещение в сообщение проверяемых данных
    BOOL bResult = CryptMsgUpdate(hMsg, pbEncodedBlob, cbEncodedBlob, TRUE);
    if(!bResult){
      THROW_EXCEPTION(0, PSigner, NULL, "Decode MsgUpdate failed.");
    }
    free(pbEncodedBlob);
    //определение длины подписываемых данных
    DWORD cbDecoded;
    bResult = CryptMsgGetParam(hMsg, CMSG_CONTENT_PARAM, 0, NULL, &cbDecoded);
    if(!bResult){
      THROW_EXCEPTION(0, PSigner, NULL, "Decode CMSG_CONTENT_PARAM failed.");
    }
    //получение подписанных данных
    std::vector<BYTE> pbDecoded(cbDecoded);
    bResult = CryptMsgGetParam(hMsg, CMSG_CONTENT_PARAM, 0, &pbDecoded[0], &cbDecoded);
    if(!bResult){
      THROW_EXCEPTION(0, PSigner, NULL, "Decode CMSG_CONTENT_PARAM #2 failed.");
    }
    
    HCERTSTORE hStoreHandleM = CertOpenStore(CERT_STORE_PROV_MEMORY, TYPE_DER, 0, CERT_STORE_CREATE_NEW_FLAG, NULL);
    if (!hStoreHandleM){
      THROW_EXCEPTION(0, PSigner, NULL, "Cannot create temporary store in memory.");
    }
    //добавление сертификата
    bResult = CertAddCertificateContextToStore(hStoreHandleM, pUserCert, CERT_STORE_ADD_ALWAYS, NULL);
    if (!bResult){
      THROW_EXCEPTION(0, PSigner, NULL, "Cannot add user certificate to store.");
    }
    
    PCERT_INFO pSignerCertInfo = pUserCert->pCertInfo;
    
    PCCERT_CONTEXT pSignerCertContext = CertGetSubjectCertificateFromStore(hStoreHandleM, TYPE_DER, pSignerCertInfo);
    if(!pSignerCertContext){
      THROW_EXCEPTION(0, PSigner, NULL, "Verify GetSubjectCert failed.");
    }
    
    //проверка подписи сообщения
    PCERT_INFO pSignerCertificateInfo = pSignerCertContext->pCertInfo;
    bResult = CryptMsgControl(hMsg, 0, CMSG_CTRL_VERIFY_SIGNATURE, pSignerCertificateInfo);
    // освобождение памяти
    CertFreeCertificateContext(pSignerCertContext);
    CertFreeCertificateContext(pUserCert);
    CertCloseStore(hStoreHandleM, CERT_CLOSE_STORE_CHECK_FLAG);
    CryptMsgClose(hMsg);
    if(bResult){
      callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
      return;
    }
    else{
      THROW_EXCEPTION(0, PSigner, NULL, "The signature was NOT VERIFIED.");
    }
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

@end
  
