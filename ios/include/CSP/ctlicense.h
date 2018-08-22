#ifndef _CTLICENSE_LICENSE_H_
#define _CTLICENSE_LICENSE_H_

#include <stdbool.h> 
#include <stdint.h>
#include <openssl/safestack.h>

# ifdef  __cplusplus
extern "C" {
# endif

/* Struct of date old license format */
typedef unsigned long       DWORDL;
typedef unsigned short      WORD;
typedef unsigned char       BYTE;

typedef struct LicenseInfo {
	char  szProdCode[3];
	DWORDL dwDigest;
	char  hexDigest[33];
	unsigned long dwLicenseID;
	DWORDL dwExpirationTime;
	WORD  wLicenseFlags;
	WORD  wReserved;
	char  szName[4096];
	char  szOrganization[4096];
	char  szEMail[2048];
	char  szProductVersion[2048];
	char  szLicenseCode[2048];
} LICENSE_INFO;


/* Struct of date old license format */
typedef struct ctlicense_operation_st {
    bool tls;
    bool sign;
    bool decrypt;
    bool keygen;
    bool ctgostcp;
    bool pkcs11;
    bool cerber;
} CTLICENSE_OPERATION;

typedef struct ctlicense_payload_st {
    const char *iss;
    const char *sub;
    const char *desc;
    const char *aud;
    long long exp;
    long long nbf;
    long long iat;
    CTLICENSE_OPERATION core;
    const char *jti;
} CTLICENSE_PAYLOAD;

/* Битовые флаги (маски) для операций, 1 - означает, что операция разрешена */
typedef enum
{
    ct_operation_tls      = 1UL << 0, /* tls with two-side authentication, one-side (server) authentication doesn't demand a permition */
    ct_operation_sign     = 1UL << 1, /* any data sign, it includes certificate and etc. */
    ct_operation_decrypt  = 1UL << 2, /* decrypt */
    ct_operation_keygen   = 1UL << 3, /* create key pair */
    ct_operation_ctgostcp = 1UL << 4, /* ctgostcp engine */
    ct_operation_pkcs11   = 1UL << 5, /* pkcs11 */
    ct_operation_cerber   = 1UL << 6  /* cerber */
} CTOperationCode_t;

/*
* Вычисление дайджеста лицензионного ключа по сведениям из LICENSE_INFO
*/
int CreateDigestOnLicenceInfo(char* productGUID, LICENSE_INFO *pLicenseInfo, int *ErrorInfo);
/*
* Процедура шифрования/расшифрования лицензионного ключа
*/
int BlowfishCrypt(const unsigned char* pInBuffer, unsigned char* pOutBuffer, long length, const char* key, int bEncrypt, int *ErrorInfo);
/*
* Процедура удаления дефисов из последовательности лицензионного ключа
*/
char* SplitLicenceSequence(char* str, char charToRemove);
/*
* Процедура преобразования Hex строки в бинарную строку
*/
char* String2Bin(const char* ptszHexString, unsigned long bufOutputSize);
static int getSymbolIndexInTable(char ch, char* ptszTable);
/*
* Процедура проверки корректности лицензионного ключа
*/
int CheckLicense(char* serialNumber, char* productGUID, LICENSE_INFO *pLicenseInfo, int *ErrorInfo);
/*
* Общая процедура проверки лицензионного ключа MTX, JWT, TRIAL
*/
bool licenseValidate(char* licenseToken, char* productGuid, int *ErrorInfo);
/*
* Процедура получения времени истечения ключа MTX
*/
int getExpTime(char* licenseToken, int *ErrorInfo);

/* Error codes for the CTLICENSE functions. */

/* Function codes. */
#define CTLICENSE_F_ADD_LICENSE                 801
#define CTLICENSE_F_CHECK_LICENSE               802
#define CTLICENSE_F_CHECK_STORE                 803
#define CTLICENSE_F_GET_PAYLOAD                 804
#define CTLICENSE_F_SAVE_LICENSE_FILE           805

/* Reason codes. */
#define CTLICENSE_R_NO_ERROR				    900
#define CTLICENSE_R_ERROR_INTERNAL			    901
#define CTLICENSE_R_ERROR_LOAD_LICENSE		    902
#define CTLICENSE_R_ERROR_TOKEN_FORMAT		    903
#define CTLICENSE_R_ERROR_SIGN				    904
#define CTLICENSE_R_ERROR_PARSING			    905
#define CTLICENSE_R_ERROR_STUCTURE              906
#define CTLICENSE_R_ERROR_PRODUCT			    907
#define CTLICENSE_R_ERROR_EXPIRED_TIME          908
#define CTLICENSE_R_ERROR_NOT_STARTED           909
#define CTLICENSE_R_ERROR_OPERATION_BLOCK       910

#define CTLICENSE_R_ERROR_NO_LICENSE_IN_STORE   911
#define CTLICENSE_R_ERROR_STORE_IS_LOCKED       912
#define CTLICENSE_R_ERROR_SAVE_LICENSE		    913

#define LICENSE_LENGTH (32)

#define CTLICENSE_R_ERROR_LOAD_ITM				914
#define CTLICENSE_R_ERROR_SAVE_ITM				915
#define CTLICENSE_R_ERROR_INTERNAL_ITM			916
#define CTLICENSE_R_ERROR_TRIAL_EXPIRED_ITM		917
#define CTLICENSE_R_ERROR_ITM_ALREADY_EXISTS	918

# ifdef  __cplusplus
} /* end of extern"C" */
# endif

#endif /* _CTLICENSE_LICENSE_H_ */

