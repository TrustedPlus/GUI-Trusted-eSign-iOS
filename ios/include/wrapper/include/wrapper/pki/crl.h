#ifndef PKI_CRL_H_INCLUDED
#define PKI_CRL_H_INCLUDED

#include <openssl/x509v3.h>
#include <openssl/pem.h>

#include "../common/common.h"

#include "revokeds.h"

#define ERROR_CRL_BAD_INPUT_DATA "Input data is not CRL"
#define ERROR_CRL_BAD_DIR_INPUT_DATA "Input data is not binary CRL format"
#define ERROR_CRL_BAD_PEM_INPUT_DATA "Input data is not PEM CRL format"

class CTWRAPPER_API CRL;
class CTWRAPPER_API RevokedCertificate;

#include "pki.h"

SSLOBJECT_free(X509_CRL, X509_CRL_free);

class CRL : public SSLObject < X509_CRL > {
public:
	SSLOBJECT_new(CRL, X509_CRL){}
	SSLOBJECT_new_null(CRL, X509_CRL, X509_CRL_new){}

	//Methods
	void read(::TrustedHandle<Bio> in, DataFormat::DATA_FORMAT format);
	void write(::TrustedHandle<Bio> out, DataFormat::DATA_FORMAT format);
	int equals(::TrustedHandle<CRL> crl);
	::TrustedHandle<CRL> duplicate();
	int compare(::TrustedHandle<CRL> crl);
	::TrustedHandle<std::string> hash(const EVP_MD *md);
	::TrustedHandle<std::string> hash(::TrustedHandle<std::string> algorithm);

	//Properties
	::TrustedHandle<std::string> getThumbprint();
	::TrustedHandle<std::string> getEncoded();
	::TrustedHandle<std::string> getSignature();
	::TrustedHandle<std::string> getThisUpdate();
	::TrustedHandle<std::string> getNextUpdate();
	::TrustedHandle<std::string> getSigAlgName();
	::TrustedHandle<std::string> getSigAlgShortName();
	::TrustedHandle<std::string> getSigAlgOID();
	long getVersion();
	::TrustedHandle<RevokedCollection> getRevoked();
public:
	::TrustedHandle<std::string> issuerName();
	::TrustedHandle<std::string> issuerFriendlyName();
protected:
	static ::TrustedHandle<std::string> GetCommonName(X509_NAME *a);
};

#endif // PKI_CRL_H_INCLUDED