#ifndef PKI_EXT_H_INCLUDED
#define PKI_EXT_H_INCLUDED

#include <openssl/x509v3.h>

#include "../common/common.h"

class CTWRAPPER_API Extension;

#include "pki.h"
#include "oid.h"

SSLOBJECT_free(X509_EXTENSION, X509_EXTENSION_free);

class Extension : public SSLObject<X509_EXTENSION> {
public:
	SSLOBJECT_new(Extension, X509_EXTENSION){}
	SSLOBJECT_new_null(Extension, X509_EXTENSION, X509_EXTENSION_new){}
	Extension(::TrustedHandle<OID> oid, ::TrustedHandle<std::string> value);

	bool getCritical();
	void setCritical(bool critical);
	::TrustedHandle<OID> getTypeId();
	void setTypeId(::TrustedHandle<OID> &oid);
	void setTypeId(std::string oid);
};

#endif //!PKI_EXT_H_INCLUDED
