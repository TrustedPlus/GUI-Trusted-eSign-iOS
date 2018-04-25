#ifndef CMS_PKI_CERTREG_H_INCLUDED
#define  CMS_PKI_CERTREG_H_INCLUDED

#include <openssl/x509v3.h>

#include "../common/common.h"

class CTWRAPPER_API CertificationRequest;

#include "pki.h"
#include "cert_request_info.h"
#include "exts.h"

SSLOBJECT_free(X509_REQ, X509_REQ_free)

class CertificationRequest : public SSLObject < X509_REQ > {
public:
	//Constructor
	SSLOBJECT_new(CertificationRequest, X509_REQ){}
	SSLOBJECT_new_null(CertificationRequest, X509_REQ, X509_REQ_new){}

	CertificationRequest(::TrustedHandle<CertificationRequestInfo> csrinfo);

	void read(::TrustedHandle<Bio> in, DataFormat::DATA_FORMAT format);
	void write(::TrustedHandle<Bio> out, DataFormat::DATA_FORMAT format);
	::TrustedHandle<CertificationRequest> duplicate();

	void setSubject(::TrustedHandle<std::string> x509Name);
	void setPublicKey(::TrustedHandle<Key> key);
	void setVersion(long version);
	void setExtensions(::TrustedHandle<ExtensionCollection> exts);

	::TrustedHandle<std::string> getSubject();
	::TrustedHandle<Key> getPublicKey();
	long getVersion();
	::TrustedHandle<ExtensionCollection> getExtensions();

	void sign(::TrustedHandle<Key> key, const char* digest);
	bool verify();

	::TrustedHandle<Certificate> toCertificate(int days, ::TrustedHandle<Key> key);

	::TrustedHandle<std::string> getPEMString();
};

#endif