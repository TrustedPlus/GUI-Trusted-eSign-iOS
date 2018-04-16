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

#ifndef CTCRYPTO_H__INCLUDED
#define CTCRYPTO_H__INCLUDED

#include <openssl/e_os2.h> // it includes <openssl/opensslconf.h>


#if defined(OPENSSL_SYS_WINDOWS)

#include <windows.h>
#include <tchar.h>

#if defined(CTCRYPTO_STATIC)
#define CTCRYPTO_API
#elif defined(CTCRYPTO_EXPORTS)
#define CTCRYPTO_API __declspec(dllexport)
#else // !CTCRYPTO_EXPORTS
#define CTCRYPTO_API __declspec(dllimport)
#endif // !CTCRYPTO_EXPORTS

#else // !OPENSSL_SYS_WINDOWS

#include <ctype.h>
#include <string.h>
#include <strings.h>

#define CTCRYPTO_API

#ifdef __APPLE__
// Apple specific
#include <CoreFoundation/CFString.h>

#define CFRELEASE(x) \
	if (x) { CFRelease(x); x = NULL; }
#endif // __APPLE__

#endif // !OPENSSL_SYS_WINDOWS

#include <openssl/pem.h>
#include <openssl/evp.h>
#include <openssl/asn1.h>
#include <openssl/cms.h>
#include <openssl/engine.h>
#ifndef OPENSSL_NO_STORE
#include <openssl/store.h>
#endif // !OPENSSL_NO_STORE

#include <sys/stat.h> // for stat()


#ifdef __cplusplus
extern "C" {
#endif

// === engine specific definitions ===
#define CTCRYPTO_ENGINE_get_x509_lookup_method(engine, ppMethod) \
	ENGINE_ctrl(engine, CTCRYPTO_ENGINE_CTRL_GET_X509_LOOKUP_METHOD, 0, ppMethod, 0)

#define CTCRYPTO_ENGINE_CTRL_BASE                           570
#define CTCRYPTO_ENGINE_CTRL_GET_X509_LOOKUP_METHOD			(CTCRYPTO_ENGINE_CTRL_BASE + 1)

// evp_pkey:
#define CTCRYPTO_EVP_PKEY_CTX_get_keyid(ctx, keytype, buff, buflen) \
	EVP_PKEY_CTX_ctrl(ctx, keytype, -1, CTCRYPTO_PKEY_CTRL_GET_KEYID, \
		buflen, buff)

#define CTCRYPTO_EVP_PKEY_CTX_get_friendly_name(ctx, keytype, buff, buflen) \
	EVP_PKEY_CTX_ctrl(ctx, keytype, -1, CTCRYPTO_PKEY_CTRL_GET_FRIENDLY_NAME, \
		buflen, buff)

#define CTCRYPTO_EVP_PKEY_CTX_is_decrypted_key(ctx, keytype) \
	EVP_PKEY_CTX_ctrl(ctx, keytype, -1, CTCRYPTO_PKEY_CTRL_IS_DECRYPTED_KEY, \
		0, NULL)

#define CTCRYPTO_EVP_PKEY_CTX_decrypt_key(ctx, keytype, flags, password) \
	EVP_PKEY_CTX_ctrl(ctx, keytype, -1, CTCRYPTO_PKEY_CTRL_DECRYPT_KEY, \
		flags, password)

#define CTCRYPTO_EVP_PKEY_CTX_change_password(ctx, keytype, flags, new_password) \
	EVP_PKEY_CTX_ctrl(ctx, keytype, -1, CTCRYPTO_PKEY_CTRL_CHANGE_PASSWORD, \
		flags, new_password)

#define CTCRYPTO_EVP_PKEY_CTX_init_key_by_cert(ctx, keytype, x509) \
	EVP_PKEY_CTX_ctrl(ctx, keytype, -1, CTCRYPTO_PKEY_CTRL_INIT_KEY_BY_CERT, \
		0, x509)

#define CTCRYPTO_PKEY_CTRL_BASE                 (EVP_PKEY_ALG_CTRL + 0x240)
#define CTCRYPTO_PKEY_CTRL_GET_KEYID            (CTCRYPTO_PKEY_CTRL_BASE + 1)   /* returns keyid (pkey must be linked to ctx) */
#define CTCRYPTO_PKEY_CTRL_GET_FRIENDLY_NAME    (CTCRYPTO_PKEY_CTRL_BASE + 2)   /* returns friendly name (pkey must be linked to ctx) */
#define CTCRYPTO_PKEY_CTRL_IS_DECRYPTED_KEY     (CTCRYPTO_PKEY_CTRL_BASE + 3)   /* verify existing decrypted key (pkey must be linked to ctx) */
#define CTCRYPTO_PKEY_CTRL_DECRYPT_KEY          (CTCRYPTO_PKEY_CTRL_BASE + 4)   /* decipher encrypted key using password_cb (pkey must be linked to ctx) */
#define CTCRYPTO_PKEY_CTRL_CHANGE_PASSWORD      (CTCRYPTO_PKEY_CTRL_BASE + 5)   /* change password (pkey must be linked to ctx and key must be decrypted) */
#define CTCRYPTO_PKEY_CTRL_INIT_KEY_BY_CERT     (CTCRYPTO_PKEY_CTRL_BASE + 6)   /* looking for certificate in store & seting key property if found */

#define CTCRYPTO_PKEY_CTRL_STR_PARAM_KEYID          "keyid"   /* key id */
#define CTCRYPTO_PKEY_CTRL_STR_PARAM_PASSWORD       "password"   /* password */
#define CTCRYPTO_PKEY_CTRL_STR_PARAM_STORE          "store"   /* save to store after generation */
#define CTCRYPTO_PKEY_CTRL_STR_VALUE_YES            "yes"   /* common value "yes" */
#define CTCRYPTO_PKEY_CTRL_STR_VALUE_NO             "no"   /* common value "no" */

// store:
#define CTCRYPTO_STORE_set_type(store, type) \
	STORE_ctrl(store, CTCRYPTO_STORE_CTRL_SET_TYPE, 0, type, NULL)

#define CTCRYPTO_STORE_set_name(store, name) \
	STORE_ctrl(store, CTCRYPTO_STORE_CTRL_SET_NAME, 0, name, NULL)

#define CTCRYPTO_STORE_CTRL_BASE            470
#define CTCRYPTO_STORE_CTRL_SET_TYPE        STORE_CTRL_SET_DIRECTORY   /* see follow CTCRYPTO_STORE_TYPE_xxx */
#define CTCRYPTO_STORE_CTRL_SET_NAME        STORE_CTRL_SET_FILE   /* "My", "AddressBook", "CA", "Root" & any other (case insensitive) */
#define CTCRYPTO_STORE_CTRL_DELETE_STORE    (CTCRYPTO_STORE_CTRL_BASE + 1127)

#define CTCRYPTO_STORE_TYPE_CURRENT_USER        (1 << 0)
#define CTCRYPTO_STORE_TYPE_LOCAL_MACHINE       (1 << 1)


// === other definitions ===
#ifndef va_copy
# ifdef __va_copy
#  define va_copy(dst, src) __va_copy(dst, src)
# else /* !__va_copy */
#  define va_copy(dst, src) ((dst) = (src))
# endif /* __va_copy */
#endif /* va_copy */

#ifndef _countof
#define _countof(array) (sizeof(array)/sizeof(array[0]))
#endif

#ifndef MIN
#define MIN(a, b) ((a) < (b) ? (a) : (b))
#endif

#ifndef MAX
#define MAX(a, b) ((a) > (b) ? (a) : (b))
#endif

#ifndef UNUSED
#define UNUSED(x) (void)(x)
#endif

#ifndef BOOL2STR
#define BOOL2STR(x) ((x) ? "TRUE" : "FALSE")
#endif

#ifndef CAST2INT
#define CAST2INT(x) ((unsigned char *)(x) - (unsigned char *)NULL)
#endif

#if (SIZEOF_VOID_P == 8) || defined(_WIN64)
#define PTR_FORMAT "(ptr) %016p"
#else
#define PTR_FORMAT "(ptr) %08p"
#endif

#define LOG_IMPLEMENT_ME(szComment) \
	LOG_PRINTF((LL_ERROR, "// TODO: implement me - " szComment));

typedef enum
{
	EXAUTODETECT = -1,
	EXEMPTY = 0,
	EXFALSE = 1,
	EXTRUE = 2
} EXBOOL;

//#define EXB2BOOL(x) (x - 1) - use IS_EXxxx() instead
#define BOOL2EXB(x) ((x) ? EXTRUE : EXFALSE)
#define IS_EXAUTODETECT(x) (EXAUTODETECT == (x))
#define IS_EXEMPTY(x) (EXEMPTY == (x))
#define IS_EXFALSE(x) (EXFALSE == (x))
#define IS_EXTRUE(x) (EXTRUE == (x))
#define IS_EXBOOL_HOLD_VALUE(x) ((x) & (EXFALSE | EXTRUE))
#define ASN2EXB(x) ((x) ? (-1 == (x) ? EXEMPTY : EXTRUE) : EXFALSE)

#define COMMON_FREE(t, x) \
	if (x) { t ## _free(x); x = NULL; }
#define COMMON_ASN1_FREE(t, x) \
	if (x) { M_ASN1_free_of(x, t); x = NULL; }
// for standard OpenSSL types (in alphabetical order)
#define ASN1_INTEGER_FREE(x) COMMON_FREE(ASN1_INTEGER, x)
#define ASN1_OCTET_STRING_FREE(x) COMMON_FREE(ASN1_OCTET_STRING, x)
#define ASN1_STRING_FREE(x) COMMON_FREE(ASN1_STRING, x)
#define ASN1_TYPE_FREE(x) COMMON_FREE(ASN1_TYPE, x)
#define BN_FREE(x) COMMON_FREE(BN, x)
#define BN_CTX_FREE(x) COMMON_FREE(BN_CTX, x)
#define BIO_FREE(x) COMMON_FREE(BIO, x)
#define BUF_MEM_FREE(x) COMMON_FREE(BUF_MEM, x)
#define CMS_CONTENT_INFO_FREE(x) COMMON_FREE(CMS_ContentInfo, x)
#define CMS_SIGNED_DATA_FREE(x) COMMON_ASN1_FREE(CMS_SignedData, x)
#define CMS_SIGNER_INFO_FREE(x) \
	if (x) { CMS_SignerInfo_freeEx(x); x = NULL; }
#define EC_GROUP_FREE(x) COMMON_FREE(EC_GROUP, x)
#define EC_KEY_FREE(x) COMMON_FREE(EC_KEY, x)
#define EC_POINT_FREE(x) COMMON_FREE(EC_POINT, x)
#define OPENSSL_FREE(x) COMMON_FREE(OPENSSL, x)
#define OPENSSL_ITEM_FREE(x) COMMON_FREE(OPENSSL_ITEM, x)
#define PKCS7_FREE(x) COMMON_FREE(PKCS7, x)
#define PKCS8_PRIV_KEY_INFO_FREE(x) COMMON_FREE(PKCS8_PRIV_KEY_INFO, x)
#define PKCS7_SIGNER_INFO_FREE(x) COMMON_FREE(PKCS7_SIGNER_INFO, x)
#define PKCS12_FREE(x) COMMON_FREE(PKCS12, x)
#define PKCS12_SAFEBAG_FREE(x) COMMON_FREE(PKCS12_SAFEBAG, x)
#define RSA_FREE(x) COMMON_FREE(RSA, x)
#define EVP_PKEY_FREE(x) COMMON_FREE(EVP_PKEY, x)
#define EVP_PKEY_CTX_FREE(x) COMMON_FREE(EVP_PKEY_CTX, x)
#define X509_FREE(x) COMMON_FREE(X509, x)
#define X509_CRL_FREE(x) COMMON_FREE(X509_CRL, x)
#define X509_NAME_FREE(x) COMMON_FREE(X509_NAME, x)
#define X509_PKEY_FREE(x) COMMON_FREE(X509_PKEY, x)
#define X509_SIG_FREE(x) COMMON_FREE(X509_SIG, x)
#define X509_STORE_FREE(x) COMMON_FREE(X509_STORE, x)
#define STORE_FREE(x) COMMON_FREE(STORE, x)
#define STORE_OBJECT_FREE(x) COMMON_FREE(STORE_OBJECT, x)

#define SK_FREE_NO_POP(t, x) \
	if (x) { sk_ ## t ## _free(x); x = NULL; }
#define SK_POP_FREE(t, x) \
	if (x) { sk_ ## t ## _pop_free(x, t ## _free); x = NULL; }

// for other types (in alphabetical order)
#define SQLITE3_CLOSE(x) \
	if (x) { sqlite3_close(x); x = NULL; }
#define SQLITE3_FINALIZE(x) \
	if (x) { sqlite3_finalize(x); x = NULL; }

// for self types (in alphabetical order)
#define BASIC_TYPE_FREE(x) COMMON_FREE(BASIC_TYPE, x)

#include "ctcrypto_stack.h"
#include "ctcrypto_debug.h"


typedef union
{
	char _char;
	signed char schar;
	unsigned char uchar;

	short int _short;
	signed short int sshort;
	unsigned short int ushort;

	int _int;
	signed int sint;
	unsigned int uint;

	long int _long;
	signed long int slong;
	unsigned long int ulong;

	long long int _longlong;
	signed long long int slonglong;
	unsigned long long int ulonglong;

	float _float;

	double _double;

	long double _longdouble;
} BASIC_TYPE;

DECLARE_STACK_OF(BASIC_TYPE)

// TODO: remove this OPENSSL's struct from project(?)
typedef struct openssl_pw_cb_data
{
	const void *pPassword;
	const char *pszPromptInfo;
} OPENSSL_PW_CB_DATA;

// helper functions
CTCRYPTO_API void OPENSSL_STRING_free(OPENSSL_STRING); // for sk_OPENSSL_STRING_pop_free()

CTCRYPTO_API OPENSSL_ITEM *OPENSSL_ITEM_new(int count, const OPENSSL_ITEM *data);
CTCRYPTO_API void OPENSSL_ITEM_free(OPENSSL_ITEM *data);

CTCRYPTO_API BASIC_TYPE *BASIC_TYPE_new(const void *data, size_t len);
CTCRYPTO_API void BASIC_TYPE_free(BASIC_TYPE *data);

CTCRYPTO_API void ERR_load_CTCRYPTO_strings(void);
CTCRYPTO_API void ERR_unload_CTCRYPTO_strings(void);
CTCRYPTO_API void ERR_CTCRYPTO_errnoerror(char *file, int line);
#define CTCRYPTOerrnoerr() ERR_CTCRYPTO_errnoerror(__FILE__,__LINE__)

CTCRYPTO_API char *strndupEx(const char *src, size_t n); // not requires NULL-terminating of src contrary to BUF_strndup()

CTCRYPTO_API BUF_MEM * BUF_MEM_newWithLen(size_t size, int bZeroMemory);
CTCRYPTO_API BUF_MEM * BUF_MEM_newWithData(const void *ptr, size_t size);
CTCRYPTO_API BUF_MEM * BUF_MEM_newWithStr(const char *str, int bAppendNull);
CTCRYPTO_API BUF_MEM * BUF_MEM_newWithPrintf(const char *format, ...);
CTCRYPTO_API BUF_MEM * BUF_MEM_newWithVprintf(const char *format, va_list args);
CTCRYPTO_API size_t BUF_MEM_printf(BUF_MEM *buf, const char *format, ...);
CTCRYPTO_API size_t BUF_MEM_vprintf(BUF_MEM *buf, const char *format, va_list args);
CTCRYPTO_API size_t BUF_MEM_writeData(BUF_MEM *buf, const void *ptr, size_t size);
CTCRYPTO_API size_t BUF_MEM_writeStr(BUF_MEM *buf, const char *str, int iLen, int bAppendNull);
CTCRYPTO_API size_t BUF_MEM_appendData(BUF_MEM *buf, const void *ptr, size_t size);
CTCRYPTO_API size_t BUF_MEM_appendStr(BUF_MEM *buf, const char *str, int iLen, int bAppendNull);
CTCRYPTO_API size_t BUF_MEM_appendNull(BUF_MEM *buf);
CTCRYPTO_API size_t BUF_MEM_appendPrintf(BUF_MEM *buf, const char *format, ...);
CTCRYPTO_API size_t BUF_MEM_appendVprintf(BUF_MEM *buf, const char *format, va_list args);

CTCRYPTO_API int num2bit(unsigned long long int ullValue, int iReturnFirstBitIfSeveral);
CTCRYPTO_API int str2bool(const char * pszValue, int iDefaultValue);
CTCRYPTO_API char * data2hex(const void *ptr, size_t len, const char *format); // for output to BIO use printDataAsHex()
CTCRYPTO_API char * str2hex(const char *str, const char *format); // for output to BIO use printStrAsHex()
CTCRYPTO_API char * asn2str(ASN1_STRING *asn1s); // for output to BIO use printAsn1Str()
CTCRYPTO_API char * asn2hexStr(ASN1_STRING *asn1s, const char *format); // for output to BIO use printAsn1StrAsHex()
CTCRYPTO_API char * asnTime2iso8601(ASN1_TIME *asn1time); // for output to BIO use printAsn1TimeAsIso8601()

CTCRYPTO_API int printDataAsHex(BIO *bio, const void *ptr, size_t len, const char *format);
CTCRYPTO_API int printStrAsHex(BIO *bio, const char *str, const char *format);
CTCRYPTO_API int printAsn1Str(BIO *bio, ASN1_STRING *asn1s);
CTCRYPTO_API int printAsn1StrAsHex(BIO *bio, ASN1_STRING *asn1s, const char *format);
CTCRYPTO_API int printAsn1TimeAsIso8601(BIO *bio, ASN1_TIME *asn1time);
CTCRYPTO_API int printDN(BIO *bio, X509_NAME *name);
CTCRYPTO_API int printBigNum(BIO *bio, BIGNUM *number);
CTCRYPTO_API int printCertSubjectDN(BIO *bio, X509 *cert);
CTCRYPTO_API int printCertIssuerDN(BIO *bio, X509 *cert);
CTCRYPTO_API int printCertSerialNumber(BIO *bio, X509 *cert);
CTCRYPTO_API int printCertNotBefore(BIO *bio, X509 *cert);
CTCRYPTO_API int printCertNotAfter(BIO *bio, X509 *cert);
CTCRYPTO_API int printCertEKU(BIO *bio, X509 *cert, const char *szSeparator,
	const char *szPreffix, const char *szSuffix, const char *szTextIfEkuIsAbsent);
CTCRYPTO_API int printCertHash(BIO *bio, X509 *cert);
//CTCRYPTO_API char * printEmail(BIO *bio, X509_NAME *name, int flags); - use X509_get1_email() instead this
//CTCRYPTO_API int printCertEmail(BIO *bio, X509 *cert, int flags, int iFindInOtherPlaces);
CTCRYPTO_API int printCrlIssuerDN(BIO *bio, X509_CRL *crl);
CTCRYPTO_API int printCrlThisUpdate(BIO *bio, X509_CRL *crl);
CTCRYPTO_API int printCrlNextUpdate(BIO *bio, X509_CRL *crl);
CTCRYPTO_API int printCrlHash(BIO *bio, X509_CRL *crl);

CTCRYPTO_API int printPubKeyHash(BIO *bio, EVP_PKEY *pkey);


CTCRYPTO_API int ASN1_TYPE_swap(ASN1_TYPE *a, ASN1_TYPE *b);

CTCRYPTO_API int X509_ATTRIBUTE_replace1Data(X509_ATTRIBUTE *attr,
	int index, int type, const void *data, int len, int freeOldContent);

CTCRYPTO_API X509 *readCertificateFile(X509 **cert, const char *file); // DER & PEM formats supported


// === CMS ===
#define BIO_TYPE_STREAM_CMS 		(114|BIO_TYPE_FILTER)		/* filter */
#define BIO_TYPE_STREAM_CMS_ENVELOPED_HEADER	(115|BIO_TYPE_FILTER)
#define BIO_TYPE_STREAM_CMS_ENVELOPED_CONTENT	(116|BIO_TYPE_FILTER)

CTCRYPTO_API char *X509_NAME_onelineEx(X509_NAME *a, char*buf, int len);

CTCRYPTO_API CMS_SignerInfo *CMS_SignerInfo_newEx(void);
CTCRYPTO_API CMS_SignerInfo *CMS_SignerInfo_newEx2(X509 *signer, EVP_PKEY *pk, const EVP_MD *md, unsigned int flags);
CTCRYPTO_API void CMS_SignerInfo_freeEx(CMS_SignerInfo *a);
CTCRYPTO_API CMS_SignerInfo *d2i_CMS_SignerInfoEx(CMS_SignerInfo **a, const unsigned char **in, long len);
CTCRYPTO_API int i2d_CMS_SignerInfoEx(CMS_SignerInfo *a, unsigned char **out);
CTCRYPTO_API CMS_SignerInfo *CMS_SignerInfo_createEx(X509 *signer, EVP_PKEY *pk, const EVP_MD *md, unsigned int flags);
CTCRYPTO_API void CMS_SignerInfo_get0_algsEx(CMS_SignerInfo *si, EVP_PKEY **pk, X509 **signer, X509_ALGOR **pdig, X509_ALGOR **psig, ASN1_OCTET_STRING **sig);

CTCRYPTO_API int CMS_add0_certEx(CMS_ContentInfo *cms, X509 *cert); // returns 0 if certificate already exists
CTCRYPTO_API int CMS_add1_certEx(CMS_ContentInfo *cms, X509 *cert); // returns 0 if certificate already exists
CTCRYPTO_API int CMS_add1_digestAlgorithmEx(CMS_ContentInfo *cms, const EVP_MD *md);
CTCRYPTO_API int CMS_SignerInfoEx(CMS_SignerInfo *si);

CTCRYPTO_API int CMS_set1_signerCert(CMS_ContentInfo *cms, CMS_SignerInfo *si,
	STACK_OF(X509) *scerts, unsigned int flags);

CTCRYPTO_API BIO *d2i_CMS_streamInitEx(BIO *in, BIO *dcont, BIO **chain); // returned BIO should be passed to d2i_CMS_bio()

typedef struct cms_handlerDataEx_st
{
	size_t uiStructSize; // for all cases
	void *pUserData; // for all cases
	int iIsModified; // for most cases
	int iVerifyResult; // for verification only
} CMS_HANDLER_DATA_EX;

typedef int (*fnCmsHandlerEx)(const char *szIndex, CMS_SignerInfo *parent,
	CMS_SignerInfo *signer, CMS_HANDLER_DATA_EX *pData); // negative - error, 0 - stop, positive - continue

CTCRYPTO_API int CMS_enumSignersEx(CMS_ContentInfo *cms, const char *szIndex,
	unsigned int flags, fnCmsHandlerEx cbHandler, void *pUserData);
CTCRYPTO_API int CMS_enumCounterSignersEx(CMS_SignerInfo *si, const char *szIndex,
	unsigned int flags, fnCmsHandlerEx cbHandler, void *pUserData); // TODO: add param "cms"?

CTCRYPTO_API int CMS_add1_signerEx(CMS_ContentInfo *cms, const char *szIndex,
	X509 *signer, EVP_PKEY *pk, const EVP_MD *md, unsigned int flags,
	fnCmsHandlerEx cbHandler, void *pUserData);
CTCRYPTO_API int CMS_finalEx(CMS_ContentInfo *cms, BIO *data, BIO *dcont, unsigned int flags);

CTCRYPTO_API int CMS_verifyEx(CMS_ContentInfo *cms, STACK_OF(X509) *certs,
	X509_STORE *store, BIO *dcont, BIO *out, unsigned int flags,
	fnCmsHandlerEx cbHandler, void *pUserData); // returns negative on error, 0 if signature is invalid or stopped by cb & positive on success
CTCRYPTO_API int CMS_verifyCounterSignerEx(CMS_ContentInfo *cms, CMS_SignerInfo *parent,
	CMS_SignerInfo *signer, X509_STORE *store, unsigned int flags,
	fnCmsHandlerEx cbHandler, void *pUserData); // returns negative on error, 0 if signature is invalid or stopped by cb & positive on success


CTCRYPTO_API BIO *BIO_new_cms_env_hdr(BIO* inputFileBio, int freeSourceBio, int discardUnprotectedAttrs);
CTCRYPTO_API BIO *BIO_new_cms_env_cont(BIO* inputFileBio, int freeSourceBio);


// === File system ===

// for getApplicationPath()
#define CT_APT_HOME         (1 << 0)   /* application home */
#define CT_APT_BINARY       (1 << 1)   /* application itself */
#define CT_APT_CACHES       (1 << 2)   /* cache files */
#define CT_APT_DATA         (1 << 3)   /* created by application (not user data) */
#define CT_APT_DESKTOP      (1 << 4)   /* desktop folder */
#define CT_APT_DOCUMENTS    (1 << 5)   /* user documents */
#define CT_APT_DOWNLOADS    (1 << 6)   /* downloaded documents */
#define CT_APT_MOVIES       (1 << 7)   /* user video files */
#define CT_APT_MUSIC        (1 << 8)   /* user audio files */
#define CT_APT_PICTURES     (1 << 9)   /* user pictures */
#define CT_APT_TEMP         (1 << 10)  /* temporary files */

CTCRYPTO_API int statMode(const char *name); // it returns st_mode on success and 0 if entry is absent
#if defined(OPENSSL_SYS_WINDOWS)
CTCRYPTO_API int mkdirRecursively(LPCTSTR path, SECURITY_ATTRIBUTES *psa);
CTCRYPTO_API int removeRecursively(LPCTSTR path);
#else // !OPENSSL_SYS_WINDOWS
CTCRYPTO_API char * getApplicationPath(int iType, const char *szAppendDir); // iType must be one of CT_APT_xxx, function returns pointer to allocated string on success and NULL if fail
CTCRYPTO_API int mkdirRecursively(const char *path, mode_t mode);
CTCRYPTO_API int removeRecursively(const char *path);
#endif // !OPENSSL_SYS_WINDOWS

CTCRYPTO_API const char * cmpPrefix(const char * pszStr, const char * pszPrefix, size_t *pValueLen); // returns NULL is prefix is not match else ptr to it's value
CTCRYPTO_API const char * getAttrValue(const char * pszStr, const char * pszParam, size_t *pValueLen); // returns ptr to value from string with format "param1:value1,param2:value2;param3:value3"

CTCRYPTO_API const char * getAsn1PkeyCtrlStr(int op);
CTCRYPTO_API const char * getEvpCtrlStr(int type);
CTCRYPTO_API const char * getEvpPkeyCtrlStr(int type);
CTCRYPTO_API const char * getEngineCtrlStr(int cmd);

#ifndef OPENSSL_NO_STORE
CTCRYPTO_API const char * getStoreObjectTypeStr(STORE_OBJECT_TYPES type);
CTCRYPTO_API const char * getStoreAttrTypeStr(STORE_ATTR_TYPES type);

// must return negative on error, 0 if equal and positive - if not equal
typedef int (*fnCmpStoreCert)(X509 *cert, const char *szAttr, const X509_NAME *nameAttr,
	const BIGNUM *numAttr, void *pOtherAttr);

CTCRYPTO_API fnCmpStoreCert getCmpStoreCertFnByAttr(STORE_ATTR_TYPES attr);
CTCRYPTO_API int CmpStoreCertByKeyId(X509 *cert, const char *szAttr,
	const X509_NAME *nameAttr, const BIGNUM *numAttr, void *pOtherAttr);
CTCRYPTO_API int CmpStoreCertByIssuerKeyId(X509 *cert, const char *szAttr,
	const X509_NAME *nameAttr, const BIGNUM *numAttr, void *pOtherAttr);
CTCRYPTO_API int CmpStoreCertBySubjectKeyId(X509 *cert, const char *szAttr,
	const X509_NAME *nameAttr, const BIGNUM *numAttr, void *pOtherAttr);
CTCRYPTO_API int CmpStoreCertByIssuerSerialHash(X509 *cert, const char *szAttr,
	const X509_NAME *nameAttr, const BIGNUM *numAttr, void *pOtherAttr);
CTCRYPTO_API int CmpStoreCertByIssuerDN(X509 *cert, const char *szAttr,
	const X509_NAME *nameAttr, const BIGNUM *numAttr, void *pOtherAttr);
CTCRYPTO_API int CmpStoreCertBySerialNumber(X509 *cert, const char *szAttr,
	const X509_NAME *nameAttr, const BIGNUM *numAttr, void *pOtherAttr);
CTCRYPTO_API int CmpStoreCertBySubjectDN(X509 *cert, const char *szAttr,
	const X509_NAME *nameAttr, const BIGNUM *numAttr, void *pOtherAttr);
CTCRYPTO_API int CmpStoreCertByCertHash(X509 *cert, const char *szAttr,
	const X509_NAME *nameAttr, const BIGNUM *numAttr, void *pOtherAttr);
CTCRYPTO_API int CmpStoreCertByEmail(X509 *cert, const char *szAttr,
	const X509_NAME *nameAttr, const BIGNUM *numAttr, void *pOtherAttr);
CTCRYPTO_API int CmpStoreCertByFilename(X509 *cert, const char *szAttr,
	const X509_NAME *nameAttr, const BIGNUM *numAttr, void *pOtherAttr);
CTCRYPTO_API int CmpStoreCertByAlias(X509 *cert, const char *szAttr,
	const X509_NAME *nameAttr, const BIGNUM *numAttr, void *pOtherAttr);

CTCRYPTO_API int checkStoreCertByFilters(fnCmpStoreCert fnsCmp[], X509 *cert,
	const char *szAttr, const X509_NAME *nameAttr, const BIGNUM *numAttr, void *pOtherAttr);
CTCRYPTO_API int filterStoreCerts(fnCmpStoreCert fnsCmp[], STACK_OF(X509) *skCerts, void (*fnFree)(X509 *),
	const char *szAttr, const X509_NAME *nameAttr, const BIGNUM *numAttr, void *pOtherAttr);


// must return negative on error, 0 if equal and positive - if not equal
typedef int (*fnCmpStoreCrl)(X509_CRL *crl, const char *szAttr, const X509_NAME *nameAttr,
	const BIGNUM *numAttr, void *pOtherAttr);

CTCRYPTO_API fnCmpStoreCrl getCmpStoreCrlFnByAttr(STORE_ATTR_TYPES attr);
CTCRYPTO_API int CmpStoreCrlByIssuerDN(X509_CRL *crl, const char *szAttr,
	const X509_NAME *nameAttr, const BIGNUM *numAttr, void *pOtherAttr);
CTCRYPTO_API int CmpStoreCrlByCrlHash(X509_CRL *crl, const char *szAttr,
	const X509_NAME *nameAttr, const BIGNUM *numAttr, void *pOtherAttr);

CTCRYPTO_API int checkStoreCrlByFilters(fnCmpStoreCrl fnsCmp[], X509_CRL *crl,
	const char *szAttr, const X509_NAME *nameAttr, const BIGNUM *numAttr, void *pOtherAttr);
CTCRYPTO_API int filterStoreCrls(fnCmpStoreCrl fnsCmp[], STACK_OF(X509_CRL) *skCrls, void (*fnFree)(X509_CRL *),
	const char *szAttr, const X509_NAME *nameAttr, const BIGNUM *numAttr, void *pOtherAttr);


// must return negative on error, 0 if equal and positive - if not equal
typedef int (*fnCmpStoreKey)(EVP_PKEY *pkey, const char *szAttr, const X509_NAME *nameAttr,
	const BIGNUM *numAttr, void *pOtherAttr);

CTCRYPTO_API int checkStoreKeyByFilters(fnCmpStoreKey fnsCmp[], EVP_PKEY *pkey,
	const char *szAttr, const X509_NAME *nameAttr, const BIGNUM *numAttr, void *pOtherAttr);
CTCRYPTO_API int filterStoreKeys(fnCmpStoreKey fnsCmp[], STACK_OF(EVP_PKEY) *skKeys, void (*fnFree)(EVP_PKEY *),
	const char *szAttr, const X509_NAME *nameAttr, const BIGNUM *numAttr, void *pOtherAttr);


CTCRYPTO_API int getStoreAttrsCount(const OPENSSL_ITEM *items); // returns -1 if fail and count of useful (differ STORE_ATTR_END) items on success
CTCRYPTO_API int getIndexByStoreAttr(const OPENSSL_ITEM *items, STORE_ATTR_TYPES type,
	int iFailOnDuplicate); // returns -1 if not found, another negative on error and 0-based index of found item
CTCRYPTO_API OPENSSL_ITEM *getItemByStoreAttr(OPENSSL_ITEM *items, STORE_ATTR_TYPES type,
	int iFailOnDuplicate);
CTCRYPTO_API int findStoreAttribute(OPENSSL_ITEM *attributes, STORE_ATTR_TYPES type,
	char ** ppStr, unsigned char ** ppuStr, X509_NAME ** ppName, BIGNUM ** ppNum);
CTCRYPTO_API int checkStoreAttributes(OPENSSL_ITEM *checking, OPENSSL_ITEM *required,
	OPENSSL_ITEM *allowed, OPENSSL_ITEM *prohibited, int iFailOnDuplicate); // if allowed is NULL - all known attributes are allowed
#endif // !OPENSSL_NO_STORE

#ifdef __APPLE__
// Apple specific
CTCRYPTO_API char *CFStringCopyToCString(CFStringRef cfstr);
CTCRYPTO_API char *lowercase(const char *str);
#endif // __APPLE__

#ifdef  __cplusplus
}
#endif
#endif // !CTCRYPTO_H__INCLUDED
