const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const donorsFile = path.join(__dirname, 'donors.json');

// Load donors from file
let donors = [];
if (fs.existsSync(donorsFile)) {
  donors = JSON.parse(fs.readFileSync(donorsFile, 'utf8'));
}

// Save donors to file
function saveDonors() {
  fs.writeFileSync(donorsFile, JSON.stringify(donors, null, 2));
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Home page - registration form
app.get('/', (req, res) => {
  res.render('index');
});

// Donor registration form POST
app.post('/register', (req, res) => {
  const { name, blood_group, contact } = req.body;
  const newDonor = {
    id: Date.now(), // <-- add ID
    name,
    blood_group,
    contact
  };
  donors.push(newDonor);
  saveDonors();
  res.redirect('/donors');
});

// Show all registered donors
app.get('/donors', (req, res) => {
  res.render('donors', { donors });
});

// Delete donor by ID
app.get('/delete/:id', (req, res) => {
  const idToDelete = parseInt(req.params.id);
  donors = donors.filter(donor => donor.id !== idToDelete);
  saveDonors();
  res.redirect('/donors');
});

app.get('/search', (req, res) => {
  const group = req.query.blood_group.trim().toUpperCase();
  const filteredDonors = donors.filter(d => d.blood_group.toUpperCase() === group);
  res.render('donors', { donors: filteredDonors });
});


app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
