#include "Book.h"
#include <fstream>
#include <sstream>
#include <iostream>
#include <algorithm>

Book::Book(int id, const string &title, const string &author, const string &isbn, bool available)
    : id(id), title(title), author(author), isbn(isbn), available(available), next(nullptr) {}

// ------------------- Books class -------------------

Books::Books() : head(nullptr), tail(nullptr) {}

Books::~Books()
{
    // Destructor
    Book *temp = head;
    while (temp)
    {
        Book *nextBook = temp->next;
        delete temp;
        temp = nextBook;
    }
}

bool Books::addBook(int id, const string &title, const string &author, const string &isbn, bool available)
{
    if (findById(id) || findByIsbn(isbn))
        return false; // already exists

    Book *newBook = new Book(id, title, author, isbn, available);
    if (!head)
    {
        head = tail = newBook;
    }
    else
    {
        tail->next = newBook;
        tail = newBook;
    }
    return true;
}

bool Books::loadFromCSV(const string &filename)
{
    ifstream file(filename);
    if (!file.is_open())
        return false;

    string line;
    getline(file, line); // skip header

    while (getline(file, line))
    {
        if (line.empty())
            continue;

        stringstream ss(line);
        string idStr, title, author, isbn, availabilityStr;

        getline(ss, idStr, ',');
        getline(ss, title, ',');
        getline(ss, author, ',');
        getline(ss, isbn, ',');
        getline(ss, availabilityStr, ',');

        if (idStr.empty() || isbn.empty())
            continue;

        int id = stoi(idStr);
        bool available = (availabilityStr == "Available" || availabilityStr == "available" || availabilityStr == "1");

        addBook(id, title, author, isbn, available);
    }

    file.close();
    return true;
}

string Books::displayBooks() const
{
    if (!head)
        return "No books available.\n";

    string result;
    Book *temp = head;
    while (temp)
    {
        result += "ID: " + to_string(temp->id) +
                  " | Title: " + temp->title +
                  " | Author: " + temp->author +
                  " | ISBN: " + temp->isbn +
                  " | Availability: " + (temp->available ? "Available" : "Borrowed") + "\n";
        temp = temp->next;
    }
    return result;
}

Book *Books::findById(int id)
{
    Book *temp = head;
    while (temp)
    {
        if (temp->id == id)
            return temp;
        temp = temp->next;
    }
    return nullptr;
}

Book *Books::findByIsbn(const string &isbn)
{
    Book *temp = head;
    while (temp)
    {
        if (temp->isbn == isbn)
            return temp;
        temp = temp->next;
    }
    return nullptr;
}

// Sort books by title (simple bubble sort)
void Books::sortByTitle(bool ascending)
{
    if (!head || !head->next)
        return;

    for (Book *i = head; i != nullptr; i = i->next)
    {
        for (Book *j = i->next; j != nullptr; j = j->next)
        {
            if ((ascending && i->title > j->title) || (!ascending && i->title < j->title))
            {
                // swap data, not nodes
                swap(i->id, j->id);
                swap(i->title, j->title);
                swap(i->author, j->author);
                swap(i->isbn, j->isbn);
                swap(i->available, j->available);
            }
        }
    }
}
