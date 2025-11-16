#include <iostream>
#include "Book.h"
#include "User.h"
// #include "Transaction.h"

using namespace std;

int main()
{
    // ----------------- Load Users -----------------
    Users users;
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
    Books books;
    if (!books.loadFromCSV("books.csv"))
    {
        cout << "Failed to load books.csv\n";
    }
    else
    {
        cout << "Books loaded successfully:\n";
        cout << books.displayBooks() << endl;
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

    string searchName = "Trip";
    b = nullptr;
    b = books.findByIsbn(searchName);

    return 0;
}
