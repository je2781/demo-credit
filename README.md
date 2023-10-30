---
title: Democredit
description: lending app
author: Joshua Eze
created:  2023 Oct 29
updated: 2023 Oct 30
---

Democredit
=========

## development
I started with the views, then moved onto the api design, and finished off with the test suites. To manage authentication I used a stateful data storage system (sessions/cookies), rather than tokens, because the views are being served to the client.

I also used a rendering template to design a frontend for the service, so all endpoints return a view.

## How to run the app

Run (npm run start:dev) from the main directory to compile for development. To test, navigate to the respective tests sub-folder and run (npm t 'name of test script'). The approach of executing individual test suites, is to mitigate jest tendency not to follow order in test execution. Tests that require asynchronous processes, like database connection, execute concurrently with other tests. That means multiple tests could be accessing the database at the same time, which could increase the test time.

Running all test suites at the same time, would require a large test timeout (because of tests accessing the database at the same time), and the test time would be prolonged. Some tests will also fail by timing out, or failing to access the database. 

__Make sure you have MySQL community server/workbench installed, and update the database from the db directory using (npx knex migrate:latest --env testing), to create the testing tables on MySQl local instance__

## The Database and relationships

The knexjs ORM was used to translate queries for MySql(on local machine), and PlanetScale (for production). The migrations created were users, and transfers; which housed the user data, and user transfer data. PlanetScale doesn't allow foreign key constraints, so I improvised, by inserting the user_id into the transfers table, for every user transfer. See E-R diagram below for relationships between the entities.

[![demo credit ER diagram](/demo_credit.drawio.png?raw=true)](#erdiagram)

## Deployment

Heroku was used for deployment (see production URL below), while the cloudinary nodejs sdk was used to upload/download user images, as Heroku doesn't store user generated files.

https://joshua-eze-lendsqr-be-test-d68fed4092b4.herokuapp.com.




