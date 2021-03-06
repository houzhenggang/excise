/**
 * @file 7.13.8.b.cc
 * @brief 
 * @author Airead Fan <fgh1987168@gmail.com>
 * @date 2013/04/20 15:09:42
 */

/*
  在不使用 array 类的情况下完成程序清单7.15所做的工作。编写两个这样的版本：

  a. 使用 const char *数组存储表示季度名称的字符串，并使用 double 数组
  存储开支。

  b. 使用 const char *数组存储表示季度名称的字符串，并使用 一个结构，该
  结构只有一个成员——一个用于存储开支的 double 数组。这种设计与使用
  array 类的基本设计类似。
 */

#include <iostream>

const int Seasons = 4;
const char *Snames[] = {
    "Spring", "Summer", "Fall", "Winter"    
};

struct expenses {
    double d[Seasons];
};

void fill(expenses *pa)
{
    using namespace std;

    for (int i = 0; i < Seasons; i++) {
        cout << "Enter " << Snames[i] << " expenses: ";
        cin >> (*pa).d[i];
    }
}

void show(expenses da)
{
    using namespace std;
    double total = 0.0;
    cout << "\nEXPENSES\n";
    for (int i = 0; i < Seasons; i++) {
        cout << Snames[i] << ": $" << da.d[i] << endl;
        total += da.d[i];
    }
    cout << "Total Expenses: $" << total << endl;
}

int main(int argc, char *argv[])
{
    expenses ex;

    fill(&ex);
    show(ex);

    return 0;
}
