#ifndef CSP_Helper_h
#define CSP_Helper_h

#include "Constants.h"

#include "signed_data.h"
#import <Foundation/Foundation.h>
#import <CPROCSP/CPROCSP.h>
#import <CPROCSP/CPCrypt.h>

#include <vector>

#include "storehelper.h"
#include "pkistore.h"

extern TrustedHandle<PkiItemCollection> g_picCSP;

//поиск сертификата в хранилище криптоПРО
PCCERT_CONTEXT findCertInCSPStore(char *serialNumber, char *category);

//чтение файла в массив байт
BYTE *readFile(char *file, DWORD &cbContent);

//по Oid ключа получить Oid хэш алгоритма
char *getHashOidByKeyOid(IN char *szKeyOid);

//проверка цепочки сертификатов для входного сертификата
BOOL verifyCertificateChain(PCCERT_CONTEXT pCertCtx);

TCHAR *getFileExtension(TCHAR *szFile);
BOOL checkFileExtension(TCHAR * szFile);

//проверка наличия у сертификата закрытого ключа
CSP_BOOL hasPrivateKey(PCCERT_CONTEXT pUserCert);

//проверка сертификата на самоподписанность
CSP_BOOL selfSignedCert(PCCERT_CONTEXT pCertCtx);

//чтение из файла в зависимости от формата
BYTE *readFromFile(char *file, char *format, DWORD &cbContent);

//запись в файл
void writeToFile(BYTE *pbSignedMessageBlob, DWORD cbSignedMessageBlob, char *file, char *format);

//установка сертификата из контейнера
void installCertifiacteFromContainer(TrustedHandle<std::string> contName, int provType, TrustedHandle<std::string> provName);

//установка сертификата в контейнер
void installCertifiacteToContainer(TrustedHandle<Certificate> cert, TrustedHandle<std::string> contName, int provType, TrustedHandle<std::string> provName);

//получение имени контейнера по сертификату
TrustedHandle<std::string> getContainerNameByCertificate(TrustedHandle<Certificate> cert);

//преобразование TrustedHandle<Certificate> в PCCERT_CONTEXT
PCCERT_CONTEXT createCertificateContext(TrustedHandle<Certificate> cert);

//определение имени провайдера и его тип по сертификату
void getProvNameAndType(TrustedHandle<Certificate> cert, int &provType, TrustedHandle<std::string> &provName);

//определение назначения ключа для входного контейнера
DWORD getKeySpec(TrustedHandle<std::string> contName, int provType);

//поиск существующего сертификата
bool findExistingCertificate(OUT PCCERT_CONTEXT &pOutCertContext, IN HCERTSTORE hCertStore, IN PCCERT_CONTEXT pCertContext, IN DWORD dwFindFlags, IN DWORD dwCertEncodingType );

bool cmpCertAndContFP(LPCSTR szContainerName, LPBYTE pbFPCert, DWORD cbFPCert);
LPCWSTR provTypeToProvNameW(DWORD dwProvType);

//привязка сертификата к закрытому ключу
PCCERT_CONTEXT bindCertToPrivateKey(PCCERT_CONTEXT pCertContext, LPCSTR contName, LPCSTR provName, DWORD provType, DWORD dwKeySpec);

//преобразование из char * в wchar *
WCHAR* ConvertCharToWchar(const char *name, int &length);

#endif /* CSP_Helper_h */
