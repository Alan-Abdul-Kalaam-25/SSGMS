# MongoDB Atlas Setup Guide

## 1. Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/atlas
2. Click "Try Free" or "Get Started Free"
3. Sign up with email or Google account

## 2. Create a Cluster

1. After login, click "Build a Database"
2. Choose "FREE" tier (M0 Sandbox)
3. Select a cloud provider (AWS recommended)
4. Choose a region close to you
5. Click "Create"

## 3. Create Database User

1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `ssgms-user` (or any name you prefer)
5. Password: Generate a secure password (save this!)
6. Database User Privileges: Select "Read and write to any database"
7. Click "Add User"

## 4. Set Network Access

1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (adds 0.0.0.0/0)
4. Click "Confirm"

## 5. Get Connection String

1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `myFirstDatabase` with `ssgms`

Final string should look like:
mongodb+srv://ssgms-user:yourpassword@cluster0.abcde.mongodb.net/ssgms?retryWrites=true&w=majority
