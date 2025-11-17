#include <iostream>
#include "Book.h"
#include "User.h"
#include "Transaction.h"

using namespace std;

// single global instances (definition)
Books books;
Users users;
Transactions transactions;

int main()
{
    // ----------------- Load Users -----------------
    if (!users.loadFromCSV("users.csv"))
    {
        cout << "Failed to load users.csv\n";
    }
    else
    {
        cout << "Users loaded successfully:\n";
        cout << users.displayUsers() << endl;
    }

    // ----------------- Load Books -----------------
    if (!books.loadFromCSV("books.csv"))
    {
        cout << "Failed to load books.csv\n";
    }
    else
    {
        cout << "Books loaded successfully:\n";
        cout << books.displayBooks() << endl;
    }

    // ----------------- Load Transactions -----------------
    if (!transactions.loadFromCSV("transactions.csv"))
    {
        cout << "No transactions loaded (file missing or empty).\n";
    }
    else
    {
        cout << "Transactions loaded successfully:\n";
        cout << transactions.displayTransactions() << endl;
    }

    // ----------------- Example Operations -----------------
    cout << "Sorting books by title (A → Z):\n";
    books.sortByTitle(true);
    cout << books.displayBooks() << endl;

    int searchId = 5;
    Book *b = books.findById(searchId);
    if (b)
    {
        cout << "Book with ID " << searchId << " found: " << b->title << " by " << b->author << endl;
    }
    else
    {
        cout << "Book with ID " << searchId << " not found.\n";
    }

    string searchIsbn = "Trip";
    b = books.findByIsbn(searchIsbn);
    if (b) cout << "Found by ISBN: " << b->title << endl;

    return 0;
}
