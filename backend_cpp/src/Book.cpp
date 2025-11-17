#include "Book.h"
#include <fstream>
#include <sstream>
#include <iostream>
#include <algorithm>

Book::Book(int id, const string &title, const string &author, const string &isbn, bool available)
    : id(id), title(title), author(author), isbn(isbn), available(available), next(nullptr) {}


Books::Books() : head(nullptr), tail(nullptr) {}

Books::~Books()
{
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
        return false;

    Book *newBook = new Book(id, title, author, isbn, available);

    if (!head)
        head = tail = newBook;
    else {
        tail->next = newBook;
        tail = newBook;
    }
    saveToCSV("books.csv");
    return true;
}
bool Books::loadFromCSV(const string &filename)
{
    ifstream file(filename);
    if (!file.is_open())
        return false;

    string line;
    getline(file, line); 

    while (getline(file, line)) {
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
    Book *newBook = new Book(id, title, author, isbn, available);
    if (!head)
        head = tail = newBook;
    else {
    tail->next = newBook;
    tail = newBook;
    }
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
Book* Books::split(Book* head) {
    Book* fast = head;
    Book* slow = head;

    while (fast->next && fast->next->next) {
        fast = fast->next->next;
        slow = slow->next;
    }

    Book* second = slow->next;
    slow->next = nullptr;
    return second;
}
Book* Books::mergeLists(Book* first, Book* second, bool ascending) {
    if (!first) return second;
    if (!second) return first;

    bool condition = ascending ? (first->title < second->title)
                               : (first->title > second->title);

    if (condition) {
        first->next = mergeLists(first->next, second, ascending);
        return first;
    } else {
        second->next = mergeLists(first, second->next, ascending);
        return second;
    }
}
Book* Books::mergeSort(Book* head, bool ascending) {
    if (!head || !head->next)
        return head;

    Book* second = split(head);

    head = mergeSort(head, ascending);
    second = mergeSort(second, ascending);

    return mergeLists(head, second, ascending);
}
void Books::sortByTitle(bool ascending)
{
    head = mergeSort(head, ascending);
    tail = head;
    if (tail) {
        while (tail->next)
            tail = tail->next;
    }
}
bool Books::saveToCSV(const string &filename) const
{
    ofstream file(filename);
    if (!file.is_open())
        return false;

    file << "ID,Title,Author,ISBN,Availability\n";

    Book *temp = head;
    while (temp)
    {
        file << temp->id << ","
             << temp->title << ","
             << temp->author << ","
             << temp->isbn << ","
             << (temp->available ? "Available" : "Borrowed") << "\n";

        temp = temp->next;
    }

    file.close();
    return true;
}