#include "PCerts.h"

@implementation PCerts

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(init: (RCTResponseSenderBlock)callback){
  std::string listStore[] = {"My", "AddressBook", "ROOT", "TRUST", "CA", "Request"};
  
  HCERTSTORE hCertStore;
  int c = sizeof(listStore) / sizeof(*listStore);
  
  for (int i = 0; i < c; i++){
    std::vector<PCCERT_CONTEXT> vecCerts;//содержит список сертификатов в выбранном хранилище
    vecCerts.clear();
    std::wstring widestr = std::wstring(listStore[i].begin(), listStore[i].end());
    hCertStore = CertOpenStore(CERT_STORE_PROV_SYSTEM,
                               PKCS_7_ASN_ENCODING | X509_ASN_ENCODING,
                               NULL,
                               CERT_SYSTEM_STORE_CURRENT_USER,
                               widestr.c_str());
    if(!hCertStore){
      fprintf (stderr, "CertOpenSystemStore failed.");
    }
    PCCERT_CONTEXT pCertContext = NULL;
    do{
      pCertContext = CertEnumCertificatesInStore(hCertStore, pCertContext);
      if (pCertContext){
        vecCerts.push_back(pCertContext);
      }
    } while (pCertContext != NULL);
    allCerts[listStore[i]] = vecCerts;
  }
  callback(@[[NSNull null], [NSNull null]]);
}

//возможно понадобится добавлять сертификаты не только в "My", добавить для аргумент выбора хранилища
RCT_EXPORT_METHOD(importPFX: (NSString *)pathToPFX: (NSString *)password: (RCTResponseSenderBlock)callback){
  char *pfx = (char *) [pathToPFX UTF8String];
  char *pass = (char *) [password UTF8String];
  
  CRYPT_DATA_BLOB cryptBlob = *new CRYPT_DATA_BLOB();
  DWORD flag = CRYPT_EXPORTABLE | PKCS12_ALLOW_OVERWRITE_KEY;
  
  FILE *f;
  
  f= fopen(pfx, "rb");
  if (f == NULL){
    callback(@[[@"Error open pfx file!" copy], [NSNull null]]);
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
        int ret = CSP_GetLastError();
        callback(@[[NSNull null], [NSNumber numberWithInt: ret]]);
      }
      CertCloseStore(hStore, 0);
    }
  }
  
  callback(@[[NSNull null], [NSNull null]]);
}

@end
