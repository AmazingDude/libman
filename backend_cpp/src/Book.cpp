#include <iostream>
#include <fstream>
#include <sstream>
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

    Book(int i, const string &t, const string &a, const string &is, bool av)
        : id(i), title(t), author(a), isbn(is), available(av), next(nullptr) {}
};

class Books
{
private:
    Book *head;
    Book *tail;

public:
    Books() : head(nullptr), tail(nullptr) {}

    Book *findById(int id)
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

    Book *findByIsbn(const string &isbn)
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

    bool addBook(int id, const string &title, const string &author, const string &isbn, bool available)
    {
        if (findById(id) || findByIsbn(isbn))
            return false;
        Book *newBook = new Book(id, title, author, isbn, available);
        if (!head)
            head = tail = newBook;
        else
        {
            tail->next = newBook;
            tail = newBook;
        }
        return true;
    }

    bool loadFromCSV(const string &filename)
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
            bool available = (availabilityStr == "Available");
            addBook(id, title, author, isbn, available);
        }
        file.close();
        return true;
    }

    string displayBooks()
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

    string sortBooksByTitle(bool ascending = true)
    {
        if (!head || !head->next)
            return "Not enough books to sort.";
        for (Book *i = head; i; i = i->next)
            for (Book *j = i->next; j; j = j->next)
                if ((ascending && i->title > j->title) || (!ascending && i->title < j->title))
                    swapData(i, j);
        return ascending ? "Books sorted A → Z." : "Books sorted Z → A.";
    }

    string sortBooksById(bool ascending = true)
    {
        if (!head || !head->next)
            return "Not enough books to sort.";
        for (Book *i = head; i; i = i->next)
            for (Book *j = i->next; j; j = j->next)
                if ((ascending && i->id > j->id) || (!ascending && i->id < j->id))
                    swapData(i, j);
        return ascending ? "Books sorted by ID ascending." : "Books sorted by ID descending.";
    }

    string searchBookByName(const string &name)
    {
        string result;
        Book *temp = head;
        while (temp)
        {
            if (temp->title.find(name) != string::npos)
                result += "Found: " + temp->title + " by " + temp->author + "\n";
            temp = temp->next;
        }
        return result.empty() ? "No book found by that name." : result;
    }

    string searchBookById(int id)
    {
        Book *b = findById(id);
        return b ? "Found: " + b->title + " by " + b->author + " | ISBN: " + b->isbn
                 : "No book found with that ID.";
    }

    string searchBookByIsbn(const string &isbn)
    {
        Book *b = findByIsbn(isbn);
        return b ? "Found: " + b->title + " by " + b->author
                 : "No book found with that ISBN.";
    }

    string displayBooksOfAuthor(const string &author)
    {
        string result;
        Book *temp = head;
        while (temp)
        {
            if (temp->author == author)
                result += "ID: " + to_string(temp->id) + " | Title: " + temp->title + "\n";
            temp = temp->next;
        }
        return result.empty() ? "No books found by that author." : result;
    }

private:
    void swapData(Book *a, Book *b)
    {
        swap(a->id, b->id);
        swap(a->title, b->title);
        swap(a->author, b->author);
        swap(a->isbn, b->isbn);
        swap(a->available, b->available);
    }
};

int main()
{
    Books lib;
    if (!lib.loadFromCSV("books.csv"))
    {
        cout << "Failed to load books.\n";
        return 1;
    }

    cout << lib.displayBooks().substr(0, 500) << "...\n";
    cout << lib.sortBooksByTitle(true) << endl;
    cout << lib.searchBookById(5) << endl;
    cout << lib.searchBookByName("Trip") << endl;
    cout << lib.searchBookByIsbn("978-1-942185-85-7") << endl;
    cout << lib.displayBooksOfAuthor("Erin Dillon") << endl;
}
