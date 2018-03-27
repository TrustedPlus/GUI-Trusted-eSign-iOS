#include "PCsp.h"

@implementation PCsp

- (NSMutableArray*) UnloadCertsFromStore{
  NSMutableArray *myArray = [NSMutableArray array];
  g_picCSP = new PkiItemCollection();
  try{
    providerItemCollection = new PkiItemCollection();
    std::string listStore[] = {"My", "AddressBook", "ROOT", "TRUST", "CA", "Request"};
    
    HCERTSTORE hCertStore;
    int c = sizeof(listStore) / sizeof(*listStore);
    
    for (int i = 0; i < c; i++){
      std::wstring widestr = std::wstring(listStore[i].begin(), listStore[i].end());
      hCertStore = CertOpenStore(CERT_STORE_PROV_SYSTEM, PKCS_7_ASN_ENCODING | X509_ASN_ENCODING, NULL, CERT_SYSTEM_STORE_CURRENT_USER, widestr.c_str());
      if(!hCertStore){
        THROW_EXCEPTION(0, PCsp, NULL, "CertOpenSystemStore failed.");
      }
      else{
        X509 *cert =NULL;
        const unsigned char *p;
        PCCERT_CONTEXT pCertContext = NULL;
        DWORD dwSize = 0;
        int res = 0;
        do{
          pCertContext = CertEnumCertificatesInStore(hCertStore, pCertContext);
          if (pCertContext){
            if (CertGetCertificateContextProperty(pCertContext, CERT_KEY_PROV_INFO_PROP_ID, NULL, &dwSize)) {
              res = 1;
            }
            p = pCertContext->pbCertEncoded;
            if (!(cert = d2i_X509(NULL, &p, pCertContext->cbCertEncoded))){
              THROW_EXCEPTION(0, PCsp, NULL, "'d2i_X509' Error decode len bytes");
            }
            TrustedHandle<Certificate> hcert = new Certificate(cert);
            TrustedHandle<PkiItem> item = objectToPKIItem(hcert);
            item->category = new std::string(listStore[i]);
            item->certificate = hcert;
            
            NSMutableDictionary *arrayPropertyCert = [NSMutableDictionary dictionary];
            arrayPropertyCert[@"category"] = @(std::string(listStore[i]).c_str());
            arrayPropertyCert[@"version"] = @(hcert->getVersion() + 1);
            arrayPropertyCert[@"serialNumber"] = @(hcert->getSerialNumber()->c_str());
            arrayPropertyCert[@"notBefore"] = @(hcert->getNotBefore()->c_str());
            arrayPropertyCert[@"notAfter"] = @(hcert->getNotAfter()->c_str());
            arrayPropertyCert[@"issuerFriendlyName"] = @(hcert->getIssuerFriendlyName()->c_str());
            arrayPropertyCert[@"issuerName"] = @(hcert->getIssuerName()->c_str());
            arrayPropertyCert[@"subjectFriendlyName"] = @(hcert->getSubjectFriendlyName()->c_str());
            arrayPropertyCert[@"subjectName"] = @(hcert->getSubjectName()->c_str());
            arrayPropertyCert[@"thumbprint"] = @(hcert->getThumbprint()->c_str());
            arrayPropertyCert[@"publicKeyAlgorithm"] = @(hcert->getPublicKeyAlgorithm()->c_str());
            arrayPropertyCert[@"signatureAlgorithm"] = @(hcert->getSignatureAlgorithm()->c_str());
            arrayPropertyCert[@"signatureDigestAlgorithm"] = @(hcert->getSignatureDigestAlgorithm()->c_str());
            arrayPropertyCert[@"organizationName"] = @(hcert->getOrganizationName()->c_str());
            arrayPropertyCert[@"keyUsage"] = @(hcert->getKeyUsage());
            arrayPropertyCert[@"selfSigned"] = @(hcert->isSelfSigned());
            arrayPropertyCert[@"isCA"] = @(hcert->isCA());
            arrayPropertyCert[@"hasPrivateKey"] = @(res);
            arrayPropertyCert[@"provider"] = @("CRYPTOPRO");
            arrayPropertyCert[@"type"] = @("CERTIFICATE");
            [myArray addObject: arrayPropertyCert];
            
            providerItemCollection->push(item);
            g_picCSP->push(item);
            res = 0;
          }
        } while (pCertContext != NULL);
      }
    }
  }
  catch(Exception ex){
    throw ex;
  }
  catch (TrustedHandle<Exception> e){
    throw e;
  }
  
  return myArray;
}

TrustedHandle<PkiItem> objectToPKIItem(TrustedHandle<Certificate> cert){
  try{
    if (cert.isEmpty()){
      THROW_EXCEPTION(0, ProviderCryptopro, NULL, "Certificate empty");
    }
    TrustedHandle<PkiItem> item = new PkiItem();
    
    item->format = new std::string("DER");
    item->type = new std::string("CERTIFICATE");
    item->provider = new std::string("CRYPTOPRO");
    
    char * hexHash;
    TrustedHandle<std::string> hhash = cert->getThumbprint();
    
    PkiStore::bin_to_strhex((unsigned char *)hhash->c_str(), hhash->length(), &hexHash);
    
    item->hash = new std::string(hexHash);
    
    item->certSubjectName = cert->getSubjectName();
    item->certSubjectFriendlyName = cert->getSubjectFriendlyName();
    item->certIssuerName = cert->getIssuerName();
    item->certIssuerFriendlyName = cert->getIssuerFriendlyName();
    item->certSerial = cert->getSerialNumber();
    item->certOrganizationName = cert->getOrganizationName();
    item->certSignatureAlgorithm = cert->getSignatureAlgorithm();
    item->certSignatureDigestAlgorithm = cert->getSignatureDigestAlgorithm();
    item->certPublicKeyAlgorithm = cert->getPublicKeyAlgorithm();
    
    item->certNotBefore = cert->getNotBefore();
    item->certNotAfter = cert->getNotAfter();
    item->certKey = new std::string("");//без пароля
    
    return item;
  }
  catch (TrustedHandle<Exception> e){
    throw e;
  }
}


RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(enumProviders: (RCTResponseSenderBlock)callback){
  try{
    NSMutableArray *listProviderProps = [NSMutableArray array];
    providerProps.clear();
    DWORD dwIndex = 0;
    DWORD dwType;
    DWORD cbName;
    LPTSTR pszName;
    while (CryptEnumProviders(dwIndex, NULL, 0, &dwType, NULL, &cbName)){
      if (!cbName)
        break;
      
      pszName = (LPTSTR)malloc(cbName);
      
      if (!CryptEnumProviders(dwIndex++, NULL, NULL, &dwType, pszName, &cbName)){
        THROW_EXCEPTION(0, PCsp, NULL, "CryptEnumProviders failed: Code: %d", CSP_GetLastError());
      }
      if (providerProps[(int)dwType] == ""){
        providerProps[(int)dwType] = *new std::string(pszName);
        NSMutableDictionary *arrayPropertyProvider = [NSMutableDictionary dictionary];
        arrayPropertyProvider[@"type"] = @(std::to_string(dwType).c_str());
        arrayPropertyProvider[@"provider"] = @(std::string(pszName).c_str());
        [listProviderProps addObject: arrayPropertyProvider];
      }
    }
    callback(@[[NSNull null], [listProviderProps copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(enumContainers: (NSString *)provType: (NSString *)provName:  (RCTResponseSenderBlock)callback){
  char *pvType = (char *) [provType UTF8String];
  char *pvName = (char *) [provName UTF8String];
  NSMutableArray *listContainers = [NSMutableArray array];
  try{
    int type = atoi(pvType);
    if (providerProps[type] == ""){
      providerProps[type] =  pvName;
    }
    else{
      enumProviders:callback;
    }
    
    if (providerProps.size() <= 0){
      THROW_EXCEPTION(0, PCsp, NULL, "Empty providers list!");
    }
    
    std::map <int, std::string>::iterator cur;
    HCRYPTPROV hProv = 0;
    DWORD cbName;
    DWORD dwFlags = CRYPT_FIRST;
    BYTE* pbData = NULL;
    char* pszContainerName = NULL;
    HCRYPTPROV hProvCont = 0;
    DWORD cbData = 0;
    WCHAR wzContName[MAX_PATH];
    char* containerName = NULL;
    Cont item;
    
    //for (cur = providerProps.begin(); cur !=providerProps.end(); cur++) {
    int provType_i = type;//(*cur).first;
    std::string provName_i = providerProps[type];//(*cur).second;
      
    if (!CryptAcquireContext(&hProv, NULL, (LPCSTR)provName_i.c_str(), (DWORD)provType_i, CRYPT_VERIFYCONTEXT)) {
      THROW_EXCEPTION(0, PCsp, NULL, "CryptAcquireContext failed: Code: %d", CSP_GetLastError());
    }
      
    while (CryptGetProvParam(hProv, PP_ENUMCONTAINERS, NULL, &cbName, dwFlags))
    {
      NSMutableDictionary *arrayPropertyContainer = [NSMutableDictionary dictionary];

      if (cbName == 0)
        break;
      
      pbData = (BYTE*)malloc(cbName);
      
      if (!pbData) {
        THROW_EXCEPTION(0, PCsp, NULL, "malloc failure");
      }
      
      if (!CryptGetProvParam(hProv, PP_ENUMCONTAINERS, pbData, &cbName, dwFlags | CRYPT_UNIQUE)) {
        free((void*)pbData);
        pbData = NULL;
        break;
      }
      
      pszContainerName = (char*)pbData;
      item.unique = *new std::string(pszContainerName);
      arrayPropertyContainer[@"unique"] = @(std::string(pszContainerName).c_str());
      
      if (!CryptAcquireContext(&hProvCont, pszContainerName, NULL, (DWORD)provType_i, CRYPT_VERIFYCONTEXT)) {
        THROW_EXCEPTION(0, PCsp, NULL, "CryptAcquireContext failed: Code: %d", CSP_GetLastError());
      }
      
      if (!CryptGetProvParam(hProvCont, PP_FQCN, NULL, &cbData, 0)){
        THROW_EXCEPTION(0, PCsp, NULL, "CryptGetProvParam failed: Code: %d", CSP_GetLastError());
      }
      
      pbData = (LPBYTE)malloc(cbData);
      
      if (!CryptGetProvParam(hProvCont, PP_FQCN, pbData, &cbData, 0)){
        THROW_EXCEPTION(0, PCsp, NULL, "CryptGetProvParam failed: Code: %d", CSP_GetLastError());
      }
      
      item.fqcnA = *new std::string((char*)pbData);
      arrayPropertyContainer[@"fqcnA"] = @(std::string((char*)pbData).c_str());
      
      if (mbstowcs(wzContName, (char*)pbData, MAX_PATH) <= 0) {
        THROW_EXCEPTION(0, PCsp, NULL, "mbstowcs failed");
      }
      
      item.fqcnW = *new std::wstring(wzContName);
      std::string strFqcnW( item.fqcnW.begin(), item.fqcnW.end() );
      arrayPropertyContainer[@"fqcnW"] = @(strFqcnW.c_str());
      
      if (!CryptGetProvParam(hProvCont, PP_CONTAINER, NULL, &cbData, 0)){
        THROW_EXCEPTION(0, PCsp, NULL, "CryptGetProvParam failed: Code: %d", CSP_GetLastError());
      }
      
      pbData = (LPBYTE)malloc(cbData);
      
      if (!CryptGetProvParam(hProvCont, PP_CONTAINER, pbData, &cbData, 0)){
        THROW_EXCEPTION(0, PCsp, NULL, "CryptGetProvParam failed: Code: %d", CSP_GetLastError());
      }
      
      containerName = (char *)pbData;
      
      size_t value_len = strlen(containerName);
      size_t wide_string_len = MultiByteToWideChar(CP_ACP, MB_ERR_INVALID_CHARS, (LPCSTR)containerName, value_len, NULL, 0);
      if (!wide_string_len) {
        THROW_EXCEPTION(0, PCsp, NULL, "MultiByteToWideChar() failed!");
      }
      
      wchar_t* wide_buf = (wchar_t*)LocalAlloc(LMEM_ZEROINIT, (wide_string_len + 1) * sizeof(wchar_t));
      wide_string_len = MultiByteToWideChar(CP_ACP, MB_ERR_INVALID_CHARS, (LPCSTR)containerName, value_len, (LPWSTR)wide_buf, wide_string_len);
      
      if (!wide_string_len) {
        LocalFree(wide_buf);
        THROW_EXCEPTION(0, PCsp, NULL, "MultiByteToWideChar() failed!");
      }
      
      item.container = *new std::wstring(wide_buf);
      std::string strContainer( item.container.begin(), item.container.end() );
      arrayPropertyContainer[@"container"] = @(strContainer.c_str());
      
      vec_item.push_back(item);
      [listContainers addObject: arrayPropertyContainer];
      
      pszContainerName = NULL;
      free((void*)pbData);
      
      dwFlags = CRYPT_NEXT;
    }
      
    if (hProv) {
      if (!CryptReleaseContext(hProv, 0)) {
        THROW_EXCEPTION(0, PCsp, NULL, "CryptReleaseContext failed: Code: %d", CSP_GetLastError());
      }
    }
      
    if (hProvCont) {
      if (!CryptReleaseContext(hProvCont, 0)) {
        THROW_EXCEPTION(0, PCsp, NULL, "CryptReleaseContext failed #2: Code: %d", CSP_GetLastError());
      }
    }
      
    if (pbData) {
      free((BYTE*)pbData);
    }
    //}
    callback(@[[NSNull null], [listContainers copy]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(deleteContainer: (NSString *)contNameSt: (NSString *)provTypeSt: (NSString *)provNameSt:  (RCTResponseSenderBlock)callback){
  char *pContName = (char *) [contNameSt UTF8String];
  char *pProvType = (char *) [provTypeSt UTF8String];
  char *pProvName = (char *) [provNameSt UTF8String];
  TrustedHandle<std::string> contName = new std::string(pContName);
  int provType = atoi(pProvType);
  TrustedHandle<std::string> provName = new std::string(pProvName);
  try{
    HCRYPTPROV hProv = NULL;
    if (contName.isEmpty()) {
      THROW_EXCEPTION(0, PCsp, NULL, "Container name epmty.");
    }
      
    if (!provType) {
      THROW_EXCEPTION(0, PCsp, NULL, "Provider type not set.");
    }
      
    if (!CryptAcquireContext(&hProv, contName->c_str(), !provName.isEmpty() && provName->length() ? (LPCSTR)provName->c_str() : NULL, provType, CRYPT_DELETEKEYSET)) {
      THROW_EXCEPTION(0, PCsp, NULL, "CryptAcquireContext failed: Code: %d", CSP_GetLastError());
    }
      
    hProv = NULL;
    
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(getContainerNameByCertificate: (NSString *)serialNumberSt: (NSString *)categorySt: (RCTResponseSenderBlock)callback){
  PCCERT_CONTEXT pUserCert = HCRYPT_NULL;
  HCRYPTPROV hCryptProv = HCRYPT_NULL;
  HCRYPTKEY hPublicKey = HCRYPT_NULL;
  LPBYTE pbContainerName = HCRYPT_NULL;
  LPBYTE pbFPCert = HCRYPT_NULL;
  
  try{
    PCCERT_CONTEXT pUserCert = NULL;
    pUserCert = findCertInCSPStore(serialNumberSt, categorySt);
    
    DWORD cbFPCert;
    DWORD cbContainerName;
    DWORD dwFlags;
    TrustedHandle<std::string> res = new std::string("");
    
    if (!CryptAcquireContext(&hCryptProv, NULL, NULL, PROV_GOST_2001_DH, CRYPT_VERIFYCONTEXT)) {
      THROW_EXCEPTION(0, PCsp, NULL, "CryptAcquireContext failed: Code: %d", CSP_GetLastError());
    }
    
    if (!CryptImportPublicKeyInfo(hCryptProv, pUserCert->dwCertEncodingType, &pUserCert->pCertInfo->SubjectPublicKeyInfo, &hPublicKey)) {
      THROW_EXCEPTION(0, PCsp, NULL, "CryptImportPublicKeyInfo failed: Code: %d", CSP_GetLastError());
    }
    
    if (!CryptGetKeyParam(hPublicKey, KP_FP, NULL, &cbFPCert, 0)) {
      THROW_EXCEPTION(0, PCsp, NULL, "CryptGetKeyParam failed: Code: %d", CSP_GetLastError());
    }
    
    pbFPCert = (LPBYTE)malloc(cbFPCert);
    
    if (!pbFPCert) {
      THROW_EXCEPTION(0, PCsp, NULL, "Fail to allocate memory");
    }
    
    if (!CryptGetKeyParam(hPublicKey, KP_FP, pbFPCert, &cbFPCert, 0)) {
      THROW_EXCEPTION(0, PCsp, NULL, "CryptGetKeyParam failed: Code: %d", CSP_GetLastError());
    }
    
    if (!CryptGetProvParam(hCryptProv, PP_ENUMCONTAINERS, NULL, &cbContainerName, CRYPT_FIRST)) {
      THROW_EXCEPTION(0, PCsp, NULL, "CryptGetProvParam failed: Code: %d", CSP_GetLastError());
    }
    
    pbContainerName = (LPBYTE)malloc(cbContainerName);
    
    if (!pbContainerName) {
      THROW_EXCEPTION(0, Csp, NULL, "Fail to allocate memory");
    }
    
    dwFlags = CRYPT_FIRST;
    
    while (CryptGetProvParam(hCryptProv, PP_ENUMCONTAINERS, pbContainerName, &cbContainerName, dwFlags | CRYPT_FQCN)) {
      if (cmpCertAndContFP((LPCSTR)pbContainerName, pbFPCert, cbFPCert)) {
        res = new std::string((char*)pbContainerName);
        break;
      }
      dwFlags = CRYPT_NEXT;
    }
    
    if (pUserCert) {
      CertFreeCertificateContext(pUserCert);
      pUserCert = HCRYPT_NULL;
    }
    
    free(pbContainerName);
    free(pbFPCert);
    
    if (hPublicKey) {
      if (!CryptDestroyKey(hPublicKey)) {
        THROW_EXCEPTION(0, PCsp, NULL, "CryptDestroyKey failed: Code: %d", CSP_GetLastError());
      }
    }
    
    if (hCryptProv) {
      if (!CryptReleaseContext(hCryptProv, 0)) {
        THROW_EXCEPTION(0, PCsp, NULL, "CryptReleaseContext failed: Code: %d", CSP_GetLastError());
      }
    }
    NSMutableString *contNameStrg = [NSMutableString string];
    [contNameStrg appendFormat:@"%2s", res->c_str()];
    callback(@[[NSNull null], [contNameStrg copy]]);
  }
  catch (TrustedHandle<Exception> e){
    if (pUserCert) {
      CertFreeCertificateContext(pUserCert);
      pUserCert = HCRYPT_NULL;
    }
    
    free(pbContainerName);
    free(pbFPCert);
    
    if (hPublicKey) {
      if (!CryptDestroyKey(hPublicKey)) {
        THROW_EXCEPTION(0, PCsp, NULL, "CryptDestroyKey failed: Code: %d", CSP_GetLastError());
      }
    }
    
    if (hCryptProv) {
      if (!CryptReleaseContext(hCryptProv, 0)) {
        THROW_EXCEPTION(0, PCsp, NULL, "CryptReleaseContext failed: Code: %d", CSP_GetLastError());
      }
    }
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

bool cmpCertAndContFP(LPCSTR szContainerName, LPBYTE pbFPCert, DWORD cbFPCert) {
  try {
    HCRYPTPROV hProvCont = HCRYPT_NULL;
    LPBYTE pbFPCont;
    DWORD cbFPCont;
    BOOL result = FALSE;
    
    if (!pbFPCert) {
      THROW_EXCEPTION(0, PCsp, NULL, "pbFPCert cannot be null pointer");
    }
    
    if (!CryptAcquireContext(&hProvCont, szContainerName, NULL, PROV_GOST_2012_256, CRYPT_VERIFYCONTEXT)) {
      THROW_EXCEPTION(0, PCsp, NULL, "CryptAcquireContext. Error: 0x%08x", CSP_GetLastError());
    }
    
    cbFPCont = cbFPCert;
    pbFPCont = (LPBYTE)malloc(cbFPCont);
    
    if (CryptGetProvParam(hProvCont, PP_SIGNATURE_KEY_FP, pbFPCont, &cbFPCont, 0)) {
      if (pbFPCont && !memcmp(pbFPCont, pbFPCert, cbFPCert)) {
        result = TRUE;
        goto Done;
      }
    }
    
    if (CryptGetProvParam(hProvCont, PP_EXCHANGE_KEY_FP, pbFPCont, &cbFPCont, 0)) {
      if (pbFPCont && !memcmp(pbFPCont, pbFPCert, cbFPCert)) {
        result = TRUE;
        goto Done;
      }
    }
    
  Done:
    free(pbFPCont);
    
    if (hProvCont) {
      if (!CryptReleaseContext(hProvCont, 0)) {
        THROW_EXCEPTION(0, PCsp, NULL, "CryptReleaseContext. Error: 0x%08x", CSP_GetLastError());
      }
    }
    
    return result;
  }
  catch (TrustedHandle<Exception> e) {
    THROW_EXCEPTION(0, PCsp, e, "Error compare cert and container FP");
  }
}

/*
RCT_EXPORT_METHOD(installCertificateFromContainer: (NSString *)contName: (NSString *)provType: (NSString *)provName:(RCTResponseSenderBlock)callback){
  char *chContName = (char *) [contName UTF8String];
  char *chType = (char *) [provType UTF8String];
  char *chName = (char *) [provName UTF8String];
  int type = atoi(chType);
  
  HCRYPTPROV hProv = NULL;
  HCRYPTKEY hKey = NULL;
  BYTE* pbCertificate = NULL;
  
  DWORD cbName;
  DWORD dwKeySpec, dwSize;
  PCCERT_CONTEXT pCertContext;
  HCERTSTORE hCertStore = NULL;
  CRYPT_KEY_PROV_INFO pKeyInfo = { 0 };
  DWORD dwNewProvType = 0;
  ALG_ID dwAlgId = 0;
  WCHAR wzContName[MAX_PATH];
  
  if (chContName) {
    callback(@[[@"container name epmty" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if (!type) {
    callback(@[[@"provider type not set" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if (!CryptAcquireContext(
                           &hProv,
                           chContName,
                           (LPCSTR)chName,
                           type,
                           0))
  {
    int ret = CSP_GetLastError();
    callback(@[[NSNumber numberWithInteger:ret], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if (!CryptGetUserKey(hProv, AT_SIGNATURE, &hKey)) {
    CryptDestroyKey(hKey);
    
    if (!CryptGetUserKey(hProv, AT_KEYEXCHANGE, &hKey)) {
      int ret = CSP_GetLastError();
      callback(@[[NSNumber numberWithInteger:ret], [NSNumber numberWithInt: 0]]);
      return;
    }
    else {
      dwKeySpec = AT_KEYEXCHANGE;
    }
  }
  else {
    dwKeySpec = AT_SIGNATURE;
  }
  
  if (!CryptGetKeyParam(hKey, KP_CERTIFICATE, NULL, &cbName, 0)) {
    int ret = CSP_GetLastError();
    callback(@[[NSNumber numberWithInteger:ret], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  pbCertificate = (BYTE*)malloc(cbName);
  
  if (!CryptGetKeyParam(hKey, KP_CERTIFICATE, pbCertificate, &cbName, 0)) {
    int ret = CSP_GetLastError();
    callback(@[[NSNumber numberWithInteger:ret], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if ((pCertContext = CertCreateCertificateContext(X509_ASN_ENCODING, pbCertificate, cbName)) == NULL) {
    int ret = CSP_GetLastError();
    callback(@[[NSNumber numberWithInteger:ret], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if (mbstowcs(wzContName, chContName, MAX_PATH) <= 0) {
    callback(@[[@"mbstowcs failed" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  dwSize = sizeof(dwAlgId);
  if (!CryptGetKeyParam(hKey, KP_ALGID, (LPBYTE)&dwAlgId, &dwSize, 0)) {
    int ret = CSP_GetLastError();
    callback(@[[NSNumber numberWithInteger:ret], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  switch (dwAlgId) {
    case CALG_GR3410EL:
    case CALG_DH_EL_SF:
      dwNewProvType = PROV_GOST_2001_DH;
      break;
      
#if defined(PROV_GOST_2012_256)
    case CALG_GR3410_12_256:
    case CALG_DH_GR3410_12_256_SF:
      dwNewProvType = PROV_GOST_2012_256;
      break;
      
    case CALG_GR3410_12_512:
    case CALG_DH_GR3410_12_512_SF:
      dwNewProvType = PROV_GOST_2012_512;
      break;
#endif // PROV_GOST_2012_256
      
#if defined(CALG_ECDSA) && defined(CALG_ECDH)
    case CALG_ECDSA:
    case CALG_ECDH:
      dwNewProvType = PROV_EC_ECDSA_FULL;
      break;
#endif // defined(CALG_ECDSA) && defined(CALG_ECDH)
      
#if defined(CALG_RSA_SIGN) && defined(CALG_RSA_KEYX)
    case CALG_RSA_SIGN:
    case CALG_RSA_KEYX:
      dwNewProvType = PROV_RSA_AES;
      break;
#endif // defined(CALG_ECDSA) && defined(CALG_ECDH)
      
    default:
      int ret = CSP_GetLastError();
      callback(@[[NSNumber numberWithInteger:ret], [NSNumber numberWithInt: 0]]);
      return;
  }
  
  pKeyInfo.dwKeySpec = dwKeySpec;
  pKeyInfo.dwProvType = dwNewProvType;
  pKeyInfo.pwszContainerName = wzContName;
  pKeyInfo.pwszProvName = (LPWSTR)provTypeToProvNameW(dwNewProvType);
  
  if (!CertSetCertificateContextProperty(
                                         pCertContext,
                                         CERT_KEY_PROV_INFO_PROP_ID,
                                         CERT_STORE_NO_CRYPT_RELEASE_FLAG,
                                         &pKeyInfo
                                         ))
  {
    int ret = CSP_GetLastError();
    callback(@[[NSNumber numberWithInteger:ret], [NSNumber numberWithInt: 0]]);
    return;
 };
  
  if (NULL == (hCertStore = CertOpenStore(
                                                 CERT_STORE_PROV_SYSTEM,
                                                 X509_ASN_ENCODING | PKCS_7_ASN_ENCODING,
                                                 NULL,
                                                 CERT_SYSTEM_STORE_CURRENT_USER,
                                                 L"MY")))
  {
    int ret = CSP_GetLastError();
    callback(@[[NSNumber numberWithInteger:ret], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  if (!CertAddCertificateContextToStore(
                                        hCertStore,
                                        pCertContext,
                                        CERT_STORE_ADD_REPLACE_EXISTING,
                                        NULL
                                        ))
  {
    int ret = CSP_GetLastError();
    callback(@[[NSNumber numberWithInteger:ret], [NSNumber numberWithInt: 0]]);
    return;
  }
  
  CertFreeCertificateContext(pCertContext);
  pCertContext = NULL;
  
  CertCloseStore(hCertStore, 0);
  hCertStore = NULL;
  
  free(pbCertificate);
  
  if (hKey) {
    CryptDestroyKey(hKey);
    hKey = NULL;
  }
  
  if (hProv) {
    if (!CryptReleaseContext(hProv, 0)) {
      int ret = CSP_GetLastError();
      callback(@[[NSNumber numberWithInteger:ret], [NSNumber numberWithInt: 0]]);
      return;
    }
    
    hProv = NULL;
  }
  
  callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
}
*/

@end

