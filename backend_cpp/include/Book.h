#ifndef BOOK_H
#define BOOK_H

#include <string>
using namespace std;

class Book
{
public:
    int id;
    string title;
    string author;
    string isbn;
    bool available;
    Book *next;

    Book(int id, const string &title, const string &author, const string &isbn, bool available);
};

class Books
{
private:
    Book *head;
    Book *tail;

public:
    Books();
    ~Books(); // destructor

    bool addBook(int id, const string &title, const string &author, const string &isbn, bool available);
    bool loadFromCSV(const string &filename);
    string displayBooks() const;
    void sortByTitle(bool ascending = true);
    Book *findById(int id);
    Book *findByIsbn(const string &isbn);
};

#endif
