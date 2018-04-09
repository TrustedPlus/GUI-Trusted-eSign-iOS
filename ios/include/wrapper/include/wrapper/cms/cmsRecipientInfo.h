#ifndef CMS_PKI_CMSRECIPIENTINFO_H_INCLUDED
#define  CMS_PKI_CMSRECIPIENTINFO_H_INCLUDED

#include <openssl/cms.h>

#include "../common/common.h"
#include "../pki/cert.h"

class CTWRAPPER_API CmsRecipientInfo;

class CmsRecipientInfo {
public:
	//constructor
	CmsRecipientInfo(){};
	CmsRecipientInfo(CMS_RecipientInfo *ri);
	~CmsRecipientInfo(){};

	//properties
	::TrustedHandle<std::string> getSerialNumber();
	::TrustedHandle<std::string> getIssuerName();

	//Methods
	void setValue(CMS_RecipientInfo *ri);
	::TrustedHandle<CmsRecipientInfo> duplicate();
	int ktriCertCmp(::TrustedHandle<Certificate> cert);
public:
	CMS_RecipientInfo *ri = NULL;
};

#endif //!CMS_PKI_CMSRECIPIENTINFO_H_INCLUDED
