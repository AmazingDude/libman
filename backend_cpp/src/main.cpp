#include <iostream>
#include <string>
#include "Book.h"
#include "User.h"
#include "Transaction.h"

using namespace std;

Books books;
Users users;
Transactions transactions;

void loadAll()
{
    books.loadFromCSV("data/books.csv");
    users.loadFromCSV("data/users.csv");
    transactions.loadFromCSV("data/transactions.csv");
}

void saveAll()
{
    books.saveToCSV("data/books.csv");
    users.saveToCSV("data/users.csv");
    transactions.saveToCSV("data/transactions.csv");
}

int main(int argc, char *argv[])
{

    loadAll();

    if (argc < 2)
    {
        cout << "No command provided.\n";
        return 0;
    }

    string command = argv[1];

    // ---------- BOOK COMMANDS ----------
    if (command == "list_books")
    {
        cout << books.displayBooks();
    }

    else if (command == "add_book")
    {
        if (argc < 6)
        {
            cout << "Usage: add_book <id> <title> <author> <isbn>\n";
            return 0;
        }

        int id = stoi(argv[2]);
        string title = argv[3];
        string author = argv[4];
        string isbn = argv[5];

        if (books.addBook(id, title, author, isbn, true))
            cout << "Book added.\n";
        else
            cout << "Failed to add book.\n";
    }

    // ---------- USER COMMANDS ----------
    else if (command == "list_users")
    {
        cout << users.displayUsers();
    }

    else if (command == "add_user")
    {
        if (argc < 5)
        {
            cout << "Usage: add_user <id> <name> <phone>\n";
            return 0;
        }

        int id = stoi(argv[2]);
        string name = argv[3];
        string phone = argv[4];

        if (users.addUser(id, name, phone))
            cout << "User added.\n";
        else
            cout << "Failed to add user.\n";
    }

    // ---------- TRANSACTION COMMANDS ----------
    else if (command == "borrow_book")
    {
        if (argc < 4)
        {
            cout << "Usage: borrow_book <userId> <bookId>\n";
            return 0;
        }

        if (transactions.borrowTransaction(stoi(argv[2]), stoi(argv[3])))
            cout << "Book borrowed.\n";
        else
            cout << "Borrow failed.\n";
    }

    else if (command == "return_book")
    {
        if (argc < 4)
        {
            cout << "Usage: return_book <userId> <bookId>\n";
            return 0;
        }

        if (transactions.returnbook(stoi(argv[2]), stoi(argv[3])))
            cout << "Book returned.\n";
        else
            cout << "Return failed.\n";
    }

    else if (command == "list_transactions")
    {
        cout << transactions.displayTransactions();
    }

    else
    {
        cout << "Unknown command.\n";
    }

    saveAll();
    return 0;
}
