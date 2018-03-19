#include "PCsp.h"
#include "../globalHelper.h"

@implementation PCsp

- (NSMutableArray*) showCerts{
  NSMutableArray *myArray = [NSMutableArray array];
  try{
    providerItemCollection = new PkiItemCollection();
    std::string listStore[] = {"My", "AddressBook", "ROOT", "TRUST", "CA", "Request"};
    
    HCERTSTORE hCertStore;
    int c = sizeof(listStore) / sizeof(*listStore);
    
    for (int i = 0; i < c; i++){
      std::wstring widestr = std::wstring(listStore[i].begin(), listStore[i].end());
      hCertStore = CertOpenStore(CERT_STORE_PROV_SYSTEM, PKCS_7_ASN_ENCODING | X509_ASN_ENCODING, NULL, CERT_SYSTEM_STORE_CURRENT_USER, widestr.c_str());
      if(!hCertStore){
        throw new std::string("CertOpenSystemStore failed.");
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
              throw new std::string("'d2i_X509' Error decode len bytes");
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
    THROW_EXCEPTION(0, ProviderCryptopro, e, "Error create PkiItem from certificate");
  }
}


RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(enumProviders: (RCTResponseSenderBlock)callback){  
  DWORD dwIndex = 0;
  DWORD dwType;
  DWORD cbName;
  LPTSTR pszName;
  while (CryptEnumProviders(dwIndex, NULL, 0, &dwType, NULL, &cbName)){
    if (!cbName)
      break;
    
    pszName = (LPTSTR)malloc(cbName);
    
    if (!CryptEnumProviders(dwIndex++, NULL, NULL, &dwType, pszName, &cbName)){
      int ret = CSP_GetLastError();
      callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
    }

    providerProps[(int)dwType] = *new std::string(pszName);
  }
  
  callback(@[[NSNull null], [NSNull null]]);
}

RCT_EXPORT_METHOD(enumContainers: (NSString *)provType: (NSString *)provName:  (RCTResponseSenderBlock)callback){
  char *pvType = (char *) [provType UTF8String];
  char *pvName = (char *) [provName UTF8String];
  
  int type = atoi(pvType);
  
  if (providerProps[type] == ""){
    providerProps[type] =  pvName;
  }
  else{
    enumProviders:callback;
  }
  
  if (providerProps.size() <= 0){
    callback(@[[@"Empty providers list" copy], [NSNull null]]);
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
  
  for (cur = providerProps.begin(); cur !=providerProps.end(); cur++) {
    int provType_i = (*cur).first;
    std::string provName_i = (*cur).second;
    
    if (!CryptAcquireContext(&hProv,
                             NULL,
                             (LPCSTR)provName_i.c_str(),
                             provType_i, //поставить условие
                             CRYPT_VERIFYCONTEXT))
    {
      int ret = CSP_GetLastError();
      callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
    }
    
    while (CryptGetProvParam(hProv, PP_ENUMCONTAINERS, NULL, &cbName, dwFlags))
    {
      if (cbName == 0)
        break;
      
      pbData = (BYTE*)malloc(cbName);
      
      if (!pbData) {
        callback(@[[@"malloc failure" copy], [NSNull null]]);
      }
      
      if (!CryptGetProvParam(hProv, PP_ENUMCONTAINERS, pbData, &cbName, dwFlags | CRYPT_UNIQUE)) {
        free((void*)pbData);
        pbData = NULL;
        break;
      }
      
      pszContainerName = (char*)pbData;
      item.unique = *new std::string(pszContainerName);
      
      if (!CryptAcquireContext(&hProvCont,
                               pszContainerName,
                               NULL,
                               provType_i,
                               CRYPT_VERIFYCONTEXT))
      {
        int ret = CSP_GetLastError();
        callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
      }
      
      if (!CryptGetProvParam(hProvCont, PP_FQCN, NULL, &cbData, 0)){
        int ret = CSP_GetLastError();
        callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
      }
      
      pbData = (LPBYTE)malloc(cbData);
      
      if (!CryptGetProvParam(hProvCont, PP_FQCN, pbData, &cbData, 0)){
        int ret = CSP_GetLastError();
        callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
      }
      
      item.fqcnA = *new std::string((char*)pbData);
      
      if (mbstowcs(wzContName, (char*)pbData, MAX_PATH) <= 0) {
        callback(@[[@"mbstowcs failed" copy], [NSNull null]]);
      }
      
      item.fqcnW = *new std::wstring(wzContName);
      
      if (!CryptGetProvParam(hProvCont, PP_CONTAINER, NULL, &cbData, 0)){
        int ret = CSP_GetLastError();
        callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
      }
      
      pbData = (LPBYTE)malloc(cbData);
      
      if (!CryptGetProvParam(hProvCont, PP_CONTAINER, pbData, &cbData, 0)){
        int ret = CSP_GetLastError();
        callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
      }
      
      containerName = (char *)pbData;
      
      size_t value_len = strlen(containerName);
      size_t wide_string_len = MultiByteToWideChar(CP_ACP, MB_ERR_INVALID_CHARS, (LPCSTR)containerName, value_len, NULL, 0);
      if (!wide_string_len) {
        callback(@[[@"MultiByteToWideChar() failed" copy], [NSNull null]]);
      }
      
      wchar_t* wide_buf = (wchar_t*)LocalAlloc(LMEM_ZEROINIT, (wide_string_len + 1) * sizeof(wchar_t));
      wide_string_len = MultiByteToWideChar(CP_ACP, MB_ERR_INVALID_CHARS, (LPCSTR)containerName, value_len, (LPWSTR)wide_buf, wide_string_len);
      
      if (!wide_string_len) {
        LocalFree(wide_buf);
        callback(@[[@"MultiByteToWideChar() failed" copy], [NSNull null]]);
      }
      
      item.container = *new std::wstring(wide_buf);
      
      vec_item.push_back(item);
      
      pszContainerName = NULL;
      free((void*)pbData);
      
      dwFlags = CRYPT_NEXT;
    }
    
    if (hProv) {
      if (!CryptReleaseContext(hProv, 0)) {
        int ret = CSP_GetLastError();
        callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
      }
    }
    
    if (hProvCont) {
      if (!CryptReleaseContext(hProvCont, 0)) {
        int ret = CSP_GetLastError();
        callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
      }
    }
    
    if (pbData) {
      free((BYTE*)pbData);
    }
  }
  //(std::__1::string) unique = "HDIMAGE\\\\09izp87f.000\\23EA"
  //(std::__1::wstring) fqcnW = L"\\\\.\\HDIMAGE\\de2f8166-2420-4fe5-9968-cae18bd74404" (std::__1::string) unique = "HDIMAGE\\\\de2f8166.000\\5BCD"
  //(std::__1::wstring) fqcnW = L"\\\\.\\HDIMAGE\\f06abcae-fa87-4fb9-b871-853ee89bbefa" (std::__1::string) unique = "HDIMAGE\\\\f06abcae.000\\3B84"
  //(std::__1::wstring) fqcnW = L"\\\\.\\HDIMAGE\\fcrizduvu1vy202hof9s5p35dmpvr7zce3d5v4u" (std::__1::string) unique = "HDIMAGE\\\\fcrizduv.000\\9923"
  //(std::__1::wstring) fqcnW = L"\\\\.\\HDIMAGE\\tj1fx6buuku71em77fo5377iq4tmjwtqdzxv5th" (std::__1::string) unique = "HDIMAGE\\\\tj1fx6bu.000\\F92A"
  callback(@[[NSNull null], [NSNull null]]);
}

RCT_EXPORT_METHOD(getCertificateFromContainer: (NSString *)contName: (NSString *)provType: (NSString *)provName:(RCTResponseSenderBlock)callback){
  char *chContName = (char *) [contName UTF8String];
  char *chType = (char *) [provType UTF8String];
  char *chName = (char *) [provName UTF8String];
  int type = atoi(chType);
  
  HCRYPTPROV hProv = NULL;
  HCRYPTKEY hKey = NULL;
  BYTE* pbCertificate = NULL;
  
  DWORD cbName;
  DWORD dwKeySpec;
  PCCERT_CONTEXT pCertContext;
  
  if (!chContName) {
    callback(@[[@"container name epmty" copy], [NSNull null]]);
  }
  
  if (!type) {
     callback(@[[@"provider type not set" copy], [NSNull null]]);
  }
  
  if (!CryptAcquireContext(
                           &hProv,
                           chContName,
                           (LPCSTR)chName,
                           type,
                           0))
  {
    int ret = CSP_GetLastError();
    callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
  }
  
  if (!CryptGetUserKey(hProv, AT_SIGNATURE, &hKey)) {
    CryptDestroyKey(hKey);
    
    if (!CryptGetUserKey(hProv, AT_KEYEXCHANGE, &hKey)) {
      int ret = CSP_GetLastError();
      callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
    }
    else {
      dwKeySpec = AT_KEYEXCHANGE;
    }
  }
  else {
    dwKeySpec = AT_SIGNATURE;
  }
  dwKeySpec = AT_SIGNATURE;
  if (!CryptGetKeyParam(hKey, KP_CERTIFICATE, NULL, &cbName, 0)) {
    DWORD ret = CSP_GetLastError();
    callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
  }
  
  pbCertificate = (BYTE*)malloc(cbName);
  
  if (!CryptGetKeyParam(hKey, KP_CERTIFICATE, pbCertificate, &cbName, 0)) {
    int ret = CSP_GetLastError();
    callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
  }
  
  if ((pCertContext = CertCreateCertificateContext(X509_ASN_ENCODING, pbCertificate, cbName)) == NULL) {
    int ret = CSP_GetLastError();
    callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
  }
  
  pcert = pCertContext;
  
  free(pbCertificate);
  
  if (hKey) {
    CryptDestroyKey(hKey);
    hKey = NULL;
  }
  
  if (hProv) {
    if (!CryptReleaseContext(hProv, 0)) {
      int ret = CSP_GetLastError();
      callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
    }
    
    hProv = NULL;
  }
  
  callback(@[[NSNull null], [NSNull null]]);
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
    callback(@[[@"container name epmty" copy], [NSNull null]]);
  }
  
  if (!type) {
    callback(@[[@"provider type not set" copy], [NSNull null]]);
  }
  
  if (!CryptAcquireContext(
                           &hProv,
                           chContName,
                           (LPCSTR)chName,
                           type,
                           0))
  {
    int ret = CSP_GetLastError();
    callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
  }
  
  if (!CryptGetUserKey(hProv, AT_SIGNATURE, &hKey)) {
    CryptDestroyKey(hKey);
    
    if (!CryptGetUserKey(hProv, AT_KEYEXCHANGE, &hKey)) {
      int ret = CSP_GetLastError();
      callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
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
    callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
  }
  
  pbCertificate = (BYTE*)malloc(cbName);
  
  if (!CryptGetKeyParam(hKey, KP_CERTIFICATE, pbCertificate, &cbName, 0)) {
    int ret = CSP_GetLastError();
    callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
  }
  
  if ((pCertContext = CertCreateCertificateContext(X509_ASN_ENCODING, pbCertificate, cbName)) == NULL) {
    int ret = CSP_GetLastError();
    callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
  }
  
  if (mbstowcs(wzContName, chContName, MAX_PATH) <= 0) {
    callback(@[[@"mbstowcs failed" copy], [NSNull null]]);
  }
  
  dwSize = sizeof(dwAlgId);
  if (!CryptGetKeyParam(hKey, KP_ALGID, (LPBYTE)&dwAlgId, &dwSize, 0)) {
    int ret = CSP_GetLastError();
    callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
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
      callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
      break;
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
    callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
  };
  
  if (NULL == (hCertStore = CertOpenStore(
                                                 CERT_STORE_PROV_SYSTEM,
                                                 X509_ASN_ENCODING | PKCS_7_ASN_ENCODING,
                                                 NULL,
                                                 CERT_SYSTEM_STORE_CURRENT_USER,
                                                 L"MY")))
  {
    int ret = CSP_GetLastError();
    callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
  }
  
  if (!CertAddCertificateContextToStore(
                                        hCertStore,
                                        pCertContext,
                                        CERT_STORE_ADD_REPLACE_EXISTING,
                                        NULL
                                        ))
  {
    int ret = CSP_GetLastError();
    callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
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
      callback(@[[NSNumber numberWithInteger:ret], [NSNull null]]);
    }
    
    hProv = NULL;
  }
  
  callback(@[[NSNull null], [NSNull null]]);
}
*/



@end

