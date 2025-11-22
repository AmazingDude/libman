#ifndef TRANSACTION_H
#define TRANSACTION_H

#include <string>
using namespace std;

class Transaction
{
public:
    int transactionId;
    int userId;
    int bookId;
    string borrowDate;
    string returnDate;
    Transaction *next;

    // Match the constructor used in Transaction.cpp
    Transaction(int tID, int userId, int bookId, const string &bDate, const string &rDate);
};

class Transactions
{
private:
    Transaction *head;
    Transaction *tail;
    int nextTransactionId; // used in Transaction.cpp

public:
    Transactions();
    ~Transactions(); // destructor

    bool loadFromCSV(const string &filename);
    bool saveToCSV(const string &filename);

    // Name must match implementation
    bool borrowTransaction(int userId, int bookId);
    bool returnbook(int userId, int bookId);

    string displayTransactions() const;

    string getTodayDate() const;
};

#endif
