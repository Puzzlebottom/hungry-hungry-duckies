# GETTING YOUR BACKEND RUNNING

INSTALL BACKEND DEPENDENCIES

`cd backend`</br>
`npm i`

CREATE .ENV FILE AND PROVISION DATABASE

Copy `.env.example` to a new file `.env`.</br>
Create a database and make sure that you add your local settings to `.env`

BUILD AND SEED YOU TABLES

`npm run db:reset`</br>
Seeding the tables isn't necessary for function.

RUN THE SERVER

`npm run start`</br>
You're good to go!

[Head back to the main README](../README.md)
