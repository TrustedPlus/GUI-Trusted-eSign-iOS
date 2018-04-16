#ifndef PKI_REVOCATION_H_INCLUDED
#define PKI_REVOCATION_H_INCLUDED

#include "../common/common.h"
#include "../store/pkistore.h"

class CTWRAPPER_API CRL;

#include "crl.h"
#include "cert.h"
#include "../store/pkistore.h"

class Revocation{
public:	
	::TrustedHandle<CRL> getCrlLocal(::TrustedHandle<Certificate> cert, ::TrustedHandle<PkiStore> pkiStore);
	bool checkCrlTime(::TrustedHandle<CRL> crl);
	std::vector<std::string> getCrlDistPoints(::TrustedHandle<Certificate> cert);
};

#endif //!PKI_REVOCATION_H_INCLUDED
