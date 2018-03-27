#import "PHelp.h"

//функция поиска сертификата в хранилище криптоПРО
PCCERT_CONTEXT findCertInCSPStore(NSString *serialNumber, NSString *category){
  try{
    char *pSerialNumber = (char *) [serialNumber UTF8String];
    char *pCategory = (char *) [category UTF8String];
    
    HCERTSTORE hCertStore = 0;
    PCCERT_CONTEXT pUserCert = NULL;
    PCCERT_CONTEXT pUserCert_new = NULL;
    
    hCertStore = CertOpenSystemStore(0, pCategory);
    if(!hCertStore)
      THROW_EXCEPTION(0, PHelp, NULL, "CertOpenSystemStore failed.");
    
    TrustedHandle<Filter> filterByCert = new Filter();
    filterByCert->setSerial(new std::string(pSerialNumber));
    TrustedHandle<PkiItemCollection> pic = g_picCSP->find(filterByCert);
    if (pic->length() <= 0)
      THROW_EXCEPTION(0, PHelp, NULL, "Not find certificate!");
    
    TrustedHandle<PkiItem> pi = new PkiItem();
    pi = pic->items(0);
    
    TrustedHandle<Certificate> cert = pi->certificate;
    
    unsigned char *pData = NULL, *p = NULL;
    int iData; 
    if (cert->isEmpty())
      THROW_EXCEPTION(0, PHelp, NULL, "Cert cannot be empty!");
    
    if ((iData = i2d_X509(cert->internal(), NULL)) <= 0)
      THROW_EXCEPTION(0, PHelp, NULL, "Error i2d_X509!");
    
    if (NULL == (pData = (unsigned char*)OPENSSL_malloc(iData)))
      THROW_EXCEPTION(0, PHelp, NULL, "Error malloc!");
    
    p = pData;
    if ((iData = i2d_X509(cert->internal(), &p)) <= 0)
      THROW_EXCEPTION(0, PHelp, NULL, "Error i2d_X509!");
    
    if (NULL == (pUserCert_new = CertCreateCertificateContext(X509_ASN_ENCODING | PKCS_7_ASN_ENCODING, pData, iData)))
      THROW_EXCEPTION(0, PHelp, NULL, "CertCreateCertificateContext() failed.");
    
    OPENSSL_free(pData);
    
    pUserCert = CertFindCertificateInStore(hCertStore, X509_ASN_ENCODING | PKCS_7_ASN_ENCODING, NULL, CERT_FIND_EXISTING, pUserCert_new, NULL);
    if (!pUserCert)
      THROW_EXCEPTION(0, PHelp, NULL, "No find exiting certificates.");
    
    if (hCertStore){
      CertCloseStore(hCertStore, 0);
      hCertStore = HCRYPT_NULL;
    }
    
    if (pUserCert_new){
      CertFreeCertificateContext(pUserCert_new);
      pUserCert_new = HCRYPT_NULL;
    }
    
    return pUserCert;
  }
  catch (TrustedHandle<Exception> e){
    throw e;
  }
}

//считывание файла в массив байт
BYTE *readFile(NSString *file, DWORD &cbContent){
  try{
    char *infile = (char *) [file UTF8String];
    FILE *tbs = NULL;
    BYTE *pbContent = NULL;
    //read input file
    tbs = fopen (infile, "rb");
    if (!tbs) {
      THROW_EXCEPTION(0, PHelp, NULL, "Cannot open input file.");
    }
    cbContent = 0;
    while (!feof(tbs)) {
      int r = 0;
      BYTE tmp[1024];
      r = fread(tmp, 1, 1024, tbs);
      pbContent = (BYTE *)realloc(pbContent, cbContent+r);
      memcpy (&pbContent[cbContent], tmp, r);
      cbContent += r;
    }
    fclose (tbs);
    tbs = NULL;
    return pbContent;
  }
  catch (TrustedHandle<Exception> e){
    throw e;
  }
}
