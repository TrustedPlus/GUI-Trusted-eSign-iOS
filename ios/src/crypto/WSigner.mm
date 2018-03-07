#include "WSigner.h"
#include "WHelp.h"

@implementation WSigner

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(signFile: (NSString *)infilenameCert: (NSString *)formatCert: (NSString *)infilenameKey: (NSString *)formatKey: (NSString *)infilenameContext: (NSString *)outfilename:(RCTResponseSenderBlock)callback) {
  try{
    OpenSSL::run();
    
    //read key file
    char *infileKey = (char *) [infilenameKey UTF8String];
    TrustedHandle<Key> key = new Key();
    TrustedHandle<Bio> inKey = NULL;
    DataFormat::DATA_FORMAT format = NSStringToDataFormat(formatCert);
    inKey = new Bio(BIO_TYPE_FILE, infileKey, "rb");
    key->readPrivateKey(inKey, format, new std::string(""));
    
    //read cert file
    char *infileCert = (char *) [infilenameCert UTF8String];
    TrustedHandle<Certificate> cert = new Certificate();
    TrustedHandle<Bio> inf = NULL;
    format = NSStringToDataFormat(formatKey);
    inf = new Bio(BIO_TYPE_FILE, infileCert, "rb");
    cert->read(inf, format);
    
    TrustedHandle<SignedData> sd = new SignedData();
    sd->setFlags(32+256);
    
    TrustedHandle<Signer> signer =  sd->createSigner(cert, key);
    
    char *infile = (char *) [infilenameContext UTF8String];
    TrustedHandle<Bio> value = new Bio(BIO_TYPE_FILE, infile, "rb");
    sd->setContent(value);
    
    sd->sign();
    
    char *outfile = (char *) [outfilename UTF8String];
    TrustedHandle<Bio> outFile = new Bio(BIO_TYPE_FILE, outfile, "wb");
    sd->write(outFile, DataFormat::BASE64);
    
    callback(@[[NSNull null], [NSNumber numberWithInt:(true)]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(verifySign: (NSString *)infilenameCert: (NSString *)formatCert: (NSString *)checkfilename:(RCTResponseSenderBlock)callback) {
  try{
    OpenSSL::run();
    
    //read cert file
    char *infileCert = (char *) [infilenameCert UTF8String];
    TrustedHandle<Certificate> cert = new Certificate();
    TrustedHandle<Bio> inf = NULL;
    DataFormat::DATA_FORMAT format = NSStringToDataFormat(formatCert);
    inf = new Bio(BIO_TYPE_FILE, infileCert, "rb");
    cert->read(inf, format);
    
    //read file
    char *inFileName = (char *) [checkfilename UTF8String];
    TrustedHandle<Bio> value = NULL;
    format = DataFormat::BASE64;
    value = new Bio(BIO_TYPE_FILE, inFileName, "rb");
    
    TrustedHandle<SignedData> sd = new SignedData();
    sd->read(value, format);
    
    TrustedHandle<Signer> signer = sd->signers(0);
    TrustedHandle<Algorithm> alg = signer->getDigestAlgorithm();
    signer->setCertificate(cert);
    
    bool b = signer->verify(sd->getContent());
    
    callback(@[[NSNull null], [NSNumber numberWithInt:(b)]]);
  }
  catch (TrustedHandle<Exception> e){
    callback(@[[@((e->description()).c_str()) copy], [NSNull null]]);
  }
}

@end
