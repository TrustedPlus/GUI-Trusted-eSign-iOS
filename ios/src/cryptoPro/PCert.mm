#include "PCert.h"

@implementation PCert

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(addCert: (NSString *)pathToFie: (NSString *)format: (NSString *)category: (RCTResponseSenderBlock)callback){
  try{
    //считывание сертификата из файла
    char *pPathCert = (char *) [pathToFie UTF8String];
    char *pFormat = (char *) [format UTF8String];
    char *pCategory = (char *) [category UTF8String];
    TrustedHandle<Bio> in = NULL;
    TrustedHandle<Certificate> cert = new Certificate();
    DataFormat::DATA_FORMAT data_format;
    if (strncmp(pFormat, "DER", 3) == 0)
      data_format = DataFormat::DER;
    else{
      if (strncmp(pFormat, "BASE64", 6) == 0)
        data_format = DataFormat::BASE64;
      else{
        THROW_EXCEPTION(0, PCert, NULL, "Error input format!");
      }
    }
    in = new Bio(BIO_TYPE_FILE, pPathCert, "rb");
    cert->read(in, data_format);
    
    PCCERT_CONTEXT pUserCert = NULL;
    //преобразование TrustedHandle<Certificate> в PCCERT_CONTEXT
    unsigned char *pData = NULL, *p = NULL;
    int iData;
    if (cert->isEmpty())
      THROW_EXCEPTION(0, PCert, NULL, "Cert cannot be empty!");
    
    if ((iData = i2d_X509(cert->internal(), NULL)) <= 0)
      THROW_EXCEPTION(0, PCert, NULL, "Error i2d_X509!");
    
    if (NULL == (pData = (unsigned char*)OPENSSL_malloc(iData)))
      THROW_EXCEPTION(0, PCert, NULL, "Error malloc!");
    
    p = pData;
    if ((iData = i2d_X509(cert->internal(), &p)) <= 0)
      THROW_EXCEPTION(0, PCert, NULL, "Error i2d_X509!");
    
    if (NULL == (pUserCert = CertCreateCertificateContext(X509_ASN_ENCODING | PKCS_7_ASN_ENCODING, pData, iData)))
      THROW_EXCEPTION(0, PCert, NULL, "CertCreateCertificateContext() failed.");
    
    //преобразование category из char * в wchar_t
    const size_t cSize = strlen(pCategory)+1;
    wchar_t* w_pCategory = new wchar_t[cSize];
    mbstowcs (w_pCategory, pCategory, cSize);
    
    DWORD dwFlags = CERT_SYSTEM_STORE_CURRENT_USER | CERT_STORE_OPEN_EXISTING_FLAG;
    HCERTSTORE hStore = CertOpenStore(CERT_STORE_PROV_SYSTEM, 0, 0, dwFlags, w_pCategory);
    //добавление сертификата
    if (!CertAddCertificateContextToStore(hStore, pUserCert, CERT_STORE_ADD_REPLACE_EXISTING, NULL)){
      THROW_EXCEPTION(0, PCert, NULL, "CertAddCertificateContextToStore failed: Code: %d", CSP_GetLastError());
    }
    CertCloseStore(hStore, 0);
    free(pData);
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@(e->description().c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(deleteCertInStore: (NSString *)serialNumber: (NSString *)category: (RCTResponseSenderBlock)callback){
  try{
    PCCERT_CONTEXT pUserCert = NULL;
    pUserCert = findCertInCSPStore(serialNumber, category);
    
    if (!CertDeleteCertificateFromStore(pUserCert)) {
      THROW_EXCEPTION(0, ProviderCryptopro, NULL, "CertDeleteCertificateFromStore failed: Code: %d", CSP_GetLastError());
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
