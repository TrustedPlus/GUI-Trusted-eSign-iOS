#include "PCert.h"
#include "../globalHelper.h"

@implementation PCert

RCT_EXPORT_MODULE();

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
