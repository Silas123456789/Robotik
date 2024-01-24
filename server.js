const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const profilesFilePath = path.join(__dirname, 'data', 'userProfiles.json');

let userProfiles = {};

try {
  const data = fs.readFileSync(profilesFilePath, 'utf-8');
  userProfiles = JSON.parse(data);
} catch (error) {
  console.log('Keine vorhandene Benutzerprofil-Datei gefunden. Eine neue wird erstellt.');
  saveUserProfiles(); // Speichern Sie eine leere Datei, falls keine vorhanden ist
}

function saveUserProfiles() {
  try {
    fs.writeFileSync(profilesFilePath, JSON.stringify(userProfiles, null, 2), 'utf-8');
    console.log('Benutzerprofile erfolgreich gespeichert.');
  } catch (error) {
    console.error('Fehler beim Speichern der Benutzerprofile:', error);
  }
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

app.get('/getProfiles', (req, res) => {
  // Senden Sie die Benutzerprofile als JSON zurück
  res.json(Object.values(userProfiles));
});

app.post('/register', (req, res) => {
  const { email, password, name, age, hobby } = req.body;

  if (userProfiles[email]) {
    return res.json({ success: false, message: 'E-Mail bereits registriert.' });
  }

  userProfiles[email] = { email, password, name, age, hobby };
  console.log('Neue Registrierung:', { email, password, name, age, hobby });
  saveUserProfiles();

  // Senden Sie eine Bestätigung an den Client
  res.json({ success: true, message: 'Registrierung erfolgreich.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
