#include "Transaction.h"
#include <fstream>
#include <sstream>
#include <iostream>
#include <ctime>

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
        if (line.empty()) continue;

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


// borrowing book
void Transactions::borrowTransaction(int userId, int bookId)
{
        Book *book = books.findById(bookId);
    if (!book)
    {
        cout << "Book not found!\n";
        return;
    }

    if (!book->available)
    {
        cout << "Book is already borrowed!\n";
        return;
    }

    string today = getTodayDate();

    Transaction *t = new Transaction(
        nextTransactionId++,
        userId,
        bookId,
        today,    // borrowDate
        ""        // returnDate is currently empty
    );

    if (!head)
        head = tail = t;
    else
    {
        tail->next = t;
        tail = t;
    }
}

//return transaction
void Transactions::returnbook(int userId, int bookId)
{
    Transaction *temp = head;

    // Find unfinished borrow of this book
    while (temp)
    {
        if (temp->userId == userId &&
            temp->bookId == bookId &&
            temp->returnDate.empty()) // not returned yet
        {
            temp->returnDate = getTodayDate();

            Book *book = books.findById(bookId);//this will now look up the book
            if (book)//then it will set it to available again
                book->available = true;

            cout << "Book returned successfully!\n";
            return;
            
        }
        temp = temp->next;
    }
}


//display function
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
