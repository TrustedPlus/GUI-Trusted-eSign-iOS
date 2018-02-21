#include "SignerClass.h"
#include "cert.h"
#include "signed_data.h"
#include "key.h"
#include "cipher.h"
#include "openssl.h"
#include "signers.h"

@implementation SignerClass

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(signFile: (NSString *)infilenameCert:(NSString *)infilenameKey:(NSString *)infilenameContext:(NSString *)outfilename:(RCTResponseSenderBlock)callback) {
  //logger->start("/Users/admin/Desktop/ios_trustedssl_cryptoModule/Test/ios/encrypt/logger.txt", LoggerLevel::All );
  OpenSSL::run();
  
  //read key file
  char *infileKey = (char *) [infilenameKey UTF8String];
  TrustedHandle<Key> key = new Key();
  TrustedHandle<Bio> inKey = NULL;
  DataFormat::DATA_FORMAT format = DataFormat::BASE64;
  inKey = new Bio(BIO_TYPE_FILE, infileKey, "rb");
  key->readPrivateKey(inKey, format, new std::string(""));
  
  //read cert file
  char *infileCert = (char *) [infilenameCert UTF8String];
  TrustedHandle<Certificate> cert = new Certificate();
  TrustedHandle<Bio> inf = NULL;
  format = DataFormat::BASE64;
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
  
  /*TrustedHandle<CertificateCollection> certs = new CertificateCollection();
   certs->push(cert);
   bool b = sd->verify(certs);
   if (b)
   NSLog(@"TRUE");
   else
   NSLog(@"FALSE");*/
  callback(@[[NSNull null], [NSNumber numberWithInt:(true)]]);
}

RCT_EXPORT_METHOD(verifySign: (NSString *)infilenameCert:(NSString *)checkfilename:(RCTResponseSenderBlock)callback) {
  //logger->start("/Users/admin/Desktop/ios_trustedssl_cryptoModule/Test/ios/encrypt/logger.txt", LoggerLevel::All );
  OpenSSL::run();
  
  //read cert file
  char *infileCert = (char *) [infilenameCert UTF8String];
  TrustedHandle<Certificate> cert = new Certificate();
  TrustedHandle<Bio> inf = NULL;
  DataFormat::DATA_FORMAT format = DataFormat::BASE64;
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

@end
//

