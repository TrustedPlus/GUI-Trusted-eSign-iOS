/* vim:set sw=4 ts=8 fileencoding=cp1251::���������:WINDOWS-1251[���������] */
#ifdef _WIN32
    #pragma setlocale("rus")
#endif
/*
 * Copyright(C) 2000-2014 ������ ���
 *
 * ���� ���� �������� ����������, ����������
 * �������������� �������� ������ ���.
 *
 * ����� ����� ����� ����� �� ����� ���� �����������,
 * ����������, ���������� �� ������ �����,
 * ������������ ��� �������������� ����� ��������,
 * ���������������, �������� �� ���� � ��� ��
 * ����� ������������ ������� ��� ����������������
 * ���������� ���������� � ��������� ������ ���.
 */

#if !defined( _READER_SUPPORT_SUPPORT_H )
#define _READER_SUPPORT_SUPPORT_H

#include<CPROCSP/common.h>
#include<CPROCSP/reader/tchar.h>

/* --------------- INCLUDE --------------- */
#if defined(CSP_LITE)
#elif defined _WIN32
#   include <stdlib.h>
#   pragma warning( push )
#   pragma warning( disable: 4100 4115 4201 4214 )
#   include <windows.h>
#   include <time.h>
#   pragma warning( pop )
#elif defined UNIX
#   include <stdlib.h>
#   include <stdarg.h>
# ifdef HAVE_STDINT_H
#   include <stdint.h>
# elif defined(HAVE_INTTYPES_H)
#   include <inttypes.h>
# elif defined(HAVE_SYS_INTTYPES_H)
#   include <sys/inttypes.h>
# endif //HAVE_STDINT_H
#   include <time.h>
#   include <sys/time.h>
#   include <pthread.h>
#   include <nl_types.h>
#include<CPROCSP/reader/ubi_mutex.h>
#else
#   error !UNIX && !_WIN32
#endif //CSP_LITE

#include<CPROCSP/reader/std_decl.h>

#if !defined( _SUPPORT_DECL )
#   if defined( SUPPORT_IMPORTS )
#        define _SUPPORT_DECL _STDIMPL_DECL
#   else /* defined( SUPPORT_IMPORTS ) */
#        define _SUPPORT_DECL
#   endif /* !defined( SUPPORT_IMPORTS ) */
#endif /* !defined( _SUPPORT_DECL ) */


#if !defined( _SUPPORT_CALLBACK_CONV )
#   if defined( UNIX )
#	if defined( __GNUC__ ) && !defined(IOS) && defined (PROCESSOR_TYPE) && (PROCESSOR_TYPE != PROC_TYPE_ARM && PROCESSOR_TYPE != PROC_TYPE_ARM64 && PROCESSOR_TYPE != PROC_TYPE_PPC64 && PROCESSOR_TYPE != PROC_TYPE_PPC32 && PROCESSOR_TYPE != PROC_TYPE_MIPS32 && PROCESSOR_TYPE != PROC_TYPE_E2K32 && PROCESSOR_TYPE != PROC_TYPE_E2K64)
#	    define _SUPPORT_CALLBACK_CONV __attribute__((regparm(0))) 
#	else // defined( __GNUC__ )
#	    define _SUPPORT_CALLBACK_CONV
#	endif // defined( __GNUC__ )
#   else // defined( UNIX )
#      define _SUPPORT_CALLBACK_CONV __cdecl
#   endif // defined( UNIX )
#endif // !defined( _SUPPORT_CALLBACK_CONV )

// ����������� ����������� ���� � ������ reader/source/support/sup_def.h,
// � reader/source/rndm/rndm_def.h, �� ���� ������� � ������������!
#if defined( UNIX ) || defined( _WIN32 ) && defined( __STDC__ )
    #define NO_SUP_NOTIFICATOR
    #define NO_SUP_WIZARD
    #define NO_SUP_PROPERTIES
#endif // defined( UNIX ) || defined( _WIN32 ) && defined( __STDC__ )

#if !defined( LANGUAGE ) 
    /*+ ����� ������ ����� WIN1251. +*/
#   define _LANGTEXT(a/*+English+*/,b/*+Win1251+*/) (const wchar_t*)L ## a
#elif defined(LANGUAGE) && ( LANGUAGE == 1251 )
    /*+ ����� ������ ����� WIN1251. +*/
#   define _LANGTEXT(a/*+English+*/,b/*+Win1251+*/) (const wchar_t*)L ## b
#else /* defined( LANGUAGE ) && ( LANGUAGE == 1251 )  */
    /*+ ����� ������ ����� WIN1251. +*/
#   define _LANGTEXT(a/*+English+*/,b/*+Win1251+*/) (const wchar_t*)L ## a
#endif /* !defined( LANGUAGE ) || ( LANGUAGE != 866 ) && ( LANGUAGE != 1251 ) ) */

//------------------------------
// ������� ������� ��� ����������� �����, ���������� �� �������, ��� ����� ������� ����� �� �������
// ��� destArrayLen == 0 ���������� ����� ���������� ������ ��� 0 � ������ ������
// ��� destArrayLen != 0 ���������� ����� ����������������� ������ ��� 0 � ������ ������
#ifdef UNIX
#define CPRO_CONSOLE_CP CP_UTF8
#else // UNIX
#define CPRO_CONSOLE_CP CP_ACP
#endif // UNIX

#define console_c2w(destW, srcC, destArrayLen) MultiByteToWideChar(CPRO_CONSOLE_CP, 0, (srcC), (int)(-1), (destW), (int)(destArrayLen))
#define console_w2c(destC, srcW, destArrayLen) WideCharToMultiByte(CPRO_CONSOLE_CP, 0, (srcW), (int)(-1), (destC), (int)(destArrayLen), NULL, NULL)
// console_c2t � console_t2c �� ����� ���� ����������, ��� ��� ������ ��������� ������� c2c ��� ������� ����� ���������
#ifdef UNICODE
#   define console_t2w(destW, srcT, destArrayLen) ((destArrayLen) ? (wcsncpy((destW), (srcT), (destArrayLen)), ((int)wcslen(srcT)+1)) : ((int)wcslen(srcT)+1))
#   define console_w2t(destT, srcW, destArrayLen) ((destArrayLen) ? (wcsncpy((destT), (srcW), (destArrayLen)), ((int)wcslen(srcW)+1)) : ((int)wcslen(srcW)+1))
#else /* UNICODE */
#   define console_t2w(destW, srcT, destArrayLen) console_c2w(destW, srcT, destArrayLen)
#   define console_w2t(destT, srcW, destArrayLen) console_w2c(destT, srcW, destArrayLen)
#endif /* UNICODE */

//------------------------------
// ���������� ������� ��� ����������� ����� �� ���������� ������������� ���������� � �������
// ������������� �� ������������� ��� �������������, �.�. ����� ��� �������������� ��� ����������
// ��������� ����� ���������� ������ ��� ������, ��������� �� ������
#if defined _WIN32 && !defined CSP_LITE
#   define safe_mbsrtowcs( dest, src, len ) MultiByteToWideChar( CP_ACP, 0, (src), (int)(len), (dest), (int)(len) )
#   define safe_wcsrtombs( dest, src, len ) WideCharToMultiByte( CP_ACP, 0, (src), (int)(len), (dest), (int)(len), NULL, NULL )
#elif defined _WIN32
#   define safe_mbsrtowcs mbstowcs
#   define safe_wcsrtombs wcstombs
#endif

//�� ��������� �� TCHAR
#define _2un(dest, src, len) safe_mbsrtowcs(dest, src, len) //����� �������� � ��������� ������ � ��������
#define _2u(dest, src) safe_mbsrtowcs(dest, src, strlen(src)+1)
#define _u2n(dest, src, len) safe_wcsrtombs(dest, src, len) //����� �������� � ��������� ������ � ��������
#define _u2(dest, src) safe_wcsrtombs(dest, src, wcslen(src)+1)	

#ifdef UNICODE
#   define _2asciincpy( dest, src, len ) safe_wcsrtombs(dest, src, len)
#   define _2asciicpy( dest, src ) safe_wcsrtombs(dest, src, wcslen(src)+1)
#   define _ascii2ncpy( dest, src, len ) safe_mbsrtowcs(dest, src, len)
#   define _ascii2cpy( dest, src ) safe_mbsrtowcs(dest, src, strlen(src)+1)
#   define _2unincpy( dest, src, len ) wcsncpy( dest, src, len )
#   define _2unicpy( dest, src ) wcscpy( dest, src )
#   define _uni2ncpy( dest, src, len ) wcsncpy( dest, src, len )
#   define _uni2cpy( dest, src ) wcscpy( dest, src )
#else /* UNICODE */
#   define _2asciincpy( dest, src, len ) strncpy( dest, src, len )
#   define _2asciicpy( dest, src ) strcpy( dest, src )
#   define _ascii2ncpy( dest, src, len ) strncpy( dest, src, len )
#   define _ascii2cpy( dest, src ) strcpy( dest, src )
#   define _asciincpy( dest, src ) strcpy( dest, src )
#   define _2unincpy( dest, src, len ) safe_mbsrtowcs(dest, src, len)
#   define _2unicpy( dest, src ) safe_mbsrtowcs(dest, src, strlen(src)+1)
#   define _uni2ncpy( dest, src, len ) safe_wcsrtombs(dest, src, len)
#   define _uni2cpy( dest, src ) safe_wcsrtombs(dest, src, wcslen(src)+1)
#endif /* UNICODE */

#define _2wcencpy( dest, src, len ) _2asciincpy(dest, src, len)
#define _2wcecpy( dest, src ) _2asciicpy(dest, src)
#define _wce2ncpy( dest, src, len ) _ascii2ncpy(dest, src, len)
#define _wce2cpy( dest, src ) _ascii2cpy(dest, src)
#define _u2wcen(dest, src, len) safe_wcsrtombs(dest, src, len) //����� �������� � ��������� ������ � ��������
#define _u2wce(dest, src) safe_wcsrtombs(dest, src, wcslen(src)+1)
#define _wce2un(dest, src, len) safe_mbsrtowcs(dest, src, len) //����� �������� � ��������� ������ � ��������
#define _wce2u(dest, src) safe_mbsrtowcs(dest, src, strlen(src)+1)	
#define _a2wcen(dest, src, len) strncpy(dest, src, len) //����� �������� � ��������� ������ � ��������
#define _a2wce(dest, src) strcpy(dest, src)
#define _wce2an(dest, src, len) strncpy(dest, src, len) //����� �������� � ��������� ������ � ��������
#define _wce2a(dest, src) strcpy(dest, src)	

#define SUPPORT_MUTEX_RECURSIVE 1
#define SUPPORT_MUTEX_PRIVATE 2

#if !defined CSP_LITE
#if !defined UNIX
/* Mutex - ����������� ���������� � ������������� ������.
   ���������� ��� ���������� ���������� ������ ����� ���� ������� ��
   ���������� */
#   define support_mutex_init( mutex ) *mutex = INVALID_HANDLE_VALUE;
#   define support_mutex_open( mutex, name, flags ) support_mutex_open_fun( mutex, name, flags )
#   define support_mutex_lock( mutex ) WaitForSingleObject( (mutex), INFINITE )
#   define support_mutex_unlock( mutex ) { if(mutex != INVALID_HANDLE_VALUE) ReleaseMutex( mutex ); }
#   define support_mutex_trylock( mutex ) (WaitForSingleObject( (mutex), 0 ) == WAIT_TIMEOUT ? SUP_ERR_CANCEL : SUP_ERR_NO )
#   define support_mutex_close( mutex ) { if( *mutex != INVALID_HANDLE_VALUE ) { CloseHandle( *mutex ); *mutex = INVALID_HANDLE_VALUE; } }
# ifndef _M_ARM
#   define support_try __try {
#   define support_finally } __finally {
# else
#   define support_try {
#   define support_finally } {
# endif
#   define support_finally_end }
#   define support_finally_return

/* Critical Section ����������� ���������� ������. ���������� ����� ����������
    ���. ���������� ������ ����� ���� ������� �� ����������. */
#   define support_section_init( section, arg ) (InitializeCriticalSection(section),0)
#   define support_section_init_recursive(section) (InitializeCriticalSection(section),0)
#   define support_section_done( section ) (DeleteCriticalSection(section),0)
#   define support_section_enter( section ) (EnterCriticalSection(&section),0)
#   define support_section_leave( section ) (LeaveCriticalSection(&section),0)

/* Event ����������� �������������, ���������� � ������������� ������. */
#   define support_event_init( event ) *event = INVALID_HANDLE_VALUE;
#   define support_event_open( event, name ) support_event_open_fun( event, name )
#   define support_event_lock( event ) WaitForSingleObject( (event), INFINITE )
#   define support_event_unlock( event ) { if(event != INVALID_HANDLE_VALUE) SetEvent( event ); }
#   define support_event_trylock( event ) (WaitForSingleObject( (event), 0 ) == WAIT_TIMEOUT ? SUP_ERR_CANCEL : SUP_ERR_NO )
#   define support_event_close( event ) { if( *event != INVALID_HANDLE_VALUE ) { CloseHandle( *event ); *event = INVALID_HANDLE_VALUE; } }

/* RWLock ����������� ���������� ������. �������� ������ ���������� reader ���
    ������ writer. ���������� ����� ���������� ���.
    ���������� ������ ����� ���� ������� �� ����������. */

#else /* UNIX */
#define support_mutex_init( m ) \
            ((m)->inited = 0)
#define support_mutex_open( m, name, flags ) \
            ( ubi_mutex_open(&((m)->ubi_mutex),name,flags) \
                ? SUP_ERR_VERIFY \
                : ((((m)->inited = 1)), 0) \
            )
#define support_mutex_lock( m ) \
            (ubi_mutex_lock(&((m).ubi_mutex)))
#define support_mutex_trylock( m ) \
            ( ((m).inited) \
                ? (ubi_mutex_trylock( &((m).ubi_mutex) ) \
                    ? SUP_ERR_CANCEL \
                    : SUP_ERR_NO ) \
                : SUP_ERR_PARAM \
            )
#define support_mutex_unlock( m ) \
            { if((m).inited) { \
                ubi_mutex_unlock(&((m).ubi_mutex)); \
              } \
            }
#define support_mutex_close( m ) \
            { if((m)->inited) { \
                ubi_mutex_close(&((m)->ubi_mutex)); \
              } \
              (m)->inited = 0; \
            }
#define support_mutex_copy( m1, m2 ) \
            { if(0 != ((m1)->inited = (m2).inited)) { \
                ubi_mutex_copy(&(m1)->ubi_mutex, &(m2).ubi_mutex); \
              } \
            }

# define support_section_init( section, arg ) pthread_mutex_init( section,NULL )
# define support_section_init_recursive(section) support_mutex_init_recursive(section)
# define support_section_done( section ) pthread_mutex_destroy( section )
# define support_section_enter( section ) pthread_mutex_lock( &section )
# define support_section_leave( section ) pthread_mutex_unlock( &section )

# define support_event_init( event ) support_mutex_init( event )
# define support_event_open( event, name ) support_mutex_open( event, name, 0 )
# define support_event_lock( event ) support_mutex_lock( event )
# define support_event_unlock( event ) support_mutex_unlock( event )
# define support_event_trylock( event ) support_mutex_trylock( event )
# define support_event_close( event ) support_mutex_close( event )

# define support_try {
# define support_finally }
# define support_finally_end

#endif /* UNIX */

#elif defined CSP_LITE

# if !defined UNIX
#   define support_try __try {
#   define support_finally } __finally {
#   define support_finally_end }
#   define support_finally_return
# else
#   define support_try {
#   define support_finally }
#   define support_finally_end
#endif

# define support_section_init( section, arg )
# define support_section_init_recursive(section)
# define support_section_done( section )
# define support_section_enter( section ) (void) 1
# define support_section_leave( section )

#endif /* CSP_LITE */

#define support_mutex_try_lock( mutex ) \
    support_mutex_lock( mutex ); support_try
#define support_mutex_finally_unlock( mutex ) \
    support_finally support_mutex_unlock( mutex ); support_finally_end
#define support_section_try_enter( section ) \
    support_section_enter( section ); support_try
#define support_section_finally_leave( section ) \
    support_finally support_section_leave( section ); support_finally_end
#define support_event_try_lock( event ) \
    support_event_lock( event ); support_try
#define support_event_finally_unlock( event ) \
    support_finally support_event_unlock( event ); support_finally_end
#define RWLOCK_CLAIM(lock,mode) \
    CRWLock_Claim (lock, mode); support_try
#define RWLOCK_RELEASE(lock,mode) \
    support_finally CRWLock_Release (lock, mode); support_finally_end

#if !defined support_finally_return
#   define support_mutex_finally_return( mutex ) support_mutex_unlock( mutex );
#   define support_section_return_leave( section ) support_section_leave( section );
#   define support_event_finally_return( event ) support_event_unlock( event );
#else
#   define support_mutex_finally_return( mutex )
#   define support_section_return_leave( section )
#   define support_event_finally_return( event )
#endif

#if defined _WIN64
#   define support_registry_get_time_t(p,t) \
    support_registry_get_long_long(p,(long long*)t )
#   define support_registry_put_time_t(p,t) \
    support_registry_put_long_long(p,(long long)t )
#else
#   define support_registry_get_time_t(p,t) \
    support_registry_get_long(p,(long*)t )
#   define support_registry_put_time_t(p,t) \
    support_registry_put_long(p,(long)t )
#endif

#if defined (_WIN32)
    #define SUP_STOP __debugbreak(); 
#elif (defined __GNUC__ || defined __clang__) && PROCESSOR_TYPE != PROC_TYPE_ARM64
/* ������� �� 0 �������� "undefined behaviour" -->
 * ���������� ���������� �������� �����������
 * dim: �� ����, ��� �������� ��� VS/sunCC
 * dedal: �� linux/arm64 __builtin_trap() �������� ������� abort
 */
    #define SUP_STOP { __builtin_trap(); }
#elif defined __xlC__
#if defined __cplusplus
#   include <builtins.h>
#endif	/* __cplusplus */
    #define SUP_STOP { __trap(1); }
#else
    #ifdef CSP_LITE
	#define SUP_STOP { \
		int x; \
		x=3;x=x/(3-x); \
		*(char *)(void *)(intptr_t)(x-3) = 0; \
	    }
    #else
	#define SUP_STOP { abort(); }
    #endif
#endif

#ifdef UNIX
# define SUP_INLINE inline
#else
# define SUP_INLINE __inline
#endif

#ifdef __cplusplus
# if defined(__xlC__) || defined(_AIX)
// TODO: fast AIX fix: RuNetCPC.cpp, line 388.9: 1540-0064 (S) Syntax error:  "(" was expected but "," was found.
#  define CPRO_ALIGNOF(type) 2
# else
   template<typename T> struct alignment_trick { char c; T member; };
#  define CPRO_ALIGNOF(type) CPRO_OFFSETOF(alignment_trick<type>, member)
# endif
#else // __cplusplus
# define CPRO_ALIGNOF(type) CPRO_OFFSETOF(struct { char x; type test; }, test)
#endif // __cplusplus

#define IS_ALIGNED_PTR(x,type) ( (x) && !( ((size_t)(x)) % (CPRO_ALIGNOF(type)) ) )

typedef void(*SUP_PROC_PTR)(void);

#if 0 //defined _WIN32 && !defined CSP_LITE
#   define IS_READ_PTRS(x,size) ( !IsBadReadPtr(x,size) )
#   define IS_WRITE_PTRS(x,size) ( !IsBadWritePtr(x,size) )
#   define IS_READ_PTR(x) ( !IsBadReadPtr(x,1) )
#   define IS_WRITE_PTR(x) ( !IsBadWritePtr(x,1) )
#   ifdef UNDER_CE
#	define IS_STRING_PTRS(x,size)	IS_READ_PTR(x)
#	define IS_STRING_PTR(x)		IS_READ_PTR(x)
#   else /*UNDER_CE*/
#	define IS_STRING_PTRS(x,size) ( !IsBadStringPtr(x,size) )
#	define IS_STRING_PTR(x) ( !IsBadStringPtr(x,(size_t)-1) )
#   endif /*UNDER_CE*/
#   define IS_FUN_PTR(x) (!IsBadCodePtr((FARPROC)x) )
#   define IS_ALIGNED_RPTR(x,type) (IS_ALIGNED_PTR(x,type) && IS_READ_PTRS(x,sizeof(type)))
#   define IS_ALIGNED_WPTR(x,type) (IS_ALIGNED_PTR(x,type) && IS_WRITE_PTRS(x,sizeof(type)))
#else
/* �������� �� ����: 
   TODO: �� ������������� ����� ��������� wchar-������ � ���,
   ��� ���� �������� ������: SUPSYS_PRE_CONTEXT(), SUPSYS_PRE_INFO */
SUP_INLINE static int IsGoodPtr(const void *p) { return (p != NULL); }
SUP_INLINE static int IsGoodCodePtr(SUP_PROC_PTR p) { return (p != NULL); }
#   define IS_READ_PTRS(x,size) IsGoodPtr(x)
#   define IS_WRITE_PTRS(x,size) IsGoodPtr(x)
#   define IS_READ_PTR(x) IS_READ_PTRS(x,1)
#   define IS_WRITE_PTR(x) IS_WRITE_PTRS(x,1)
#   define IS_STRING_PTRS(x,size) IsGoodPtr(x)
#   define IS_STRING_PTR(x) IsGoodPtr(x)
#   define IS_FUN_PTR(x) IsGoodCodePtr((SUP_PROC_PTR)x)
#   define IS_ALIGNED_RPTR(x,type) IS_ALIGNED_PTR(x,type)
#   define IS_ALIGNED_WPTR(x,type) IS_ALIGNED_PTR(x,type)
#endif

#define SUPDLL_NULL
#define SUPDLL_LOAD_PROC(nn,name,err) \
    if(!nn##_entry.name##_proc){ \
        if( !nn##_module ) { \
            if( nn##_load_library() ) return err; \
        } \
        nn##_entry.name##_proc = (T##name##Proc)support_load_library_getaddr( nn##_module, #name ); \
        if( !nn##_entry.name##_proc ) return err; \
    }

#define SUPDLL_ITEMT(nn,name,arg_list,type,conv) \
    typedef type (conv *T##name##Proc) arg_list;
#define SUPDLL_ITEMI(nn,name) \
    T##name##Proc name##_proc;

#define SUPDLL_ITEMI_B(nn) \
    static TSupModuleInstance nn##_module = NULL; \
    static int nn##_load_count = 0; \
    struct nn##Entry_ {
#define SUPDLL_ITEMI_E(nn) \
    } nn##_entry;

#define SUPDLL_ITEMI_B_INSIDE(nn) \
    static TSupModuleInstance nn##_module = NULL; \
    static int nn##_load_count = 0; \
    static struct nn##Entry_ {

#define SUPDLL_LOAD(nn,name) \
    TSupErr nn##_load_library( void ) { \
        if( nn##_load_count ) { nn##_load_count++; return 0; } \
        nn##_module = support_load_library_registry( name, \
            SUP_LOAD_LIBRARY_DEFAULT ); \
        if( nn##_module == NULL ) return SUP_ERR_VERIFY; \
        nn##_load_count++; \
        return 0; \
    }

#define SUPDLL_LOAD_SYSTEM(nn,name) \
    TSupErr nn##_load_library( void ) { \
        if( nn##_load_count ) { nn##_load_count++; return 0; } \
        nn##_module = support_load_library_registry( name, \
            SUP_LOAD_LIBRARY_DEFAULT | SUP_LOAD_LIBRARY_SYSTEM ); \
        if( nn##_module == NULL ) return SUP_ERR_VERIFY; \
        nn##_load_count++; \
        return 0; \
    }

#define SUPDLL_UNLOAD(nn) \
    void nn##_unload_library( void ) { \
        if( !nn##_load_count ) return; \
        nn##_load_count--; \
        if( nn##_load_count ) return; \
        memset( &nn##_entry, 0, sizeof( nn##_entry ) ); \
        support_unload_library_registry( nn##_module ); \
    }

#define SUPDLL_ITEMR2(nn,name,arg_list,call_list,type,conv,err) \
    type conv name arg_list { \
        SUPDLL_LOAD_PROC(nn,name,err) \
        return nn##_entry.name##_proc call_list; \
    }

#define SUPDLL_ITEMV(nn,name,arg_list,call_list) \
    void name arg_list { \
        SUPDLL_LOAD_PROC(nn,name,SUPDLL_NULL) \
        nn##_entry.name##_proc call_list; \
    }

#define SUPDLL_ITEMVL(nn,name,arg_list,name2,last,call_list) \
    void name arg_list { \
        va_list valist; \
        va_start( valist, last ); \
        SUPDLL_LOAD_PROC(nn,name2,SUPDLL_NULL); \
        nn##_entry.name2##_proc call_list; \
	va_end(valist); \
    }

#define SUPDLL_ITEMRL(nn,name,arg_list,name2,last,call_list,type,err) \
    type name arg_list { \
        va_list valist; \
	type _retcode_; \
        va_start( valist, last ); \
        SUPDLL_LOAD_PROC(nn,name2,err); \
        _retcode_ = nn##_entry.name2##_proc call_list; \
        va_end(va_list); \
        return _retcode_; \
    }

#define SUPLIB_ITEMR2(nn,name,arg_list,call_list,type,conv,err) \
    type conv name arg_list { return err; }
#define SUPLIB_ITEMV(nn,name,arg_list,call_list) \
    void name arg_list { return; }
#define SUPLIB_ITEM(nn,name,arg_list,call_list) \
    SUPLIB_ITEMR2(nn,name,arg_list,call_list,TSupErr,SUPDLL_NULL,SUP_ERR_UNSUPPORTED)
#define SUPLIB_ITEMVL(nn,name,arg_list,call_list) \
    void name arg_list { return; }

#if defined UNUSED
    #undef  UNUSED
#endif
#define UNUSED(x)   (void)(x)

/* ����� ������, ������� ������������� ��������� � ������� ����������. */

/* ����� ��� ������: ���������� ������ ��� ������� ����������� �������. +*/
#define SUP_ERR_NO 0

/* ����� ��� ������: ���������� ������ ��� ������� ����������� �������. +*/
#define SUP_ERR_CORRECT 0

/* ����� ��� ������: ���������� ������ ��� ������� ����������� �������. +*/
#define SUP_CORRECT 0

/*+ ����� ��� ������: �������� ������. +*/
#define SUP_ERR_MEMORY 0x1001

/*+ ����� ��� ������: �� ����������� ����������� ��� ��������. +*/
#define SUP_ERR_VERIFY 0x1002

/*+ ����� ��� ������: ����������� �������� ���������. +*/
#define SUP_ERR_PARAM 0x1003

/*+ ����� ��� ������: ������� �� ��������������. +*/
#define SUP_ERR_UNSUPPORTED 0x1004

/*+ ����� ��� ������: ����������� ������. +*/
#define SUP_ERR_UNKNOWN 0x1005

/*+ ����� ��� ������: ����� �� ���������� ��������. +*/
#define SUP_ERR_CANCEL 0x1006

/*+ ����� ��� ������: ������������ ����. +*/
#define SUP_ERR_RIGHTS 0x1007

#define SUP_ERR_CONNECT 0x1008

/*+ ����� ��� ������: ������ ������ 1.0 �� ��������������. +*/
#define SUP_ERR_STD_VERSION_1 0x1009

/*+ ����� ��� ������: ������� ���������. +*/
#define SUP_ERR_FEATURE_DISABLED 0x100A

#define SUP_ERR_STD_MAX 0x1FFF

/*+ ����������� �������������� ������ � ������� ������� ���������.
    �������� ����������� ������. +*/
#define SUP_ERR_IS_STD( err ) \
    ( ( (err) >= SUP_ERR_MEMORY ) && ( (err) <= SUP_ERR_STD_MAX ) )

/*+ ��� ������ ������� ���������: ������, ���� ��� �������� �� ������. +*/
#define SUP_ERR_KEY_NOT_FOUND 0x2000

/*+ ��� ������ ������� ���������: ������, ���� ��� �������� ��������. +*/
#define SUP_ERR_KEY_INVALID 0x2001

/*+ ��� ������ ������� ���������: ������������ ���� ��� ������. +*/
#define SUP_ERR_RESOURCE 0x2002

#define SUP_ERR_INSTALL_ADD 0x2003

/* ��� ������: �������� �������� �������� ������������� ����. */
#define SUP_ERR_KEY_TYPE 0x2004

/*+ ��� ������ ������� ���������: ������ ������ 1.0 �� ��������������. +*/
#define SUP_ERR_VERSION_1 0x2005

/*+ ��� ������ ������� ���������: ��������� ��� ������. +*/
#define SUP_ERR_MAX 0x2FFF

/*+ ����������� �������������� ������ � ������� ������� ���������.
    �������� ����������� ������. +*/
#define SUP_ERR_IS( err /*+ (i) ��� ������. +*/ ) \
    ( ( (err) >= SUP_ERR_KEY_NOT_FOUND ) && ( (err) <= SUP_ERR_MAX ) )

#define SUP_TYPE_UNKNOWN 0

/* ��� ��������� ������. */
#define SUP_TYPE_STRING 0x1

/* ��� ��������� long. */
#define SUP_TYPE_LONG 0x2

/* ��� ��������� Boolean. */
#define SUP_TYPE_CSP_BOOL 0x4

/* ��� ��������� Hex. */
#define SUP_TYPE_HEX 0x8

/* ��� ��������� Section. */
#define SUP_TYPE_SECTION 0x10

/* ��� ��������� Section. */
#define SUP_TYPE_MULTI_SZ 0x20

/* ��� ��������� long long */
#define SUP_TYPE_LONG_LONG 0x40

/* ����� �������� � ������ ������������� �������� ���������. */

/* ������ � ����� �� ��������, ��������� �������� ����������. */
#define SUP_ACCESS_READ 0x1
/* ������ � ����� �� ��������, ��������� � �������� ���������� */
#define SUP_ACCESS_MODIFY 0x2
/* ������ �� �������� ���������. */
#define SUP_ACCESS_CREATE_SUBKEY 0x4
/* ������ �� �������� ���������. */
#define SUP_ACCESS_DELETE_SUBKEY 0x8
/* ������ �� ��������� ����. */
#define SUP_ACCESS_GET_ACCESS 0x10
/* ������ �� ��������� ����. */
#define SUP_ACCESS_SET_ACCESS 0x20
/* ������ �� ������������ ������. */
#define SUP_ACCESS_ENUM_SUBKEY 0x40
/* ������ �� ����������� �� ����������. */
#define SUP_ACCESS_NOTIFY 0x80
/* ������ � SACL. */
#define SUP_ACCESS_SYSTEM_SECURITY           (0x01000000L)

/* If we have bit from this mask, we need to open file for read/write */
#define SUP_ACCESS_WRITE_MASK (SUP_ACCESS_MODIFY|SUP_ACCESS_CREATE_SUBKEY|SUP_ACCESS_DELETE_SUBKEY|SUP_ACCESS_SET_ACCESS)

#define SUPPORT_NOTIFY_SUBTREE 0x1
#define SUPPORT_NOTIFY_CHANGE 0x2
#define SUPPORT_NOTIFY_RENAME 0x4
#define SUPPORT_NOTIFY_SECURITY 0x8

#define SUP_LOAD_LIBRARY_STD 0

#define SUP_LOAD_LIBRARY_DEFAULT    1
#define SUP_LOAD_LIBRARY_SEPARATE   2
#define SUP_LOAD_LIBRARY_LAZY	    4
#define SUP_LOAD_LIBRARY_SYSTEM	    8 /* do not use this module path during dll search */ 
#define SUP_LOAD_LIBRARY_REDIRECTION 16 /*try to get redirected path or use default behaviour*/

/* --------------- TYPES --------------- */

/*+ ��� ���� ������. +*/
typedef unsigned int TSupErr;

#if defined _WIN32
    typedef unsigned ( __stdcall *TSupFun )( void* );
#endif

typedef enum CRWLockMode_ {
    CRWLOCK_NONE = 1,
    CRWLOCK_HIGHLOAD_NOSERIALIZED_READ = 2,
    CRWLOCK_READ = 3,
    CRWLOCK_ANY = 4,
    CRWLOCK_WRITE = 5,
    CRWLOCK_ERROR = -1
} CRWLockMode;

#if defined UNIX && defined CSP_LITE
    typedef void * TSupportCriticalSection;
    typedef void * TSupportMutex;
    typedef TSupportMutex TSupportEvent;
#elif defined UNIX && !defined CSP_LITE
    struct CRWLock_t
    {
	pthread_mutex_t CriticalSection;
	enum {
	    CRWLockInited   = 0x74696e49,
	    CRWLockReleased = 0x656c6552
	}       Status;
	int     Recusion;
	const char *LastFile;
	int     LastLine;
	#if defined(__sparcv9)
	    int            dwReserved;
	#endif /* defined(__sparcv9)*/
	void    *Arg;
    };

    typedef struct TSupportMutex_
    {
	ubi_mutex_t ubi_mutex;
	int inited;
    } TSupportMutex;
    typedef pthread_mutex_t TSupportCriticalSection;
    typedef TSupportMutex TSupportEvent;
#elif !defined UNIX && defined CSP_LITE
    typedef struct _FAST_MUTEX *PFAST_MUTEX;
    #ifndef CSP_LITE
	typedef PVOID PSECURITY_DESCRIPTOR;     // winnt
    #endif
    typedef PFAST_MUTEX TSupportCriticalSection;
#elif defined _WIN32
    typedef HANDLE TSupportMutex;
    typedef CRITICAL_SECTION TSupportCriticalSection;
    typedef HANDLE TSupportEvent;
    struct CRWLock_t
    {
	LONGLONG dummy[2*16];
    };
#elif defined( _WIN32 ) && defined( __STDC__ )
    typedef volatile int TSupportMutex;
    typedef volatile int TSupportCriticalSection;
    typedef TSupportMutex TSupportEvent;
#endif

typedef struct CRWLock_t CRWLock;

struct TSupportSharedMemory_;
typedef struct TSupportSharedMemory_ TSupportSharedMemory;

/* ���� ����������. */
typedef unsigned int TSupType;

/* ���� ����������. */
typedef unsigned int TSupAccess;

/* �������� � registry. */
struct TSupportRegistrySearchContext_;

typedef struct TSupportRegistrySearchContext_ TSupportRegistrySearchContext;

struct TSupportRegistrySearchValue_;

typedef struct TSupportRegistrySearchValue_ TSupportRegistrySearchValue;

#ifdef NO_SUP_NOTIFICATOR
    typedef int TSupRegNotificator;
#else /* !NO_SUP_NOTIFICATOR */
    struct TSupRegNotificator_;
    typedef struct TSupRegNotificator_ TSupRegNotificator;
#endif /* !NO_SUP_NOTIFICATOR */

    struct TSupFileEnum_;

typedef struct TSupFileEnum_ TSupFileEnum;

typedef enum TSupFileType_ {
    SUP_FTYPE_IGNORE,
    SUP_FTYPE_FILE,
    SUP_FTYPE_DIR
} TSupFileType;

#if !defined CSP_LITE
    /* ��������������� ����������� ������ ������� */
	/* TODO:X �������� �� ���-�� � ����:
	 * typedef boost::once_flag TSupportOnce;
	 * #define SUPPORT_ONCE_INIT BOOST_ONCE_INIT
	 * #define support_once(once_control, init_routine) boost::call_once(init_routine, once_control)
	 */
    #ifdef UNIX

	typedef pthread_once_t TSupportOnce;
	#define SUPPORT_ONCE_INIT PTHREAD_ONCE_INIT
	#define support_once(once_control, init_routine) \
			    (pthread_once((once_control), (init_routine)))
    #else
	typedef struct TSupportOnce_ {
	    LONG lLock;
	    LONG lDone;
	    LONG lInited;
	} TSupportOnce;
	#define SUPPORT_ONCE_INIT { 0, 0 }

	static __inline int
	support_once(TSupportOnce *once_control, 
		     void (*init_routine)(void))
	{
	    LONG lThreadID = GetCurrentThreadId();
	    int ret = 0;

	    if(once_control == NULL || init_routine == NULL) {
		return /*EINVAL*/22;
	    }
	    if(once_control->lDone) {	// "�����������" �����������
	    	return 0;
	    }
	    if(!InterlockedExchangeAdd(&once_control->lDone, 0)) 
	    { /* MBR fence */
		while(0 != InterlockedCompareExchange(
				&once_control->lLock, lThreadID, 0)) {
		    Sleep(100);
		}
		if(!once_control->lDone) 
		{
		    (*init_routine)();
		    if(0 != InterlockedExchangeAdd(&once_control->lDone, 1)) {
			// TODO:XX ���������� ���� �� �������� volatile �� 
			// lDone, ������, �������� InterlockedExchangeAdd()
			// �� CE ��������.
			// TODO:X �������� ��������� �� ������. ���� 
			// Interlocked*() ��������, �� ���������� ���� 
			// �� ������.
			SUP_STOP;
			ret = -1; /* Internal error */
		    }
		    once_control->lInited = lThreadID;
		}	    
		if(lThreadID != once_control->lLock) {
		    // TODO:X �������� ��������� �� ������. ���� 
		    // Interlocked*() ��������, �� ���������� ���� 
		    // �� ������.
		    SUP_STOP;
		    ret = -1; /* Internal error */
		}
		once_control->lLock = 0;
	    }
	    return ret;
	}
    #endif
#endif

#if defined( SUPPORT_RESOURCE_STD )
    typedef struct TSupStringTableItem_
    {
	size_t num; /*!< ����� ��������. */
	const wchar_t *string; /*!< ������. */
    } TSupStringTableItem;

    /*! ������� ������ ����������� �� ���� ������������. */
    typedef struct TSupVersionItem_
    {
	const wchar_t *company; /*!< �������� �������������. */
	const wchar_t *copyright; /*!< Copyright */
	unsigned int version[4]; /*!< ����� ������. */
    } TSupVersionItem;

    /*! ������� ������ ����������� �� ���� ������������. */
    typedef struct TSupIconTableItem_
    {
	int num; /*!< ����� ��������. */
	const wchar_t *icon_name; /*!< ��� ������. */
    } TSupIconTableItem;

    /*!
     * \brief resource ���������� �� ���� ������������
     */
    #if defined(UNIX) && !defined(CSP_LITE)
	typedef void (* TSupOnceFunc)(void);
	typedef struct TSupInstanceCatalog_
	{
	    TSupportOnce once_control;
	    const TSupOnceFunc once_func;
	    nl_catd nl_id;
	} TSupInstanceCatalog;
    #endif
    typedef struct TSupInstanceResourceDecl_
    {
	#if defined(UNIX) && !defined(CSP_LITE) && defined(USE_NLCAT)
	    TSupInstanceCatalog *catalog;
	#else
	    int string_table_max; /*!< ������ ���������� �������. */
	    const TSupStringTableItem *string_table; /*!< ���������� string table. */
       	#endif
	const TSupVersionItem *version; /*!< ��������� �� ���������� � ������. */
	int icon_table_max; /*!< ������ ������� ������. */
	const TSupIconTableItem *icon_table; /*!< ��������� �� ������. */
    } TSupInstanceResourceDecl;

    /*!
     * \brief instance ���������� �� ���� ������������
     */
    typedef const TSupInstanceResourceDecl * TSupResourceInstance;
#else
    /*!
     * \brief instance ������� ������������ ��� DLL instance.
     */
    typedef HINSTANCE TSupResourceInstance;
#endif /* !defined( SUPPORT_RESOURCE_STD ) */

#if defined _WIN32 && !defined CSP_LITE
    typedef HINSTANCE TSupModuleInstance;
    typedef HICON TSupIcon;
    typedef HBITMAP TSupBitMap;
    typedef FARPROC TSupProc;
#else
    typedef void* TSupModuleInstance;
    typedef void *TSupIcon;
    typedef void *TSupBitMap;
    typedef void *TSupProc;
#endif /* _WIN32 && !CSP_LITE */

#if defined(UNIX) && !defined CSP_LITE
#   include <sys/time.h>
#endif /* UNIX && !CSP_LITE */

typedef struct timeval support_timeval;

/* --------------- FUNCTIONS --------------- */
#if defined( __cplusplus )
extern "C" {
#endif /* defined( __cplusplus ) */

#include<CPROCSP/reader/altreg.h>
TSupErr usenewreg(void); /* ������������ �� ����� ��������. 0 -- �������, ��-0 -- ������ */
TSupErr rlsnewreg(void); /* ��������� ������ � �����, ������������� �� ������. ������ ������� */
TSupErr isnewreg(void);   /* 0 -- ������, ��-0 -- ����� */
TSupErr support_registry_get_oid(struct AREG_CRYPT_OID_INFO*); /* �������� ��������� OID. -1 -- ������ */
TSupErr support_registry_get_oidlen(void); /* ���������� ��������� OID. -1 -- ������ */
TSupErr release_files(void);
TSupErr write_random_seed(void);

unsigned long       support_get_last_error (void);
void                support_set_last_error (unsigned long);

TSupErr support_set_impersonate (int delayed, int hsmmode, int kb2mode);

/* Thread Local Storage. ����� ��� ������, ���������� ��� ������ ����. */
TSupErr support_set_thread_specific (unsigned int key, const void * ptr, void **old_ptr);
void * support_get_thread_specific (unsigned int key);
TSupErr support_tskey_create (unsigned int* key);
TSupErr support_tskey_delete (unsigned int key);

TSupErr support_thread_actualize_uids ( void );
TSupErr support_thread_deactualize_uids ( void );

#if defined _WIN32 && !defined CSP_LITE
_SUPPORT_DECL TSupErr support_mutex_open_fun(
    TSupportMutex *mutex, const TCHAR *name, unsigned flags );

_SUPPORT_DECL TSupErr support_event_open_fun(
    TSupportEvent *event, const TCHAR *name );
#endif

#if defined( _WIN32 )
_SUPPORT_DECL TSupErr support_shared_memory_create( 
    TSupportSharedMemory **shared, const TCHAR *file_name, const TCHAR *lock_name,
    size_t sizeof_shared );
_SUPPORT_DECL TSupErr support_shared_memory_remove( 
    TSupportSharedMemory *shared );
_SUPPORT_DECL void* support_shared_memory_lock( 
    TSupportSharedMemory *shared );
_SUPPORT_DECL TSupErr support_shared_memory_unlock( 
    TSupportSharedMemory *shared );
#endif /* _WIN32 */

/* ������� ��������� ���������� ���������. */
_SUPPORT_DECL TSupErr support_registry_get_string(
    const TCHAR *path, size_t *length, TCHAR *dest );

_SUPPORT_DECL TSupErr support_registry_get_multi_string(
    const TCHAR *path, size_t *length, TCHAR *dest );

/* ������� ��������� long ���������. */
_SUPPORT_DECL TSupErr support_registry_get_long(
    const TCHAR *path, long *dest );

/* ������� ��������� long ���������. */
_SUPPORT_DECL TSupErr support_registry_get_long_long(
    const TCHAR *path, long long *dest );

/* ������� ��������� Boolean ���������. */
_SUPPORT_DECL TSupErr support_registry_get_bool(
    const TCHAR *path, int *dest );

/* ������� ��������� ����������������� ���������. */
_SUPPORT_DECL TSupErr support_registry_get_hex(
    const TCHAR *path, size_t *size, void *dest );

/* ������� ������ ���������� ���������. */
_SUPPORT_DECL TSupErr support_registry_put_string(
    const TCHAR *path, const TCHAR *src );

/* ������� ������ ���������� ���������. */
_SUPPORT_DECL TSupErr support_registry_put_multi_string(
    const TCHAR *path, const TCHAR *src );

/* ������� ������ long ���������. */
_SUPPORT_DECL TSupErr support_registry_put_long(
    const TCHAR *path, long src );

/* ������� ������ long long ���������. */
_SUPPORT_DECL TSupErr support_registry_put_long_long(
    const TCHAR *path, long long src );

/* ������� ������ Boolean ���������. */
_SUPPORT_DECL TSupErr support_registry_put_bool(
    const TCHAR *path, int src );

/* ������� ������ ����������������� ���������. */
_SUPPORT_DECL TSupErr support_registry_put_hex(
    const TCHAR *path, size_t size, const void *src );

#if defined _WIN32
/* ������� ������ access control list �� �������� ��� ������. */
_SUPPORT_DECL TSupErr support_registry_put_acl(
    const TCHAR *path, const void *src );

/* ������� ������ system access control list �� �������� ��� ������. */
_SUPPORT_DECL TSupErr support_registry_put_sacl(
	const TCHAR *path, const void *src );

#if !defined UNDER_CE && !defined ( EXCLUDE_READER )

_SUPPORT_DECL TSupErr support_registry_get_sdecr ( 
				    const TCHAR *path, 
				    const DWORD secInfo, 
				    void * pSec, long * pSecLen, 
				    long * pError );

_SUPPORT_DECL TSupErr support_registry_put_sdecr ( const TCHAR *path, 
				     const DWORD secInfo, 
				     void * pSec, 
				     long * pError );

#   endif/*UNDER_CE*/

#endif /* _WIN32 */

#if defined (_WIN32) && !defined (CSP_LITE)
/* ������� ��������� ��������� PP_KEYSET_SEC_DESCR ����� ������� ��� ����� ����. */
_SUPPORT_DECL TSupErr support_get_PP_KEYSET_SEC_DESCR( BYTE *pbData, DWORD *pdwDataLen);
#endif

/* ������� ������ ������. */
_SUPPORT_DECL TSupErr support_registry_put_section(
    const TCHAR *path, const TCHAR *src );

/* ������� �������� ������������� ������. */
_SUPPORT_DECL TSupErr support_registry_test_section( 
    const TCHAR *path );

/* ������� �������� ��������� �� �������. */
_SUPPORT_DECL TSupErr support_registry_delete_param(
    const TCHAR *path, const TCHAR *src );

/* ������� �������� ������ �� �������. */
_SUPPORT_DECL TSupErr support_registry_delete_section(
    const TCHAR *path, const TCHAR *src );

/* ������� �������� ���������. */
_SUPPORT_DECL TSupErr support_registry_search_open(
    const TCHAR *path, TSupportRegistrySearchContext **context,
    size_t *max_name, int subkey );

/* ������� ������������ ��������� ������. */
_SUPPORT_DECL TSupErr support_registry_search_cpy(
    TSupportRegistrySearchContext **dest,
    TSupportRegistrySearchContext *src );

/* ������� ������������ ��������� ������. */
_SUPPORT_DECL int support_registry_search_cmp(
    TSupportRegistrySearchContext *left,
    TSupportRegistrySearchContext *right );

/* ������� �������� ���������. */
_SUPPORT_DECL TSupErr support_registry_search_close(
    TSupportRegistrySearchContext *context );

/* ������� ������ ��������� ��������� ������. */
_SUPPORT_DECL TSupErr support_registry_search_next(
    TSupportRegistrySearchContext *context,
    TSupportRegistrySearchValue **right );

/* ������� ������ ��������. */
_SUPPORT_DECL TSupErr support_registry_find(
    const TCHAR *path, TSupportRegistrySearchValue **value );

_SUPPORT_DECL int support_registry_value_cmp(
    const TSupportRegistrySearchValue *left,
    const TSupportRegistrySearchValue *right );

_SUPPORT_DECL TSupErr support_registry_value_cpy(
    TSupportRegistrySearchValue **left,
    const TSupportRegistrySearchValue *right );

/* ������� ������������ ��������. */
_SUPPORT_DECL TSupErr support_registry_value_free(
    TSupportRegistrySearchValue *src );

_SUPPORT_DECL TSupErr support_registry_value_string(
    const TSupportRegistrySearchValue *src, size_t *length, TCHAR *dest );

_SUPPORT_DECL TSupErr support_registry_value_multi_string(
    const TSupportRegistrySearchValue *src, size_t *length, TCHAR *dest );

/* ������� ��������� long ���������. */
_SUPPORT_DECL TSupErr support_registry_value_long(
    const TSupportRegistrySearchValue *src, long *dest );

_SUPPORT_DECL TSupErr support_registry_value_long_long(
    const TSupportRegistrySearchValue *src, long long *dest );

_SUPPORT_DECL TSupErr support_registry_value_bool(
    const TSupportRegistrySearchValue *src, int *dest );

_SUPPORT_DECL TSupErr support_registry_value_hex(
    const TSupportRegistrySearchValue *src, size_t *size, void *dest );

_SUPPORT_DECL TSupErr support_registry_value_type(
    const TSupportRegistrySearchValue *src, TSupType *type, size_t *size );

_SUPPORT_DECL TSupErr support_registry_value_name(
    const TSupportRegistrySearchValue *src, size_t *length, TCHAR *dest );

/* ������� ��������� ����� ���������. */
_SUPPORT_DECL TSupErr support_registry_get_param(
    TSupportRegistrySearchContext *context, size_t length, TCHAR *dest );

/* ������� ��������� ���� ����. */
_SUPPORT_DECL TSupErr support_registry_type(
    const TCHAR *path, TSupType *type, size_t *size );

/* ������� ��������� ���� ����. */
_SUPPORT_DECL TSupErr support_registry_check_access(
    const TCHAR *path, TSupAccess *acc );

#ifdef NO_SUP_NOTIFICATOR
#ifdef _MSC_VER
#pragma warning (disable:4127)
#endif
#define support_registry_notify_set(a,b,n) SUP_ERR_NO
#define support_registry_notify_is(n) SUP_ERR_CANCEL
#define support_registry_notify_done(n)
#else /* !NO_SUP_NOTIFICATOR */
_SUPPORT_DECL TSupErr support_registry_notify_set(
    const TCHAR *path, unsigned flags, TSupRegNotificator **notificator );

_SUPPORT_DECL TSupErr support_registry_notify_is(
    TSupRegNotificator *notificator );

_SUPPORT_DECL TSupErr support_registry_notify_done(
    TSupRegNotificator *notificator );
#endif /* !NO_SUP_NOTIFICATOR */

/* ������� ��������� ������ �� ���� ������. */
_SUPPORT_DECL TSupErr support_error_text(
    TSupErr err, size_t *length, TCHAR *dest );

/* ������� ��������� ������ �� ������-�������. */
_SUPPORT_DECL TSupErr support_resource_string(
    TSupResourceInstance instance, size_t ids, TCHAR *dest, size_t *length );

/* ������� ��������� ������������ ���������� ������ �� ������� VersionInfo */
_SUPPORT_DECL TSupErr support_resource_version_string(
    TCHAR *target,
    TSupResourceInstance instance, TCHAR *dest, size_t *length );

/* ������� ��������� copyright �� ������-�������. */
_SUPPORT_DECL TSupErr support_resource_copyright(
    TSupResourceInstance instance, TCHAR *dest, size_t *length );

/* ������� ��������� �������� ������������� �� ������-�������. */
_SUPPORT_DECL TSupErr support_resource_company(
    TSupResourceInstance instance, TCHAR *dest, size_t *length );

/* ������� ��������� ������ ������ �� ������-�������. */
_SUPPORT_DECL TSupErr support_resource_version(
    TSupResourceInstance instance, unsigned int dest[4] );

/* ������� ��������� ������ �� ������-�������. */
_SUPPORT_DECL TSupErr support_resource_icon(
    TSupResourceInstance instance, size_t idi, TSupIcon *dest );

_SUPPORT_DECL TSupErr support_icon_free(
    TSupIcon bitmap );

/* ������� ��������� ������ �� ������-�������. */
_SUPPORT_DECL TSupErr support_resource_bitmap(
    TSupResourceInstance instance, size_t idi, TSupBitMap *dest );

_SUPPORT_DECL TSupErr support_bitmap_free(
    TSupBitMap bitmap );

_SUPPORT_DECL TSupErr support_path2dir(
    const TCHAR *src, size_t *length, TCHAR *dest );

_SUPPORT_DECL TSupErr support_opendir(
    const TCHAR *path, const TCHAR* wildcard, size_t *max_path,
    TSupFileEnum **ctx );

_SUPPORT_DECL TSupErr support_nextent(
    TSupFileEnum *ctx, TCHAR *name, TSupFileType *type );

_SUPPORT_DECL TSupErr support_closedir(
    TSupFileEnum *ctx );

#if 0
/* Thread-safe ���������� ������� strtok(). */
_SUPPORT_DECL TSupErr support_strtok(
    char *strToken, const char *strDelimit, char **strResult, char **strNext );

_SUPPORT_DECL TSupErr support_tcstok(
    TCHAR *strToken, const TCHAR *strDelimit, TCHAR **strResult, TCHAR **strNext );
#endif	/* 0 */
/* ������� ��������� �������������� �������� ������������. */
_SUPPORT_DECL TSupErr support_user_id(
    size_t *length, TCHAR *dest );

#if defined UNIX && !defined CSP_LITE
#include <unistd.h>
/* ������� ��������� �������������� �������� ������������. */
_SUPPORT_DECL TSupErr support_user_dir(
    size_t *length, TCHAR *dest );
/* ������� ��������� ��������������� �������� ������������. */
_SUPPORT_DECL TSupErr support_user_id_ex(
    size_t *length, TCHAR *dest,
    uid_t *euid,  uid_t *egid );

/* ������� ��������� ����� �������� ������������. */
_SUPPORT_DECL TSupErr support_impersonate_user_by_uids (
    uid_t euid,  uid_t egid );
#endif	/* UNIX && !CSP_LITE */

/* ������� ��������� ����� �������� ������������. */
_SUPPORT_DECL TSupErr support_user_name(
    TCHAR *dest, size_t *length );

/* ������� ��������� ����� �������� ������������. */
_SUPPORT_DECL TSupErr support_impersonate_user (
    const TCHAR *id );

/* ������� ����������� ��������� ������������. */
_SUPPORT_DECL TSupErr support_revert_to_self (void);

/* ������� ��������� ������� �������� �������. */
//_SUPPORT_DECL TSupErr
//support_compound_time(long long *lpCompoundCount);

/* ������� ��������� �������� �������. */
_SUPPORT_DECL TSupErr support_gettimeofday (
    support_timeval * stv);

/* ������� ��������� ��������� � �������� �������. */
_SUPPORT_DECL TSupErr support_time_set (
    support_timeval * tv_res, long secs);

/* ������� ��������� � ��������� �������. tv_res = tv1 - tv2 */
_SUPPORT_DECL TSupErr support_time_sub (
    const support_timeval * tv1, const support_timeval * tv2,
    support_timeval * tv_res, int* cmp);

/* ������� �������� �������. tv_res = tv1 + tv2 */
_SUPPORT_DECL TSupErr support_time_add (
    const support_timeval * tv1, const support_timeval * tv2,
    support_timeval * tv_res);

/* �������������� ������� �� timeval � ULONGLONG (filetime) */
#define TimevalToULongLong(cpc_timeval)		\
    (unsigned long long)(cpc_timeval.tv_sec*10000000ULL + cpc_timeval.tv_usec*10ULL + 116444736000000000ULL)

#ifndef CSP_LITE
    _SUPPORT_DECL TSupErr support_time2tm(
	support_timeval * tv_src, struct tm * tm_dest);

    _SUPPORT_DECL TSupErr support_tm2time(
	struct tm * tm_src, support_timeval * tv_dest );
#endif /* CSP_LITE */

#if defined _WIN32 && !defined CSP_LITE
    _SUPPORT_DECL TSupErr create_thread_same_rights(
	TSupFun fun, void* info, HANDLE *thread );

    _SUPPORT_DECL TSupErr descriptor_get_null(
	PSECURITY_DESCRIPTOR *ppSD );

    _SUPPORT_DECL TSupErr descriptor_free(
	PSECURITY_DESCRIPTOR pSD );
#endif /* _WIN32 && !CSP_LITE */

_SUPPORT_DECL int CRWLock_Initialize (CRWLock * lock, void *arg);
_SUPPORT_DECL TSupErr CRWLock_Cleanup (CRWLock * lock);
_SUPPORT_DECL TSupErr CRWLock_Claim (CRWLock * lock, CRWLockMode mode);
_SUPPORT_DECL TSupErr CRWLock_Release (CRWLock * lock, CRWLockMode mode);

#if !defined _WIN32
    _SUPPORT_DECL size_t safe_mbsrtowcs( wchar_t *dest,
	const char *src, size_t len);
    _SUPPORT_DECL size_t safe_wcsrtombs( char *dest,
	const wchar_t *src, size_t len);
#endif

TSupModuleInstance support_load_library_registry(
    const TCHAR *dll_name, int def );

void support_unload_library_registry(TSupModuleInstance handle);
TSupProc support_load_library_getaddr(TSupModuleInstance handle,
    const char *name);
TSupModuleInstance support_load_dll(TCHAR *path, int mode);
void support_unload_dll( TSupModuleInstance handle );

TSupErr support_registry_get_app_path(
    const TCHAR *path, size_t *length, TCHAR *dest );

TSupErr support_registry_get_app_path_ex(
    const TCHAR *path, size_t *length, TCHAR *dest, int do_not_use_this_file_path);

/* ��������� ����������. */
_SUPPORT_DECL TSupErr support_load_library( void );

/* �������� ����������. */
_SUPPORT_DECL void support_unload_library( void );

/* ����� ��� ������ CAdES �� Linux */
#if defined UNDER_CE || defined UNIX
# ifndef TLS_OUT_OF_INDEXES
#   define TLS_OUT_OF_INDEXES ((DWORD)0xFFFFFFFF)
# endif
#endif /* UNDER_CE || UNIX */

//��������� Windows CE
#ifdef UNDER_CE

# ifndef GetUserName
#   define GetUserName(x,y) GetUserNameEx(NameWindowsCeLocal,x,y)
# endif

# define GetConsoleOutputCP GetACP

# define LongToPtr( l )   ((VOID *)(LONG_PTR)((long)l))
# define ULongToHandle( ul ) ((HANDLE)(ULONG_PTR) (ul) )
# define UlongToHandle(ul) ULongToHandle(ul)
#endif /*UNDER_CE*/

#if !defined(SUPPORT_ALIGN)
#   define SUPPORT_ALIGN	16
#endif

#define support__empty__

#define support_align_var(type, var)                    \
    support_align_n(type, SUPPORT_ALIGN, var, support__empty__)

#define support_align_array(type, var, add)             \
    support_align_n(type, SUPPORT_ALIGN, var, add)

#if defined(_AIX)
	// �� �������� �� �����
#   define support_align_n(typ, alg, var, add)		\
	typ __align(alg) var add
#elif defined(__SUNPRO_C) || defined (__SUNPRO_CC)
	// �� �������� �� �����
#   define sa_da_pragma(p)	_Pragma(#p)
#   define support_align_n(typ, alg, var, add)		\
	sa_da_pragma(align alg ( var ))			\
	typ var add
#elif defined(__GNUC__)
	// �� �������� �� �����
#   define support_align_n(typ, alg, var, add)		\
	typ var add __attribute__ ((aligned (alg)))
#elif defined(_WIN32)
	// �������� �� �����
#   define support_align_n(typ, alg, var, add)		\
	__declspec(align(alg)) typ var add
#else
#   error "Can't support align"
#endif

#if defined(_AIX)
#   if defined(__STDC__) && defined __STDC_VERSION__ && __STDC_VERSION__ - 0 >= 199901L
#       define SUPPORT_RESTRICT restrict
#   else
#       define SUPPORT_RESTRICT __restrict
#   endif
#elif defined(__SUNPRO_C) || defined(__SUNPRO_CC)
#   if defined(__STDC__) && defined __STDC_VERSION__ && __STDC_VERSION__ - 0 >= 199901L
#       define SUPPORT_RESTRICT restrict
#   else
#       define SUPPORT_RESTRICT
#   endif
#elif defined(__GNUC__)
#   if defined(__STDC__) && defined __STDC_VERSION__ && __STDC_VERSION__ - 0 >= 199901L
#       define SUPPORT_RESTRICT restrict
#   else
#       define SUPPORT_RESTRICT __restrict
#   endif
#elif defined(_WIN32)
#   define SUPPORT_RESTRICT     __restrict
#else
#   error "Can't support restrict"
#endif

    /* ������� ���������� ������� */
enum support_mlockall_ {
    SUPPORT_MCL_CURRENT = 1,
    SUPPORT_MCL_FUTURE = 2
};
typedef int support_mlockall_t;	// TODO: �������� ����������� ����� �������� `|'

typedef enum support_mprotect_ {
    SUPPORT_PROT_EXEC,
    SUPPORT_PROT_NONE,
    SUPPORT_PROT_READ,
    SUPPORT_PROT_WRITE
} support_mprotect_t;

typedef enum support_mmap_ {
    SUPPORT_MAP_FIXED,
    SUPPORT_MAP_PRIVATE,
    SUPPORT_MAP_SHARED
} support_mmap_t;

#if defined CSP_LITE
    typedef long support_off_t;  // TODO: ����� ptrdiff_t ��� intptr_t (INT_PTR �� �������� ����)
#else
    #include <sys/types.h>

    typedef off_t support_off_t;
#endif

#define SUPPORT_MAP_FAILED  (NULL)

_SUPPORT_DECL int 
support_mlockall(support_mlockall_t flags);
_SUPPORT_DECL int 
support_munlockall(void); 
_SUPPORT_DECL support_mlockall_t 
support_get_mlockall(void); 
_SUPPORT_DECL void *
support_mmap(void *addr, size_t len, 
	     support_mprotect_t prot, support_mmap_t flags,
	     int fildes, support_off_t off);
_SUPPORT_DECL int 
support_munmap(void *addr, size_t len);
_SUPPORT_DECL int 
support_mprotect(void *addr, size_t len, support_mprotect_t prot);

#if !defined(CSP_LITE) && !defined(BUG_IN_KERNEL_SPACE_C)
# if defined(UNIX) 
    typedef uint16_t WIN_WCHAR_T;

    static SUP_INLINE 
    size_t support_utf16le_len(const WIN_WCHAR_T * src)
    {
	size_t n;
	for (n=0;src[n];n++)
	    ;
	return n;
    }

    static SUP_INLINE 
    size_t support_utf16le_nlen(const WIN_WCHAR_T * src, 
				size_t maxlen /* size in win_wchars */)
    {
	size_t n;
	for (n=0; n < maxlen && src[n];n++)
	    ;
	return n;
    }
    
    /* �������� ��������!
       �) ������ ����� �� ������ ���������� ��� ������, ������� �������������
       ����. � ���� ������ �� �������� ����� �������� ������ ���
       �������������� ���� ��� � ���, ��������� ��� ������ ������ �������
       ��������� "����� ������ ��� N ��������", ��������� ������ ��� N+1
       ��������, �� � �������� ����� ��������� ������ �������� N.
       �) ���� ���� �� ������������� ����������������� ������, �� ���������� �
       �������� ������� ����� ��� ��, ��� ������� � ������ �).
       �) � ���������� ���� ������� ������ � UTF-16LE ���������� � ��������, �
       ������ � ������ ���������� -- � ������.
       �) ���� ������� ��������, ��� �������� N ��������/����, �� ��� ������,
       ��� ��� �������� N ��������/���� + ������������� ���� (����� N+1
       ������/����).
       �) ����� �������� ������ (slen) ��������� ������������ �������. */
    _SUPPORT_DECL TSupErr 
    support_to_utf16le(
	const char * encoding, /* encoding or NULL (current locale) */
	WIN_WCHAR_T * dst, /* buffer to hold utf16 string or NULL to calculate*/
	size_t * pdlen, /* max size of message in win_wchars w/o terminating zero */
	const TCHAR * src, /* source string (encoded using encoding) */
	size_t slen /* max size of message in chars w/o terminating zero */
	);

    _SUPPORT_DECL TSupErr 
    support_from_utf16le(
	 const char * encoding, /* enconding or NULL (current locale) */
	 TCHAR * dst, /* Buffer to hold the string or NULL to calculate */ 
	 size_t * pdlen, /* max size of message in chars w/o terminating zero */
	 const WIN_WCHAR_T * src, /* utf16 string */ 
	 size_t slen /* max size of message in win_wchars w/o terminating zero */
	 );
# else /* defined(UNIX) */
    typedef wchar_t WIN_WCHAR_T;

#   define support_utf16le_len(src) wcslen(src)
#   define support_utf16le_nlen(src,maxlen) wcsnlen((src),(maxlen))

#   ifdef UNICODE
	TSupErr SUP_INLINE 
	support_to_utf16le(const char * encoding, 
			   WIN_WCHAR_T * dst, 
			   size_t * pdlen, 
			   const TCHAR * src, 
			   size_t slen)
	{
	    size_t len;
	    (void)(encoding); // TODO:XXX UNUSED(encoding);
	    if (pdlen == NULL || src == NULL)
		return SUP_ERR_PARAM;
	    // TODO: wcsncpy_s(dst, 1+*pdlen, src, slen+1);
	    len = wcsnlen(src, slen);
	    if (dst == NULL)
	    {
		*pdlen=len;
		return SUP_ERR_MEMORY;
	    }
	    if (*pdlen >= len)
	    {
		wcsncpy_s(dst, 1+*pdlen, src, len+1);
		return SUP_ERR_NO;
	    }
	    else
	    {
		wcscpy_s(dst, 1+*pdlen, src);
		return SUP_ERR_MEMORY;
	    }
	}

	TSupErr SUP_INLINE 
	support_from_utf16le(const char * encoding, 
			     TCHAR * dst, 
			     size_t * pdlen, 
			     const WIN_WCHAR_T * src, 
			     size_t slen)
	{
	    size_t len;
	    (void)(encoding); // TODO:XXX UNUSED(encoding);
	    if (pdlen == NULL || src == NULL)
		return SUP_ERR_PARAM;
	    // TODO: wcsncpy_s(dst, 1+*pdlen, src, slen+1);
	    len=wcsnlen(src,slen);
	    if (dst == NULL)
	    {
		*pdlen=len;
		return SUP_ERR_MEMORY;
	    }
	    if (*pdlen >= len) 
	    {
		wcsncpy_s(dst, 1+*pdlen, src, len+1);
		return SUP_ERR_NO;
	    }
	    else
	    {
		wcscpy_s(dst, 1+*pdlen, src);
		return SUP_ERR_MEMORY;
	    }
	}
#   else
	TSupErr SUP_INLINE 
	untested_support_to_utf16le(const char * encoding, 
				    WIN_WCHAR_T * dst, 
				    size_t * pdlen, 
				    const TCHAR * src, 
				    size_t slen)
	{
	    size_t alloclen = 0;
	    (void)(encoding); // TODO:XXX UNUSED(encoding);
	    (void)(slen); // TODO:XXX UNUSED(encoding);

	    if (pdlen == NULL || src == NULL)
		return SUP_ERR_PARAM;
	    if (dst) {
		alloclen = 1 + *pdlen;
	    }
	    if(mbstowcs_s(pdlen, dst, alloclen, src, alloclen-1) ||
		NULL == dst) {
		    return SUP_ERR_MEMORY;
	    }
	    return SUP_ERR_NO;
	}

	TSupErr SUP_INLINE 
	untested_support_from_utf16le(const char * encoding, 
				      TCHAR * dst, 
				      size_t * pdlen, 
				      const WIN_WCHAR_T * src, 
				      size_t slen)
	{
	    size_t alloclen = 0;
	    (void)(encoding); // TODO:XXX UNUSED(encoding);
	    (void)(slen); // TODO:XXX UNUSED(encoding);

	    if (pdlen == NULL || src == NULL)
		return SUP_ERR_PARAM;
	    if (dst) {
		alloclen = 1 + *pdlen;
	    }
	    if(wcstombs_s(pdlen, dst, alloclen, src, alloclen-1) ||
		NULL == dst) {
		return SUP_ERR_MEMORY;
	    }
	    return SUP_ERR_NO;
	}
#   endif
# endif /* defined(UNIX) */
#endif /* defined(CSP_LITE) */

#define SUPPORT_CSUM_BNAME_LEN 40
#define SUPPORT_CSUM_MNAME_LEN SUPPORT_CSUM_BNAME_LEN
#define SUPPORT_CSUM_HASH_LEN 32

_SUPPORT_DECL TSupErr support_register_checksum_block(
    const char * module_name,
    const char * block_name,
    const void * block_ptr,
    size_t block_length,
    const void * checksum);

_SUPPORT_DECL TSupErr support_unregister_checksum_block(
    const char * module_name,
    const void * block_ptr,
    size_t block_length);

_SUPPORT_DECL TSupErr support_is_checksum_block_registered(
    const char * module_name,
    const void * block_ptr,
    size_t block_length);

_SUPPORT_DECL TSupErr support_free_all_checksum_blocks(void);

_SUPPORT_DECL TSupErr support_register_csm_module(
    const char *module_name);

_SUPPORT_DECL TSupErr support_is_csm_module_registered(
    const char *module_name);

_SUPPORT_DECL TSupErr support_unregister_csm_module(
    const char *module_name);

typedef TSupErr _SUPPORT_CALLBACK_CONV support_checksum_callback_t (
    const char * module_name,
    const char * block_name,
    const void * block_ptr,
    size_t block_length,
    const void * checksum,
    void * arg);

_SUPPORT_DECL TSupErr support_verify_blocks(
    support_checksum_callback_t *callback, void * arg);  


#define support_len_of(a)    (sizeof(a)/sizeof((a)[0]))

//
// ��������� ���� ������/������ ��/� ������.
//

#define SRC_TIMEOUT (10)	// �������� ��������� �� ����, ��� ��� � 10 ���.

//
// ��� ������������� SUPPORT_REGISTRY_CACHE_DECL(CP, 0)
// ���������:
// #include "reader/ISO-IEC_TR_24731-1.h"
// #include "../../CSP/src/RuNetCSP/reality/stdlocks.h"
// #include "reader/support.h"
//

#define SRC_CPC_pCP_CALL_CTX		pCP_CALL_CTX
#define SRC_CPC_LOCK_OBJ		CPC_LOCK_OBJ
#define SRC_CPC_RWLOCK_INIT(pCC,pS,a)	CPC_RWLOCK_INIT(pCC,pS,a)
#define SRC_CPC_RWLOCK_RDLOCK(pCC,pS)	CPC_RWLOCK_RDLOCK(pCC,pS)
#define SRC_CPC_RWLOCK_WRLOCK(pCC,pS) 	CPC_RWLOCK_WRLOCK(pCC,pS) 
#define SRC_CPC_RWLOCK_UNLOCK(pCC,pS)	CPC_RWLOCK_UNLOCK(pCC,pS)
#define SRC_CPC_INTERLOCKED_CASL(pCC,plvD,S,C) \
					CPC_INTERLOCKED_CASL(pCC,plvD,S,C)
#define SRC_CPC_INTERLOCKED_INCREMENT(pCC,plvD) \
					CPC_INTERLOCKED_INCREMENT(pCC,plvD)
#define SRC_CPC_timeval			CPC_timeval
#define SRC_CPC_GET_TIME(pCC,pTV)	CPC_GET_TIME(pCC,pTV)

#define SRC_CP_pCP_CALL_CTX	struct { struct { CSP_BOOL fSerialize; } *hCSP; } *
#define SRC_CP_LOCK_OBJ			CPC_RWLOCK
#define SRC_CP_RWLOCK_INIT(pCC,pS,a)	rwlock_init((pS), sizeof(*(pS)), NULL)
#define SRC_CP_RWLOCK_RDLOCK(pCC,pS)	rwlock_rdlock(pS)
#define SRC_CP_RWLOCK_WRLOCK(pCC,pS)	rwlock_wrlock(pS)
#define SRC_CP_RWLOCK_UNLOCK(pCC,pS)	rwlock_unlock(pS)
#define SRC_CP_INTERLOCKED_CASL(pCC,plvD,S,C) \
				support_interlocked_CASL((plvD), (S), (C))
#define SRC_CP_INTERLOCKED_INCREMENT(pCC,plvD) \
				support_interlocked_increment(plvD)
#define SRC_CP_timeval			support_timeval
#define SRC_CP_GET_TIME(pCC,pTV)	(SUP_ERR_NO == support_gettimeofday(pTV))

#if !defined(CSP_LITE)	// CPCSP-4228 - �������� � ��������
	    // ������ ����� ���� �������.
	    // ������ �������� static �������� ������ ��� �����������.
	    // t == CP - �� ������������ pCP_CALL_CTX, � ���� ������ pCC 
	    //           ������ ���� ������ 0 (������� ������ CP);
	    // t == CPC - ������������ pCP_CALL_CTX (������� ������ CP�).
    #define SUPPORT_REGISTRY_CACHE_DECL(t, pCC) { \
	    SRC_##t##_pCP_CALL_CTX pCC_ = (pCC); \
	    static volatile LONG src_##t##_inited_ = 0; \
	    static CSP_BOOL src_cached_ok_ = FALSE; \
	    static SRC_##t##_LOCK_OBJ src_lock_; \
	    static SRC_##t##_timeval src_prev_ = { 0 };
		// ����������� ���������� ������

	    // ������ ������� �������� ���, ���������� �������� ��������� �� ������
	    // ����� ��� ����� ��������� �������������� ������
    #define SUPPORT_REGISTRY_CACHE_INVALIDATE_1(t)  \
	    SRC_##t##_timeval src_cur_ = { SRC_TIMEOUT, SRC_TIMEOUT }; \
	    CSP_BOOL src_##t##_use_ = FALSE; \
	    CSP_BOOL src_cache_ = FALSE; \
	    CSP_BOOL src_try_check_ = FALSE; \
	    int src_try_cnt_ = 3; \
	    \
	    do { \
		src_try_check_ = FALSE; \
		src_cache_ = FALSE; \
		src_##t##_use_ = (0 == pCC_ || pCC_->hCSP->fSerialize) \
				 && 0 < src_try_cnt_--; \
			/* ���� !fSerialize, �� CPC_RWLOCK_*LOCK */ \
			/* ����� ���������� ������, ������� �� */ \
			/* �������� */ \
			/* ��� 0 == pCC_, rwlock_*lock ����� ��� */ \
			/* void � ������� �� ���������� ������ */ \
		if(src_##t##_use_) { \
		    while(2 != src_##t##_inited_) { \
			if(SRC_##t##_INTERLOCKED_CASL(pCC_, &src_##t##_inited_, 1, 0)) { \
			    SRC_##t##_RWLOCK_INIT(pCC_, &src_lock_, CPC_RWLOCK_WAIT); \
			    SRC_##t##_INTERLOCKED_INCREMENT(pCC_, &src_##t##_inited_); \
			} \
		    } \
		    if(SRC_##t##_GET_TIME(pCC_, &src_cur_)) { \
			SRC_##t##_RWLOCK_RDLOCK(pCC_, &src_lock_);

	    // �������� ������� ��� ������� (cond).
	    // cond == FALSE - �������������� ��� ������ �� �������.
    #define SUPPORT_REGISTRY_CACHE_INVALIDATE_2(t, cond)  \
			    src_cache_ = src_cached_ok_ && \
			       src_cur_.tv_sec < src_prev_.tv_sec + SRC_TIMEOUT && \
			       src_cur_.tv_sec > src_prev_.tv_sec - SRC_TIMEOUT; \
			SRC_##t##_RWLOCK_UNLOCK(pCC_, &src_lock_); \
		    } \
		    if(!src_cache_ || (cond)) { \
			src_cache_ = FALSE; \
			SRC_##t##_RWLOCK_WRLOCK(pCC_, &src_lock_); \
			support_try \
			    if (src_cached_ok_) { \
				    /* ���� ����� ��� �� */ \
				    /* ������������� � ��������� */ \
				src_cached_ok_ = FALSE; \
				src_prev_.tv_sec = 0; 
				// ��������������� ���. �����������: return,
				// ���������� � ��.
				/*...*/

	    // ������ ������� �������� ���, �� ������� ��� �� ������� (cond).
	    // cond == FALSE - �������������� ��� ������ �� �������.
    #define SUPPORT_REGISTRY_CACHE_INVALIDATE(t, cond)  \
	    SUPPORT_REGISTRY_CACHE_INVALIDATE_1(t) \
	    SUPPORT_REGISTRY_CACHE_INVALIDATE_2(t, cond) \

	    // ������ ������� ��������� ���� (��������� ��������� � ������)
	    // � ������, ���� ������ ����������� ���� ���������������.
    #define SUPPORT_REGISTRY_CACHE_NOCACHE(t)  \
				/*...*/ \
			    } \
			support_finally \
			SRC_##t##_RWLOCK_UNLOCK(pCC_, &src_lock_); \
			support_finally_end; \
		    } \
		    /* ���� !src_cache_, �� ��� ������������� � */ \
		    /* ���� ������ */ \
		} \
		if(!src_##t##_use_ || !src_cache_) {
		    // �������� ������ � ������� ��� ������ ��� 
		    // ��������� ������. ���������: return, 
		    // ���������� � �.�.
		    /*...*/

	    // ������ ������� ���������� ������ ����������� �� �����������
	    // ��������� ���� (��������� ��������� � ������).
	    // ok == TRUE - ������ ��������� ������ �����������.
    #define SUPPORT_REGISTRY_CACHE_FILL(t, ok) \
		    /*...*/ \
		    if(src_##t##_use_ & (ok)) { \
			SRC_##t##_RWLOCK_WRLOCK(pCC_, &src_lock_); \
			support_try \
			    if (!src_cached_ok_) { \
				    /* ���� ����� ��� �� */ \
				    /* �������� � ��������� */ \
				src_cached_ok_ = FALSE; \
				src_prev_.tv_sec = 0; 
				// ���������� ���. �����������: return,
				// ���������� � ��.
				/*...*/

	    // ������ ������� ������������� ������ ����������� � ������ 
	    // ���� �������� ��� (�������� ��������� � ������) �� ����������.
    #define SUPPORT_REGISTRY_CACHE_CACHE(t) \
				/*...*/ \
				if(SRC_##t##_GET_TIME(pCC_, &src_prev_)) { \
				    src_cached_ok_ = TRUE; \
				} \
			    } \
			support_finally \
			SRC_##t##_RWLOCK_UNLOCK(pCC_, &src_lock_); \
			support_finally_end; \
		    } \
		} else if(src_##t##_use_) { \
			/* TODO: if(src_##t##_use_) ������������� � */ \
			/* assert(src_##t##_use_); */ \
		    SRC_##t##_RWLOCK_RDLOCK(pCC_, &src_lock_); \
		    support_try \
			if (!src_cached_ok_) { \
			        /* ���� ���-�� ���������� */ \
				/* ������������� ���, �� ������ */ \
			    src_try_check_ = TRUE; \
			} else {
			    // ������ ���. �����������: return,
			    // ���������� � ��.
			    /*...*/

	    // ��������� ����� ���� �������.
    #define SUPPORT_REGISTRY_CACHE_END(t) \
			    /*...*/ \
			} \
		    support_finally \
		    SRC_##t##_RWLOCK_UNLOCK(pCC_, &src_lock_); \
		    support_finally_end; \
		} \
	    } while(src_##t##_use_ && src_try_check_); \
	}
#else
    #define SUPPORT_REGISTRY_CACHE_DECL(t, pCC)         { int src_##t##_false_ = 0;
    #define SUPPORT_REGISTRY_CACHE_INVALIDATE(t, cond)  if(src_##t##_false_) {
    #define SUPPORT_REGISTRY_CACHE_NOCACHE(t)           } \
                                                        {
    #define SUPPORT_REGISTRY_CACHE_FILL(t, ok)          } \
                                                        if(src_##t##_false_) {
    #define SUPPORT_REGISTRY_CACHE_CACHE(t)
    #define SUPPORT_REGISTRY_CACHE_END(t)               }}
#endif

//
// �������� �������/������������ ����������. � ��� �� �� ������������ ��� 
// ������������� �������������� C++ ���������� � ��������.
//

#define SLR_DNTABR	(1)	// ���� � ������ DEBUG �� ����� �� ������ abort(),
				// ������ ������������ ���������.
#define SLR_NORMAL	(0)	// ��� DEBUG - ��������� � �������� � abort(), �
				// ��������� ������, ������ ���������.

typedef void(*slr_pfDestruct_t)(void *);
				// ��������� �� ������� ������������ ����������.

#if !defined(CSP_LITE) && defined UNIX && (SECURITY_LEVEL > KC1)
#define ENABLE_SLR_STACK
#endif

		// ������������ ������ ����������.
    void  support_lckrec_push_slr_impl(void *pvLock, slr_pfDestruct_t pfUnlock);
		// ������������ ������ ����������� ����������.
    void  support_lckrec_push_recursion_slr_impl(void *pvLock, 
    					slr_pfDestruct_t pfUnlock);
		// ������������ ������������ ����������.
    void  support_lckrec_pop_slr_impl(void *pvLock);
		// ���������, ��� � ����� ����������������� ����������
		// �� ������ uBottom �������.
    TSupErr support_lckrec_check_slr_impl(unsigned uDntAbr, unsigned uBottom);
		// ����������� ���������� ���������� �� ������ uBottom �������.
    TSupErr support_lckrec_flush_slr_impl(unsigned uDntAbr, unsigned uBottom);
		// ���������� ���������� ���������� ���������� � �����.
    unsigned support_lckrec_top_slr_impl(void);

#if defined (ENABLE_SLR_STACK)
    #define support_lckrec_push(pvLock, pfUnlock) \
	support_lckrec_push_slr_impl((pvLock), (pfUnlock))
    #define support_lckrec_push_recursion(pvLock, pfUnlock) \
	support_lckrec_push_recursion_slr_impl((pvLock), (pfUnlock))
    #define support_lckrec_pop(pvLock) \
	support_lckrec_pop_slr_impl((pvLock))
    #define support_lckrec_check(uDntAbr, uBottom) \
	support_lckrec_check_slr_impl((uDntAbr), (uBottom))
    #define support_lckrec_flush(uDntAbr, uBottom) \
	support_lckrec_flush_slr_impl((uDntAbr), (uBottom))
    #define support_lckrec_top() \
	support_lckrec_top_slr_impl()
#else
    static SUP_INLINE void support_lckrec_push(void *pvLock, slr_pfDestruct_t pfUnlock) {
        UNUSED(pvLock); 
        UNUSED(pfUnlock);
    }
    
    static SUP_INLINE void support_lckrec_push_recursion(void *pvLock, slr_pfDestruct_t pfUnlock) {
        UNUSED(pvLock); 
        UNUSED(pfUnlock);
    }
    
    static SUP_INLINE void support_lckrec_pop(void *pvLock) {
        UNUSED(pvLock);
    }
    
    static SUP_INLINE TSupErr support_lckrec_check(unsigned uDntAbr, unsigned uBottom) {
        UNUSED(uDntAbr); 
        UNUSED(uBottom); 
        return SUP_ERR_NO;
    }
    
    static SUP_INLINE TSupErr support_lckrec_flush(unsigned uDntAbr, unsigned uBottom) {
        UNUSED(uDntAbr); 
        UNUSED(uBottom); 
        return SUP_ERR_NO;
    }
    
    static SUP_INLINE unsigned  support_lckrec_top(void) {
        return 0;
    }
#endif // ENABLE_SLR_STACK

	// ������� ����������� ������������� �������� ����������
#if defined(DEBUG) || defined(_DEBUG)
    #define SLR_DEBUG_CHECK_TOP(uT) unsigned (uT) = support_lckrec_top()
    #define SLR_DEBUG_CHECK(uT)     (support_lckrec_check(SLR_NORMAL, (uT)))
#else
    #define SLR_DEBUG_CHECK_TOP(uT) unsigned (uT)
    #define SLR_DEBUG_CHECK(uT)     ((void)(uT))
#endif

/* _countof helper */
/* ����� �� protobuf/src/google/protobuf/stubs/common.h */
/* ��� ���� ��� ��������� GOOGLE_ARRAYSIZE */
#if !defined(_countof)
#if !defined(__cplusplus)
#define _countof(_Array) (sizeof(_Array) / sizeof(_Array[0]))
#else
#define _countof(a) \
  ((sizeof(a) / sizeof(*(a))) / \
   static_cast<size_t>(!(sizeof(a) % sizeof(*(a)))))
#endif
#endif	/* !_countof */

#if defined( __cplusplus )
}
#endif /* defined( __cplusplus ) */

#endif /* !defined( _READER_SUPPORT_SUPPORT_H ) */
/*+ end of file:$Id: support.h 179791 2018-08-20 15:22:59Z dedal $ +*/
