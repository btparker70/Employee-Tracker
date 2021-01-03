-- Drops the database if it already exists
DROP DATABASE IF EXISTS employees_db;

-- Create the DB "employee_db"
CREATE DATABASE employees_db;

-- Use the db for the rest of the script
USE employees_db;

-- Create table department
CREATE TABLE departments (
    id int AUTO_INCREMENT NOT NULL,
    name varchar(30) NOT NULL,
    PRIMARY KEY(id)
);

-- Create table roles
CREATE TABLE roles (
    id int AUTO_INCREMENT NOT NULL,
    title varchar(30) NOT NULL,
    salary DECIMAL(6,0),
    department_id int NOT NULL,
    PRIMARY KEY(id)
);

-- Create table employee
CREATE TABLE employees (
    id int AUTO_INCREMENT NOT NULL,
    first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
    role_id int NOT NULL,
    manager_id int,
    PRIMARY KEY(id)
);