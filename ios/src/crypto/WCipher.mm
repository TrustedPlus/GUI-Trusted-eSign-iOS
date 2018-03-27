#include "WCipher.h"
#include "WHelp.h"
#include "../globalHelper.h"

@implementation WCipher

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(EncSymmetric: (NSString *)infilename:(NSString *)outfilename:(RCTResponseSenderBlock)callback) {
  try{
    OpenSSL::run();
    
    TrustedHandle<Cipher> ch = new Cipher();
    ch->setCryptoMethod(CryptoMethod::SYMMETRIC);
    ch->setDigest(new std::string("MD5"));
    ch->setPass(new std::string("4321"));
    
    char *infile = (char *) [infilename UTF8String];
    TrustedHandle<Bio> inFile = new Bio(BIO_TYPE_FILE, infile, "rb");
    
    char *outfile = (char *) [outfilename UTF8String];
    TrustedHandle<Bio> outFile = new Bio(BIO_TYPE_FILE, outfile, "wb");
    
    ch->encrypt(inFile, outFile, DataFormat::BASE64);
    
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(DecSymmetric: (NSString *)encFile: (NSString *)decFile: (RCTResponseSenderBlock)callback){
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
/*
RCT_EXPORT_METHOD(EncAssymmetric: (NSString *)inFile: (NSString *)encFile: (NSString *)certFile: (NSString *)formatCert: (RCTResponseSenderBlock)callback){
  try{
    OpenSSL::run();
    
    //read cert file
    char *infileCert = (char *) [certFile UTF8String];
    TrustedHandle<Certificate> cert = new Certificate();
    TrustedHandle<Bio> inf = NULL;
    DataFormat::DATA_FORMAT format = NSStringToDataFormat(formatCert);
    inf = new Bio(BIO_TYPE_FILE, infileCert, "rb");
    cert->read(inf, format);
    
    TrustedHandle<Cipher> ch = new Cipher();
    TrustedHandle<CertificateCollection> certs = new CertificateCollection();
    certs->push(cert);
    ch->addRecipientsCerts(certs);
    
    char *infile = (char *) [inFile UTF8String];
    TrustedHandle<Bio> bioInFile = new Bio(BIO_TYPE_FILE, infile, "rb");
    
    char *encfile = (char *) [encFile UTF8String];
    TrustedHandle<Bio> bioEncFile = new Bio(BIO_TYPE_FILE, encfile, "wb");
    
    ch->encrypt(bioInFile, bioEncFile, format);
    
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}

RCT_EXPORT_METHOD(DecAssymmetric: (NSString *)encFile: (NSString *)decFile: (NSString *)certFile: (NSString *)formatCert: (NSString *)keyFile: (NSString *)formatKey:(RCTResponseSenderBlock)callback){
  try{
    OpenSSL::run();
    
    //read cert file
    char *infileCert = (char *) [certFile UTF8String];
    TrustedHandle<Certificate> cert = new Certificate();
    TrustedHandle<Bio> inf = NULL;
    DataFormat::DATA_FORMAT format = NSStringToDataFormat(formatCert);
    inf = new Bio(BIO_TYPE_FILE, infileCert, "rb");
    cert->read(inf, format);
    
    //read key file
    char *infileKey = (char *) [keyFile UTF8String];
    TrustedHandle<Key> key = new Key();
    TrustedHandle<Bio> inKey = NULL;
    format = NSStringToDataFormat(formatKey);
    inKey = new Bio(BIO_TYPE_FILE, infileKey, "rb");
    key->readPrivateKey(inKey, format, new std::string(""));
    
    TrustedHandle<Cipher> ch = new Cipher();
    ch->setRecipientCert(cert);
    ch->setPrivKey(key);
    
    char *encfile = (char *) [encFile UTF8String];
    TrustedHandle<Bio> bioEncFile = new Bio(BIO_TYPE_FILE, encfile, "rb");
    
    char *decfile = (char *) [decFile UTF8String];
    TrustedHandle<Bio> bioDecFile = new Bio(BIO_TYPE_FILE, decfile, "wb");
    
    ch->decrypt(bioEncFile, bioDecFile, format);
    
    callback(@[[NSNull null], [NSNumber numberWithInt: 1]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNumber numberWithInt: 0]]);
  }
}
*/
RCT_EXPORT_METHOD(EncAssymmetric: (NSString *)serialNumber: (NSString *)inFile: (NSString *)encFile: (RCTResponseSenderBlock)callback){
  char *pSerialNumber = (char *) [serialNumber UTF8String];
  try{
    OpenSSL::run();
    //read cert file
    TrustedHandle<Filter> filterByCert = new Filter();
    
    filterByCert->setSerial(new std::string(pSerialNumber));
    
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

RCT_EXPORT_METHOD(DecAssymmetric: (NSString *)serialNumber: (NSString *)encFile: (NSString *)decFile:(RCTResponseSenderBlock)callback){
  try{
    char *pSerialNumber = (char *) [serialNumber UTF8String];
    OpenSSL::run();
    
    //read cert file
    TrustedHandle<Filter> filterByCert = new Filter();
    filterByCert->setSerial(new std::string(pSerialNumber));
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
