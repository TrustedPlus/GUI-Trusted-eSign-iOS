#ifndef PKISTORE_H_INCLUDED
#define PKISTORE_H_INCLUDED

#include "../stdafx.h"

#include "../common/common.h"

#include "../pki/cert.h"
#include "../pki/certs.h"
#include "../pki/crl.h"
#include "../pki/key.h"
#include "../pki/cert_request.h"

#include "storehelper.h"
#include "cashjson.h"

class CTWRAPPER_API PkiStore;

class PkiStore {
public:
	PkiStore(::TrustedHandle<std::string> json);
	~PkiStore(){};

public:
	::TrustedHandle<CertificateCollection> getCerts();
	::TrustedHandle<PkiItemCollection> getItems();

	void addProvider(::TrustedHandle<Provider> provider);
	void deleteProvider(::TrustedHandle<std::string> typeProvider);
	
	::TrustedHandle<PkiItemCollection> find(::TrustedHandle<Filter> filter);
	::TrustedHandle<PkiItem> findKey(::TrustedHandle<Filter> filter);

	::TrustedHandle<Certificate> getItemCert(::TrustedHandle<PkiItem> item);
	::TrustedHandle<CRL> getItemCrl(::TrustedHandle<PkiItem> item);
	::TrustedHandle<Key> getItemKey(::TrustedHandle<PkiItem> item);
	::TrustedHandle<CertificationRequest> getItemReq(::TrustedHandle<PkiItem> item);

	::TrustedHandle<std::string> addPkiObject(::TrustedHandle<Provider> provider, ::TrustedHandle<std::string> category, ::TrustedHandle<Certificate> cert);
	::TrustedHandle<std::string> addPkiObject(::TrustedHandle<Provider> provider, ::TrustedHandle<std::string> category, ::TrustedHandle<CRL> crl);
	::TrustedHandle<std::string> addPkiObject(::TrustedHandle<Provider> provider, ::TrustedHandle<std::string> category, ::TrustedHandle<CertificationRequest> csr);
	::TrustedHandle<std::string> addPkiObject(::TrustedHandle<Provider> provider, ::TrustedHandle<Key> key, ::TrustedHandle<std::string> password);

	void deletePkiObject(::TrustedHandle<Provider> provider, ::TrustedHandle<std::string> category, ::TrustedHandle<Certificate> cert);

	static void bin_to_strhex(unsigned char *bin, unsigned int binsz, char **result);

private:
	::TrustedHandle<ProviderCollection> providers;
	::TrustedHandle<PkiItemCollection> storeItemCollection;
};

#endif //PKISTORE_H_INCLUDED