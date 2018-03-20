#include "../stdafx.h"

#include "../../include/wrapper/store/provider_microsoft.h"

ProviderMicrosoft::ProviderMicrosoft(){
	LOGGER_FN();

	try{
		type = new std::string("MICROSOFT");
		providerItemCollection = new PkiItemCollection();

		init();
	}
	catch (::TrustedHandle<Exception> e){
		THROW_EXCEPTION(0, ProviderMicrosoft, e, "Cannot be constructed ProviderMicrosoft");
	}
}
void ProviderMicrosoft::init(){
	LOGGER_FN();

	try{
		std::string listStore[] = {
			"MY",
			"AddressBook",
			"ROOT",
			"TRUST",
			"CA",
			"Request",
		};

		HCERTSTORE hCertStore;

		for (int i = 0, c = sizeof(listStore) / sizeof(*listStore); i < c; i++){
			std::wstring widestr = std::wstring(listStore[i].begin(), listStore[i].end());
			hCertStore = CertOpenStore(
				CERT_STORE_PROV_SYSTEM,
				PKCS_7_ASN_ENCODING | X509_ASN_ENCODING,
				NULL,
				CERT_SYSTEM_STORE_CURRENT_USER,
				widestr.c_str()
				);

			if (!hCertStore) {
				LOGGER_ERROR("error open store");
				continue;
			}

			enumCertificates(hCertStore, &listStore[i]);
			enumCrls(hCertStore, &listStore[i]);

			CertCloseStore(hCertStore, 0);
		}
	}
	catch (::TrustedHandle<Exception> e){
		THROW_EXCEPTION(0, ProviderMicrosoft, e, "Error init microsoft provider");
	}
}

void ProviderMicrosoft::enumCertificates(HCERTSTORE hCertStore, std::string *category){
	LOGGER_FN();

	try{
		X509 *cert = NULL;
		const unsigned char *p;

		if (!hCertStore){
			THROW_EXCEPTION(0, ProviderMicrosoft, NULL, "Certificate store not opened");
		}

		PCCERT_CONTEXT pCertContext = NULL;
		do
		{
			pCertContext = CertEnumCertificatesInStore(hCertStore, pCertContext);
			if (pCertContext){
				p = pCertContext->pbCertEncoded;
				LOGGER_OPENSSL(d2i_X509);
				if (!(cert = d2i_X509(NULL, &p, pCertContext->cbCertEncoded))) {
					THROW_OPENSSL_EXCEPTION(0, ProviderMicrosoft, NULL, "'d2i_X509' Error decode len bytes");
				}

				::TrustedHandle<Certificate> hcert = new Certificate(cert);
				::TrustedHandle<PkiItem> item = objectToPKIItem(hcert);
				item->category = new std::string(*category);
				item->certificate = hcert;

				providerItemCollection->push(item);
			}
		} while (pCertContext != NULL);

		if (pCertContext){
			CertFreeCertificateContext(pCertContext);
		}
	}
	catch (::TrustedHandle<Exception> e){
		THROW_EXCEPTION(0, ProviderMicrosoft, e, "Error enum certificates in store");
	}
}

void ProviderMicrosoft::enumCrls(HCERTSTORE hCertStore, std::string *category){
	LOGGER_FN();

	try{
		X509_CRL *crl = NULL;
		const unsigned char *p;

		if (!hCertStore){
			THROW_EXCEPTION(0, ProviderMicrosoft, NULL, "Certificate store not opened");
		}

		PCCRL_CONTEXT pCrlContext = NULL;
		do
		{
			pCrlContext = CertEnumCRLsInStore(hCertStore, pCrlContext);
			if (pCrlContext){
				p = pCrlContext->pbCrlEncoded;
				LOGGER_OPENSSL(d2i_X509_CRL);
				if (!(crl = d2i_X509_CRL(NULL, &p, pCrlContext->cbCrlEncoded))) {
					THROW_OPENSSL_EXCEPTION(0, ProviderMicrosoft, NULL, "'d2i_X509_CRL' Error decode len bytes");
				}

				::TrustedHandle<CRL> hcrl = new CRL(crl);
				::TrustedHandle<PkiItem> item = objectToPKIItem(hcrl);
				item->category = new std::string(*category);
				item->crl = hcrl;

				providerItemCollection->push(item);
			}
		} while (pCrlContext != NULL);

		if (pCrlContext){
			CertFreeCRLContext(pCrlContext);
		}
	}
	catch (::TrustedHandle<Exception> e){
		THROW_EXCEPTION(0, ProviderMicrosoft, e, "Error enum CRLs in store");
	}
}

::TrustedHandle<PkiItem> ProviderMicrosoft::objectToPKIItem(::TrustedHandle<Certificate> cert){
	LOGGER_FN();

	try{
		if (cert.isEmpty()){
			THROW_EXCEPTION(0, ProviderMicrosoft, NULL, "Certificate empty");
		}

		::TrustedHandle<PkiItem> item = new PkiItem();

		item->format = new std::string("DER");
		item->type = new std::string("CERTIFICATE");
		item->provider = new std::string("MICROSOFT");

		char * hexHash;
		::TrustedHandle<std::string> hhash = cert->getThumbprint();
		PkiStore::bin_to_strhex((unsigned char *)hhash->c_str(), hhash->length(), &hexHash);
		item->hash = new std::string(hexHash);

		item->certSubjectName = cert->getSubjectName();
		item->certSubjectFriendlyName = cert->getSubjectFriendlyName();
		item->certIssuerName = cert->getIssuerName();
		item->certIssuerFriendlyName = cert->getIssuerFriendlyName();
		item->certSerial = cert->getSerialNumber();
		item->certOrganizationName = cert->getOrganizationName();
		item->certSignatureAlgorithm = cert->getSignatureAlgorithm();
		item->certSignatureDigestAlgorithm = cert->getSignatureDigestAlgorithm();
		item->certPublicKeyAlgorithm = cert->getPublicKeyAlgorithm();

		item->certNotBefore = cert->getNotBefore();
		item->certNotAfter = cert->getNotAfter();
		item->certKey = hasPrivateKey(cert) ? new std::string("1") : new std::string("");

		return item;
	}
	catch (::TrustedHandle<Exception> e){
		THROW_EXCEPTION(0, ProviderMicrosoft, e, "Error create PkiItem from certificate");
	}
}

::TrustedHandle<PkiItem> ProviderMicrosoft::objectToPKIItem(::TrustedHandle<CRL> crl){
	LOGGER_FN();

	try{
		if (crl.isEmpty()){
			THROW_EXCEPTION(0, ProviderMicrosoft, NULL, "CRL empty");
		}

		::TrustedHandle<PkiItem> item = new PkiItem();

		item->format = new std::string("DER");
		item->type = new std::string("CRL");
		item->provider = new std::string("MICROSOFT");

		char * hexHash;
		::TrustedHandle<std::string> hhash = crl->getThumbprint();
		PkiStore::bin_to_strhex((unsigned char *)hhash->c_str(), hhash->length(), &hexHash);
		item->hash = new std::string(hexHash);

		item->crlIssuerName = crl->issuerName();
		item->crlIssuerFriendlyName = crl->issuerFriendlyName();
		item->crlLastUpdate = crl->getThisUpdate();
		item->crlNextUpdate = crl->getNextUpdate();

		return item;
	}
	catch (::TrustedHandle<Exception> e){
		THROW_EXCEPTION(0, ProviderMicrosoft, e, "Error create PkiItem from crl");
	}
}

::TrustedHandle<Certificate> ProviderMicrosoft::getCert(::TrustedHandle<std::string> hash, ::TrustedHandle<std::string> category){
	LOGGER_FN();

	X509 *hcert = NULL;

	try{
		HCERTSTORE hCertStore;
		PCCERT_CONTEXT pCertContext = NULL;

		const unsigned char *p;

		std::wstring wCategory = std::wstring(category->begin(), category->end());

		char cHash[20] = { 0 };
		hex2bin(hash->c_str(), cHash);

		CRYPT_HASH_BLOB cblobHash;
		cblobHash.pbData = (BYTE *)cHash;
		cblobHash.cbData = (DWORD)20;

		hCertStore = CertOpenStore(
			CERT_STORE_PROV_SYSTEM,
			PKCS_7_ASN_ENCODING | X509_ASN_ENCODING,
			NULL,
			CERT_SYSTEM_STORE_CURRENT_USER,
			wCategory.c_str()
			);

		if (!hCertStore) {
			THROW_EXCEPTION(0, ProviderMicrosoft, NULL, "Error open store");
		}

		pCertContext = CertFindCertificateInStore(
			hCertStore,
			X509_ASN_ENCODING | PKCS_7_ASN_ENCODING,
			0,
			CERT_FIND_HASH,
			&cblobHash,
			NULL);

		if (pCertContext) {
			p = pCertContext->pbCertEncoded;
			LOGGER_OPENSSL(d2i_X509);

			if (!(hcert = d2i_X509(NULL, &p, pCertContext->cbCertEncoded))) {
				THROW_OPENSSL_EXCEPTION(0, ProviderMicrosoft, NULL, "'d2i_X509' Error decode len bytes");
			}

			CertFreeCertificateContext(pCertContext);

			CertCloseStore(hCertStore, 0);

			return new Certificate(hcert);
		}
		else{
			THROW_EXCEPTION(0, ProviderMicrosoft, NULL, "Cannot find certificate in store");
		}
	}
	catch (::TrustedHandle<Exception> e){
		THROW_EXCEPTION(0, ProviderMicrosoft, e, "Error get certificate");
	}
}

::TrustedHandle<CRL> ProviderMicrosoft::getCRL(::TrustedHandle<std::string> hash, ::TrustedHandle<std::string> category){
	LOGGER_FN();

	try{
		HCERTSTORE hCertStore;
		PCCRL_CONTEXT pCrlContext = NULL;

		const unsigned char *p;

		std::wstring wCategory = std::wstring(category->begin(), category->end());

		hCertStore = CertOpenStore(
			CERT_STORE_PROV_SYSTEM,
			PKCS_7_ASN_ENCODING | X509_ASN_ENCODING,
			NULL,
			CERT_SYSTEM_STORE_CURRENT_USER,
			wCategory.c_str()
			);

		if (!hCertStore) {
			THROW_EXCEPTION(0, ProviderMicrosoft, NULL, "Error open store");
		}

		do
		{
			pCrlContext = CertEnumCRLsInStore(hCertStore, pCrlContext);
			if (pCrlContext){
				X509_CRL *tempCrl = NULL;
				p = pCrlContext->pbCrlEncoded;
				LOGGER_OPENSSL(d2i_X509_CRL);
				if (!(tempCrl = d2i_X509_CRL(NULL, &p, pCrlContext->cbCrlEncoded))) {
					THROW_OPENSSL_EXCEPTION(0, ProviderMicrosoft, NULL, "'d2i_X509_CRL' Error decode len bytes");
				}

				::TrustedHandle<CRL> hTempCrl = new CRL(tempCrl);

				char * hexHash;
				::TrustedHandle<std::string> hhash = hTempCrl->getThumbprint();
				PkiStore::bin_to_strhex((unsigned char *)hhash->c_str(), hhash->length(), &hexHash);
				std::string sh(hexHash);

				if (strcmp(sh.c_str(), hash->c_str()) == 0){
					return hTempCrl;
				}
			}
		} while (pCrlContext != NULL);

		if (pCrlContext){
			CertFreeCRLContext(pCrlContext);
		}

		CertCloseStore(hCertStore, 0);

		THROW_EXCEPTION(0, ProviderMicrosoft, NULL, "Cannot find CRL in store");
	}
	catch (::TrustedHandle<Exception> e){
		THROW_EXCEPTION(0, ProviderMicrosoft, e, "Error get CRL");
	}
}

::TrustedHandle<Key> ProviderMicrosoft::getKey(::TrustedHandle<Certificate> cert) {
	LOGGER_FN();

	EVP_PKEY_CTX *pctx = NULL;
	EVP_PKEY *pkey = NULL;
	EVP_MD_CTX *mctx = NULL;

	try{
		EVP_PKEY *pubkey;
		LOGGER_OPENSSL(X509_get_pubkey);
		pubkey = X509_get_pubkey(cert->internal());
		if (!pubkey) {
			THROW_OPENSSL_EXCEPTION(0, ProviderMicrosoft, NULL, "X509_get_pubkey");
		}

		if (pubkey->type == EVP_PKEY_RSA || pubkey->type == EVP_PKEY_DSA) {
#ifndef OPENSSL_NO_ENGINE
			if (!hasPrivateKey(cert)) {
				return NULL;
			}

			if (ENGINE *e = ENGINE_by_id("capi"))
			{
				if (ENGINE_init(e))
				{
					PCCERT_CONTEXT pCertContext = HCRYPT_NULL;
					PCCERT_CONTEXT pCertFound = HCRYPT_NULL;
					HCERTSTORE hCertStore = HCRYPT_NULL;

					pCertContext = Csp::createCertificateContext(cert);

					if (HCRYPT_NULL == (hCertStore = CertOpenStore(
						CERT_STORE_PROV_SYSTEM,
						X509_ASN_ENCODING | PKCS_7_ASN_ENCODING,
						HCRYPT_NULL,
						CERT_SYSTEM_STORE_CURRENT_USER | CERT_STORE_READONLY_FLAG,
						L"My")))
					{
						THROW_EXCEPTION(0, ProviderMicrosoft, NULL, "CertOpenStore(My) failed");
					}

					if (!Csp::findExistingCertificate(pCertFound, hCertStore, pCertContext)) {
						THROW_EXCEPTION(0, ProviderMicrosoft, NULL, "findExistingCertificate");
					}

					CertFreeCertificateContext(pCertContext);
					pCertContext = HCRYPT_NULL;

					CertCloseStore(hCertStore, 0);
					hCertStore = HCRYPT_NULL;

					::TrustedHandle<std::string> name = nameToStr(pCertFound->dwCertEncodingType, &pCertFound->pCertInfo->Subject);

					LOGGER_OPENSSL(ENGINE_load_private_key);
					pkey = ENGINE_load_private_key(e, name->c_str(), 0, 0);
					if (!pkey) {
						THROW_OPENSSL_EXCEPTION(0, ProviderMicrosoft, NULL, "ENGINE_load_private_key");
					}

					LOGGER_OPENSSL(ENGINE_free);
					ENGINE_free(e);
					e = NULL;
				}
				else {
					THROW_OPENSSL_EXCEPTION(0, ProviderMicrosoft, NULL, "Error init capi engine");
				}
			}
			else {
				THROW_OPENSSL_EXCEPTION(0, ProviderMicrosoft, NULL, "ENGINE 'capi' is not loaded");
			}

			return new Key(pkey);
#else
			THROW_EXCEPTION(0, ProviderMicrosoft, NULL, "Wrong Algorithm type");
#endif //OPENSSL_NO_ENGINE
		}

#ifndef OPENSSL_NO_CTGOSTCP
#define MAX_SIGNATURE_LEN 128
		size_t len;
		unsigned char buf[MAX_SIGNATURE_LEN];

		ENGINE *e = ENGINE_by_id("ctgostcp");
		if (e == NULL) {
			THROW_OPENSSL_EXCEPTION(0, ProviderMicrosoft, NULL, "CTGSOTCP is not loaded");
		}

		LOGGER_OPENSSL(EVP_PKEY_CTX_new_id);
		pctx = EVP_PKEY_CTX_new_id(NID_id_GostR3410_2001, e);

		LOGGER_OPENSSL(EVP_PKEY_keygen_init);
		if (EVP_PKEY_keygen_init(pctx) <= 0){
			THROW_OPENSSL_EXCEPTION(0, ProviderMicrosoft, NULL, "EVP_PKEY_keygen_init");
		}

		LOGGER_OPENSSL(EVP_PKEY_CTX_ctrl_str);
		if (EVP_PKEY_CTX_ctrl_str(pctx, CTGOSTCP_PKEY_CTRL_STR_PARAM_KEYSET, "all") <= 0){
			THROW_OPENSSL_EXCEPTION(0, ProviderMicrosoft, NULL, "EVP_PKEY_CTX_ctrl_str CTGOSTCP_PKEY_CTRL_STR_PARAM_KEYSET 'all'");
		}

		LOGGER_OPENSSL(EVP_PKEY_CTX_ctrl_str);
		if (EVP_PKEY_CTX_ctrl_str(pctx, CTGOSTCP_PKEY_CTRL_STR_PARAM_EXISTING, "true") <= 0){
			THROW_OPENSSL_EXCEPTION(0, ProviderMicrosoft, NULL, "EVP_PKEY_CTX_ctrl_str CTGOSTCP_PKEY_CTRL_STR_PARAM_EXISTING 'true'");
		}

		LOGGER_OPENSSL(CTGOSTCP_EVP_PKEY_CTX_init_key_by_cert);
		if (CTGOSTCP_EVP_PKEY_CTX_init_key_by_cert(pctx, cert->internal()) <= 0){
			THROW_OPENSSL_EXCEPTION(0, ProviderMicrosoft, NULL, "Can not init key context by certificate");
		}

		LOGGER_OPENSSL(EVP_PKEY_CTX_ctrl_str);
		if (EVP_PKEY_CTX_ctrl_str(pctx, CTGOSTCP_PKEY_CTRL_STR_PARAM_EXISTING, "true") <= 0){
			THROW_OPENSSL_EXCEPTION(0, ProviderMicrosoft, NULL, "Parameter 'existing' setting error");
		}

		LOGGER_OPENSSL(EVP_PKEY_keygen);
		if (EVP_PKEY_keygen(pctx, &pkey) <= 0){
			THROW_OPENSSL_EXCEPTION(0, ProviderMicrosoft, NULL, "Can not init key by certificate");
		}

		int md_type = 0;
		const EVP_MD *md = NULL;

		LOGGER_OPENSSL(EVP_PKEY_get_default_digest_nid);
		if (EVP_PKEY_get_default_digest_nid(pkey, &md_type) <= 0) {
			THROW_OPENSSL_EXCEPTION(0, ProviderMicrosoft, NULL, "default digest for key type not found");
		}

		LOGGER_OPENSSL(EVP_get_digestbynid);
		md = EVP_get_digestbynid(md_type);

		LOGGER_OPENSSL(EVP_MD_CTX_create);
		if (!(mctx = EVP_MD_CTX_create())) {
			THROW_OPENSSL_EXCEPTION(0, ProviderMicrosoft, NULL, "Error creating digest context");
		}

		len = sizeof(buf);
		LOGGER_OPENSSL(EVP_DigestSignInit);
		if (!EVP_DigestSignInit(mctx, NULL, md, e, pkey)
			|| (EVP_DigestSignUpdate(mctx, "123", 3) <= 0)
			|| !EVP_DigestSignFinal(mctx, buf, &len)) {
			THROW_OPENSSL_EXCEPTION(0, ProviderMicrosoft, NULL, "Error testing private key (via signing data)");
		}

		return new Key(pkey);
#endif //OPENSSL_NO_CTGOSTCP
	}
	catch (::TrustedHandle<Exception> e){
		THROW_EXCEPTION(0, ProviderMicrosoft, e, "Error get key");
	}

	EVP_MD_CTX_destroy(mctx);
	EVP_PKEY_free(pkey);
	EVP_PKEY_CTX_free(pctx);

	return NULL;
}

void ProviderMicrosoft::addPkiObject(::TrustedHandle<Certificate> cert, ::TrustedHandle<std::string> category){
	LOGGER_FN();

	try{
		PCCERT_CONTEXT pCertContext = HCRYPT_NULL;
		HCERTSTORE hCertStore = HCRYPT_NULL;

		std::wstring wCategory = std::wstring(category->begin(), category->end());

		pCertContext = Csp::createCertificateContext(cert);

		if (HCRYPT_NULL == (hCertStore = CertOpenStore(
			CERT_STORE_PROV_SYSTEM,
			X509_ASN_ENCODING | PKCS_7_ASN_ENCODING,
			HCRYPT_NULL,
			CERT_SYSTEM_STORE_CURRENT_USER,
			wCategory.c_str())))
		{
			THROW_EXCEPTION(0, ProviderMicrosoft, NULL, "CertOpenStore failed: %s Code: %d", category->c_str(), GetLastError());
		}

		if (!CertAddCertificateContextToStore(
			hCertStore,
			pCertContext,
			CERT_STORE_ADD_REPLACE_EXISTING,
			NULL
			))
		{
			THROW_EXCEPTION(0, ProviderMicrosoft, NULL, "CertAddCertificateContextToStore failed. Code: %d", GetLastError())
		}

		if (hCertStore) {
			CertCloseStore(hCertStore, 0);
			hCertStore = HCRYPT_NULL;
		}

		if (cert->isSelfSigned() && (strcmp(category->c_str(), "ROOT") != 0)) {
			if (HCRYPT_NULL == (hCertStore = CertOpenStore(
				CERT_STORE_PROV_SYSTEM,
				X509_ASN_ENCODING | PKCS_7_ASN_ENCODING,
				HCRYPT_NULL,
				CERT_SYSTEM_STORE_CURRENT_USER,
				L"ROOT")))
			{
				THROW_EXCEPTION(0, ProviderMicrosoft, NULL, "CertOpenStore ROOT failed");
			}

			if (!CertAddCertificateContextToStore(
				hCertStore,
				pCertContext,
				CERT_STORE_ADD_REPLACE_EXISTING,
				NULL
				))
			{
				THROW_EXCEPTION(0, ProviderMicrosoft, NULL, "CertAddCertificateContextToStore failed. Code: %d", GetLastError())
			}

			CertCloseStore(hCertStore, 0);
			hCertStore = HCRYPT_NULL;
		}

		if (pCertContext) {
			CertFreeCertificateContext(pCertContext);
			pCertContext = HCRYPT_NULL;
		}
	}
	catch (::TrustedHandle<Exception> e){
		THROW_EXCEPTION(0, ProviderMicrosoft, e, "Error add certificate to store");
	}
}

void ProviderMicrosoft::deletePkiObject(::TrustedHandle<Certificate> cert, ::TrustedHandle<std::string> category){
	LOGGER_FN();

	PCCERT_CONTEXT pCertContext = HCRYPT_NULL;
	PCCERT_CONTEXT pCertFound = HCRYPT_NULL;
	HCERTSTORE hCertStore = HCRYPT_NULL;

	try{
		std::wstring wCategory = std::wstring(category->begin(), category->end());

		pCertContext = Csp::createCertificateContext(cert);

		if (HCRYPT_NULL == (hCertStore = CertOpenStore(
			CERT_STORE_PROV_SYSTEM,
			X509_ASN_ENCODING | PKCS_7_ASN_ENCODING,
			HCRYPT_NULL,
			CERT_SYSTEM_STORE_CURRENT_USER,
			wCategory.c_str())))
		{
			THROW_EXCEPTION(0, ProviderMicrosoft, NULL, "CertOpenStore failed: %s Code: %d", category->c_str(), GetLastError());
		}

		if (!Csp::findExistingCertificate(pCertFound, hCertStore, pCertContext)) {
			THROW_EXCEPTION(0, ProviderMicrosoft, NULL, "Cannot find existing certificate");
		}

		if (!CertDeleteCertificateFromStore(pCertFound)) {
			THROW_EXCEPTION(0, ProviderMicrosoft, NULL, "CertDeleteCertificateFromStore failed: Code: %d", GetLastError());
		}

		if (hCertStore) {
			CertCloseStore(hCertStore, 0);
			hCertStore = HCRYPT_NULL;
		}

		if (pCertContext) {
			CertFreeCertificateContext(pCertContext);
			pCertContext = HCRYPT_NULL;
		}

		if (pCertFound) {
			CertFreeCertificateContext(pCertFound);
			pCertFound = HCRYPT_NULL;
		}
	}
	catch (::TrustedHandle<Exception> e){
		if (hCertStore) {
			CertCloseStore(hCertStore, 0);
			hCertStore = HCRYPT_NULL;
		}

		if (pCertContext) {
			CertFreeCertificateContext(pCertContext);
			pCertContext = HCRYPT_NULL;
		}

		if (pCertFound) {
			CertFreeCertificateContext(pCertFound);
			pCertFound = HCRYPT_NULL;
		}

		THROW_EXCEPTION(0, ProviderMicrosoft, e, "Error add certificate to store");
	}
}


bool ProviderMicrosoft::hasPrivateKey(::TrustedHandle<Certificate> cert) {
	LOGGER_FN();

	try {
		PCCERT_CONTEXT pCertContext = HCRYPT_NULL;
		PCCERT_CONTEXT pCertFound = HCRYPT_NULL;
		HCERTSTORE hCertStore = HCRYPT_NULL;
		DWORD dwSize = 0;
		bool res = false;

		pCertContext = Csp::createCertificateContext(cert);

		if (HCRYPT_NULL == (hCertStore = CertOpenStore(
			CERT_STORE_PROV_SYSTEM,
			X509_ASN_ENCODING | PKCS_7_ASN_ENCODING,
			HCRYPT_NULL,
			CERT_SYSTEM_STORE_CURRENT_USER | CERT_STORE_READONLY_FLAG,
			L"My")))
		{
			THROW_EXCEPTION(0, ProviderMicrosoft, NULL, "CertOpenStore(My) failed");
		}

		if (Csp::findExistingCertificate(pCertFound, hCertStore, pCertContext)) {
			if (CertGetCertificateContextProperty(pCertFound, CERT_KEY_PROV_INFO_PROP_ID, NULL, &dwSize)) {
				res = true;
			}

			CertFreeCertificateContext(pCertFound);
			pCertFound = HCRYPT_NULL;
		}

		CertFreeCertificateContext(pCertContext);
		pCertContext = HCRYPT_NULL;

		CertCloseStore(hCertStore, 0);
		hCertStore = HCRYPT_NULL;

		return res;
	}
	catch (::TrustedHandle<Exception> e) {
		THROW_EXCEPTION(0, ProviderMicrosoft, e, "Error check key existing");
	}
}

::TrustedHandle<std::string> ProviderMicrosoft::nameToStr(
	IN DWORD dwCertEncodingType,
	IN const CERT_NAME_BLOB *pName,
	IN DWORD dwStrType
	)
{
	LOGGER_FN();

	try {
		LPTSTR pszString;
		DWORD cbSize;
		::TrustedHandle<std::string> res;

		cbSize = CertNameToStr(
			dwCertEncodingType,
			const_cast<PCERT_NAME_BLOB> (pName),
			dwStrType,
			NULL,
			0);

		if (!cbSize) {
			THROW_EXCEPTION(0, ProviderMicrosoft, NULL, "CertNameToStr. Code: %d", GetLastError());
		}

		if (!(pszString = (LPTSTR)malloc(cbSize * sizeof(TCHAR)))) {
			THROW_EXCEPTION(0, ProviderMicrosoft, NULL, "Memory allocation failed");
		}

		cbSize = CertNameToStr(
			dwCertEncodingType,
			const_cast<PCERT_NAME_BLOB> (pName),
			dwStrType,
			pszString,
			cbSize);

		res = new std::string(pszString);

		free(pszString);
		pszString = NULL;

		return res;
	}
	catch (::TrustedHandle<Exception> e) {
		THROW_EXCEPTION(0, ProviderMicrosoft, e, "Error convert name to string");
	}
}

int ProviderMicrosoft::char2int(char input) {
	LOGGER_FN();

	try{
		if (input >= '0' && input <= '9'){
			return input - '0';
		}

		if (input >= 'A' && input <= 'F'){
			return input - 'A' + 10;
		}

		if (input >= 'a' && input <= 'f'){
			return input - 'a' + 10;
		}

		THROW_EXCEPTION(0, ProviderMicrosoft, NULL, "Invalid input string");
	}
	catch (::TrustedHandle<Exception> e){
		THROW_EXCEPTION(0, ProviderMicrosoft, e, "Error char to int");
	}

}

void ProviderMicrosoft::hex2bin(const char* src, char* target) {
	LOGGER_FN();

	while (*src && src[1]){
		*(target++) = char2int(*src) * 16 + char2int(src[1]);
		src += 2;
	}
}
