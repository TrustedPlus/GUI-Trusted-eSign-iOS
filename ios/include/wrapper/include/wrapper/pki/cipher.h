#ifndef CMS_PKI_CIPHER_H_INCLUDED
#define  CMS_PKI_CIPHER_H_INCLUDED

#include <openssl/evp.h>
#include <openssl/pem.h>
#include <openssl/cms.h>

#include "../common/common.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "certs.h"
#include "cert.h"
#include "key.h"
#include "../cms/cmsRecipientInfos.h"

#undef SIZE
#undef BSIZE

#define SIZE	(512)
#define BSIZE	(8*1024)

class CryptoMethod
{
public:
	enum Crypto_Method {
		SYMMETRIC,
		ASSYMETRIC
	};

	static CryptoMethod::Crypto_Method get(int value){
		switch (value){
		case CryptoMethod::SYMMETRIC:
			return CryptoMethod::SYMMETRIC;
		case CryptoMethod::ASSYMETRIC:
			return CryptoMethod::ASSYMETRIC;
		default:
			THROW_EXCEPTION(0, CryptoMethod, NULL, ERROR_DATA_FORMAT_UNKNOWN_FORMAT, value);
		}
	}
};

class CTWRAPPER_API Cipher;

static const char magic[] = "Salted__";

class Cipher{

public:
	Cipher();

	/*Symetric or assymetric(default)*/
	void setCryptoMethod(CryptoMethod::Crypto_Method method);

	void encrypt(::TrustedHandle<Bio> inSource, ::TrustedHandle<Bio> outEnc, DataFormat::DATA_FORMAT format);
	void decrypt(::TrustedHandle<Bio> inEnc, ::TrustedHandle<Bio> outDec, DataFormat::DATA_FORMAT format);

public:
	::TrustedHandle<std::string> getAlgorithm();
	::TrustedHandle<std::string> getMode();

//********************************************************************* 
// Functions for assymetric method
//*********************************************************************
public:
	/*Add recipints certificates for encrypted*/
	void addRecipientsCerts(::TrustedHandle<CertificateCollection> certs);

	/*Set private key for decrypted*/
	void setPrivKey(::TrustedHandle<Key> privkey);

	/*Set recipient certificate for decrypted*/
	void setRecipientCert(::TrustedHandle<Certificate> cert);

	/*Get recipients*/
	::TrustedHandle<CmsRecipientInfoCollection> getRecipientInfos(::TrustedHandle<Bio> inEnc, DataFormat::DATA_FORMAT format);

//*********************************************************************
// Functions for symetric method
//*********************************************************************
public:
	void setDigest(::TrustedHandle<std::string>  md);
	void setSalt(::TrustedHandle<std::string> saltP);
	void setPass(::TrustedHandle<std::string> password);
	void setIV(::TrustedHandle<std::string> iv);
	void setKey(::TrustedHandle<std::string> key);

	::TrustedHandle<std::string> getSalt();
	::TrustedHandle<std::string> getIV();
	::TrustedHandle<std::string> getKey();

	::TrustedHandle<std::string> getDigestAlgorithm();

protected:
	CryptoMethod::Crypto_Method hmethod = CryptoMethod::ASSYMETRIC;

	unsigned char key[EVP_MAX_KEY_LENGTH], iv[EVP_MAX_IV_LENGTH];
	unsigned char salt[PKCS5_SALT_LEN];
	char *hkey = NULL, *hiv = NULL, *hsalt = NULL, *hmd = NULL;
	const EVP_MD *dgst = NULL;
	const EVP_CIPHER *cipher = NULL;
	char *hpass = NULL;
	unsigned char *buff = NULL, *bufsize = NULL;
	int bsize = BSIZE;
	int inl;
	char mbuf[sizeof magic - 1];

	BIO *benc = NULL, *rbio = NULL, *wbio = NULL;
	EVP_CIPHER_CTX *ctx = NULL;

	STACK_OF(X509) *encerts = NULL;
	X509 *rcert = NULL;
	CMS_ContentInfo *cms = NULL;
	int flags = CMS_STREAM;
	EVP_PKEY *rkey = NULL;

private:
	int setHex(char *in, unsigned char *out, int size);
};

#endif