const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json')),
});

app.post('/createUser', async (req, res) => {
  const { email, password } = req.body;

  try {
    await admin.auth().createUser({ email, password, emailVerified: false });
    res.status(200).send('User created');
  } catch (err) {
    if (err.code === 'auth/email-already-exists') {
      res.status(200).send('User already exists');
    } else {
      res.status(500).send(err.message);
    }
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
