// Importing express library and initializing app variable
let express = require('express')
const http = require('http');
let app = express()

// Set the maximum payload size to 50MB
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Importing dotenv library to retrieve sensitive information from the .env file
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

// Getting the port value from the .env file or defaulting to 5000
const PORT = process.env.PORT || 3001

// Connecting to the MongoDB database
// require('./db/mongo')

// Serving static files from the 'public' folder
app.use('/public', express.static('public'));

let cors = require('cors')
app.use(cors());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', (req, res) => {
    res.json({msg:'Hello This Is Sajid','email':process.env.WORK_EMAIL})
})

//before AUTH.JS loading so that it effects
app.use(express.json())

// Linking the noteroute.js file to the main app
app.use(require('./routes/noteroute'))
app.use(require('./routes/pageroutes'))
app.use(require('./routes/friendroutes'))
app.use(require('./routes/htmlroutes'))
// app.use(require('./routes/aws'))

const server = http.createServer(app);



server.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
