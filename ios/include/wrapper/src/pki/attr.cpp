#include "../stdafx.h"

#include "../../include/wrapper/pki/attr.h"

Attribute::Attribute(::TrustedHandle<OID> oid, int asnType)
	:SSLObject<X509_ATTRIBUTE>(X509_ATTRIBUTE_new(), &so_X509_ATTRIBUTE_free)
{
	LOGGER_FN();

	LOGGER_OPENSSL(X509_ATTRIBUTE_create_by_txt);
	X509_ATTRIBUTE *attr = X509_ATTRIBUTE_create_by_txt(NULL, oid->toString()->c_str(), 0, NULL, -1);
	if (!attr)
		THROW_EXCEPTION(0, Attribute, NULL, "X509_ATTRIBUTE_create_by_txt");
	this->setData(attr);
	this->asnType_ = asnType;
}

Attribute::Attribute(const std::string& oid, int asnType)
	:SSLObject<X509_ATTRIBUTE>(X509_ATTRIBUTE_new(), &so_X509_ATTRIBUTE_free)
{
	LOGGER_FN();

	LOGGER_OPENSSL(X509_ATTRIBUTE_create_by_txt);
	X509_ATTRIBUTE *attr = X509_ATTRIBUTE_create_by_txt(NULL, oid.c_str(), 0, NULL, -1);
	if (!attr)
		THROW_EXCEPTION(0, Attribute, NULL, "X509_ATTRIBUTE_create_by_txt");
	this->setData(attr);
	this->asnType_ = asnType;
}

/*
 *
 */
::TrustedHandle<std::string> Attribute::write() {
	LOGGER_FN();

	unsigned char *_out = NULL;

	LOGGER_OPENSSL(i2d_X509_ATTRIBUTE);
	int len = i2d_X509_ATTRIBUTE(this->internal(), &_out);
	::TrustedHandle<std::string> res = new std::string((char *)_out, len);
	OPENSSL_free(_out);
	return res;
}

::TrustedHandle<OID> Attribute::getTypeId() {
	LOGGER_FN();

	if (this->internal() && this->internal()->object) {
		::TrustedHandle<OID> res = new OID(this->internal()->object);
		return res;
	}
	return NULL;
}

void Attribute::setTypeId(::TrustedHandle<OID> &oid) {
	LOGGER_FN();

	LOGGER_OPENSSL(X509_ATTRIBUTE_set1_object);
	if (!X509_ATTRIBUTE_set1_object(this->internal(), oid->internal())) {
		THROW_EXCEPTION(0, Attribute, NULL, "X509_ATTRIBUTE_set1_object");
	}
}

void Attribute::setTypeId(std::string oid) {
	LOGGER_FN();

	try {
		::TrustedHandle<OID> _oid = new OID(oid);
		this->setTypeId(_oid);
	}
	catch (::TrustedHandle<Exception> e) {
		THROW_EXCEPTION(0, Attribute, e, "No comment");
	}
}

::TrustedHandle<AttributeValueCollection> Attribute::values() {
	LOGGER_FN();

	return new AttributeValueCollection(this);
}

::TrustedHandle<std::string> Attribute::values(int index) {
	LOGGER_FN();

	return this->values()->items(index);
}

int Attribute::getAsnType() {
	LOGGER_FN();

	return this->asnType_;
}

void Attribute::setAsnType(int val) {
	LOGGER_FN();

	this->asnType_ = val;
}
