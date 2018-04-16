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

#ifndef CTGOSTCP_H__INCLUDED
#define CTGOSTCP_H__INCLUDED

#include <openssl/e_os2.h> // it includes <openssl/opensslconf.h>


#if defined(OPENSSL_NO_GOST) || defined(OPENSSL_NO_CTGOSTCP)
#error CTGOSTCP is disabled.
#endif

#ifndef OPENSSL_NO_STORE
#include <openssl/store.h>
#endif
#include <openssl/engine.h>
#include <openssl/ctcrypto.h>

// engine:
#define CTGOSTCP_ENGINE_ID	"ctgostcp"

// pkey:
#define CTGOSTCP_PKEY_CTRL_STR_PARAM_FILENAME           "filename"
#define CTGOSTCP_PKEY_CTRL_STR_PARAM_FILENAME_ALIAS_1   "file"
#define CTGOSTCP_PKEY_CTRL_STR_PARAM_KEYID              CTCRYPTO_PKEY_CTRL_STR_PARAM_KEYID   /* has no default value */
#define CTGOSTCP_PKEY_CTRL_STR_PARAM_KEYID_ALIAS_1      "container"
#define CTGOSTCP_PKEY_CTRL_STR_PARAM_PASSWORD           CTCRYPTO_PKEY_CTRL_STR_PARAM_PASSWORD   /* default: "", NOTE: if pkey is linked to ctx then its PIN will be changed! */
#define CTGOSTCP_PKEY_CTRL_STR_PARAM_PASSWORD_ALIAS_1   "pin"
#define CTGOSTCP_PKEY_CTRL_STR_PARAM_SAVEPASS           "savepass"
#define CTGOSTCP_PKEY_CTRL_STR_PARAM_KEYSET             "keyset"
#define CTGOSTCP_PKEY_CTRL_STR_VALUE_KEYSET_USER        "user"
#define CTGOSTCP_PKEY_CTRL_STR_VALUE_KEYSET_MACHINE     "machine"
#define CTGOSTCP_PKEY_CTRL_STR_VALUE_KEYSET_AUTO        "auto"
#define CTGOSTCP_PKEY_CTRL_STR_VALUE_KEYSET_AUTO_ALIAS_1 "all"
#define CTGOSTCP_PKEY_CTRL_STR_PARAM_ALGID              "algid"
#define CTGOSTCP_PKEY_CTRL_STR_VALUE_ALGID_EXCH         "exch"
#define CTGOSTCP_PKEY_CTRL_STR_VALUE_ALGID_SIGN         "sign"
#define CTGOSTCP_PKEY_CTRL_STR_VALUE_ALGID_AUTO         "auto"
#define CTGOSTCP_PKEY_CTRL_STR_PARAM_EXPORTABLE         "exportable"
//#define CTGOSTCP_PKEY_CTRL_STR_PARAM_DHOID              "dhoid"
#define CTGOSTCP_PKEY_CTRL_STR_PARAM_EXISTING           "existing"
#define CTGOSTCP_PKEY_CTRL_STR_PARAM_SILENT             "silent"   /* NOTE: if pkey is linked to ctx then its param will be changed! */

// pkey:
#define CTGOSTCP_EVP_PKEY_CTX_init_key_by_cert(ctx, x509) \
	CTCRYPTO_EVP_PKEY_CTX_init_key_by_cert(ctx, -1, x509)

// md:
#define CTGOSTCP_MD_CTRL_GET_KEY_LEN                    (EVP_MD_CTRL_ALG_CTRL+2)
#define CTGOSTCP_MD_CTRL_SET_KEY                        (EVP_MD_CTRL_ALG_CTRL+3)

#endif // !CTGOSTCP_H__INCLUDED
