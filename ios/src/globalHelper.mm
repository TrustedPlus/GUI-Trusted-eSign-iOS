#include "globalHelper.h"

std::string g_pathToStore;
int countCSPCerts = 0;
int countCryptoCerts = 0;
TrustedHandle<PkiStore> g_storeCrypto;
TrustedHandle<PkiItemCollection> g_picCSP = new PkiItemCollection();
TrustedHandle<Provider> g_prov;  
