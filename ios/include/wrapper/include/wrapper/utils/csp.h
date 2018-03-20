#ifndef UTIL_CSP_INCLUDED
#define UTIL_CSP_INCLUDED

#include <vector>
#include <sstream>

#include "../common/common.h"
#include "../pki/cert.h"

struct ProviderProps {
	int type;
	::TrustedHandle<std::string> name;
};

class Csp {
public:
	Csp(){};
	~Csp(){};

	bool isGost2001CSPAvailable();
	bool isGost2012_256CSPAvailable();
	bool isGost2012_512CSPAvailable();

	bool checkCPCSPLicense();
	::TrustedHandle<std::string> getCPCSPLicense();
	::TrustedHandle<std::string> getCPCSPVersion();
	::TrustedHandle<std::string> getCPCSPVersionPKZI();
	::TrustedHandle<std::string> getCPCSPVersionSKZI();
	::TrustedHandle<std::string> getCPCSPSecurityLvl();

	std::vector<ProviderProps> enumProviders();
	std::vector<::TrustedHandle<std::string>> enumContainers(int provType, ::TrustedHandle<std::string> provName);
	::TrustedHandle<Certificate> getCertifiacteFromContainer(::TrustedHandle<std::string> contName, int provType, ::TrustedHandle<std::string> provName);
	::TrustedHandle<std::string> getContainerNameByCertificate(::TrustedHandle<Certificate> cert, ::TrustedHandle<std::string> category);
	void installCertifiacteFromContainer(::TrustedHandle<std::string> contName, int provType, ::TrustedHandle<std::string> provName);
	void deleteContainer(::TrustedHandle<std::string> contName, int provType, ::TrustedHandle<std::string> provName);

#ifdef CSP_ENABLE
	PCCERT_CONTEXT static createCertificateContext(::TrustedHandle<Certificate> cert);

	bool static findExistingCertificate(
		OUT PCCERT_CONTEXT &pOutCertContext,
		IN HCERTSTORE hCertStore,
		IN PCCERT_CONTEXT pCertContext,
		IN DWORD dwFindFlags = 0,
		IN DWORD dwCertEncodingType = X509_ASN_ENCODING | PKCS_7_ASN_ENCODING
		);

private:
	bool static cmpCertAndContFP(LPCSTR szContainerName, LPBYTE pbFPCert, DWORD cbFPCert);

	CRYPT_KEY_PROV_INFO static * getCertificateContextProperty(
		IN PCCERT_CONTEXT pCertContext,
		IN DWORD dwPropId
		);
#endif //CSP_ENABLE
};

#endif //!UTIL_CSP_INCLUDED 
