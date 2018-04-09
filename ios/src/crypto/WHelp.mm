#include "WHelp.h"

DataFormat::DATA_FORMAT NSStringToDataFormat(NSString *nsformat) {
  try{
    char *format = (char *) [nsformat UTF8String];
    DataFormat::DATA_FORMAT data_format;
    if (strncmp(format, "DER", 3) == 0)
      data_format = DataFormat::DER;
    else{
      if (strncmp(format, "BASE64", 6) == 0)
        data_format = DataFormat::BASE64;
      else
        THROW_EXCEPTION(0, WHelp, NULL, "format is not set correctly!");
    }
    return data_format;
  }
  catch (TrustedHandle<Exception> e){
    throw e;
  }
}
//проверка наличия у сертификата закрытого ключа (1 - есть, 0 - нет)
int hasCertInStore(TrustedHandle<Certificate> cert){
  try {
    TrustedHandle<Filter> filterByCert = new Filter();
    filterByCert->setSerial(cert->getSerialNumber());
    TrustedHandle<PkiItemCollection> pic = g_storeCrypto->find(filterByCert);
    if (pic->length() == 0)
      return 0;
    else
      return 1;
  } catch (TrustedHandle<Exception> e) {
    throw e;
  }
}
//высчитывание хэша
void bin_to_strhex(unsigned char *bin, unsigned int binsz, char **result){
  char hex_str[] = "0123456789abcdef";
  unsigned int  i;
  
  *result = (char *)malloc(binsz * 2 + 1);
  (*result)[binsz * 2] = 0;
  
  if (!binsz)  return;
  
  for (i = 0; i < binsz; i++){
    (*result)[i * 2 + 0] = hex_str[(bin[i] >> 4) & 0x0F];
    (*result)[i * 2 + 1] = hex_str[(bin[i]) & 0x0F];
  }
}
