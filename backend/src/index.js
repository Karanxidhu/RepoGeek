const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const connectToMongo = require('./db');
const port = process.env.PORT || 3000;
app.use(cors());
connectToMongo();
app.use(express.json());

app.use('/api/auth', require('./routes/Auth'))
app.use('/api/github', require('./routes/Github'))
app.use('/api/ollama', require('./routes/Ollama'))

app.get('/', (req, res) => { 
  res.json({ message: 'Hello World' });
})

app.listen(port, ()=>{
  console.log(`Server is running on port http://localhost:${port}`)
})