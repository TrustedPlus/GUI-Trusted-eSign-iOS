#include "PCerts.h"

@implementation PCerts

RCT_EXPORT_MODULE();

//возможно понадобится добавлять сертификаты не только в "My", добавить для аргумент выбора хранилища
RCT_EXPORT_METHOD(importPFX: (NSString *)pathToPFX: (NSString *)password: (RCTResponseSenderBlock)callback){
  char *pfx = (char *) [pathToPFX UTF8String];
  char *pass = (char *) [password UTF8String];
  
  CRYPT_DATA_BLOB cryptBlob = *new CRYPT_DATA_BLOB();
  DWORD flag = CRYPT_EXPORTABLE | PKCS12_ALLOW_OVERWRITE_KEY;
  
  FILE *f;
  
  f= fopen(pfx, "rb");
  if (f == NULL){
    callback(@[[@"Error open pfx file!" copy], [NSNumber numberWithInt: 0]]);
    return;
  }
  fseek (f , 0 , SEEK_END);
  cryptBlob.cbData = (DWORD)ftell (f);
  fseek(f, 0, SEEK_SET);
  //заполнение Блоба данными
  cryptBlob.pbData = (BYTE *)malloc(cryptBlob.cbData);
  fread(cryptBlob.pbData, 1, cryptBlob.cbData, f);
  
  fclose(f);
  //преобразование пароля в wchar_t
  const size_t cSize = strlen(pass)+1;
  wchar_t* w_pass = new wchar_t[cSize];
  mbstowcs (w_pass, pass, cSize);
  
  HCERTSTORE hCertStore = PFXImportCertStore(&cryptBlob, w_pass, flag);//создание хранилища ключа
  if (hCertStore != NULL){
    //!  работает лишь для случая, если в pfx ОДИН ключ и ОДИН сертификат  !
    PCCERT_CONTEXT pUserCert = CertEnumCertificatesInStore(hCertStore, NULL);//нашли сертификат в этом хранилище
    if (pUserCert != NULL){
      DWORD dwFlags = CERT_SYSTEM_STORE_CURRENT_USER | CERT_STORE_OPEN_EXISTING_FLAG;
      HCERTSTORE hStore = CertOpenStore(CERT_STORE_PROV_SYSTEM, 0, 0, dwFlags, L"My");
      if (!CertAddCertificateContextToStore(hStore, pUserCert, CERT_STORE_ADD_REPLACE_EXISTING, NULL)){
        callback(@[[NSNumber numberWithInt: CSP_GetLastError()], [NSNumber numberWithInt: 0]]);
        return;
      }
      CertCloseStore(hStore, 0);
    }
  }
  callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
}

RCT_EXPORT_METHOD(exportPFX: (NSString *)serialNumber: (NSString *)category: (NSString *)exportPrivateKey: (NSString *)password: (NSString *)pathToFile: (RCTResponseSenderBlock)callback){
  char *pSerialNumber = (char *) [serialNumber UTF8String];
  char *pCategory = (char *) [category UTF8String];
  char *pExportPrivateKey = (char *) [exportPrivateKey UTF8String];
  char *pPwd = (char *) [password UTF8String];
  char *pPathToFile = (char *) [pathToFile UTF8String];
  
  HCERTSTORE hTempStore = HCRYPT_NULL;
  HCERTSTORE hCertStore = HCRYPT_NULL;
  PCCERT_CONTEXT pUserCert = HCRYPT_NULL;
  PCCERT_CONTEXT pUserCert_new = HCRYPT_NULL;
  
  try {
    DWORD dwFlags = NULL;
    PKCS12 *p12 = NULL;
    TrustedHandle<Pkcs12> resP12;
    
    if (pExportPrivateKey) {
      dwFlags = EXPORT_PRIVATE_KEYS | REPORT_NOT_ABLE_TO_EXPORT_PRIVATE_KEY;
    }
    
    //преобразование пароля в wchar_t
    const size_t cSize = strlen(pPwd)+1;
    wchar_t* wPassword = new wchar_t[cSize];
    mbstowcs (wPassword, pPwd, cSize);
    
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
    
    if (!(hTempStore = CertOpenStore(CERT_STORE_PROV_MEMORY, 0, NULL, CERT_STORE_CREATE_NEW_FLAG, NULL))) {
      callback(@[[@"CertOpenStore failed!" copy], [NSNumber numberWithInt: 0]]);
    }
    
    if (CertAddCertificateContextToStore(hTempStore, pUserCert, CERT_STORE_ADD_NEW, NULL)) {
      CRYPT_DATA_BLOB bDataBlob = { 0, NULL };
      if (PFXExportCertStoreEx(hTempStore, &bDataBlob, wPassword, NULL, dwFlags)) {
        bDataBlob.pbData = (BYTE *)malloc(bDataBlob.cbData);
        
        if (PFXExportCertStoreEx(hTempStore, &bDataBlob, wPassword, NULL, dwFlags)) {
          const unsigned char *p = bDataBlob.pbData;
          
          p12 = d2i_PKCS12(NULL, &p, bDataBlob.cbData);
          resP12 = new Pkcs12(p12);
          
          TrustedHandle<Bio> out = new Bio(BIO_TYPE_FILE, pPathToFile, "wb");
          resP12->write(out);
          out->flush();          
        }
        
        if (bDataBlob.pbData) {
          free((BYTE*)bDataBlob.pbData);
        }
      }
    }
    
    if (pUserCert) {
      CertFreeCertificateContext(pUserCert);
      pUserCert = HCRYPT_NULL;
    }
    
    if (pUserCert_new) {
      CertFreeCertificateContext(pUserCert_new);
      pUserCert_new = HCRYPT_NULL;
    }
    
    if (hTempStore) {
      CertCloseStore(hTempStore, 0);
      hTempStore = HCRYPT_NULL;
    }
    
    if (hCertStore) {
      CertCloseStore(hCertStore, 0);
      hCertStore = HCRYPT_NULL;
    }
    
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    if (pUserCert) {
      CertFreeCertificateContext(pUserCert);
    }
    
    if (pUserCert_new) {
      CertFreeCertificateContext(pUserCert_new);
    }
    
    if (hTempStore) {
      CertCloseStore(hTempStore, 0);
      hTempStore = HCRYPT_NULL;
    }
    
    if (hCertStore) {
      CertCloseStore(hCertStore, 0);
      hCertStore = HCRYPT_NULL;
    }
    
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

@end
