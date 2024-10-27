const fs = require('fs');
const readline = require('readline');
const path = require('path');

class ContactBook {
    constructor() {
        this.contacts = this.loadContacts();
    }

    addContact(name, phone) {
        this.contacts.push({ name, phone });
        this.saveContacts();
    }

    searchContact(query) {
        return this.contacts.filter(contact => contact.name.includes(query) || contact.phone.includes(query));
    }

    sortContacts() {
        this.contacts.sort((a, b) => a.name.localeCompare(b.name));
        this.saveContacts();
    }

    saveContacts() {
        const filePath = path.join(__dirname, 'data', 'contacts.json');
        fs.writeFileSync(filePath, JSON.stringify(this.contacts, null, 2));
    }

    loadContacts() {
        const filePath = path.join(__dirname, 'data', 'contacts.json');
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath);
            return JSON.parse(data);
        }
        return [];
    }
}

const contactBook = new ContactBook();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function mainMenu() {
    console.log('1. Add Contact');
    console.log('2. Search Contact');
    console.log('3. Sort Contacts');
    console.log('4. View All Contacts');
    console.log('5. Exit');
    rl.question('Choose an option: ', (option) => {
        switch (option) {
            case '1':
                rl.question('Enter name: ', (name) => {
                    rl.question('Enter phone: ', (phone) => {
                        contactBook.addContact(name, phone);
                        console.log('Contact added.');
                        mainMenu();
                    });
                });
                break;
            case '2':
                rl.question('Enter search query: ', (query) => {
                    const results = contactBook.searchContact(query);
                    console.log('Search Results:', results);
                    mainMenu();
                });
                break;
            case '3':
                contactBook.sortContacts();
                console.log('Contacts sorted.');
                mainMenu();
                break;
            case '4':
                console.log('All Contacts:', contactBook.contacts);
                mainMenu();
                break;
            case '5':
                rl.close();
                break;
            default:
                console.log('Invalid option. Please try again.');
                mainMenu();
                break;
        }
    });
}

mainMenu();