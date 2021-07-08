# CMS: Employee Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

## Description

This is a command-line application that provides a solution for easily managing a company's employees using node, the Inquirer package, and MySQL. It allows employers to view and manage different aspects of the departments, roles, and employees in their company. 

It allows users to add, delete, and view employees, roles, and departments, as well as updating roles and managers, or viewing departments budgets.
    
## Table of Contents
 - [Installation](#installation)
 - [Usage](#usage)
 - [License](#license)
 - [Questions](#questions)
    
    
## Installation

This application is run through the command-line. To use this application, clone and download the files from this repository. Additionally, run 'npm install' to install the packages included in the package.json (required packages are mysql, inquirer, dotenv, and console.table).

The trackerSeeds.sql file can be used to easily populate a MYSQL database. 
Create your own .env file to contain your database host, user, and password.
    
## Usage

Once everything is downloaded and installed (and the database has been created using the trackerSeeds.sql as a base), get the application running by typing "node employeeTracker.js" into the command-line. The application will then prompt you for what you would like to do. 

Cycle through the options by using the arrow keys and enter to select. View, add, or delete departments, roles, or employees — update employee roles and managers - or view department budgets. The application will update your database as you make changes.

*See a video of the application in use [here](https://www.awesomescreenshot.com/video/4416767?key=1689c0490c9d56ff02dba9aad1fd25e1).*


*View saved notes on the left, write new notes on the right, and save or start a new note by clicking the buttons in the upper-right-hand corner.*
![Screenshot of Application](asset/app.png)

## License

This project is licensed under [MIT License](https://opensource.org/licenses/MIT).

## Questions

See more of my work on my [GitHub Profile](https://github.com/msteblu/).
For any additional questions, reach me at my email: megan@steblay.net.