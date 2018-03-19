#include "PCert.h"
#include "../globalHelper.h"

@implementation PCert

RCT_EXPORT_MODULE();

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

@end
