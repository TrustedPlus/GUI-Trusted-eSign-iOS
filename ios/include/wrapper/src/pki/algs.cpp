#include "stdafx.h"

#include "../../include/wrapper/pki/algs.h"

int AlgorithmCollection::length() {
	LOGGER_FN();

	if (this->isEmpty())
		return 0;
	
	LOGGER_OPENSSL(sk_X509_ALGOR_num);
	return sk_X509_ALGOR_num(this->internal());
}

::TrustedHandle<Algorithm> AlgorithmCollection::items(int index) {
	LOGGER_FN();

	LOGGER_OPENSSL(sk_X509_ALGOR_value);
	X509_ALGOR *res = sk_X509_ALGOR_value(this->internal(), index);
	return new Algorithm(res, this->TrustedHandle());
}

void AlgorithmCollection::push(::TrustedHandle<Algorithm>item) {
	LOGGER_FN();

	::TrustedHandle<Algorithm> algcpy = NULL;
	try{
		algcpy = item->duplicate();
	}
	catch (::TrustedHandle<Exception> e){
		THROW_EXCEPTION(0, AlgorithmCollection, e, "Can not duplicate Algorithm");
	}

	if (this->isEmpty())
		this->setData(sk_X509_ALGOR_new_null());

	LOGGER_OPENSSL(sk_X509_ALGOR_push);
	sk_X509_ALGOR_push(this->internal(), algcpy->internal());
	algcpy->setParent(this->TrustedHandle());
}

void AlgorithmCollection::pop() {
	LOGGER_FN();

	LOGGER_OPENSSL(sk_X509_ALGOR_pop);
	sk_X509_ALGOR_pop(this->internal());
}

void AlgorithmCollection::removeAt(int index) {
	LOGGER_FN();

	LOGGER_OPENSSL(sk_X509_ALGOR_delete);
	sk_X509_ALGOR_delete(this->internal(), index);
}
