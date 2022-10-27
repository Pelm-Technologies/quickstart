// Express server previewing how to best interact with common Pelm API endpoints
import express from 'express';
import fetch, { Headers } from 'node-fetch';
import dotenv from 'dotenv';
import session from 'express-session'
const app = express()
const port = 3001
dotenv.config()

// Enviornment variables stored in the .env file you created
const PELM_CLIENT_ID = process.env.PELM_CLIENT_ID
const PELM_SECRET = process.env.PELM_SECRET
const USER_ID = process.env.USER_ID


app.use(
  // We use session in lieu of a database in this example for convenience.
  // Instead use your own database to store values like the Authorization_Token
  session({ secret: "secret", saveUninitialized: true, resave: true })
);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const baseHeaders = {
  'Pelm-Client-Id': process.env.PELM_CLIENT_ID,
  'Pelm-Secret': process.env.PELM_SECRET
}

// Create connect_token
// API reference: https://docs.pelm.com/reference/post_auth-connect-token
app.post('/connect-token', async (req, res) => {

  // TODO: remove this
  // req.session.access_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJhdXRoLXNlcnZlciIsImNyZWF0ZWRfYXQiOjE2NTkzODE0NTguMDE5NzY5MiwidXNlciI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImNsaWVudF9pZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCJ9.mYv4h4e6CNNz8YeDinO6IgmVXwgQ1KIssa5Y3yWq7M2nMAJ\_-ZbRS6QCvFV8glhDYJ_zhlSM54QC9LWgMeRKAqebcj-McyYAxjsZZI6DlWjv-CxIkPnG0lODwOZW_8-IMDZMULyJkBmHDi3UoaCB-qYv0PIR94KbCGOA6ej3Srgy5vRV\_\_S0D-oRYdysYZszuiCf276VGYnIjFyYEYaLptBAYfPYXRfmf3EszBilL7yRGoqil0yUpiEg64tFo8QlSwfDNi7MSpUkgQy6YXxJRSdQIJszqvZjEqMfROBe3ncalOjIX8n8-THGpvIol914Uo9nJxJnYw7FL3syzhXUZQ'

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


// Get energy usage intervals
// API reference: https://docs.pelm.com/reference/get_intervals
app.post('/intervals', async (req, res) => {
  const accessToken = req.session.access_token
  const headers = new Headers(baseHeaders);
  headers.set('Authorization', 'Bearer ' + accessToken);
  const requestOptions = {
    method: 'GET',
    headers,
  };
  const url =
    'https://api.pelm.com/intervals?' +
    new URLSearchParams({
      account_id: req.body.intervalsAccountIdInput,
      type: req.body.intervalsType,
      start_date: req.body.intervalsStartDate,
      end_date: req.body.intervalsEndDate,
    });

  const response = await fetch(url, requestOptions);
  const data = await response.json()
  if (response.ok) {
    res.send(data)
  } else {
    res.status(500).send(data)
  }

  // fetch(url, requestOptions)
  //   .then((response) => {
  //     if (response.ok) {
  //       return response.json();
  //     } else {
  //       return response.text().then((text) => {
  //         throw new Error(text);
  //       });
  //     }
  //   })
  //   .then((data) => {
  //     // Return intervals data
  //     res.end(JSON.stringify(data));
  //   })
  //   .catch((err) => {
  //     res.status(500).send(JSON.parse(err.message).message)
  //   });

})


// Get Bills
// API reference: https://docs.pelm.com/reference/get_bills
app.post('/bills', async (req, res) => {
  const accessToken = req.session.access_token
  const headers = new Headers(baseHeaders);
  headers.set('Authorization', 'Bearer ' + accessToken);
  const requestOptions = {
    method: 'GET',
    headers,
  };
  const url = 'https://api.pelm.com/bills?account_id=' + req.body.billsAccountIdInput;

  const response = await fetch(url, requestOptions);
  const data = await response.json()
  if (response.ok) {
    res.send(data)
  } else {
    res.status(500).send(data)
  }

  // fetch(url, requestOptions)
  //   .then((response) => {
  //     if (response.ok) {
  //       return response.json();
  //     } else {
  //       return response.text().then((text) => {
  //         throw new Error(text);
  //       });
  //     }
  //   })
  //   .then((data) => {
  //     // Return bills data
  //     res.end(JSON.stringify(data));
  //   })
  //   .catch((err) => {
  //     res.status(500).send(JSON.parse(err.message).message)
  //   });
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
