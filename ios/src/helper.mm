//
//  helper.m
//  libWrap
//
//  Created by admin on 09/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#include "helper.h"
const char * providerOpenSSL = "OpenSSL";
const char * providerCryptoPro = "CryptoPro";
const char * providerIOS = "IOS";

#ifdef ProvOpenSSL
  Ossl_Main *ossl_Main = [[Ossl_Main alloc] init];
  Ossl_Cert *ossl_Cert = [[Ossl_Cert alloc] init];
  Ossl_Pkcs12 *ossl_Pkcs12 = [[Ossl_Pkcs12 alloc] init];
  Ossl_Cipher *ossl_Cipher = [[Ossl_Cipher alloc] init];
  Ossl_Signer *ossl_Signer = [[Ossl_Signer alloc] init];
#endif
#ifdef ProvCryptoPro
  CSP_Main *csp_Main = [[CSP_Main alloc] init];
  CSP_Cert *csp_Cert = [[CSP_Cert alloc] init];
  CSP_Certs *csp_Certs = [[CSP_Certs alloc] init];
  CSP_Cipher *csp_Cipher = [[CSP_Cipher alloc] init];
  CSP_Signer *csp_Signer = [[CSP_Signer alloc] init];
#endif

BOOL isGostCert(char *pathCert, char *format){
  try{
    TrustedHandle<Certificate> cert = new Certificate();
    TrustedHandle<Bio> in = NULL;
    DataFormat::DATA_FORMAT data_format;
    if (strcmp(format, "DER") == 0)
      data_format = DataFormat::DER;
    else{
      if (strcmp(format, "BASE64") == 0)
        data_format = DataFormat::BASE64;
      else{
        THROW_EXCEPTION(0, CertsList, NULL, "Error input format!");
      }
    }
    in = new Bio(BIO_TYPE_FILE, pathCert, "rb");
    cert->read(in, data_format);
    
    X509_ALGOR *sigalg = cert->internal()->sig_alg;
    TrustedHandle<OID> str_oid = (new Algorithm(sigalg))->getTypeId();
    TrustedHandle<std::string> str_2 = str_oid->toString();
    
    if (str_2->c_str() == NULL) {
      THROW_OPENSSL_EXCEPTION(0, CertsList, NULL, "undefined algorithm!");
    }
    if ((strcmp(str_2->c_str(), "1.2.643.7.1.1.3.3") == 0) || (strcmp(str_2->c_str(), "1.2.643.7.1.1.3.2") == 0) || (strcmp(str_2->c_str(), "1.2.643.2.2.3") == 0) || (strcmp(str_2->c_str(), "1.2.643.2.2.3") == 0)){
      return true;
    }
    else{
      return false;
    }
  }
  catch (TrustedHandle<Exception> e){
    throw e;
  }
}
