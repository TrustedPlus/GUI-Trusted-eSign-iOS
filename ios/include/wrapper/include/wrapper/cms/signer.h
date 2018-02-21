#ifndef CMS_SIGNER_H_INCLUDED
#define  CMS_SIGNER_H_INCLUDED

#include "common.h"
#include "./signer_id.h"

static void CMS_SignerInfo_free_ex(void *si){};

class Signer : public SSLObject < CMS_SignerInfo > {
public:
	//Constructor
	Signer(CMS_SignerInfo *data, ::TrustedHandle<SObject> parent)
		: SSLObject<CMS_SignerInfo>(data, &CMS_SignerInfo_free_ex, parent){}

	//Properties
	void setCertificate(::TrustedHandle<Certificate> cert);
	::TrustedHandle<Certificate> getCertificate();
	::TrustedHandle<std::string> getSignature();
	::TrustedHandle<Algorithm> getSignatureAlgorithm();
	::TrustedHandle<Algorithm> getDigestAlgorithm();

	//Methods
	::TrustedHandle<SignerAttributeCollection> signedAttributes();
	::TrustedHandle<Attribute> signedAttributes(int index);
	::TrustedHandle<Attribute> signedAttributes(int index, int location);
	::TrustedHandle<Attribute> signedAttributes(::TrustedHandle<OID> oid);
	::TrustedHandle<Attribute> signedAttributes(::TrustedHandle<OID> oid, int location);
	::TrustedHandle<SignerAttributeCollection> unsignedAttributes();
	::TrustedHandle<Attribute> unsignedAttributes(int index);
	::TrustedHandle<Attribute> unsignedAttributes(int index, int location);
	::TrustedHandle<Attribute> unsignedAttributes(::TrustedHandle<OID> oid);
	::TrustedHandle<Attribute> unsignedAttributes(::TrustedHandle<OID> oid, int location);
	void sign();
	bool verify();
	bool verify(::TrustedHandle<Bio> content);
	::TrustedHandle<SignerId> getSignerId();

protected:

};

#endif  //!CMS_SIGNER_H_INCLUDED

