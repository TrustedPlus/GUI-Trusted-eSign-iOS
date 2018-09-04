#include <vector>
#include <string>
#include<CPROCSP/reader/support.h>

typedef std::vector<std::pair<std::string,std::string> > UrlPostfields;
typedef std::vector<std::string> UrlHeaders;

class UrlRetriever
{
public:
    UrlRetriever();
    ~UrlRetriever();

    void set_flags( unsigned f);
    void set_timeout( unsigned t);
    void set_proxy_addr(const char* addr);
    void set_proxy_auth(const char* auth);
    void set_verify_server(CSP_BOOL ver);
    void set_verify_host(CSP_BOOL ver);
    void set_last_modified( const support_timeval& last_mod);
    void set_postfields( const UrlPostfields& postfields);
    void set_postmessage(BYTE* message, size_t size);
    void set_postmessage ( const char* message );
    void set_postmessage ( std::string const& message );
    void set_client_cert(const char *thumbprint, CSP_BOOL use_local_machine_cert=false);
    void set_headers( const UrlHeaders& headers);

    CSP_BOOL retrieve_url( const char* url);
    const unsigned char* get_data() const;
    unsigned long get_data_len() const;
    const unsigned char* get_header() const;
    unsigned long get_header_len() const;
    unsigned long get_code() const
    { return code_; }
    HRESULT get_error() const;
    HRESULT get_connection_error() const;
    CSP_BOOL is_modified() const;
    support_timeval last_modified() const;
private:
    std::vector<unsigned char> data;
    std::string header;
    std::string thumbprint;
    
    //TODO:use in retrieve_url under windows
    std::string proxy_addr; //CURLOPT_PROXY, "proxy-host.com:8080"
    std::string proxy_auth; //CURLOPT_PROXYUSERPWD, "user:password"
    
    unsigned flags;
    unsigned timeout;
    support_timeval last_modified_;
    CSP_BOOL check_modify;
    CSP_BOOL modified;
    CSP_BOOL verify_server;
    CSP_BOOL verify_host;
    CSP_BOOL use_client_cert;
    HRESULT error;
    const UrlPostfields* postfields_;
    const UrlHeaders* headers_;
    unsigned long code_;
    std::vector<BYTE> postmessage_;
    CSP_BOOL use_local_machine_cert_;
};
