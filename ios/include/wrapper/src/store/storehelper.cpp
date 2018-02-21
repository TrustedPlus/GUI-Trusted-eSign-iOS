#include "../stdafx.h"

#include "../../include/wrapper/store/storehelper.h"

::TrustedHandle<PkiItemCollection> Provider::getProviderItemCollection(){
	LOGGER_FN();

	return this->providerItemCollection;
}

ProviderCollection::ProviderCollection(){
	LOGGER_FN();

	_items = std::vector<::TrustedHandle<Provider> >();
}

ProviderCollection::~ProviderCollection(){
	LOGGER_FN();
}

::TrustedHandle<Provider> ProviderCollection::items(int index){
	LOGGER_FN();

	return _items.at(index);
}

int ProviderCollection::length(){
	LOGGER_FN();

	return _items.size();
}

void ProviderCollection::push(::TrustedHandle<Provider> v){
	LOGGER_FN();

	_items.push_back(v);
}

PkiItem::PkiItem(){
	LOGGER_FN();

	type = new std::string("");
	provider = new std::string("");
	category = new std::string("");
	hash = new std::string("");
	uri = new std::string("");
	format = new std::string("");

	certSubjectName = new std::string("");
	certSubjectFriendlyName = new std::string("");
	certIssuerName = new std::string("");
	certIssuerFriendlyName = new std::string("");
	certNotBefore = new std::string("");
	certNotAfter = new std::string("");
	certSerial = new std::string("");
	certKey = new std::string("");
	certOrganizationName = new std::string("");
	certSignatureAlgorithm = new std::string("");
	certSignatureDigestAlgorithm = new std::string("");
	certPublicKeyAlgorithm = new std::string("");
	certificate = NULL;

	csrSubjectName = new std::string("");
	csrSubjectFriendlyName = new std::string("");
	csrKey = new std::string("");
	csr = NULL;

	crlIssuerName = new std::string("");
	crlIssuerFriendlyName = new std::string("");
	crlLastUpdate = new std::string("");
	crlNextUpdate = new std::string("");
	crl = NULL;

	keyEncrypted = false;
	key = NULL;
}

void PkiItem::setFormat(::TrustedHandle<std::string> format){
	LOGGER_FN();

	this->format = format;
}

void PkiItem::setType(::TrustedHandle<std::string> type){
	LOGGER_FN();

	this->type = type;
}

void PkiItem::setProvider(::TrustedHandle<std::string> provider){
	LOGGER_FN();

	this->provider = provider;
}

void PkiItem::setCategory(::TrustedHandle<std::string> category){
	LOGGER_FN();

	this->category = category;
}

void PkiItem::setURI(::TrustedHandle<std::string> uri){
	LOGGER_FN();

	this->uri = uri;
}

void PkiItem::setHash(::TrustedHandle<std::string> hash){
	LOGGER_FN();

	this->hash = hash;
}

void PkiItem::setSubjectName(::TrustedHandle<std::string> subjectName){
	LOGGER_FN();

	this->certSubjectName = subjectName;
	this->csrSubjectName = subjectName;
}

void PkiItem::setSubjectFriendlyName(::TrustedHandle<std::string> subjectFriendlyName){
	LOGGER_FN();

	this->certSubjectFriendlyName = subjectFriendlyName;
	this->csrSubjectFriendlyName = subjectFriendlyName;
}

void PkiItem::setIssuerName(::TrustedHandle<std::string> issuerName){
	LOGGER_FN();

	this->certIssuerName = issuerName;
	this->crlIssuerName = issuerName;
}

void PkiItem::setIssuerFriendlyName(::TrustedHandle<std::string> issuerFriendlyName){
	LOGGER_FN();

	this->certIssuerFriendlyName = issuerFriendlyName;
	this->crlIssuerFriendlyName = issuerFriendlyName;
}

void PkiItem::setSerial(::TrustedHandle<std::string> serial){
	LOGGER_FN();

	this->certSerial = serial;
}

void PkiItem::setNotBefore(::TrustedHandle<std::string> notBefore){
	LOGGER_FN();

	this->certNotBefore = notBefore;
}

void PkiItem::setNotAfter(::TrustedHandle<std::string> notAfter){
	LOGGER_FN();

	this->certNotAfter = notAfter;
}

void PkiItem::setLastUpdate(::TrustedHandle<std::string> lastUpdate){
	LOGGER_FN();

	this->crlLastUpdate = lastUpdate;
}

void PkiItem::setNextUpdate(::TrustedHandle<std::string> nextUpdate){
	LOGGER_FN();

	this->crlNextUpdate = nextUpdate;
}

void PkiItem::setKey(::TrustedHandle<std::string> keyid){
	LOGGER_FN();

	this->certKey = keyid;
	this->csrKey = keyid;
}

void PkiItem::setKeyEncypted(bool enc){
	LOGGER_FN();

	this->keyEncrypted = enc;
}

void PkiItem::setOrganizationName(::TrustedHandle<std::string> organizationName){
	LOGGER_FN();

	this->certOrganizationName = organizationName;
}

void PkiItem::setSignatureAlgorithm(::TrustedHandle<std::string> signatureAlgorithm){
	LOGGER_FN();

	this->certSignatureAlgorithm = signatureAlgorithm;
}

void PkiItem::setSignatureDigestAlgorithm(::TrustedHandle<std::string> signatureDigestAlgorithm){
	LOGGER_FN();

	this->certSignatureDigestAlgorithm = signatureDigestAlgorithm;
}

void PkiItem::setPublicKeyAlgorithm(::TrustedHandle<std::string> publicKeyAlgorithm){
	LOGGER_FN();

	this->certPublicKeyAlgorithm = publicKeyAlgorithm;
}

PkiItemCollection::PkiItemCollection(){
	LOGGER_FN();

	_items = std::vector<PkiItem>();
}

PkiItemCollection::~PkiItemCollection(){
	LOGGER_FN();
}

::TrustedHandle<PkiItem> PkiItemCollection::items(int index){
	LOGGER_FN();

	return new PkiItem(_items.at(index));
}

int PkiItemCollection::length(){
	LOGGER_FN();

	return _items.size();
}

void PkiItemCollection::push(::TrustedHandle<PkiItem> v){
	LOGGER_FN();

	_items.push_back((*v.operator->()));
}

void PkiItemCollection::push(PkiItem &v){
	LOGGER_FN();

	_items.push_back(v);
}

::TrustedHandle<PkiItemCollection> PkiItemCollection::find(::TrustedHandle<Filter> filter) {
	LOGGER_FN();

	try{
		::TrustedHandle<PkiItemCollection> filteredItems = new PkiItemCollection();

		for (int i = 0, c = this->length(); i < c; i++){
			bool result = 1;

			if (filter->types.size() > 0){
				result = 0;
				for (int j = 0; j < filter->types.size(); j++){
					if (strcmp(this->items(i)->type->c_str(), filter->types[j]->c_str()) == 0){
						result = 1;
						break;
					}
				}
				if (!result){
					continue;
				}
			}

			if (filter->providers.size() > 0){
				result = 0;
				for (int j = 0; j < filter->providers.size(); j++){
					if (strcmp(this->items(i)->provider->c_str(), filter->providers[j]->c_str()) == 0){
						result = 1;
						break;
					}
				}
				if (!result){
					continue;
				}
			}

			if (filter->categorys.size() > 0){
				result = 0;
				for (int j = 0; j < filter->categorys.size(); j++){
					if (strcmp(this->items(i)->category->c_str(), filter->categorys[j]->c_str()) == 0){
						result = 1;
						break;
					}
				}
				if (!result){
					continue;
				}
			}

			if (!(filter->hash.isEmpty())){
				if (strcmp(this->items(i)->hash->c_str(), filter->hash->c_str()) == 0){
					result = 1;
				}
				else{
					result = 0;
					continue;
				}
			}

			if (!(filter->subjectName.isEmpty())){
				if ((strcmp(this->items(i)->certSubjectName->c_str(), filter->subjectName->c_str()) == 0) ||
					(strcmp(this->items(i)->csrSubjectName->c_str(), filter->subjectName->c_str()) == 0)){
					result = 1;
				}
				else{
					result = 0;
					continue;
				}
			}

			if (!(filter->subjectFriendlyName.isEmpty())){
				if ((strcmp(this->items(i)->certSubjectFriendlyName->c_str(), filter->subjectFriendlyName->c_str()) == 0) ||
					(strcmp(this->items(i)->csrSubjectFriendlyName->c_str(), filter->subjectFriendlyName->c_str()) == 0)){
					result = 1;
				}
				else{
					result = 0;
					continue;
				}
			}

			if (!(filter->issuerName.isEmpty())){
				if ((strcmp(this->items(i)->certIssuerName->c_str(), filter->issuerName->c_str()) == 0) ||
					(strcmp(this->items(i)->crlIssuerName->c_str(), filter->issuerName->c_str()) == 0)){
					result = 1;
				}
				else{
					result = 0;
					continue;
				}
			}

			if (!(filter->issuerFriendlyName.isEmpty())){
				if ((strcmp(this->items(i)->certIssuerFriendlyName->c_str(), filter->issuerFriendlyName->c_str()) == 0) ||
					(strcmp(this->items(i)->crlIssuerFriendlyName->c_str(), filter->issuerFriendlyName->c_str()) == 0)){
					result = 1;
				}
				else{
					result = 0;
					continue;
				}
			}

			if (!(filter->serial.isEmpty())){
				if (strcmp(this->items(i)->certSerial->c_str(), filter->serial->c_str()) == 0){
					result = 1;
				}
				else{
					result = 0;
					continue;
				}
			}

			if (result){
				filteredItems->push(this->items(i));
			}
		}

		return filteredItems;
	}
	catch (::TrustedHandle<Exception> e){
		THROW_EXCEPTION(0, PkiItemCollection, e, "Error search object");
	}
}

Filter::Filter(){
	LOGGER_FN();

	types = std::vector<::TrustedHandle<std::string>>();
	providers = std::vector<::TrustedHandle<std::string>>();
	categorys = std::vector<::TrustedHandle<std::string>>();
	isValid = true;
	hash = NULL;
	subjectName = NULL;
	subjectFriendlyName = NULL;
	issuerName = NULL;
	issuerFriendlyName = NULL;
	serial = NULL;
}

void Filter::setType(::TrustedHandle<std::string> type){
	LOGGER_FN();

	this->types.push_back(type);
}

void Filter::setProvider(::TrustedHandle<std::string> provider){
	LOGGER_FN();

	this->providers.push_back(provider);
}

void Filter::setCategory(::TrustedHandle<std::string> category){
	LOGGER_FN();

	this->categorys.push_back(category);
}

void Filter::setHash(::TrustedHandle<std::string> hash){
	LOGGER_FN();

	this->hash = hash;
}

void Filter::setSubjectName(::TrustedHandle<std::string> subjectName){
	LOGGER_FN();

	this->subjectName = subjectName;
}

void Filter::setSubjectFriendlyName(::TrustedHandle<std::string> subjectFriendlyName){
	LOGGER_FN();

	this->subjectFriendlyName = subjectFriendlyName;
}

void Filter::setIssuerName(::TrustedHandle<std::string> issuerName){
	LOGGER_FN();

	this->issuerName = issuerName;
}

void Filter::setIssuerFriendlyName(::TrustedHandle<std::string> issuerFriendlyName){
	LOGGER_FN();

	this->issuerFriendlyName = issuerFriendlyName;
}

void Filter::setSerial(::TrustedHandle<std::string> serial){
	LOGGER_FN();

	this->serial = serial;
}

void Filter::setIsValid(bool isValid){
	LOGGER_FN();

	this->isValid = isValid;
}