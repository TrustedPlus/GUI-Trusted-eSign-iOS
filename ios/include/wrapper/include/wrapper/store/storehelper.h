#ifndef STOREHELPER_H_INCLUDED
#define STOREHELPER_H_INCLUDED

#include "../stdafx.h"

#include <vector>

#include "../common/common.h"
#include "../pki/cert.h"
#include "../pki/crl.h"
#include "../pki/key.h"
#include "../pki/cert_request.h"

#if defined(OPENSSL_SYS_WINDOWS) 
	#define CROSSPLATFORM_SLASH       '\\'
#endif
#if defined(OPENSSL_SYS_UNIX) 
	#define CROSSPLATFORM_SLASH       '/'
#endif

class IPkiKey {
public:
	virtual ~IPkiKey(){};
public:
	bool keyEncrypted; /* Encrypted key (true or false) */
public:
	::TrustedHandle<Key> key;
};

class IPkiCrl {
public:
	virtual ~IPkiCrl(){};
public:
	::TrustedHandle<std::string> crlIssuerName;
	::TrustedHandle<std::string> crlIssuerFriendlyName;
	::TrustedHandle<std::string> crlLastUpdate;
	::TrustedHandle<std::string> crlNextUpdate;
public:
	::TrustedHandle<CRL> crl;
};

class IPkiRequest {
public:
	virtual ~IPkiRequest(){};
public:
	::TrustedHandle<std::string> csrSubjectName;
	::TrustedHandle<std::string>	csrSubjectFriendlyName;
	::TrustedHandle<std::string> csrKey; /* thumbprint SHA1 */
public:
	::TrustedHandle<CertificationRequest> csr;
};

class IPkiCertificate {
public:
	virtual ~IPkiCertificate(){};
public:
	::TrustedHandle<std::string> certSubjectName;
	::TrustedHandle<std::string> certSubjectFriendlyName;
	::TrustedHandle<std::string> certIssuerName;
	::TrustedHandle<std::string> certIssuerFriendlyName;
	::TrustedHandle<std::string> certNotBefore;
	::TrustedHandle<std::string> certNotAfter;
	::TrustedHandle<std::string> certSerial;
	::TrustedHandle<std::string> certKey; /* thumbprint SHA1 */
	::TrustedHandle<std::string> certOrganizationName;
	::TrustedHandle<std::string> certSignatureAlgorithm; /* thumbprint SHA1 */
	::TrustedHandle<std::string> certSignatureDigestAlgorithm;
	::TrustedHandle<std::string> certPublicKeyAlgorithm;

public:
	::TrustedHandle<Certificate> certificate;
};

class PkiItem : public IPkiCertificate, public IPkiCrl, public IPkiKey, public IPkiRequest{
public:
	PkiItem();
	~PkiItem(){};
public:
	::TrustedHandle<std::string> format; /* DER | PEM */
	::TrustedHandle<std::string> type; /* CRL | CERTIFICATE | KEY | REQUEST */
	::TrustedHandle<std::string> uri; /* URI to object */
	::TrustedHandle<std::string> provider; /* SYSTEM, MICROSOFT, CRYPTOPRO, TSL, PKCS11, TRUSTEDNET */
	::TrustedHandle<std::string> category; /* MY, OTHERS, TRUST, CRL */
	::TrustedHandle<std::string> hash; /* SHA-1 hash */
	
public:
	void setFormat(::TrustedHandle<std::string> type);
	void setType(::TrustedHandle<std::string> type);
	void setProvider(::TrustedHandle<std::string> provider);
	void setCategory(::TrustedHandle<std::string> category);
	void setURI(::TrustedHandle<std::string> uri);
	void setHash(::TrustedHandle<std::string> hash);
	void setSubjectName(::TrustedHandle<std::string> subjectName);
	void setSubjectFriendlyName(::TrustedHandle<std::string> subjectFriendlyName);
	void setIssuerName(::TrustedHandle<std::string> issuerName);
	void setIssuerFriendlyName(::TrustedHandle<std::string> issuerFriendlyName);
	void setSerial(::TrustedHandle<std::string> serial);
	void setNotBefore(::TrustedHandle<std::string> notBefore);
	void setNotAfter(::TrustedHandle<std::string> notAfter);
	void setLastUpdate(::TrustedHandle<std::string> lastUpdate);
	void setNextUpdate(::TrustedHandle<std::string> nextUpdate);
	void setKey(::TrustedHandle<std::string> keyid);
	void setKeyEncypted(bool enc);
	void setOrganizationName(::TrustedHandle<std::string> organizationName);
	void setSignatureAlgorithm(::TrustedHandle<std::string> signatureAlgorithm);
	void setSignatureDigestAlgorithm(::TrustedHandle<std::string> signatureDigestAlgorithm);
	void setPublicKeyAlgorithm(::TrustedHandle<std::string> publicKeyAlgorithm);
};

class Filter {
public:
	Filter();
	~Filter(){};
public:
	void setType(::TrustedHandle<std::string> type);
	void setProvider(::TrustedHandle<std::string> provider);
	void setCategory(::TrustedHandle<std::string> category);
	void setHash(::TrustedHandle<std::string> hash);
	void setSubjectName(::TrustedHandle<std::string> subjectName);
	void setSubjectFriendlyName(::TrustedHandle<std::string> subjectFriendlyName);
	void setIssuerName(::TrustedHandle<std::string> issuerName);
	void setIssuerFriendlyName(::TrustedHandle<std::string> issuerFriendlyName);
	void setSerial(::TrustedHandle<std::string> serial);
	void setIsValid(bool isValid);
public:
	std::vector<::TrustedHandle<std::string> > types; /* CRL | CERTIFICATE | KEY | REQUEST (optional) */
	std::vector<::TrustedHandle<std::string> > providers; /* SYSTEM, MICROSOFT, CRYPTOPRO, TSL, PKCS11, TRUSTEDNET (optional) */
	std::vector<::TrustedHandle<std::string> > categorys; /* MY, OTHER, CA, TRUSTED (optional) */
	::TrustedHandle<std::string> hash; /* SHA-1 hash (optional) */
	::TrustedHandle<std::string> subjectName;
	::TrustedHandle<std::string> subjectFriendlyName;
	::TrustedHandle<std::string> issuerName;
	::TrustedHandle<std::string> issuerFriendlyName;
	bool isValid;
	::TrustedHandle<std::string> serial;
};

class PkiItemCollection{
public:
	PkiItemCollection();
	~PkiItemCollection();

	::TrustedHandle<PkiItem> items(int index);
	int length();
	void push(::TrustedHandle<PkiItem> v);
	void push(PkiItem &v);
	::TrustedHandle<PkiItemCollection> find(::TrustedHandle<Filter> filter);
protected:
	std::vector<PkiItem> _items;
};

class Provider {
public:
	Provider(){};
	virtual ~Provider(){};

public:
	::TrustedHandle<std::string> type;
	::TrustedHandle<std::string> path; /* Only for provider system */

	::TrustedHandle<PkiItemCollection> getProviderItemCollection();
	::TrustedHandle<PkiItemCollection> providerItemCollection;
};

class ProviderCollection{
public:
	ProviderCollection();
	~ProviderCollection();

	::TrustedHandle<Provider> items(int index);
	int length();
	void push(::TrustedHandle<Provider> v);
protected:
	std::vector<::TrustedHandle<Provider> > _items;
};

#endif //STOREHELPER_H_INCLUDED