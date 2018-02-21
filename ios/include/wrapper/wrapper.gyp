{
    "targets": [
        {
            "target_name": "wrapper",
            "type": "static_library",
            "include_dirs": ["include", "jsoncpp"],
            "sources": [
                "src/stdafx.cpp",
                "src/utils/jwt.cpp",
                "src/utils/csp.cpp",
                "src/common/bio.cpp",
                "src/common/common.cpp",
                "src/common/excep.cpp",
                "src/common/log.cpp",
                "src/common/openssl.cpp",
                "src/common/prov.cpp",
                "src/pki/crl.cpp",
                "src/pki/crls.cpp",
                "src/pki/revoked.cpp",
                "src/pki/revokeds.cpp",
                "src/pki/cert.cpp",
                "src/pki/certs.cpp",
                "src/pki/key.cpp",
                "src/pki/cert_request_info.cpp",
                "src/pki/cert_request.cpp",
                "src/pki/csr.cpp",
                "src/pki/cipher.cpp",
                "src/pki/chain.cpp",
                "src/pki/pkcs12.cpp",
                "src/pki/revocation.cpp",
                "src/store/cashjson.cpp",
                "src/store/pkistore.cpp",
                "src/store/provider_system.cpp",
                "src/store/storehelper.cpp",
                "src/pki/x509_name.cpp",
                "src/pki/alg.cpp",
                "src/pki/attr.cpp",
                "src/pki/attrs.cpp",
                "src/pki/attr_vals.cpp",
                "src/pki/oid.cpp",
                "src/cms/signer.cpp",
                "src/cms/signer_id.cpp",
                "src/cms/signers.cpp",
                "src/cms/signer_attrs.cpp",
                "src/cms/signed_data.cpp",
                "src/cms/cmsRecipientInfo.cpp",
                "src/cms/cmsRecipientInfos.cpp",
                "jsoncpp/jsoncpp.cpp"
                #"../../src/node/store/wcryptopro.cpp",
                #"deps/wrapper/src/store/provider_cryptopro.cpp"
            ],
            "xcode_settings": {
                "OTHER_CPLUSPLUSFLAGS": [
                    "-std=c++11",
                    "-stdlib=libc++"
                ],
                "OTHER_LDFLAGS": [],
                "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
                "GCC_ENABLE_CPP_RTTI": "YES",
                "MACOSX_DEPLOYMENT_TARGET": "10.7"
            },
            "conditions": [
                [
                    "OS=='win'",
                    {
                        "sources": [
                            "src/store/provider_microsoft.cpp"
                        ],
                        "variables": {
                            "openssl_root%": "C:/openssl"
                        },
                        "include_dirs": [
                            "<(openssl_root)/include"
                        ],
                        "defines": ["CTWRAPPER_STATIC", "OPENSSL_NO_CTGOSTCP", "JWT_NO_LICENSE"],
                        "msbuild_settings": {
                            "Link": {
                                "ImageHasSafeException::TrustedHandlers": "false"
                            }
                        }
                    },
                    {
                        #"sources": [
                            #"src/store/provider_cryptopro.cpp"
                        #],
                        "conditions": [
                            [
                                "target_arch=='x64'",
                                {
                                    "variables": {
                                        #"csp_root%": "/opt/cprocsp/lib/",
                                        #"openssl_libcrypto%": "/Users/admin/Desktop/openssl/lib"
                                        "openssl_libcrypto%": "/Users/admin/Desktop/git/OpensslForIPhone/OpenSSL-for-iPhone/bin/iPhoneSimulator11.2-x86_64.sdk/lib"
                                    }
                                },
                                {
                                    "variables": {
                                        #"csp_root%": "/opt/cprocsp/lib/",
                                        #"openssl_libcrypto%": "/Users/admin/Desktop/openssl/lib"
                                        "openssl_libcrypto%": "/Users/admin/Desktop/git/OpensslForIPhone/OpenSSL-for-iPhone/bin/iPhoneSimulator11.2-x86_64.sdk/lib"
                                    }
                                }
                            ]
                        ],
                        "libraries": [
                            #"-luuid",
                            #"-L<(csp_root) -lcapi10",
                            #"-L<(csp_root) -lcapi20",
                            #"-L<(csp_root) -lrdrsup",
                            #"-L<(csp_root) -lssp",
                            #"-L<(csp_root) -libcapi10.dylib",
                            #"-L<(csp_root) -libcapi20.4.dylib",
                            #"-L<(csp_root) -libcapi10.4.dylib",
                            "-L<(openssl_libcrypto) - libcrypto"
                        ],
                        "include_dirs": [
                            #"<(node_root_dir)/include/node/openssl",
                            #"/Users/admin/Desktop/openssl/include/openssl",
                            "/Users/admin/Desktop/git/OpensslForIPhone/OpenSSL-for-iPhone/bin/iPhoneSimulator11.2-x86_64.sdk/include/openssl"
                            #"/opt/cprocsp/include"
                        ],
                        "defines": ["UNIX", "OPENSSL_NO_CTGOSTCP", "JWT_NO_LICENSE"],
                        #"defines": [ "UNIX", "CPROCSP", "OPENSSL_NO_CTGOSTCP" ],

                        "cflags_cc+": ["-std=c++11"]
                    }
                ]
            ],
            "include_dirs": [
                "<!(node -e \"require('nan')\")"
            ],
            "cflags": [],
            "cflags_cc!": [
                "-fno-rtti",
                "-fno-exceptions"
            ]
        }
    ]
}
