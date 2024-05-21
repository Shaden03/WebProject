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


// Start the server
const port = 3094;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// app.post("/sign_up", (req, res) => {
//     var name = req.body.name;
//     var age = req.body.age;
//     var email = req.body.email;
//     var phno = req.body.phno;
//     var gender = req.body.gender;
//     var password = req.body.password;

//     var data = {
//         "name": name,
//         "age": age,
//         "email": email,
//         "phno": phno,
//         "gender": gender,
//         "password": password
//     };
//     db.collection('users').insertOne(data, (err, collection) => {
//         if (err) {
//             throw err;
//         }
//         console.log("Record Inserted Successfully");
//     });
//     return res.redirect('signup_successful.html');
// });

// const userSchema = new mongoose.Schema({
//     username: String,
//     password: String, // Ensure passwords are hashed in production
// });

// const User = mongoose.model('User', userSchema);

// module.exports = User;

// app.post("/login", (req, res) => {
//     const { email, password } = req.body;

//     User.findOne({ email: email, password: password }, (err, user) => {
//         if (err) {
//             res.status(500).send("Error logging in");
//         } else if (user) {
//             res.redirect('signup_successful.html');
//         } else {
//             res.status(401).send("Invalid credentials");
//         }
//     });
// });

// app.get("/", (req, res) => {
//     res.set({
//         "Allow-access-Allow-Origin": '*'
//     });
//     return res.redirect('signup.html');
// });


// •••••**** this code correct if other code error***********

// const userSchema = new mongoose.Schema({
//     name: String,
//     age: Number,
//     email: String,
//     phno: String,
//     gender: String,
//     password: String,
// });

// const User = mongoose.model('User', userSchema);

// // post sign_up
// app.post("/sign_up", async (req, res) => {
//     try {
//         const { name, age, email, phno, gender, password } = req.body;

//         // Hash the password before saving it
//         const hashedPassword = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));
//         console.log("Hashed Password before saving:", hashedPassword); // Log hashed password before saving

//         const newUser = new User({
//             name,
//             age,
//             email,
//             phno,
//             gender,
//             password: hashedPassword
//         });

//         // Save the user to the database
//         const savedUser = await newUser.save();
//         console.log("User created successfully:", savedUser);

//         return res.redirect('/index.html');
//     } catch (err) {
//         console.error("Error during sign-up:", err);
//         res.status(500).send("Internal server error");
//     }
// });


// // post Login route
// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email: email });

//         if (!user) {
//             return res.status(401).send('Incorrect email.');
//         }

//         console.log("Provided Password:", password);
//         console.log("Hashed Password in DB:", user.password);

//         const isPasswordValid = await bcrypt.compare(password, user.password);

//         if (!isPasswordValid) {
//             return res.status(401).send('Incorrect password.');
//         }

//         // If credentials are correct, proceed to the next step (e.g., generate a session or token)
//         // res.redirect('/nextpage'); // Uncomment if using redirect

//         // Example response for successful login
//       //  res.status(200).send('signup_successful.html');
      
//         res.redirect('/index.html');

//     } catch (err) {
//         console.error("Error during login:", err);
//         res.status(500).send("Internal server error");
//     }
// });