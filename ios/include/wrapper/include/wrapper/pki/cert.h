#ifndef CMS_PKI_CERT_H_INCLUDED
#define  CMS_PKI_CERT_H_INCLUDED

#include <vector>

#include <openssl/x509v3.h>
#include <openssl/pem.h>

#include "../common/common.h"

class CTWRAPPER_API Certificate;

#include "pki.h"
#include "key.h"
#include "exts.h"
#include "cert_request.h"

#define SERIAL_RAND_BITS 64

SSLOBJECT_free(X509, X509_free);

class Certificate : public SSLObject < X509 > {
public:
	//constructor
	SSLOBJECT_new(Certificate, X509){}
	SSLOBJECT_new_null(Certificate, X509, X509_new){}

	Certificate(::TrustedHandle<CertificationRequest> csr);

	//properties
	long getVersion();
	::TrustedHandle<std::string> getSerialNumber();
	::TrustedHandle<std::string> getNotBefore();
	::TrustedHandle<std::string> getNotAfter();
	::TrustedHandle<std::string> getIssuerFriendlyName();
	::TrustedHandle<std::string> getIssuerName();
	::TrustedHandle<std::string> getSubjectFriendlyName();
	::TrustedHandle<std::string> getSubjectName();
	::TrustedHandle<std::string> getThumbprint();
	::TrustedHandle<std::string> getPublicKeyAlgorithm();
	::TrustedHandle<std::string> getSignatureAlgorithm();
	::TrustedHandle<std::string> getSignatureDigestAlgorithm();
	::TrustedHandle<std::string> getOrganizationName();
	::TrustedHandle<Key> getPublicKey();
	std::vector<std::string> getOCSPUrls();
	std::vector<std::string> getCAIssuersUrls();
	::TrustedHandle<ExtensionCollection> getExtensions();
	int getType();
	int getKeyUsage();
	bool isSelfSigned();
	bool isCA();

	void setSubject(::TrustedHandle<std::string> x509Name);
	void setIssuer(::TrustedHandle<std::string> x509Name);
	void setVersion(long version);
	void setExtensions(::TrustedHandle<ExtensionCollection> exts);
	void setNotBefore(long offset_sec = 0);
	void setNotAfter(long offset_sec);
	void setSerialNumber(::TrustedHandle<std::string> serial);

	//Methods
	void read(::TrustedHandle<Bio> in, DataFormat::DATA_FORMAT format);
	void write(::TrustedHandle<Bio> out, DataFormat::DATA_FORMAT format);
	::TrustedHandle<Certificate> duplicate();
	int compare(::TrustedHandle<Certificate> cert);
	bool equals(::TrustedHandle<Certificate> cert);
	::TrustedHandle<std::string> hash(::TrustedHandle<std::string> algorithm);
	::TrustedHandle<std::string> hash(const EVP_MD *md);
	void sign(::TrustedHandle<Key> key, const char* digest);

protected:
	static ::TrustedHandle<std::string> GetCommonName(X509_NAME *a);
};

char *i2t_X509_NAME_CN(X509_NAME *a, char* buf, int len);

#endif //!CMS_PKI_CERT_H_INCLUDED
