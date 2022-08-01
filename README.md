# Pelm quickstart

This repository accompanies Pelm's [**quickstart guide**](https://pelm.readme.io/reference/example-app).

## 1. Configuration

Clone the repository

```bash
git clone https://github.com/Pelm-Technologies/quickstart.git
cd quickstart
```

Install dependencies
```bash
npm install
```

## 2. Fill our your variables in constants.ts

Set `environment` to `sandbox` if you want to run the app with fake data. Set to `prod` if you want to run the app with real production data.

`Pelm-Client-Id` and `Pelm-Secret` are given to you when you registered.

`user_id` is the id you want to associate with the `User` who is going through Connect.

## 3. Run the Quickstart

From the quickstart folder, run:
```bash
npm start
```
