---
title: Democredit
description: credit infrastructure for lenders
author: Joshua Eze
created:  2023 Oct 29

---

Democredit
=========

## Getting started with Democredit

To manage authentication I used a stateful data storage system (sessions/cookies), rather than tokens. 
It's preferable, when making a small app that doesn't require users' activity and data being recorded infinitely.

## How to run the app

I also used a rendering template to design a frontend for the service, so not all endpoints return json.
Run (npm start) from the main directory to compile for dev. To test run (npm t). While running tests, the timeout had to be set at 800s because of the multiple CRUD operations performed on the database. The tests for transfers, withdraws, and deposits would have taken 15mins to complete, so only tests for transfer is performed.

## The Database and relationships

The knexjs ORM was used to translate queries for local MySql and PlanetScale (for production). The migrations created were users, and transfers, to house the user data, and user transfer data. See below for the relationships between the entities in the databse.

[![demo credit ER diagram](/demo_credit.drawio.png?raw=true)](#erdiagram)


