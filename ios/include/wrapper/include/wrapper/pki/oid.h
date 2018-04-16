#ifndef CMS_PKI_OID_H_INCLUDED
#define  CMS_PKI_OID_H_INCLUDED

#include <openssl/asn1.h>

#include "../common/common.h"

class CTWRAPPER_API OID;

#include "pki.h"

SSLOBJECT_free(ASN1_OBJECT, ASN1_OBJECT_free)

class OID : public SSLObject < ASN1_OBJECT > {
public:
	//Constructor
	SSLOBJECT_new(OID, ASN1_OBJECT){}
	SSLOBJECT_new_null(OID, ASN1_OBJECT, ASN1_OBJECT_new){}
	OID(const std::string& val);

	//Properties
	::TrustedHandle<std::string> getLongName();
	::TrustedHandle<std::string> getShortName();
	::TrustedHandle<std::string> getValue();

	//Methods
	int toNid();
	::TrustedHandle<std::string> toString();
};

#endif //!CMS_PKI_OID_H_INCLUDED
