#ifndef USER_H
#define USER_H

#include <string>
using namespace std;

class User
{
public:
    int id;
    string name;
    string phone;
    User *next;

    User(int id, const string &name, const string &phone);
};

class Users
{
private:
    User *head;
    User *tail;

public:
    Users();
    ~Users(); // destructor

    bool addUser(int id, const string &name, const string &phone);
    bool loadFromCSV(const string &filename);
    bool saveToCSV(const string &filename); // <-- ADD THIS
    string displayUsers() const;
    User *findById(int id);
    User *findByName(const string &name);
};

#endif
