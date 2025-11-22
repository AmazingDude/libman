#include "Transaction.h"
#include "Book.h"
#include <fstream>
#include <sstream>
#include <iostream>
#include <ctime>
extern Books books;
string Transactions::getTodayDate() const
{
    time_t now = time(nullptr);
    tm *ltm = localtime(&now);

    char buf[11];
    strftime(buf, sizeof(buf), "%Y-%m-%d", ltm);
    return string(buf);
}

// ------------------- Transaction Class -------------------

Transaction::Transaction(int tID, int userId, int bookId,
                         const string &bDate, const string &rDate)
    : transactionId(tID), userId(userId), bookId(bookId),
      borrowDate(bDate), returnDate(rDate), next(nullptr) {}

// ------------------- Linked List Class -------------------

Transactions::Transactions() : head(nullptr), tail(nullptr), nextTransactionId(1) {}

Transactions::~Transactions()
{
    Transaction *temp = head;
    while (temp)
    {
        Transaction *nextNode = temp->next;
        delete temp;
        temp = nextNode;
    }
}

bool Transactions::loadFromCSV(const string &filename)
{
    ifstream file(filename);
    if (!file.is_open())
        return false;

    string line;
    getline(file, line);

    while (getline(file, line))
    {
        if (line.empty())
            continue;

        stringstream ss(line);
        string tID, bID, uID, bDate, rDate;

        getline(ss, tID, ',');
        getline(ss, bID, ',');
        getline(ss, uID, ',');
        getline(ss, bDate, ',');
        getline(ss, rDate, ',');

        int tid = stoi(tID);
        int bid = stoi(bID);
        int uid = stoi(uID);

        Transaction *t = new Transaction(tid, uid, bid, bDate, rDate);

        if (!head)
            head = tail = t;
        else
        {
            tail->next = t;
            tail = t;
        }
        if (tid >= nextTransactionId)
            nextTransactionId = tid + 1;
    }

    file.close();
    return true;
}

bool Transactions::saveToCSV(const string &filename)
{
    ofstream file(filename);
    if (!file.is_open())
        return false;

    file << "TransactionID,BookID,UserID,BorrowDate,ReturnDate\n";

    Transaction *temp = head;
    while (temp)
    {
        file << temp->transactionId << ","
             << temp->bookId << ","
             << temp->userId << ","
             << temp->borrowDate << ","
             << temp->returnDate << "\n";

        temp = temp->next;
    }

    file.close();
    return true;
}

bool Transactions::borrowTransaction(int userId, int bookId)
{
    Book *book = books.findById(bookId);
    if (!book || !book->available)
        return false;

    book->available = false;
    books.saveToCSV("books.csv");

    Transaction *t = new Transaction(nextTransactionId++, userId, bookId, getTodayDate(), "");
    if (!head)
        head = tail = t;
    else
        tail->next = t;
    tail = t;

    saveToCSV("transactions.csv");
    return true;
}

// return transaction
bool Transactions::returnbook(int userId, int bookId)
{
    extern Books books;

    Transaction *temp = head;

    while (temp)
    {
        if (temp->userId == userId &&
            temp->bookId == bookId &&
            temp->returnDate.empty())
        {
            temp->returnDate = getTodayDate();

            // Mark book as available
            Book *book = books.findById(bookId);
            if (book)
                book->available = true;

            // Save both CSV files
            books.saveToCSV("books.csv");
            saveToCSV("transactions.csv");

            cout << "Book returned successfully!\n";
            return true; // indicate success
        }
        temp = temp->next;
    }

    // If we reach here, no matching transaction was found
    cout << "Return failed: no matching transaction found.\n";
    return false; // indicate failure
}

// display function
string Transactions::displayTransactions() const
{
    if (!head)
        return "No transactions available.\n";

    string output;
    Transaction *temp = head;

    while (temp)
    {
        output += "TransactionID: " + to_string(temp->transactionId) +
                  " | UserID: " + to_string(temp->userId) +
                  " | BookID: " + to_string(temp->bookId) +
                  " | BorrowDate: " + temp->borrowDate +
                  " | ReturnDate: " + (temp->returnDate.empty() ? "Not Returned" : temp->returnDate) +
                  "\n";

        temp = temp->next;
    }

    return output;
}
