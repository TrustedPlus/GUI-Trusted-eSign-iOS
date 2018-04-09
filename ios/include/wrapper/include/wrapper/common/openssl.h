#include "common.h"

#ifndef COMMON_OPENSSL_T_H_INCLUDED
#define  COMMON_OPENSSL_T_H_INCLUDED

#include "bio.h"

class CTWRAPPER_API OpenSSL{
	public:
		static void run();
		static void stop();
		static ::TrustedHandle<std::string> printErrors();
};

#endif //!COMMON_OPENSSL_T_H_INCLUDED
