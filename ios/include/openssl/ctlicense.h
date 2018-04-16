/* crypto/ctlicense/ctlicense.h */
/*
 * Copyright(C) 2015-2017 ��� <<�������� ����������>>
 *
 * ���� ���� �������� ����������, ����������
 * �������������� �������� ��� <<�������� ����������>>.
 *
 * ����� ����� ����� ����� �� ����� ���� �����������,
 * ����������, ���������� �� ������ �����,
 *  ������������ ��� �������������� ����� ��������,
 * ���������������, �������� �� ���� ��� ��
 * ����� ������������ ������� ��� ����������������
 * ���������� ���������� � ��� <<�������� ����������>>.
 */

#ifndef _CTLICENSE_LICENSE_H_
#define _CTLICENSE_LICENSE_H_

/*		CTLICENSE -- JSON Web Token  License */

#include <stdbool.h> 
#include <openssl/safestack.h>

# ifdef  __cplusplus
extern "C" {
# endif

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
 * \brief Получить список разрешенных операций относително стека лицензий
 * \param  requiredOperations Структура, куда будет помещены все разрешенные
 * на данный момент операции, если лицензий нет, то все операции проставляются
 * в false
 */
void ctlicense_get_store_operations(CTLICENSE_OPERATION *requiredOperations);

/*
 * Проверяет есть ли в хранлище лицензия на данную операцию
 * @return
 */
bool ctlicense_check_store(const CTLICENSE_OPERATION *requiredOperations);

bool ctlic_check_store_code(const CTOperationCode_t requiredCodes);

/*
 * Добавляет в стек действующие лиценции хранилища, в которых разрешена данная
 * операция. В лицензию добавляются копии лицензий, чтобы избежать утечек памати
 * char* необходимо будет освободить.
 * @param  STACK_OF(OPENSSL_STRING) стек в который будут помещены копии лицензий
 */
void ctlicense_get_licenses(
    STACK_OF(OPENSSL_STRING) *stack,
    const CTLICENSE_OPERATION *requiredOperations);

/*
 * Возвращает структуру с содержимым токена
 * @param  signedToken Строка (оканчивается на 0) с токеном-лицензией
 * @param  errorCode   Указатель на переменную в которую будет записан код ошибки
 * @return true - если структура успешна создана, false - иначе
 */
bool ctlicense_get_payload(
    CTLICENSE_PAYLOAD *entry,
    const char *signedToken,
    int *errorCode);

/*
 * \brief Проверяет есть ли в данной лицензиии разрешение на проведение данных операций
 *
 * \param  szSignedToken      Строка (оканчивается на 0) с токеном-лицензией
 * \param  requiredOperations Коды операций
 * \param  errorCode    Указатель на переменную в которую будет записан код ошибки
 *
 * \returns             true - если операция разрешена, false - иначе
 */
bool ctlicense_check_str(
    const char *signedToken,
    const CTLICENSE_OPERATION *requiredOperations,
    int *errorCode);

/*
 * \brief Проверяет есть ли в данной лицензиии разрешение на проведение данных операций
 *
 * \param  szSignedToken Строка (оканчивается на 0) с токеном-лицензией
 * \param  requiredOperations Коды операций
 * \param  errorCode    Указатель на переменную в которую будет записан код ошибки
 *
 * \returns             true - если операция разрешена, false - иначе
 */
bool ctlicense_check_file(
    const char *fileName,
    const CTLICENSE_OPERATION *requiredOperations,
    int *errorCode);

/*
 * \brief Добавляет в хранилище данную лицензию
 *
 * \param  sSignedToken Строка (оканчивается на 0) с токеном-лицензией
 * \param  errorCode    Указатель на переменную в которую будет записан код ошибки
 *
 * \returns             true - если операция разрешена, false - иначе
 */
bool ctlicense_add_str(const char *signedToken, int *errorCode);

/*
 * \brief Добавляет в хранилище лицензию из данного файла
 *
 * \param  fileName     Строка (оканчивается на 0) с именем файла
 * \param  errorCode    Указатель на переменную в которую будет записан код ошибки
 *
 * \returns             true - если операция разрешена, 0 - иначе
 */
bool ctlicense_add_file(const char *fileName, int *errorCode);

/*
 * Ищет в хранилище лицензию
 * @param   signedToken Строка (оканчивается на 0) с токеном-лицензией
 * @return  Индекс лиценции в хранилище, если она найдена
 *          -1, если не найдена
 */
int ctlicense_store_find(const char *signedToken);

/*
 * Возващает текущее количество лиценций в хранилище
 * @return текущее количество лиценций в хранилище
 */
int ctlicense_store_size(void);

/*
 * Возвращает лицензию по ее номеру в хранилище. Возвращаемый указатель
 * не надо освобождать, строку нельзя изменять.
 * @param  i Индекс в хранилище
 * @return Указатель на лиценцию внутри хранилища
 *         NULL если лицензии с таким индексом нет
 */
const char *ctlicense_get_store_item(int i);

/*
 * \brief Удаляет из хранилища данную лицензию
 *
 * \param  szSignedToken Строка (оканчивается на 0) с токеном-лицензией
 */
bool ctlicense_delete(const char *signedToken);

/*
 * \brief Удаляет истекшие лицензии
 */
void ctlicense_clear_garbage(void);

/*
 * \brief Удаляет все лицензии
 */
void ctlicense_clear_store(void);

/*
 * Проверка блокировки хранилища (для безопастного использования при
 * многопоточности)
 */
bool ctlicense_is_store_locked(void);

void ctlicense_lock_store(void);

void ctlicense_unlock_store(void);

/*
 * старое API добавлено для совместимости
 */
int ctlicense_verify_str(
	const char *sSignedToken, /* null terminated string with token */
	int *ErrorCode);

int ctlicense_verify_file( /* check license in file from default place */
	int *ErrorCode);

/* BEGIN ERROR CODES */
/* The following lines are auto generated by the script mkerr.pl. Any changes
 * made after this point may be overwritten when the script is next run.
 */
void ERR_load_CTLICENSE_strings(void);

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



# ifdef  __cplusplus
} /* end of extern"C" */
# endif

#endif /* _CTLICENSE_LICENSE_H_ */

