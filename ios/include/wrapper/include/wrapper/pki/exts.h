#ifndef PKI_EXTS_H_INCLUDED
#define PKI_EXTS_H_INCLUDED

#include <openssl/x509v3.h>

#include "../common/common.h"

class CTWRAPPER_API ExtensionCollection;

#include "ext.h"

SSLOBJECT_free(stack_st_X509_EXTENSION, sk_X509_EXTENSION_free)

class ExtensionCollection: public SSLObject<stack_st_X509_EXTENSION> {
public:
	SSLOBJECT_new(ExtensionCollection, stack_st_X509_EXTENSION){}
	SSLOBJECT_new_null(ExtensionCollection, stack_st_X509_EXTENSION, sk_X509_EXTENSION_new_null){}

	void push(::TrustedHandle<Extension> ext);
	void pop();
	int length();
	void removeAt(int index);
	::TrustedHandle<Extension> items(int index);
	::TrustedHandle<ExtensionCollection> duplicate();
};

#endif //!PKI_EXTS_H_INCLUDED
