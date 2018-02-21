#ifndef CMS_PKI_PKCS12_H_INCLUDED
#define  CMS_PKI_PKCS12_H_INCLUDED

#include <openssl/x509v3.h>
#include <openssl/pem.h>
#include <openssl/pkcs12.h>

#include "../common/common.h"

class CTWRAPPER_API Pkcs12;

#include "pki.h"
#include "key.h"

SSLOBJECT_free(PKCS12, PKCS12_free);

class Pkcs12 : public SSLObject < PKCS12 > {
public:
	//constructor
	SSLOBJECT_new(Pkcs12, PKCS12){}
	SSLOBJECT_new_null(Pkcs12, PKCS12, PKCS12_new){}

	//properties
	::TrustedHandle<Certificate> getCertificate(const char *pass);
	::TrustedHandle<Key> getKey(const char *pass);
	::TrustedHandle<CertificateCollection> getCACertificates(const char *pass);

	//Methods
	void read(::TrustedHandle<Bio> in);
	void write(::TrustedHandle<Bio> out);
	::TrustedHandle<Pkcs12> create(::TrustedHandle<Certificate> cert, ::TrustedHandle<Key> key, ::TrustedHandle<CertificateCollection> ca, char *pass, char *name);
};

#endif //!CMS_PKI_PKCS12_H_INCLUDED
