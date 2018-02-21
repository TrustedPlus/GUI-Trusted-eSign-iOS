#ifndef CMS_PKI_CSR_H_INCLUDED
#define  CMS_PKI_CSR_H_INCLUDED

#include <openssl/x509v3.h>

#include "../common/common.h"

class CTWRAPPER_API CSR;

#include "pki.h"

class CSR{
public:
	X509_REQ *req;
public:
	
	CSR(::TrustedHandle<std::string> x509Name, ::TrustedHandle<Key> key, const char* digest);

	void write(::TrustedHandle<Bio> out, DataFormat::DATA_FORMAT format);

	::TrustedHandle<std::string> getEncodedHEX();
};

#endif