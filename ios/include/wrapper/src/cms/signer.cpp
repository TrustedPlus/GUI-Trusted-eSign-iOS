#include "../stdafx.h"

#include "../../include/wrapper/cms/signer.h"

void Signer::setCertificate(::TrustedHandle<Certificate> cert){
	LOGGER_FN();

	LOGGER_OPENSSL("CMS_SignerInfo_cert_cmp");
	if (CMS_SignerInfo_cert_cmp(this->internal(), cert->internal()) != 0){
		THROW_EXCEPTION(0, Signer, NULL, "Certificate has differents with Signer certificate id");
	}

	LOGGER_OPENSSL("CMS_SignerInfo_set1_signer_cert");
	CMS_SignerInfo_set1_signer_cert(this->internal(), cert->internal());
}

::TrustedHandle<Certificate> Signer::getCertificate(){
	LOGGER_FN();

	X509 *cert;

	LOGGER_OPENSSL("CMS_SignerInfo_get0_algs");
	CMS_SignerInfo_get0_algs(this->internal(), NULL, &cert, NULL, NULL);

	if (!cert){
		THROW_EXCEPTION(0, Signer, NULL, "Signer hasn't got Certificate");
	}

	return new Certificate(cert, this->TrustedHandle());
}

::TrustedHandle<std::string> Signer::getSignature(){
	LOGGER_FN();

	LOGGER_OPENSSL("CMS_SignerInfo_get0_signature");
	ASN1_OCTET_STRING *sign = CMS_SignerInfo_get0_signature(this->internal());
	if (!sign){
		THROW_EXCEPTION(0, Signer, NULL, "Has no signature value");
	}

	char *buf = reinterpret_cast<char*>(sign->data);

	return new std::string(buf, sign->length);
}

::TrustedHandle<SignerAttributeCollection> Signer::signedAttributes(){
	LOGGER_FN();

	::TrustedHandle<SignerAttributeCollection> attrs = new SignerAttributeCollection(new Signer(this->internal(), this->TrustedHandle()), true);

	return attrs;
}

::TrustedHandle<Attribute> Signer::signedAttributes(int index){
	LOGGER_FN();

	return this->signedAttributes()->items(index);
}

::TrustedHandle<Attribute> Signer::signedAttributes(int index, int location){
	LOGGER_FN();

	return this->signedAttributes()->items(index, location);
}

::TrustedHandle<Attribute> Signer::signedAttributes(::TrustedHandle<OID> oid){
	LOGGER_FN();

	return this->signedAttributes()->items(oid);
}

::TrustedHandle<Attribute> Signer::signedAttributes(::TrustedHandle<OID> oid, int location){
	LOGGER_FN();

	return this->signedAttributes()->items(oid, location);
}

::TrustedHandle<SignerAttributeCollection> Signer::unsignedAttributes(){
	LOGGER_FN();

	::TrustedHandle<SignerAttributeCollection> attrs = new SignerAttributeCollection(this, false);

	return attrs;
}

::TrustedHandle<Attribute> Signer::unsignedAttributes(int index){
	LOGGER_FN();

	return this->unsignedAttributes()->items(index);
}

::TrustedHandle<Attribute> Signer::unsignedAttributes(int index, int location){
	LOGGER_FN();

	return this->unsignedAttributes()->items(index, location);
}

::TrustedHandle<Attribute> Signer::unsignedAttributes(::TrustedHandle<OID> oid){
	LOGGER_FN();

	return this->unsignedAttributes()->items(oid);
}

::TrustedHandle<Attribute> Signer::unsignedAttributes(::TrustedHandle<OID> oid, int location){
	LOGGER_FN();

	return this->unsignedAttributes()->items(oid, location);
}

void Signer::sign(){
	LOGGER_FN();

	LOGGER_OPENSSL("CMS_SignerInfo_sign");
	if (CMS_SignerInfo_sign(this->internal()) < 1){
		THROW_OPENSSL_EXCEPTION(0, Signer, NULL, "CMS_SignerInfo_sign");
	}
}

bool Signer::verify(){
	LOGGER_FN();

	try {
		LOGGER_OPENSSL("CMS_signed_get_attr_count");
		if (CMS_signed_get_attr_count(this->internal()) < 0) {
			THROW_OPENSSL_EXCEPTION(0, Signer, NULL, "No sign attributes");
		}

		LOGGER_OPENSSL("CMS_SignerInfo_verify");
		int res = CMS_SignerInfo_verify(this->internal());
		if (res == -1){
			THROW_OPENSSL_EXCEPTION(0, Signer, NULL, "CMS_SignerInfo_verify");
		}

		return res == 1;
	}
	catch (::TrustedHandle<Exception> e) {
		THROW_EXCEPTION(0, Signer, e, "Error verify signer info");
	}
}

bool Signer::verify(::TrustedHandle<Bio> content){
	LOGGER_FN();

	try {
		ASN1_OCTET_STRING *os = NULL;
		EVP_PKEY *pkey = NULL;
		EVP_MD_CTX *mctx = NULL;
		EVP_PKEY_CTX* pctx = NULL;
		unsigned char mval[EVP_MAX_MD_SIZE];
		unsigned int mlen;
		const EVP_MD *md = NULL;
		const char * digestName;
		::TrustedHandle<std::string> signature;
		char *data;
		long datalen;
		int res = 0;

		LOGGER_OPENSSL("CMS_signed_get_attr_count");
		if (CMS_signed_get_attr_count(this->internal()) >= 0) {
			LOGGER_OPENSSL("CMS_signed_get0_data_by_OBJ");
			os = (ASN1_OCTET_STRING *)CMS_signed_get0_data_by_OBJ(this->internal(),
				OBJ_nid2obj(NID_pkcs9_messageDigest),
				-3, V_ASN1_OCTET_STRING);
			if (!os) {
				THROW_OPENSSL_EXCEPTION(0, Signer, NULL, "Error reading messagedigest attribute");
			}
		}
		
		if ( !(pkey = this->getCertificate()->getPublicKey()->internal()) ) {
			THROW_EXCEPTION(0, Signer, NULL, "Error get public key");
		}
		if (!(digestName = this->getDigestAlgorithm()->getName()->c_str())) {
			THROW_EXCEPTION(0, Signer, NULL, "Error get digest name");
		}

		LOGGER_OPENSSL("EVP_get_digestbyobj");
		if ( !(md = EVP_get_digestbyobj(this->getDigestAlgorithm()->getTypeId()->internal())) ) {
			THROW_OPENSSL_EXCEPTION(0, Signer, NULL, "EVP_get_digestbyobj");
		}

		LOGGER_OPENSSL("EVP_MD_CTX_create");
		mctx = EVP_MD_CTX_create();
		pctx = nullptr;

		LOGGER_OPENSSL("EVP_DigestVerifyInit");
		if (!mctx || !EVP_DigestVerifyInit(mctx, &pctx, md, nullptr, pkey)) {
			THROW_OPENSSL_EXCEPTION(0, Signer, NULL, "EVP_DigestVerifyInit");
		}

		if ((signature = this->getSignature()).isEmpty()) {
			THROW_EXCEPTION(0, Signer, NULL, "Error get signature");
		}

		LOGGER_OPENSSL("BIO_get_mem_data");
		datalen = BIO_get_mem_data(content->internal(), &data);

		LOGGER_OPENSSL("EVP_DigestVerifyUpdate");
		if (!EVP_DigestVerifyUpdate(mctx, data, datalen)) {
			THROW_OPENSSL_EXCEPTION(0, Signer, NULL, "EVP_DigestVerifyUpdate");
		}

		if (EVP_DigestFinal_ex(mctx, mval, &mlen) <= 0) {
			THROW_OPENSSL_EXCEPTION(0, Signer, NULL, "Unable to finalize context");
		}

		if (os) {
			if (mlen != (unsigned int)os->length) {
				THROW_OPENSSL_EXCEPTION(0, Signer, NULL, "Messagedigest attribute wrong length");
			}

			if (memcmp(mval, os->data, mlen)) {
				CMSerr(CMS_F_CMS_SIGNERINFO_VERIFY_CONTENT,
					CMS_R_VERIFICATION_FAILURE);
				res = 0;
			}
			else
				res = 1;
		}
		else {
			LOGGER_OPENSSL("EVP_PKEY_verify");
			res = EVP_PKEY_verify(pctx, (const unsigned char *)signature->c_str(), signature->length(), mval, mlen);

			if (res < 0) {
				THROW_OPENSSL_EXCEPTION(0, Signer, NULL, "CMS_SignerInfo_verify_content");
			}	
		}

		if (pctx) {
			LOGGER_OPENSSL("EVP_PKEY_CTX_free");
			EVP_PKEY_CTX_free(pctx);
		}

		return res == 1;
	}
	catch (::TrustedHandle<Exception> e) {
		THROW_EXCEPTION(0, Signer, e, "Error verify signer content");
	}	
}

::TrustedHandle<SignerId> Signer::getSignerId(){
	LOGGER_FN();

	ASN1_OCTET_STRING *keyid = NULL;
	ASN1_INTEGER *sn = NULL;
	X509_NAME *issuerName = NULL;

	try {
		LOGGER_OPENSSL("CMS_SignerInfo_get0_signer_id");
		if (CMS_SignerInfo_get0_signer_id(this->internal(), &keyid, &issuerName, &sn) < 1){
			THROW_OPENSSL_EXCEPTION(0, Signer, NULL, "CMS_SignerInfo_get0_signer_id");
		}

		::TrustedHandle<SignerId> certId = new SignerId();
		if (keyid){
			::TrustedHandle<std::string> keyid_str = new std::string((char*)keyid->data, keyid->length);

			certId->setKeyId(keyid_str);
		}
		if (sn){
			LOGGER_OPENSSL(BIO_new);
			BIO * bioSerial = BIO_new(BIO_s_mem());
			LOGGER_OPENSSL(i2a_ASN1_INTEGER);
			if (i2a_ASN1_INTEGER(bioSerial, sn) < 0){
				THROW_OPENSSL_EXCEPTION(0, Signer, NULL, "i2a_ASN1_INTEGER", NULL);
			}

			int contlen;
			char * cont;
			LOGGER_OPENSSL(BIO_get_mem_data);
			contlen = BIO_get_mem_data(bioSerial, &cont);

			::TrustedHandle<std::string> sn_str = new std::string(cont, contlen);

			BIO_free(bioSerial);

			certId->setSerialNumber(sn_str);
		}

		if (issuerName){
			LOGGER_OPENSSL(X509_NAME_oneline_ex);
			std::string str_name = X509_NAME_oneline_ex(issuerName);

			::TrustedHandle<std::string> res = new std::string(str_name.c_str(), str_name.length());

			certId->setIssuerName(res);
		}

		return certId;
	}
	catch (::TrustedHandle<Exception> e) {
		THROW_EXCEPTION(0, Signer, e, "Error get signer identifier information");
	}	
}

::TrustedHandle<Algorithm> Signer::getSignatureAlgorithm(){
	LOGGER_FN();

	X509_ALGOR *alg;

	LOGGER_OPENSSL("CMS_SignerInfo_get0_algs");
	CMS_SignerInfo_get0_algs(this->internal(), NULL, NULL, NULL, &alg);

	if (!alg){
		THROW_EXCEPTION(0, Signer, NULL, "Signer hasn't got signature algorithm");
	}

	return new Algorithm(alg, this->TrustedHandle());
}

::TrustedHandle<Algorithm> Signer::getDigestAlgorithm(){
	LOGGER_FN();

	X509_ALGOR *alg;

	LOGGER_OPENSSL("CMS_SignerInfo_get0_algs");
	CMS_SignerInfo_get0_algs(this->internal(), NULL, NULL, &alg, NULL);

	if (!alg){
		THROW_EXCEPTION(0, Signer, NULL, "Signer hasn't got digest algorithm");
	}

	return new Algorithm(alg, this->TrustedHandle());
}
