require('dotenv').config(); // read environment variables from .env file
const cors = require('cors');       // middleware to enable CORS (Cross-Origin Resource Sharing)
const express = require('express');
const app = express();

app.use(cors()); //enable ALL CORS requests (client requests from other domain)

app.use(express.json()); //enable parsing JSON body data

// app.use(express.static(path.join(__dirname, 'Client', 'js')));
// app.use(express.static(path.join(__dirname, 'Client', 'css')));
// app.use(express.static(path.join(__dirname, 'Client', 'html')));
// app.use('/html', express.static(path.join(__dirname,'Client', 'html')));
// app.use('/js', express.static(path.join(__dirname,'Client', 'js')));
// app.use('/css', express.static(path.join(__dirname,'Client', 'css')));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'Client', './index.html'));
// });

// app.use('/users', require('./Server/routes/users.routes'))


app.listen(process.env.PORT, () => 
   console.log(`Server running at http://${process.env.HOST}:${process.env.PORT}/`)
);

module.exports= app