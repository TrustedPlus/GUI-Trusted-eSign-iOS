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

@end
