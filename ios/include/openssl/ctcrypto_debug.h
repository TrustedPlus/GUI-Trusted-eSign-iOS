/*
* Copyright(C) 2011-2011 ООО <<Цифровые технологии>>
*
* Этот файл содержит информацию, являющуюся
* собственностью компании ООО <<Цифровые технологии>>.
*
* Любая часть этого файла не может быть скопирована,
* исправлена, переведена на другие языки,
* локализована или модифицирована любым способом,
* откомпилирована, передана по сети или на
* любую компьютерную систему без предварительного
* заключения соглашения с ООО <<Цифровые технологии>>.
*/

#ifndef CTCRYPTO_DEBUG_H__INCLUDED
#define CTCRYPTO_DEBUG_H__INCLUDED

// log levels
#define LL_OFF    -1
#define LL_NOT_INITED 0
#define LL_FORCED  1   /* forced message */
#define LL_FATAL   2   /* fatal error */
#define LL_ERROR   3   /* error */
#define LL_ASSERT  4   /* failed assertion */
#define LL_WARN    5   /* warning, non critical error */
#define LL_NOTICE  6   /* notice, attention */
#define LL_INFO    7   /* information */
#define LL_DEBUG   8   /* debuging data, small dumps */
#define LL_DUMP    9   /* large dumps */
#define LL_TRACE  10  /* tracing calls */
#define LL_ALL    LL_TRACE
//#define NOT_SET_LOG_LEVEL = -2; - using of default value (LL_NOTICE or LL_INFO?)


#define LOG_ASSERT_ZERO(iLogLevel, x) LOG_ASSERT(iLogLevel, (x) == 0)
#define LOG_ASSERT_NEGATIVE(iLogLevel, x) LOG_ASSERT(iLogLevel, (x) < 0)
#define LOG_ASSERT_POSITIVE(iLogLevel, x) LOG_ASSERT(iLogLevel, (x) > 0)
#define LOG_ASSERT_NOT(iLogLevel, x) LOG_ASSERT(iLogLevel, (!(x)))
#define LOG_ASSERT_NOT_ZERO(iLogLevel, x) LOG_ASSERT(iLogLevel, (x) != 0)
#define LOG_ASSERT_NOT_NEGATIVE(iLogLevel, x) LOG_ASSERT(iLogLevel, (x) >= 0)
#define LOG_ASSERT_NOT_POSITIVE(iLogLevel, x) LOG_ASSERT(iLogLevel, (x) <= 0)
#define LOG_ASSERT_TRUE(iLogLevel, x) LOG_ASSERT(iLogLevel, (x) == TRUE)
#define LOG_ASSERT_FALSE(iLogLevel, x) LOG_ASSERT(iLogLevel, (x) == FALSE)
#define LOG_ASSERT_NULL(iLogLevel, x) LOG_ASSERT(iLogLevel, (x) == NULL)
#define LOG_ASSERT_NOT_NULL(iLogLevel, x) LOG_ASSERT(iLogLevel, (x) != NULL)
#define LOG_ASSERT_HCRYPT_NULL(iLogLevel, x) LOG_ASSERT(iLogLevel, (x) == HCRYPT_NULL)
#define LOG_ASSERT_NOT_HCRYPT_NULL(iLogLevel, x) LOG_ASSERT(iLogLevel, (x) != HCRYPT_NULL)
#define LOG_ASSERT_STRLEN(iLogLevel, x) LOG_ASSERT(iLogLevel, ((x) && (strlen(x) > 0)))


// uncomment follow definition for enable debug logging
//#define DEBUG_LOG

#ifdef DEBUG_LOG

#include <openssl/bio.h>


// LOG_DECLARE_LOCATION should be declared before local variables
#define LOG_DECLARE_LOCATION_NO_TRACE(szLocation) \
	char _szLogLocation[] = szLocation; \
	int _iLogTmp = 0

#define LOG_DECLARE_LOCATION(szLocation) \
	char _szLogLocation[] = szLocation; \
	int _iLogTmp = (LOG_is_logging(LL_TRACE) > 0) ? LOG_log(LL_TRACE, LOG_get_datetime(), \
		OPENSSL_strdup("in ..."), \
		_szLogLocation, __FILE__, __LINE__) : 0

#define LOG_AVOID_ARTIFACTS \
	(void)(_szLogLocation); \
	(void)(_iLogTmp)

// asserions
#define LOG_ASSERT(iLogLevel, x) \
	(void) ( LOG_check_bool((int)(x)) \
		|| (( LOG_is_logging(iLogLevel) > 0 ) \
			&& LOG_log(iLogLevel, LOG_get_datetime(), \
			    LOG_format(-1, "Assertion failed: '%s'", #x), \
			    _szLogLocation, __FILE__, __LINE__) )); \
	LOG_AVOID_ARTIFACTS

// syntax of "args" in follow macroses: iLogLevel, format, ...
#define LOG_PRINTF(args) \
	{ \
		int iLogLevel = LOG_get_level_arg args; \
		if (LOG_is_logging(iLogLevel) > 0) \
		{ \
			char *pszLogText = LOG_format args; \
			LOG_log(iLogLevel, LOG_get_datetime(), \
				pszLogText, \
				_szLogLocation, __FILE__, __LINE__); \
		} \
	} \
	LOG_AVOID_ARTIFACTS

#define LOG_ERRNO(args) \
	{ \
		int iErrno = errno; \
		int iLogLevel = LOG_get_level_arg args; \
		if (LOG_is_logging(iLogLevel) > 0) \
		{ \
			char *pszLogText = LOG_format args; \
			char *szErrnoDesc = strerror(iErrno); \
			pszLogText = LOG_concat( pszLogText, LOG_format(-1, " (errno:%d '%s')", iErrno, szErrnoDesc)); \
			LOG_log(iLogLevel, LOG_get_datetime(), \
				pszLogText, \
				_szLogLocation, __FILE__, __LINE__); \
		} \
		errno = iErrno; \
	} \
	LOG_AVOID_ARTIFACTS

#define LOG_WINERROR(args) \
	{ \
		int iLogLevel = LOG_get_level_arg args; \
		if (LOG_is_logging(iLogLevel) > 0) \
		{ \
			char *pszLogText = LOG_format args; \
			pszLogText = LOG_concat( pszLogText, LOG_format(-1, " (ERROR:0x%08x)", GetLastError())); \
			LOG_log(iLogLevel, LOG_get_datetime(), \
				pszLogText, \
				_szLogLocation, __FILE__, __LINE__); \
		} \
	} \
	LOG_AVOID_ARTIFACTS

#define LOG_SECERROR(args) \
	{ \
		int iLogLevel = LOG_get_level_arg args; \
		if (LOG_is_logging(iLogLevel) > 0) \
		{ \
			char *pszLogText = LOG_format_sec args; \
			LOG_log(iLogLevel, LOG_get_datetime(), \
				pszLogText, \
				_szLogLocation, __FILE__, __LINE__); \
		} \
	} \
	LOG_AVOID_ARTIFACTS

#define LOG_SQLITEERROR(args) \
	{ \
		int iLogLevel = LOG_get_level_arg args; \
		if (LOG_is_logging(iLogLevel) > 0) \
		{ \
			char *pszLogText = LOG_format_sqlite args; \
			LOG_log(iLogLevel, LOG_get_datetime(), \
				pszLogText, \
				_szLogLocation, __FILE__, __LINE__); \
		} \
	} \
	LOG_AVOID_ARTIFACTS


typedef int (* fnLog)(int iLogLevel, const char *szDateTime, const char *szLogLevel, const char *szText,
                      const char *szLocation, const char *szFile, int iLine);

CTCRYPTO_API int LOG_register_log_func(fnLog fnForReg);
CTCRYPTO_API int LOG_unregister_log_func(fnLog fnForUnreg);

CTCRYPTO_API int LOG_get_level();
CTCRYPTO_API void LOG_set_level(int iNewValue);

CTCRYPTO_API BIO* LOG_get_bio(void);
CTCRYPTO_API void LOG_set_bio(BIO* bio);
CTCRYPTO_API void LOG_free_bio();

// private functions
CTCRYPTO_API int LOG_get_level_arg(int iLogLevel, const char *format, ...);
CTCRYPTO_API const char * LOG_get_level_str(int iLogLevel);
CTCRYPTO_API int LOG_is_logging(int iLogLevel); // 0 - false, 1 - true
CTCRYPTO_API char * LOG_get_datetime();
CTCRYPTO_API char * LOG_vformat(const char *format, va_list args);
CTCRYPTO_API char * LOG_format(int iDummy, const char *format, ...);
CTCRYPTO_API char * LOG_format_sec(int iDummy, const char *format, ...);
CTCRYPTO_API char * LOG_format_sqlite(int iDummy, const char *format, ...);
CTCRYPTO_API char * LOG_concat(char * szLeft, char * szRight);
CTCRYPTO_API int LOG_log(int iLogLevel, char *szDateTime, char *szText,
                         const char *szLocation, const char *szFile, int iLine);

CTCRYPTO_API int LOG_check_bool(int bValue);

#else // !DEBUG_LOG

#define LOG_DECLARE_LOCATION_NO_TRACE(szLocation)   int _iLogDummy
#define LOG_DECLARE_LOCATION(szLocation)   LOG_DECLARE_LOCATION_NO_TRACE(szLocation)
#define LOG_AVOID_ARTIFACTS   (void)(_iLogDummy)
#define LOG_ASSERT(iLogLevel, x)   LOG_AVOID_ARTIFACTS
#define LOG_PRINTF(args)   LOG_AVOID_ARTIFACTS
#define LOG_ERRNO(args)   LOG_AVOID_ARTIFACTS
#define LOG_WINERROR(args)   LOG_AVOID_ARTIFACTS
#define LOG_SECERROR(args)   LOG_AVOID_ARTIFACTS
#define LOG_SQLITEERROR(args)   LOG_AVOID_ARTIFACTS

#define LOG_free_bio()

#endif // !DEBUG_LOG

#endif // !CTCRYPTO_DEBUG_H__INCLUDED
