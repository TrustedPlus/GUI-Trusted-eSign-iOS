#ifndef CMS_SIGNER_ID_H_INCLUDED
#define CMS_SIGNER_ID_H_INCLUDED

#include "../common/common.h"

class CTWRAPPER_API SignerId;

#include "common.h"

class SignerId {
public:
	//Constructor
	SignerId(){};
	~SignerId(){};

	//Properties
	void setIssuerName(::TrustedHandle<std::string> name);
	::TrustedHandle<std::string> getIssuerName();
	void setSerialNumber(::TrustedHandle<std::string> value);
	::TrustedHandle<std::string> getSerialNumber();
	void setKeyId(::TrustedHandle<std::string> value);
	::TrustedHandle<std::string> getKeyId();
protected:
	::TrustedHandle<std::string> issuerName;
	::TrustedHandle<std::string> serialNumber;
	::TrustedHandle<std::string> keyid;
};

#endif  // !CMS_SIGNER_ID_H_INCLUDED

