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
  // Here we are using session in place of a database
  // Instead use your own database to store values like the Authorization_Token
  session({ secret: "secret", saveUninitialized: true, resave: true })
);

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Display the inde.html at the servers localhost location
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


app.get('/connect', (req, res) => {

  const headers = new Headers();
  headers.set('Pelm-Client-Id', PELM_CLIENT_ID);
  headers.set('Pelm-Secret', PELM_SECRET);

  const encodedParams = new URLSearchParams();

  encodedParams.set('user_id', USER_ID);

  const requestOptions = {
    method: 'POST',
    headers,
    body: encodedParams,
  };

  // Reach out to the Pelm API connect endpoint providing all the relevent headers
  fetch('https://api.pelm.com/auth/connect-token', requestOptions)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return response.text().then(text => { throw new Error(text) })
      }
    })
    .then((data) => {
      // Return connect token
      res.end(JSON.stringify({
        connectToken: data['connect_token']
      }))
    })
    .catch((error) => {
      try {
        const errorObject = JSON.parse(error.message);
        console.log(errorObject)
      } catch (e) {
        console.log("an error occurred")
      }
    });
})


app.get('/accounts', (req, res) => {

  const accessToken = req.session.access_token

  const headers = new Headers();
  headers.set('Authorization', 'Bearer ' + accessToken);
  headers.set('Pelm-Client-Id', PELM_CLIENT_ID);
  headers.set('Pelm-Secret', PELM_SECRET);

  const requestOptions = {
    method: 'GET',
    headers,
  };

  // Reach out to the Pelm API accounts endpoint providing all the relevent headers
  fetch('https://api.pelm.com/accounts', requestOptions)
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
      // Return accounts data
      res.end(JSON.stringify(data))
    })
    .catch((error) => {
      try {
        const errorObject = JSON.parse(error.message);
        console.log(errorObject);
      } catch (e) {
        console.log('an error occurred');
      }
    });
})


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

  // Reach out to the Pelm API intervals endpoint providing all the relevent headers

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
      try {
        const errorObject = JSON.parse(error.message);
        console.log(errorObject);
      } catch (e) {
        console.log('an error occurred');
      }
    });

})


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

  // Reach out to the Pelm API bills endpoint providing all the relevent headers
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
      try {
        const errorObject = JSON.parse(error.message);
        console.log(errorObject);
      } catch (e) {
        console.log('an error occurred');
      }
    });
})


app.post('/authorization', async (req, res) => {

  const headers = new Headers();
  headers.set('Pelm-Client-Id', PELM_CLIENT_ID);
  headers.set('Pelm-Secret', PELM_SECRET);

  const encodedParams = new URLSearchParams();
  encodedParams.set('code', req.body.authorizationCode);

  const requestOptions = {
    method: 'POST',
    headers,
    body: encodedParams,
  };

  // Reach out to the Pelm API authorization endpoint providing all the relevent headers
  await fetch('https://api.pelm.com/auth/token', requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
    })
    .then(data => {
      // Save the access_token to your db
      req.session.access_token = data.access_token
      // Use the access_token to make requests for a given user's energy data
      res.json(true)
    })
    .catch((error) => {
      try {
        const errorObject = JSON.parse(error.message);
        console.log(errorObject);
        res.status(500)
        res.json(false)
      } catch (e) {
        console.log('an error occurred');
        res.json(false)
      }

    });
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
