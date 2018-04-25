#ifndef CSP_Helper_h
#define CSP_Helper_h

#include "signed_data.h"
#import <Foundation/Foundation.h>
#import <CPROCSP/CPROCSP.h>
#import <CPROCSP/CPCrypt.h>

#include <vector>

#include "storehelper.h"
#include "pkistore.h"

extern TrustedHandle<PkiItemCollection> g_picCSP;

PCCERT_CONTEXT findCertInCSPStore(char *serialNumber, char *category);
BYTE *readFile(char *file, DWORD &cbContent);
PCCERT_CONTEXT findCertInCSPStore_1(char *hash, char *category);

char *GetHashOidByKeyOid(IN char *szKeyOid);
BOOL VerifyCertificateChain(PCCERT_CONTEXT pCertCtx);
TCHAR *GetFileExtension(TCHAR *szFile);
BOOL CheckFileExtension(TCHAR * szFile);

//функция проверки наличия у сертификата закрытого ключа
CSP_BOOL hasPrivateKey(PCCERT_CONTEXT pUserCert);
//функция проверки сертификата на самоподписанность
CSP_BOOL selfSignedCert(PCCERT_CONTEXT pCertCtx);

BYTE *readFromFile(char *file, char *format, DWORD &cbContent);
void writeToFile(BYTE *pbSignedMessageBlob, DWORD cbSignedMessageBlob, char *file, char *format);

#endif /* CSP_Helper_h */
