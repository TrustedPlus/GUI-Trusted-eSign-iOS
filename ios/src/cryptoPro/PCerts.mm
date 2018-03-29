#include "PCerts.h"

@implementation PCerts

RCT_EXPORT_MODULE();

//возможно понадобится добавлять сертификаты не только в "My", добавить для аргумент выбора хранилища
RCT_EXPORT_METHOD(importPFX: (NSString *)pathToPFX: (NSString *)password: (RCTResponseSenderBlock)callback){
  try{
    char *pfx = (char *) [pathToPFX UTF8String];
    char *pass = (char *) [password UTF8String];

    CRYPT_DATA_BLOB cryptBlob = *new CRYPT_DATA_BLOB();
    DWORD flag = CRYPT_EXPORTABLE | PKCS12_ALLOW_OVERWRITE_KEY;
    
    FILE *f;
    
    f= fopen(pfx, "rb");
    if (f == NULL){
      THROW_EXCEPTION(0, PCerts, NULL, "Error open pfx file!");
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
          THROW_EXCEPTION(0, PCerts, NULL, "CertAddCertificateContextToStore failed: Code: %d", CSP_GetLastError());
        }
        CertCloseStore(hStore, 0);
      }
      else{
        THROW_EXCEPTION(0, PCerts, NULL, "Not find certificate in the pfx_file!");
      }
    }
    else{
      THROW_EXCEPTION(0, PCerts, NULL, "Incorrect password!");
    }
    
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(exportPFX: (NSString *)serialNumber: (NSString *)category: (BOOL)exportPrivateKey: (NSString *)password: (NSString *)pathToFile: (RCTResponseSenderBlock)callback){
  char *pPwd = (char *) [password UTF8String];
  char *pPathToFile = (char *) [pathToFile UTF8String];
  
  HCERTSTORE hTempStore = HCRYPT_NULL;
  PCCERT_CONTEXT pUserCert = HCRYPT_NULL;
  
  try {
    DWORD dwFlags = NULL;
    PKCS12 *p12 = NULL;
    TrustedHandle<Pkcs12> resP12;
    
    if (exportPrivateKey) {
      dwFlags = EXPORT_PRIVATE_KEYS | REPORT_NOT_ABLE_TO_EXPORT_PRIVATE_KEY;
    }
    
    //преобразование пароля в wchar_t
    const size_t cSize = strlen(pPwd)+1;
    wchar_t* wPassword = new wchar_t[cSize];
    mbstowcs (wPassword, pPwd, cSize);
    
    pUserCert = findCertInCSPStore(serialNumber, category);
    
    if (!(hTempStore = CertOpenStore(CERT_STORE_PROV_MEMORY, 0, NULL, CERT_STORE_CREATE_NEW_FLAG, NULL))) {
      THROW_EXCEPTION(0, PCerts, NULL, "CertOpenStore failed!!");
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
    
    if (hTempStore) {
      CertCloseStore(hTempStore, 0);
      hTempStore = HCRYPT_NULL;
    }
    
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    if (pUserCert) {
      CertFreeCertificateContext(pUserCert);
    }
    
    if (hTempStore) {
      CertCloseStore(hTempStore, 0);
      hTempStore = HCRYPT_NULL;
    }
    
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

@end
