/*#include "common.h"

#ifndef COMMON_PROVIDER_H_INCLUDE
#define COMMON_PROVIDER_H_INCLUDE

#include <vector>

class CTWRAPPER_API Provider;
class CTWRAPPER_API ProviderCollection;

class Provider{
public:
	Provider();
	Provider(const Provider &v);
	~Provider();

	void name(char *v);
	::TrustedHandle<std::string> name();
	void type(int v);
	int type();
protected:
	::TrustedHandle<std::string> _name;
	int _type;
};

class ProviderCollection{
public:
	ProviderCollection();
	~ProviderCollection();

	::TrustedHandle<Provider> items(int index);
	int length();
	void push(::TrustedHandle<Provider> v);
	void push(Provider &v);
protected:
	std::vector<Provider> _items;
};

#endif //!COMMON_PROVIDER_H_INCLUDE*/
