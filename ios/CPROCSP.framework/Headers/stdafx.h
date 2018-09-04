#include<CPROCSP/common.h>

#if defined DEBUG && !defined _DEBUG
    #define _DEBUG 1
#endif

#if !defined( UNIX ) 

    #if !defined( CSP_LITE )

       	#ifdef _CPKERB_STATUS_
	    #define WIN32_NO_STATUS
       	#endif // _CPKERB_STATUS_

       	#if defined (UNDER_CE)
	    #define NTE_INVALID_PARAMETER _HRESULT_TYPEDEF_(0x80090027L)
	    #pragma warning(disable:4214 4115)
       	#endif // defined (UNDER_CE)

       	// Уберем совсем предупреждение C4201
       	// (nonstandard extension used : nameless struct/union)
       	// т.к. оно активно используется в системных заголовках,
       	// а предназначенное для борьбы с ним лекарство - макрос NONAMELESSUNION
       	// не работает в полном объеме.
       	#if !defined(UNIX)
	    #pragma warning(disable:4201)
       	#endif
       	#if !defined (UNDER_CE)
	    #include <winsock2.h>
       	#endif
       	#include <windows.h>
		#include <VersionHelpers.h>
       	#ifdef _CPKERB_STATUS_
	    #undef WIN32_NO_STATUS
	    #include <ntstatus.h>
	    #define SECURITY_WIN32
	    #include <security.h>
	    #include <wincred.h>
	    #include <ntsecapi.h>
       	#endif /* _CPKERB_STATUS */

       	#if !defined (UNDER_CE)
	    #include <crtdbg.h>
       	#else // !defined (UNDER_CE)
	    #include <altcecrt.h> //ради _ASSERTE
	    #include <wincrypt.h>
	    #include <WinSock2.h>
       	#endif // !defined (UNDER_CE)

	#ifndef sleep_cryptopro_ru
	#define sleep_cryptopro_ru
	    static __inline 
	    unsigned int sleep(unsigned int seconds) {
		Sleep(seconds*1000UL);
		return 0;
	    }
	#endif

    #else /* CSP_LITE */

       	#include "CSP_WinDef.h"
       	#include "CSP_WinCrypt.h"
       	#include "CSP_WinError.h"

    #endif /* CSP_LITE */

#else /* UNIX */

    #ifndef CSP_LITE
       	#if !defined _GNU_SOURCE
	    #define _GNU_SOURCE
       	#endif /* !_GNU_SOURCE */
       	#include <string.h>
    #endif
#include<CPROCSP/CSP_WinDef.h>
    #define CPCSP_USE_NON_STANDART_OIDS
#include<CPROCSP/WinCryptEx.h>
#include<CPROCSP/wincsp.h>
#include<CPROCSP/CSP_WinError.h>

    #if !defined(_ASSERTE)
	#if !defined (MODULE) && !defined(KERNEL)
	    #include <assert.h>
	    #define _ASSERTE(x) assert(x)
	#else
	    #define _ASSERTE(x) (x)
	#endif
    #endif

#endif /* UNIX */

#define ADDRESSIZE sizeof(unsigned long*)
#define MASK32BIT 0xffffffff
