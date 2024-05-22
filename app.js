
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path"); // Import path module

const app = express();

app.use(bodyParser.json());
app.use(express.static('public')); 
app.use(express.static('img'));
app.use(express.static(__dirname)); 
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});
mongoose.connect('mongodb://localhost:27017/Database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Error in connecting to Database"));
db.once('open', () => {
    console.log("Connected to Database");
});

const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String,
    phno: String,
    gender: String,
    password: String,
});

const User = mongoose.model('User', userSchema);


app.post("/sign_up", async (req, res) => {
    try {
        const { name, age, email, phno, gender, password } = req.body;

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed Password before saving:", hashedPassword); // Log hashed password before saving

        const newUser = new User({
            name,
            age,
            email,
            phno,
            gender,
            password: hashedPassword
        });

        // Save the user to the database
        const savedUser = await newUser.save();
        console.log("User created successfully:", savedUser);

        return res.redirect('/index.html');
    } catch (err) {
        console.error("Error during sign-up:", err);
        res.status(500).send("Internal server error");
    }
});



// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).send('Incorrect email.');
        }

        console.log("Provided Password:", password);
        console.log("Hashed Password in DB:", user.password);

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send('Incorrect password.');
        }

        // If credentials are correct, proceed to the next step (e.g., generate a session or token)
        // res.redirect('/nextpage'); // Uncomment if using redirect

        // Example response for successful login
      //  res.status(200).send('signup_successful.html');
      
        res.redirect('/index.html');

    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).send("Internal server error");
    }
});


app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.redirect('signup.html');
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
const port = 3054;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




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


// var express = require("express");
// var bodyParser = require("body-parser");
// var mongoose = require("mongoose");
// const app = express();

// app.use(bodyParser.json());
// app.use(express.static('public'));
// app.use(bodyParser.urlencoded({ extended: true }));

// mongoose.connect('mongodb://localhost:27017/Database', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// const db = mongoose.connection;
// db.on('error', () => console.log("Error in connecting to Database"));
// db.once('open', () => console.log("Connected to Database"));


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

// app.listen(3000, () => console.log("Listening on port 3000"));

// app.listen(3000);
// console.log("Listening on port 3000");

