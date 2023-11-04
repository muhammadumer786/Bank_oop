#! /usr/bin/env node
import { faker } from "@faker-js/faker";
import inquirer from "inquirer";
import chalk from "chalk";
// customer class
class Customer {
    firstName;
    lastName;
    age;
    gender;
    mobNumber;
    accNumber;
    constructor(fName, lName, age, gender, mob, acc) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mob;
        this.accNumber = acc;
    }
}
// class Bank
class Bank {
    customer = [];
    account = [];
    addCustomer(obj) {
        this.customer.push(obj);
    }
    addAccountNumber(obj) {
        this.account.push(obj);
    }
    transaction(accObj) {
        let newAccounts = this.account.filter(acc => acc.accNumber !== accObj.accNumber);
        this.account = [...newAccounts, accObj];
    }
}
let myBank = new Bank();
// customer Create
for (let i = 1; i <= 10; i++) {
    let fName = faker.person.firstName('male');
    let lName = faker.person.lastName();
    let num = parseInt(faker.phone.number());
    const cus = new Customer(fName, lName, 25 * i, "male", num, 1000 + i);
    myBank.addCustomer(cus);
    myBank.addAccountNumber({ accNumber: cus.accNumber, balance: 1000 * i });
}
// Bank functionality
async function bankService(Bank) {
    do {
        let service = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "Please select the Service",
            choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"]
        });
        // view balance
        if (service.select == "View Balance") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please enter your Account Number:",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.italic("Invalid Account Number"));
            }
            if (account) {
                let name = myBank.customer.find((item) => item.accNumber == account?.accNumber);
                console.log(`Dear ${chalk.green.italic(name?.firstName)} ${chalk.green.italic(name?.lastName)} your Account Balance is ${chalk.bold.blueBright(`$${account.balance}`)}`);
            }
        }
        // cash withdraw
        if (service.select == "Cash Withdraw") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please enter your Account Number:",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.italic("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Please enter your amount.",
                    name: "rupee",
                });
                if (ans.rupee > account.balance) {
                    console.log(chalk.red.bold("Insufficient Balance"));
                }
                let newBalance = account.balance - ans.rupee;
                // transaction method.
                Bank.transaction({ accNumber: account.accNumber, balance: newBalance });
            }
        }
        //  cash deposit
        if (service.select == "Cash Deposit") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please enter your Account Number:",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.italic("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Please enter your amount.",
                    name: "rupee",
                });
                let newBalance = account.balance + ans.rupee;
                // transaction method.
                Bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                console.log(newBalance);
            }
        }
        if (service.select == "Exit") {
            return;
        }
    } while (true);
}
bankService(myBank);
