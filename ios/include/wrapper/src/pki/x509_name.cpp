#include "../stdafx.h"

#include "../../include/wrapper/pki/x509_name.h"

::TrustedHandle<std::string> X509Name::toString(){
	LOGGER_FN();

	X509_NAME *name = this->internal();
	if (!name) {
		THROW_EXCEPTION(0, SignerId, NULL, "X509_NAME is NULL");
	}

	LOGGER_OPENSSL("X509_NAME_oneline_ex");
	std::string text = X509_NAME_oneline_ex(name);

	return new std::string(text);
}
