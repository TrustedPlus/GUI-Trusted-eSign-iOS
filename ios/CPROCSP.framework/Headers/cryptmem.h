/*
 * Copyright(C) 2000 ������ ���
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

/*!
 * \file $RCSfile$
 * \version $Revision: 126987 $
 * \date $Date:: 2015-09-08 17:51:58 +0400#$
 * \author $Author: pav $
 *
 * \brief ��������� ������ ��������� ������.
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
/* end of file: $Id: cryptmem.h 126987 2015-09-08 13:51:58Z pav $ */
