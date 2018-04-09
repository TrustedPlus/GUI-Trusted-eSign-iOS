#include "WCipher.h"
#include "WHelp.h"
#include "../globalHelper.h"

@implementation WCipher

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(encryptSymmetric: (NSString *)infilename:(NSString *)encfilename:(RCTResponseSenderBlock)callback) {
  try{
    OpenSSL::run();
    
    TrustedHandle<Cipher> ch = new Cipher();
    ch->setCryptoMethod(CryptoMethod::SYMMETRIC);
    ch->setDigest(new std::string("MD5"));
    ch->setPass(new std::string("4321"));
    
    char *infile = (char *) [infilename UTF8String];
    TrustedHandle<Bio> inFile = new Bio(BIO_TYPE_FILE, infile, "rb");
    
    char *encfile = (char *) [encfilename UTF8String];
    TrustedHandle<Bio> encFile = new Bio(BIO_TYPE_FILE, encfile, "wb");
    
    ch->encrypt(inFile, encFile, DataFormat::BASE64);
    
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(decryptSymmetric: (NSString *)encFile: (NSString *)decFile: (RCTResponseSenderBlock)callback){
  try{
    OpenSSL::run();
    
    TrustedHandle<Cipher> ch = new Cipher();
    ch->setCryptoMethod(CryptoMethod::SYMMETRIC);
    ch->setDigest(new std::string("MD5"));
    ch->setPass(new std::string("4321"));
    
    char *encfile = (char *) [encFile UTF8String];
    TrustedHandle<Bio> bioEncFile = new Bio(BIO_TYPE_FILE, encfile, "rb");
    
    char *decfile = (char *) [decFile UTF8String];
    TrustedHandle<Bio> bioDecFile = new Bio(BIO_TYPE_FILE, decfile, "wb");
    
    ch->decrypt(bioEncFile, bioDecFile, DataFormat::BASE64);
    
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(encrypt: (NSString *)serialNumber: (NSString *)category: (NSString *)inFile: (NSString *)encFile: (RCTResponseSenderBlock)callback){
  char *pSerialNumber = (char *) [serialNumber UTF8String];
  char *pCategory = (char *) [category UTF8String];
  try{
    OpenSSL::run();
    //read cert file
    TrustedHandle<Filter> filterByCert = new Filter();
    
    filterByCert->setSerial(new std::string(pSerialNumber));
    filterByCert->setCategory(new std::string(pCategory));
    
    TrustedHandle<PkiItemCollection> pic = g_storeCrypto->find(filterByCert);
    if (pic->length() <= 0){
      THROW_EXCEPTION(0, WCipher, NULL, "This certificate was not found in the 'crypto' store!");
    }
    
    TrustedHandle<PkiItem> pi = new PkiItem();
    pi = pic->items(0);
    
    TrustedHandle<Certificate> cert = g_storeCrypto->getItemCert(pi);
    
    TrustedHandle<Cipher> ch = new Cipher();
    TrustedHandle<CertificateCollection> certs = new CertificateCollection();
    certs->push(cert);
    ch->addRecipientsCerts(certs);
    
    char *infile = (char *) [inFile UTF8String];
    TrustedHandle<Bio> bioInFile = new Bio(BIO_TYPE_FILE, infile, "rb");
    
    char *encfile = (char *) [encFile UTF8String];
    TrustedHandle<Bio> bioEncFile = new Bio(BIO_TYPE_FILE, encfile, "wb");
    
    DataFormat::DATA_FORMAT format = DataFormat::BASE64;
    
    ch->encrypt(bioInFile, bioEncFile, format);
    
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(decrypt: (NSString *)serialNumber: (NSString *)category: (NSString *)encFile: (NSString *)decFile:(RCTResponseSenderBlock)callback){
  try{
    char *pSerialNumber = (char *) [serialNumber UTF8String];
    char *pCategory = (char *) [category UTF8String];
    OpenSSL::run();
    
    //read cert file
    TrustedHandle<Filter> filterByCert = new Filter();
    filterByCert->setSerial(new std::string(pSerialNumber));
    filterByCert->setCategory(new std::string(pCategory));
    TrustedHandle<PkiItemCollection> pic = g_storeCrypto->find(filterByCert);
    if (pic->length() <= 0){
      THROW_EXCEPTION(0, WCipher, NULL, "This certificate was not found in the 'crypto' store!");
    }
    TrustedHandle<PkiItem> pi = new PkiItem();
    pi = pic->items(0);
    TrustedHandle<Certificate> cert = g_storeCrypto->getItemCert(pi);
    
    //findKey
    TrustedHandle<Filter> filterByKey = new Filter();
    filterByKey->setHash(pi->certKey);
    TrustedHandle<PkiItemCollection> picKey = g_storeCrypto->find(filterByKey);
    if (picKey->length() <= 0){
      THROW_EXCEPTION(0, WCipher, NULL, "No private key found for this certificate in the 'crypto' store!");
    }
    TrustedHandle<PkiItem> piKey = picKey->items(0);
    TrustedHandle<Key> hkey = g_storeCrypto->getItemKey(piKey);

    TrustedHandle<Cipher> ch = new Cipher();
    ch->setRecipientCert(cert);
    ch->setPrivKey(hkey);
    
    char *encfile = (char *) [encFile UTF8String];
    TrustedHandle<Bio> bioEncFile = new Bio(BIO_TYPE_FILE, encfile, "rb");
    
    char *decfile = (char *) [decFile UTF8String];
    TrustedHandle<Bio> bioDecFile = new Bio(BIO_TYPE_FILE, decfile, "wb");
    
    DataFormat::DATA_FORMAT format = DataFormat::BASE64;
    
    ch->decrypt(bioEncFile, bioDecFile, format);
    
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

@end
