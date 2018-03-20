#ifndef CMS_PKI_CHAIN_H_INCLUDED
#define  CMS_PKI_CHAIN_H_INCLUDED

#include <openssl/evp.h>
#include <openssl/pem.h>
#include <openssl/cms.h>
#include <openssl/x509.h>

#include "../common/common.h"

#include "../store/pkistore.h"

#include "certs.h"
#include "cert.h"
#include "crls.h"
#include "revocation.h"

#include "../pki/crl.h"
#include "../store/provider_system.h"

class CTWRAPPER_API Chain;

class Chain{

public:
	Chain(){};
	~Chain(){};

	/* Build chain relative certificate collection */
	::TrustedHandle<CertificateCollection> buildChain(::TrustedHandle<Certificate> cert, ::TrustedHandle<CertificateCollection> certs);

	/* Check cerificates in chain */
	bool verifyChain(::TrustedHandle<CertificateCollection> chain, ::TrustedHandle<CrlCollection> crls);

private:
	::TrustedHandle<Certificate> getIssued(::TrustedHandle<CertificateCollection> certs, ::TrustedHandle<Certificate> cert);
	bool checkIssued(::TrustedHandle<Certificate> issuer, ::TrustedHandle<Certificate> cert);
};

#endif //!CMS_PKI_CHAIN_H_INCLUDED
