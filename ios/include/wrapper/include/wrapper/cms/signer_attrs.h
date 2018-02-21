#ifndef CMS_SIGNER_ATTR_COLLECTION_H_INCLUDED
#define CMS_SIGNER_ATTR_COLLECTION_H_INCLUDED

#include "common.h"

class SignerAttributeCollection {
public:
	//Constructor
	SignerAttributeCollection(::TrustedHandle<Signer> signer, bool signed_attr);
	~SignerAttributeCollection(){}

	//Properties
	int length();

	//Methods
	::TrustedHandle<Attribute> items(int index, int location);
	::TrustedHandle<Attribute> items(int index);
	::TrustedHandle<Attribute> items(::TrustedHandle<OID>, int location);
	::TrustedHandle<Attribute> items(::TrustedHandle<OID>);
	void push(::TrustedHandle<Attribute> attr);
	void removeAt(int index);

protected:
	::TrustedHandle<Signer> signer;
	bool signed_attr;
};

#endif  //!CMS_SIGNER_ATTR_COLLECTION_H_INCLUDED

