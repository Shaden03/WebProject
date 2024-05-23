const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const path = require("path"); // Import path module
const recipeRoutes = require('./Routes/recipeRoutes');
const router = require("./Routes/recipeRoutes");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Specify the directory to store uploaded images
const Recipe = require('./js/Addrecipie');
const app = express();

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Static file serving
// Static file serving
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public')); 
app.use(express.static('img'));
app.use(express.static('js'));
app.use(express.static(__dirname)); 
app.use('/js', express.static(__dirname + '/js')); // Serve JavaScript files
app.use('/', recipeRoutes);

// session and flash config .
app.use(session({
    secret: 'lorem ipsum',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60000 * 15}
}))
app.use(flash());

// Passport Configuration
require('./config/passport-setup');
app.use(passport.initialize());
app.use(passport.session());

// bring user routes
const users = require('./Routes/user-routes');
app.use('/users', users);

// Database connection
mongoose.connect('mongodb://localhost:27017/Database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true 
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Error in connecting to Database"));
db.once('open', () => {
    console.log("Connected to Database");
});



// post Addrecipe 
router.post('/Addrecipe', upload.single('recipeImage'), async (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        
        const { name, description, recipievideio, ingredients, forTheSause, directions, category } = req.body;

        // Get the path of the uploaded image
        const image = req.file.path;  

        // Create a new recipe document with image path
        const newRecipe = new Recipe({
            name,
            description,
            category,
            recipievideio,
            ingredients: ingredients.split(',').map(ingredient => ingredient.trim()),
            forTheSause: forTheSause.split(',').map(sauce => sauce.trim()),
            directions: directions.split('\n').map((step, index) => ({
                stepNumber: index + 1,
                stepsdirections: step.trim()
            })),
            // Store the image path in the database
            recipeImage: image
        });

        // Save the new recipe to the database
        const savedRecipe = await newRecipe.save();

        // Log the saved recipe document
        console.log('Recipe created successfully:', savedRecipe);

        // Redirect to index or any other page
        res.redirect('/index.html');
    } catch (error) {
        console.error('Error adding recipe:', error);
        res.status(500).send('Internal server error');
    }
});

// Test bcrypt functionality
async function testBcrypt() {
    try {
        const password = '12345678';
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed Password:", hashedPassword);

        // Compare a hardcoded password with the hashed password
        const isPasswordValid = await bcrypt.compare('12345678', hashedPassword);
        console.log("Is Password Valid:", isPasswordValid);
    } catch (error) {
        console.error("Error:", error);
    }
}
testBcrypt();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Endpoint to check if the user is authenticated
app.get('/auth/status', (req, res) => {
    res.json({ isAuthenticated: req.isAuthenticated() });
});

// Home Route
app.get("/", (req, res) => {
    res.set({ "Allow-access-Allow-Origin": '*' });
    res.sendFile(path.join(__dirname, 'public/signup.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/addRecipe.html', (req, res) => {
    res.sendFile(__dirname + '/addRecipe.html');
});

app.get('/about.html', (req, res) => {
    res.sendFile(__dirname + '/about.html');
});
app.get('/Blogpage.html', (req, res) => {
    res.sendFile(__dirname + '/Blogpage.html');
});

app.get('/contact.html', (req, res) => {
    res.sendFile(__dirname + '/contact.html');
});

app.get('/Recipiespage.html', (req, res) => {
    res.sendFile(__dirname + '/Recipiespage.html');
});

app.get('/styleblog.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'styleblog.css'));
});


// Start the server
const port = 3094;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

