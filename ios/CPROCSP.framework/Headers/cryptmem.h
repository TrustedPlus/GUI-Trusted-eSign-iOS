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
 * \version $Revision: 148173 $
 * \date $Date:: 2016-11-07 00:01:43 +0400#$
 * \author $Author: raa $
 *
 * \brief Интерфейс модуля выделения памяти.
 */

#ifndef _CRYPTMEM_H_INCLUDED
#define _CRYPTMEM_H_INCLUDED

#ifdef __cplusplus
extern "C" {
#endif

LPVOID SSPAPAllocMemory (ULONG dwSize);
CSP_BOOL   SSPAPFreeMemory (VOID *pMem);

LPVOID CPSUPAllocMemory (size_t dwSize);
CSP_BOOL   CPSUPFreeMemory (VOID *pMem);

CSP_BOOL CPSUPInitMemory (void);
void CPSUPDoneMemory (void);

#ifdef USE_STATIC_ANALYZER
#   define AllocMemory(dwSize)	calloc(dwSize, 1)
#   define FreeMemory(pMem)	free(pMem)
#else
#   ifdef _CP_SSP_AP_
#	define AllocMemory SSPAPAllocMemory
#	define FreeMemory  SSPAPFreeMemory
#   else
#	define AllocMemory CPSUPAllocMemory
#	define FreeMemory  CPSUPFreeMemory
#   endif
#endif

#define InitMemory CPSUPInitMemory
#define DoneMemory CPSUPDoneMemory

#ifdef __cplusplus
}
#endif

#endif /* _CRYPTMEM_H_INCLUDED */
/* end of file: $Id: cryptmem.h 148173 2016-11-06 20:01:43Z raa $ */
