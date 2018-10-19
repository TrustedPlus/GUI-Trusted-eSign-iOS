/*
 * Copyright(C) 2000 Проект ИОК
 *
 * Этот файл содержит информацию, являющуюся
 * собственностью компании Крипто Про.
 *
 * Любая часть этого файла не может быть скопирована,
 * исправлена, переведена на другие языки,
 * локализована или модифицирована любым способом,
 * откомпилирована, передана по сети с или на
 * любую компьютерную систему без предварительного
 * заключения соглашения с компанией Крипто Про.
 */

/*!
 * \file $RCSfile$
 * \version $Revision: 126987 $
 * \date $Date:: 2015-09-08 17:51:58 +0400#$
 * \author $Author: pav $
 *
 * \brief Краткое описание модуля.
 *
 * Подробное описание модуля.
 */

#ifndef _CMPMEM_H_INCLUDED
#define _CMPMEM_H_INCLUDED

#ifdef __cplusplus
extern "C" {
#endif

#define CMPMEMORY_TRUE 0xda61e537
#if !defined( CmpMemory )
extern int CmpMemory (LPCVOID pMemAddr1, LPCVOID pMemAddr2, DWORD dwCount);
#endif /* !defined( CmpMemory ) */

#ifdef __cplusplus
}
#endif

#endif /* _CMPMEM_H_INCLUDED */
