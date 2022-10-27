// Express server previewing how to best interact with common Pelm API endpoints
import express from 'express';
import cors from 'cors';
import fetch, { Headers } from 'node-fetch';
import dotenv from 'dotenv';
import session from 'express-session'
import path, { dirname } from "path";
import { fileURLToPath } from 'url';

const app = express()
const port = 3001
dotenv.config()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(
  // We use session in lieu of a database in this example for convenience.
  // Instead use your own database to store values like the Authorization_Token
  session({ secret: "secret", saveUninitialized: true, resave: true })
);

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve index.html
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const baseHeaders = {
  'Pelm-Client-Id': process.env.PELM_CLIENT_ID,
  'Pelm-Secret': process.env.PELM_SECRET
}

// Create connect_token
// API reference: https://docs.pelm.com/reference/post_auth-connect-token
app.post('/connect-token', async (req, res) => {
  const headers = new Headers(baseHeaders);
  const encodedParams = new URLSearchParams();
  encodedParams.set('user_id', process.env.USER_ID);
  const requestOptions = {
    method: 'POST',
    headers,
    body: encodedParams,
  };

  const response = await fetch('https://api.pelm.com/auth/connect-token', requestOptions);
  const data = await response.json()
  if (response.ok) {
    res.json({
      'connect_token': data['connect_token']
    })
  } else {
    res.status(500).send(data)
  }
})

// Create access_token
// API reference: https://docs.pelm.com/reference/post_auth-token-1
app.post('/authorization', async (req, res) => {
  const headers = new Headers(baseHeaders);
  const encodedParams = new URLSearchParams();
  encodedParams.set('code', req.body.authorization_code);
  const requestOptions = {
    method: 'POST',
    headers,
    body: encodedParams,
  };

  const response = await fetch('https://api.pelm.com/auth/token', requestOptions);
  const data = await response.json()
  if (response.ok) {
    // We recommend securely saving your access_token to your database. We're saving to session here for convenience.
    req.session.access_token = data.access_token
    // Use the access_token to make requests for a given User's energy data
    res.json({
      'is_successful': true
    })
  } else {
    res.status(500).send(data)
  }
})

// Get Accounts
// API reference: https://docs.pelm.com/reference/get_accounts
app.post('/accounts', async (req, res) => {
  const accessToken = req.session.access_token
  const headers = new Headers(baseHeaders);
  headers.set('Authorization', 'Bearer ' + accessToken);

  const requestOptions = {
    method: 'GET',
    headers,
  };

  const response = await fetch('https://api.pelm.com/accounts', requestOptions);
  const data = await response.json()
  if (response.ok) {
    res.send(data)
  } else {
    res.status(500).send(data)
  }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
