const express= require('express');
const app= express();
require('dotenv').config();

const port= process.env.PORT || 3001

// middleware
app.use(express.json());

app.get('/', (req, res)=>{
    res.send('Jai Shree Ram');
})

// database
require('./db/DB')

app.use('/api/users', require('./routes/user'));

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
})

