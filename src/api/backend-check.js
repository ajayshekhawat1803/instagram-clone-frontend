// api/backend-check.js

import axios from 'axios';

export default async function handler(req, res) {
  try {
    // Replace 'YOUR_BACKEND_URL' with the actual URL of your backend
    const response = await axios.get('YOUR_BACKEND_URL');

    // Check if the response indicates successful connectivity
    if (response.status === 200) {
      console.log('Backend is reachable!');
      res.status(200).send('Backend is reachable!');
    } else {
      console.error('Unexpected status code:', response.status);
      res.status(response.status).send('Unexpected status code: ' + response.status);
    }
  } catch (error) {
    console.error('Error connecting to the backend:', error.message);
    res.status(500).send('Error connecting to the backend: ' + error.message);
  }
}
