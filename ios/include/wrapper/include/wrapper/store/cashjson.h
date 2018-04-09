#ifndef CASHJSON_H_INCLUDED
#define CASHJSON_H_INCLUDED

#include "../stdafx.h"

#include "../common/common.h"

#include "storehelper.h"

#include "../../../jsoncpp/json/json.h"

class CashJson {
public:
	CashJson(::TrustedHandle<std::string> fileName);
	~CashJson(){};

public:
	::TrustedHandle<std::string> jsonFileName;

	::TrustedHandle<PkiItemCollection> exportJson();
	void importJson(::TrustedHandle<PkiItem> item);
};

#endif //CASHJSON_H_INCLUDED
