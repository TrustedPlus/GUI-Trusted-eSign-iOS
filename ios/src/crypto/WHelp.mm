#include "WHelp.h"

DataFormat::DATA_FORMAT NSStringToDataFormat(NSString *nsformat) {
  char *format = (char *) [nsformat UTF8String];
  DataFormat::DATA_FORMAT data_format;
  if (strncmp(format, "DER", 3) == 0)
    data_format = DataFormat::DER;
  else{
    if (strncmp(format, "BASE64", 6) == 0)
      data_format = DataFormat::BASE64;
    else
      return data_format;
  }
  return data_format;
}
