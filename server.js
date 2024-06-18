const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3019;

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://piyush:piyush123@ticket.sorypmh.mongodb.net/?retryWrites=true&w=majority&appName=ticket', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(db => console.log('DB is connected'))
.catch(err => console.log(err));


const clientschema = new mongoose.Schema({
  ticketId: String,
  ClientCode: String,
  mobile: String,
  department: String,
  date: Date,
  query: String
});

const clients = mongoose.model("data", clientschema);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/post', async (req, res) => {
  console.log(req.body);
  const { ClientCode, mobile, department, date,query} = req.body;

  // Generate a random ticket ID
  const ticketId = 'T' + Math.floor(Math.random() * 10000);

  const clientDate = new Date(date);

  if (isNaN(clientDate)) {
    console.error("Invalid date:", date);
    return res.status(400).send("Invalid date");
  }

  const client = new clients({
    ticketId,
    ClientCode,
    mobile,
    department,
    date:clientDate,
    query
  });

  await client.save();
  console.log(client);
  
  // Sending a response that includes a JavaScript alert and a redirect
  res.send(`
    <script>
      alert('Your form has been submitted successfully. Ticket ID: ${ticketId}');
      window.location.href = '/';
    </script>
  `);
});

app.listen(port, () => {
  console.log("Server started on port " + port);
});

module.exports = clients ;