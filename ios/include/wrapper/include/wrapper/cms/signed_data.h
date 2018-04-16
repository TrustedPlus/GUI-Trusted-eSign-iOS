#ifndef CMS_SIGNED_DATA_H_INCLUDED
#define  CMS_SIGNED_DATA_H_INCLUDED

#include "common.h"

SSLOBJECT_free(CMS_ContentInfo, CMS_ContentInfo_free);

class SignedData : public SSLObject < CMS_ContentInfo > {
public:
	//Constructor
	SSLOBJECT_new(SignedData, CMS_ContentInfo){
		if (CMS_SignedData_init(this->internal()) < 1){
			THROW_OPENSSL_EXCEPTION(0, SignedData, NULL, "CMS_SignedData_init");
		}
		flags = 0;
	}
	SSLOBJECT_new_null(SignedData, CMS_ContentInfo, CMS_ContentInfo_new){
		LOGGER_FN();

		LOGGER_OPENSSL("CMS_SignedData_init");
		CMS_SignedData_init(this->internal());
		
		flags = 0;
	}

	// Properties
	void setContent(::TrustedHandle<Bio> value);
	::TrustedHandle<Bio> getContent();
	int getFlags();
	void setFlags(int v);
	void addFlag(int v);
	void removeFlags(int v);


	// Methods
	::TrustedHandle<CertificateCollection> certificates();
	::TrustedHandle<Certificate> certificates(int index);
	::TrustedHandle<SignerCollection> signers();
	::TrustedHandle<Signer> signers(int index);
	bool isDetached();
	void read(::TrustedHandle<Bio> in, DataFormat::DATA_FORMAT format);
	void write(::TrustedHandle<Bio> out, DataFormat::DATA_FORMAT format);
	void addCertificate(::TrustedHandle<Certificate> cert);
	bool verify(::TrustedHandle<CertificateCollection> certs);

	int cms_copy_content(BIO *out, BIO *in, unsigned int flags);

	static ::TrustedHandle<SignedData> sign(::TrustedHandle<Certificate> cert, ::TrustedHandle<Key> pkey, ::TrustedHandle<CertificateCollection> certs, ::TrustedHandle<Bio> content, unsigned int flags); // ����������� ������ � ��������� ����� CMS �����
	void sign();

	::TrustedHandle<Signer> createSigner(::TrustedHandle<Certificate> cert, ::TrustedHandle<Key> pkey);

protected:
	::TrustedHandle<Bio> content = NULL;
	unsigned int flags;
};

#endif  //!CMS_SIGNED_DATA_H_INCLUDED