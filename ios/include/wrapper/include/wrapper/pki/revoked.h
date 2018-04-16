#ifndef CMS_PKI_REVOKED_H_INCLUDED
#define  CMS_PKI_REVOKED_H_INCLUDED

#include <openssl/x509v3.h>
#include <openssl/pem.h>

#include "../common/common.h"

class CTWRAPPER_API RevokedCertificate;

SSLOBJECT_free(X509_REVOKED, X509_REVOKED_free);

class Revoked : public SSLObject < X509_REVOKED > {
public:
	SSLOBJECT_new(Revoked, X509_REVOKED){}
	SSLOBJECT_new_null(Revoked, X509_REVOKED, X509_REVOKED_new){}

	::TrustedHandle<Revoked> duplicate();

	//Properties
public:
	::TrustedHandle<std::string> getSerialNumber();
	::TrustedHandle<std::string> getRevocationDate();
	::TrustedHandle<std::string> getReason();
};

#endif //!CMS_PKI_REVOKED_H_INCLUDED
