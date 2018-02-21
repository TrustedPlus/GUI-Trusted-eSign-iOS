#pragma once

#include "../common/common.h"
#include "../utils/csp.h"

#include <string.h>

#ifndef OPENSSL_NO_CTGOSTCP
	#include <openssl/opensslconf.h>
	#include <openssl/crypto.h>
	#include <openssl/ctgostcp.h>
	#include <openssl/ctcrypto.h>
#endif

#include "pkistore.h"

class ProviderCryptopro : public Provider{
public:
	ProviderCryptopro();
	~ProviderCryptopro(){};

public:
	::TrustedHandle<Certificate> static getCert(::TrustedHandle<std::string> hash, ::TrustedHandle<std::string> category);
	::TrustedHandle<CRL> static getCRL(::TrustedHandle<std::string> hash, ::TrustedHandle<std::string> category);
	::TrustedHandle<Key> static getKey(::TrustedHandle<Certificate> cert);

	static void addPkiObject(::TrustedHandle<Certificate> cert, ::TrustedHandle<std::string> category);
	static void deletePkiObject(::TrustedHandle<Certificate> cert, ::TrustedHandle<std::string> category);

	bool static hasPrivateKey(::TrustedHandle<Certificate> cert);

private:
	void init();
	void enumCertificates(HCERTSTORE hCertStore, std::string *category);
	void enumCrls(HCERTSTORE hCertStore, std::string *category);
	::TrustedHandle<PkiItem> objectToPKIItem(::TrustedHandle<Certificate> cert);
	::TrustedHandle<PkiItem> objectToPKIItem(::TrustedHandle<CRL> crl);

	int static char2int(char input);
	void static hex2bin(const char* src, char* target);
};
