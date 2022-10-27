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

// Enviornment variables stored in the .env file you created
const PELM_CLIENT_ID = process.env.PELM_CLIENT_ID
const PELM_SECRET = process.env.PELM_SECRET
const USER_ID = process.env.USER_ID


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
    console.log("response ok")
    res.json({
      'connect_token': data['connect_token']
    })
  } else {
    console.log("response not ok")
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

  console.log("response")
  console.log(response)
  console.log(data)

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

  // await fetch('https://api.pelm.com/auth/token', requestOptions)
  //   .then((response) => {
  //     if (response.ok) {
  //       return response.json()
  //     } else {
  //       return response.text().then((text) => {
  //         throw new Error(text);
  //       });
  //     }
  //   })
  //   .then(data => {
  //     // We recommend securely saving your access_token to your database. We're saving to session here for convenience.
  //     req.session.access_token = data.access_token
  //     // Use the access_token to make requests for a given user's energy data
  //     res.json(true)
  //   })
  //   .catch((error) => {
  //     res.status(500).send(JSON.parse(err.message).message)
  //   });
})


// Get energy_accouts
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

  console.log("response")
  console.log(response)
  console.log(data)

  if (response.ok) {
    console.log("response ok")
    res.send(data)
  } else {
    console.log("response not ok")
    res.status(500).send(data)
  }

  fetch('https://api.pelm.com/accounts', requestOptions)
    // .then((response) => {
    //   if (response.ok) {
    //     return response.json();
    //   } else {
    //     return response.text().then((text) => {
    //       throw new Error(text);
    //     });
    //   }
    // })
    // .then((data) => {
    //   // Return accounts data
    //   res.end(JSON.stringify(data))
    // })
    // .catch((error) => {
    //   res.status(500).send(JSON.parse(err.message).message)
    // });
})


// Get energy usage intervals
// API reference: https://docs.pelm.com/reference/get_intervals
//
// Not currently being utilized in this example implementation
// Look at our React implementation for more information
app.post('/intervals', (req, res) => {

  const accessToken = req.session.access_token
  const headers = new Headers();
  headers.set('Authorization', 'Bearer ' + accessToken);
  headers.set('Pelm-Client-Id', PELM_CLIENT_ID);
  headers.set('Pelm-Secret', PELM_SECRET);

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

  fetch(url, requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
    })
    .then((data) => {
      // Return intervals data
      res.end(JSON.stringify(data));
    })
    .catch((error) => {
      res.status(500).send(JSON.parse(err.message).message)
    });

})


// Get Bills
// API reference: https://docs.pelm.com/reference/get_bills
//
// Not currently being utilized in this example implementation
// Look at our React implementation for more information
app.post('/bills', (req, res) => {

  const accessToken = req.session.access_token
  const headers = new Headers();
  headers.set('Authorization', 'Bearer ' + accessToken);
  headers.set('Pelm-Client-Id', PELM_CLIENT_ID);
  headers.set('Pelm-Secret', PELM_SECRET);

  const requestOptions = {
    method: 'GET',
    headers,
  };

  const url = 'https://api.pelm.com/bills?account_id=' + req.body.billsAccountIdInput;

  fetch(url, requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
    })
    .then((data) => {
      // Return bills data
      res.end(JSON.stringify(data));
    })
    .catch((error) => {
      res.status(500).send(JSON.parse(err.message).message)
    });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
