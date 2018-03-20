#include "WStore.h"

@implementation WStore

- (NSMutableArray*) UnloadCertsFromStore{
  arrayPkiStore = [NSMutableArray array];
  try{
    g_storeCrypto = new PkiStore(new std::string(g_pathToStore));
    g_prov = new Provider_System(new std::string(g_pathToStore));
    g_storeCrypto->addProvider(g_prov); //загрузка сертификатов и "ключей" этого криптопровайдера. Загрузка из хранилища по пути pathToStore
    TrustedHandle<PkiItemCollection> pic = new PkiItemCollection();
    pic = g_storeCrypto->getItems();                                    //список PKI обьектов
    
    TrustedHandle<CertificateCollection> certCollection = new CertificateCollection();
    certCollection = g_storeCrypto->getCerts();                         //список сертификатов
    
    int j = 0;                                                        //отслеживает сертификаты в certCollection
    
    for (int i = 0; i < pic->length(); i++){
      TrustedHandle<PkiItem> pi = new PkiItem();
      pi = pic->items(i);
      
      if (strncmp((pi->type)->c_str(), "CERTIFICATE", 11))
        continue;
      
      NSMutableDictionary *arrayPropertyCert = [NSMutableDictionary dictionary];
      TrustedHandle<Certificate> cert = certCollection->items(j);
      j++;
      arrayPropertyCert[@"category"] = @((pi->category)->c_str());
      arrayPropertyCert[@"version"] = @(cert->getVersion() + 1);
      arrayPropertyCert[@"serialNumber"] = @(cert->getSerialNumber()->c_str());
      arrayPropertyCert[@"notBefore"] = @(cert->getNotBefore()->c_str());
      arrayPropertyCert[@"notAfter"] = @(cert->getNotAfter()->c_str());
      arrayPropertyCert[@"issuerFriendlyName"] = @(cert->getIssuerFriendlyName()->c_str());
      arrayPropertyCert[@"issuerName"] = @(cert->getIssuerName()->c_str());
      arrayPropertyCert[@"subjectFriendlyName"] = @(cert->getSubjectFriendlyName()->c_str());
      arrayPropertyCert[@"subjectName"] = @(cert->getSubjectName()->c_str());
      arrayPropertyCert[@"thumbprint"] = @(cert->getThumbprint()->c_str());
      arrayPropertyCert[@"publicKeyAlgorithm"] = @(cert->getPublicKeyAlgorithm()->c_str());
      arrayPropertyCert[@"signatureAlgorithm"] = @(cert->getSignatureAlgorithm()->c_str());
      arrayPropertyCert[@"signatureDigestAlgorithm"] = @(cert->getSignatureDigestAlgorithm()->c_str());
      arrayPropertyCert[@"organizationName"] = @(cert->getOrganizationName()->c_str());
      arrayPropertyCert[@"keyUsage"] = @(cert->getKeyUsage());
      arrayPropertyCert[@"selfSigned"] = @(cert->isSelfSigned());
      arrayPropertyCert[@"isCA"] = @(cert->isCA());
      arrayPropertyCert[@"provider"] = @((pi->provider)->c_str());
      arrayPropertyCert[@"type"] = @((pi->type)->c_str());
      if (!strcmp(pi->certKey->c_str(), "")){
        arrayPropertyCert[@"hasPrivateKey"] = @(0);
      }
      else{
        arrayPropertyCert[@"hasPrivateKey"] = @((pi->certKey)->c_str());
      }
      [arrayPkiStore addObject: arrayPropertyCert];
    }
    
    return arrayPkiStore;
  }
  catch(Exception ex){
    throw new Exception(ex);
  }
  catch (TrustedHandle<Exception> e){
    throw new std::string(e->description().c_str());
  }
}

@end

