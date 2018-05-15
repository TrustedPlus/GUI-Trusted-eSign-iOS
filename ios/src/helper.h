//
//  helper.h
//  libWrap
//
//  Created by admin on 09/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef helper_h
#define helper_h

#import <Foundation/Foundation.h>

extern const char * providerOpenSSL;
extern const char * providerCryptoPro;
extern const char * providerIOS;

#ifdef ProvOpenSSL
#include <OSSL/Ossl_Main.h>
#include <OSSL/Ossl_Cert.h>
#include <OSSL/Ossl_Store.h>
#include <OSSL/Ossl_Pkcs12.h>
#include <OSSL/Ossl_Cipher.h>
#include <OSSL/Ossl_Signer.h>
#include <OSSL/Ossl_CertRequest.h>
#endif
#ifdef ProvCryptoPro
#include <CSP/CSP_Main.h>
#include <CSP/CSP_Cert.h>
#include <CSP/CSP_Csp.h>
#include <CSP/CSP_Certs.h>
#include <CSP/CSP_Cipher.h>
#include <CSP/CSP_Signer.h>
#include <CSP/CSP_CertRequest.h>
#endif

#ifdef ProvOpenSSL
extern Ossl_Main *ossl_Main;
extern Ossl_Cert *ossl_Cert;
extern Ossl_Pkcs12 *ossl_Pkcs12;
extern Ossl_Cipher *ossl_Cipher;
extern Ossl_Signer *ossl_Signer;
extern Ossl_CertRequest *ossl_CertRequest;
#endif
#ifdef ProvCryptoPro
extern CSP_Main *csp_Main;
extern CSP_Cert *csp_Cert;
extern CSP_Certs *csp_Certs;
extern CSP_Cipher *csp_Cipher;
extern CSP_Signer *csp_Signer;
extern CSP_CertRequest *csp_CertRequest;
extern CSP_Csp *csp_Store;
#endif

BOOL isGostCert(char *pathCert, char *format);

#endif /* helper_h */
