/********************************************************
 * @author  Airead Fan <fgh1987168@gmail.com>		*
 * @date    2011 8月 27 11:48:03 CST			*
 ********************************************************
 *		after studying C 40 days		*
 *		after studying APUE 5 days		*
 ********************************************************/

/*
 * This program demonstrates function
 * long sysconf(int name);
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>

void print_config(char *sname,int iname);

int main(int argc, char *argv[])
{
	print_config("LINE_MAX", _SC_LINE_MAX);
	print_config("CLK_TCK", _SC_CLK_TCK);
}

void print_config(char *sname, int iname)
{
	fprintf(stdout, "%s: %ld\n", sname, sysconf(iname));
}
