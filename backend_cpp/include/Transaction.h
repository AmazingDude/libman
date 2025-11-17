#ifndef TRANSACTION_H
#define TRANSACTION_H

#include <string>
#include <ctime>
using namespace std;

class Transaction
{
public:
    int userId;
    int bookId;
    time_t timestamp;
    bool returned;
    Transaction *next;

    Transaction(int userId, int bookId, bool returned);
};

class Transactions
{
private:
    Transaction *head;
    Transaction *tail;

public:
    Transactions();
    ~Transactions(); // destructor

    bool loadFromCSV(const string &filename);
    bool saveToCSV(const string &filename);

    void borrowbook(int userId, int bookId);
    void returnbook(int userId, int bookId);

    string displayTransactions() const;

    string getTodayDate() const;
};

#endif
