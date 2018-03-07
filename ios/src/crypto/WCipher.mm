#include "WCipher.h"
#include "WHelp.h"

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
    
    callback(@[[NSNull null], [NSNumber numberWithInt:(true)]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
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
    
    callback(@[[NSNull null], [NSNumber numberWithInt:(true)]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

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
    
    callback(@[[NSNull null], [NSNumber numberWithInt:(true)]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
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
    
    callback(@[[NSNull null], [NSNumber numberWithInt:(true)]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

@end
