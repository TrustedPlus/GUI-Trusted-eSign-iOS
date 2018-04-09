#include "../stdafx.h"

#include "../../include/wrapper/cms/signer_id.h"

void SignerId::setIssuerName(::TrustedHandle<std::string> name){
	LOGGER_FN();

	this->issuerName = name;
}

::TrustedHandle<std::string> SignerId::getIssuerName(){
	LOGGER_FN();

	if (!this->issuerName.isEmpty()) {
		return this->issuerName;
	}
	else {
		THROW_EXCEPTION(0, SignerId, NULL, "Issuer name is empty");
	}

	return this->issuerName;
}

void SignerId::setSerialNumber(::TrustedHandle<std::string> value){
	LOGGER_FN();

	this->serialNumber = value;
}

::TrustedHandle<std::string> SignerId::getSerialNumber(){
	LOGGER_FN();

	if (!this->serialNumber.isEmpty()) {
		return this->serialNumber;
	}
	else {
		THROW_EXCEPTION(0, SignerId, NULL, "Serial number is empty");
	}
}

void SignerId::setKeyId(::TrustedHandle<std::string> value){
	LOGGER_FN();

	this->keyid = value;
}

::TrustedHandle<std::string> SignerId::getKeyId(){
	LOGGER_FN();

	if (!this->keyid.isEmpty()) {
		return this->keyid;
	}
	else {
		THROW_EXCEPTION(0, SignerId, NULL, "KeyId is empty");
	}
}
