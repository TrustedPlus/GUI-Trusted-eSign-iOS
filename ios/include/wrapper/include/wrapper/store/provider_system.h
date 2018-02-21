#ifndef PROVIDER_SYSTEM_H_INCLUDED
#define PROVIDER_SYSTEM_H_INCLUDED

#include "../common/common.h"

#include <stdio.h>
#include <string>

#if defined(OPENSSL_SYS_WINDOWS) 
	#include <tchar.h> 
	#include <strsafe.h>
	#include <direct.h>
#endif
#if defined(OPENSSL_SYS_UNIX)
	#include <dirent.h>
	#include <sys/types.h>
	#include <sys/stat.h>
#endif

#include "pkistore.h"

class Provider_System : public Provider{
public:
	Provider_System(){};
	Provider_System(::TrustedHandle<std::string> folder);
	~Provider_System(){};

	::TrustedHandle<Certificate> static getCertFromURI(::TrustedHandle<std::string> uri, ::TrustedHandle<std::string> format);
	::TrustedHandle<CRL> static getCRLFromURI(::TrustedHandle<std::string> uri, ::TrustedHandle<std::string> format);
	::TrustedHandle<CertificationRequest> static getCSRFromURI(::TrustedHandle<std::string> uri, ::TrustedHandle<std::string> format);
	::TrustedHandle<Key> static getKeyFromURI(::TrustedHandle<std::string> uri, ::TrustedHandle<std::string> format, bool enc);

	static void addPkiObject(::TrustedHandle<std::string> uri, ::TrustedHandle<Certificate> cert);
	static void addPkiObject(::TrustedHandle<std::string> uri, ::TrustedHandle<CRL> crl);
	static void addPkiObject(::TrustedHandle<std::string> uri, ::TrustedHandle<CertificationRequest> csr);
	static void addPkiObject(::TrustedHandle<std::string> uri, ::TrustedHandle<Key> key, ::TrustedHandle<std::string> password);

	::TrustedHandle<PkiItem> objectToPKIItem(::TrustedHandle<std::string> URI);

private:
	void init(::TrustedHandle<std::string> folder);	
	
	/*
	* Check file for pkcs#8 private key headers.
	* Only pkcs#8 key in PEM format.
	*/
	bool itPrivateKey(::TrustedHandle<std::string> uri, int *enc);

	/*
	* Search (object filename).key in curent folder, if can find it return key filename.
	* Key's filename  must be SHA1 hash and length 40.
	* Use for certificate or request pki object.
	*/
	::TrustedHandle<std::string> getKey(::TrustedHandle<std::string> objectPatch);
};

#endif //PROVIDER_SYSTEM_H_INCLUDED