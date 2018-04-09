#include "../stdafx.h"

#include "../../include/wrapper/pki/crls.h"

void CrlCollection::push(::TrustedHandle<CRL> crl) {
	LOGGER_FN();

	if (this->isEmpty()){
		LOGGER_OPENSSL("sk_X509_CRL_new_null");
		this->setData(sk_X509_CRL_new_null());
	}

	::TrustedHandle<CRL> crlcpy = crl->duplicate();

	LOGGER_OPENSSL("sk_X509_CRL_push");
	sk_X509_CRL_push(this->internal(), crlcpy->internal());

	crlcpy->setParent(this->TrustedHandle());
}

int CrlCollection::length() {
	LOGGER_FN();

	if (this->isEmpty()) {
		return 0;
	}		

	LOGGER_OPENSSL("sk_X509_CRL_num");
	return sk_X509_CRL_num(this->internal());
}

::TrustedHandle<CRL> CrlCollection::items(int index) {
	LOGGER_FN();

	LOGGER_OPENSSL("sk_X509_CRL_value");
	X509_CRL *crl = sk_X509_CRL_value(this->internal(), index);

	if (!crl){
		THROW_OPENSSL_EXCEPTION(0, CrlCollection, NULL, "Has no item by index %d", index);
	}

	return new CRL(crl, this->TrustedHandle());
}

void CrlCollection::pop(){
	LOGGER_FN();

	LOGGER_OPENSSL("sk_X509_CRL_value");
	sk_X509_CRL_pop(this->internal());	
}

void CrlCollection::removeAt(int index){
	LOGGER_FN();

	LOGGER_OPENSSL("sk_X509_CRL_delete");
	sk_X509_CRL_delete(this->internal(), index);
}
