#include "User.h"
#include <fstream>
#include <sstream>
#include <iostream>

User::User(int id, const string &name, const string &phone)
    : id(id), name(name), phone(phone), next(nullptr) {}

// ------------------- Users class -------------------

Users::Users() : head(nullptr), tail(nullptr) {}

Users::~Users()
{
    // Destructor
    User *temp = head;
    while (temp)
    {
        User *nextUser = temp->next;
        delete temp;
        temp = nextUser;
    }
}

void Users::addUser(int id, const string &name, const string &phone)
{
    // Checking the cin for duplicates
    if (findById(id))
        return;

    User *u = new User(id, name, phone);
    if (!head)
    {
        head = tail = u;
    }
    else
    {
        tail->next = u;
        tail = u;
    }
}

bool Users::loadFromCSV(const string &filename)
{
    std::ifstream file(filename);
    if (!file.is_open())
        return false;

    string line;
    getline(file, line);

    while (getline(file, line))
    {
        if (line.empty())
            continue;

        stringstream ss(line);
        string idStr, name, phone;

        getline(ss, idStr, ',');
        getline(ss, name, ',');
        getline(ss, phone, ',');

        if (idStr.empty() || name.empty())
            continue;

        addUser(stoi(idStr), name, phone);
    }

    file.close();
    return true;
}

bool Users::saveToCSV(const string &filename)
{
    std::ofstream file(filename);
    if (!file.is_open())
        return false;

    file << "id,name,phone\n";

    User *temp = head;
    while (temp)
    {
        file << temp->id << ","
             << temp->name << ","
             << temp->phone << "\n";
        temp = temp->next;
    }

    file.close();
    return true;
}


string Users::displayUsers() const
{
    if (!head)
        return "No users available.\n";

    string result;
    User *temp = head;
    while (temp)
    {
        result += "ID: " + to_string(temp->id) +
                  " | Name: " + temp->name +
                  " | Phone: " + temp->phone + "\n";
        temp = temp->next;
    }
    return result;
}

User *Users::findById(int id)
{
    User *temp = head;
    while (temp)
    {
        if (temp->id == id)
            return temp;
        temp = temp->next;
    }
    return nullptr;
}

User *Users::findByName(const string &name)
{
    User *temp = head;
    while (temp)
    {
        if (temp->name == name)
            return temp;
        temp = temp->next;
    }
    return nullptr;
}
