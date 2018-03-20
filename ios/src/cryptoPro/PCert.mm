#include "PCert.h"
#include "../globalHelper.h"

@implementation PCert

RCT_EXPORT_MODULE();
/*
//TODO: { показать нужно выбранный сертификат, а не рандомный }
RCT_EXPORT_METHOD(getCertInfo: (RCTResponseSenderBlock)callback) {
  NSMutableDictionary *arrayPropertyCert = [NSMutableDictionary dictionary];
  
  //std::map<const char *, char *> arrayPropertyCert;
  DWORD ret = 0;
  CSP_BOOL bResult = FALSE;
  CRYPT_KEY_PROV_INFO *pProvInfo = NULL;
  HCERTSTORE hCertStore = 0;
  PCCERT_CONTEXT pUserCert = NULL;        // User certificate to be used
  DWORD dwSize;
  
  hCertStore = CertOpenSystemStore(0, "My");
  if(!hCertStore){
    ret = CSP_GetLastError();
    fprintf (stderr, "CertOpenSystemStore failed.");
  }
  
  while( !bResult){
    pUserCert= CertEnumCertificatesInStore(hCertStore, pUserCert);
    //pUserCert= CertEnumCertificatesInStore(hCertStore, pUserCert);
    if(!pUserCert){ break; }
    bResult = CertGetCertificateContextProperty(pUserCert, CERT_KEY_PROV_INFO_PROP_ID, NULL, &dwSize);
    if (bResult) {
      free(pProvInfo);
      pProvInfo = (CRYPT_KEY_PROV_INFO *)malloc(dwSize);
      if (pProvInfo) {
        bResult = CertGetCertificateContextProperty(pUserCert, CERT_KEY_PROV_INFO_PROP_ID, pProvInfo, &dwSize);
        char contName[100];
        wcstombs(contName, pProvInfo->pwszContainerName, 100);
        arrayPropertyCert[@"ContainerName"] = @(contName);
        char provName[100];
        wcstombs(provName, pProvInfo->pwszProvName, 100);
        arrayPropertyCert[@"ProvName"] = @(provName);
        char buf_1[100];
        sprintf(buf_1, "%d", pProvInfo->dwProvType);
        arrayPropertyCert[@"ProvType"] = @(buf_1);
      }
    }
    char buf[100];
    sprintf(buf, "%d", (pUserCert->pCertInfo->dwVersion + 1));
    arrayPropertyCert[@"Version"] = @(buf);
    
    DWORD cbSize;
    //get subject name
    if(!(cbSize = CertGetNameString(pUserCert, CERT_NAME_SIMPLE_DISPLAY_TYPE, 0, NULL, NULL, 0))){
      ret = CSP_GetLastError();
    }
    else{
      LPTSTR pszName = (LPTSTR)malloc(cbSize * sizeof(TCHAR));
      if(CertGetNameString(pUserCert, CERT_NAME_SIMPLE_DISPLAY_TYPE, 0, NULL, pszName, cbSize)){
        arrayPropertyCert[@"SubjectName"] = @(pszName);
      }
    }
    //get signature algorithm
    arrayPropertyCert[@"SignatureAlgorithm"] = @(pUserCert->pCertInfo->SignatureAlgorithm.pszObjId);
    //get public key info -> algorithm
    arrayPropertyCert[@"publicKeyInfoAlgorithm"] = @(pUserCert->pCertInfo->SubjectPublicKeyInfo.Algorithm.pszObjId);
  }
err:
  
  callback(@[[NSNull null], [arrayPropertyCert copy]]);
}
*/
RCT_EXPORT_METHOD(deleteCertInStore: (NSString *)issuerName: (NSString *)serialNumber: (NSString *)category: (RCTResponseSenderBlock)callback){
  try{
    //Установить лицензию можно с помощью
    //support_registry_put_string( "\\license\\ProductID\\{407E5BA7-6406-40BF-A4DC-3654B8F584C1}\\ProductID", SN ) )
    //Ограниченно проверить - с помощью
    //CryptGetProvParam (PP_LICENSE)
    char *pIssuerName = (char *) [issuerName UTF8String];
    char *pSerialNumber = (char *) [serialNumber UTF8String];
    char *pCategory = (char *) [category UTF8String];
    
    HCERTSTORE hCertStore = 0;
    PCCERT_CONTEXT pUserCert = NULL;        // User certificate to be used
    PCCERT_CONTEXT pUserCert_new = NULL;
    
    hCertStore = CertOpenSystemStore(0, pCategory);
    if(!hCertStore){
      callback(@[[@"CertOpenSystemStore failed.\n" copy], [NSNumber numberWithInt: 0]]);
      return;
    }
    
    TrustedHandle<Filter> filterByCert = new Filter();
    filterByCert->setIssuerName(new std::string(pIssuerName));
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
    if (!CertDeleteCertificateFromStore(pUserCert)) {
      THROW_EXCEPTION(0, ProviderCryptopro, NULL, "CertDeleteCertificateFromStore failed: Code: %d", CSP_GetLastError());
    }
    if (hCertStore){
      CertCloseStore(hCertStore, 0);
      hCertStore = HCRYPT_NULL;
    }
    if (pUserCert_new){
      CertFreeCertificateContext(pUserCert_new);
      pUserCert_new = HCRYPT_NULL;
    }
    if (pUserCert){
      CertFreeCertificateContext(pUserCert);
      pUserCert = HCRYPT_NULL;
    }
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

@end
