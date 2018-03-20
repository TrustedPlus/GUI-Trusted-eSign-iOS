#include "../stdafx.h"

#include "../../include/wrapper/pki/certs.h"

void CertificateCollection::push(::TrustedHandle<Certificate> cert) {
	LOGGER_FN();

	if (this->isEmpty()){
		LOGGER_OPENSSL("sk_X509_new_null");
		this->setData(sk_X509_new_null());
	}
	::TrustedHandle<Certificate> certcpy = cert->duplicate();

	LOGGER_OPENSSL("sk_X509_push");
	sk_X509_push(this->internal(), certcpy->internal());

	certcpy->setParent(this->TrustedHandle());
}

int CertificateCollection::length() {
	LOGGER_FN();

	if (this->isEmpty())
		return 0;

	LOGGER_OPENSSL("sk_X509_num");
	return sk_X509_num(this->internal());
}

::TrustedHandle<Certificate> CertificateCollection::items(int index) {
	LOGGER_FN();

	LOGGER_OPENSSL("sk_X509_value");
	X509 *cert = sk_X509_value(this->internal(), index);

	if (!cert){
		THROW_OPENSSL_EXCEPTION(0, CertificateCollection, NULL, "Has no item by index %d", index);
	}

	return new Certificate(cert, this->TrustedHandle());
}

void CertificateCollection::pop(){
	LOGGER_FN();

	LOGGER_OPENSSL("sk_X509_value");
	sk_X509_pop(this->internal());	
}

void CertificateCollection::removeAt(int index){
	LOGGER_FN();

	LOGGER_OPENSSL("sk_X509_delete");
	sk_X509_delete(this->internal(), index);
}