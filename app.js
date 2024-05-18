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



var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/Database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', () => console.log("Error in connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

app.post("/sign_up", async (req, res) => {
    try {
        var name = req.body.name;
        var age = req.body.age;
        var email = req.body.email;
        var phno = req.body.phno;
        var gender = req.body.gender;
        var password = req.body.password;

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        var data = {
            "name": name,
            "age": age,
            "email": email,
            "phno": phno,
            "gender": gender,
            "password": hashedPassword
        };

        db.collection('users').insertOne(data, (err, collection) => {
            if (err) {
                throw err;
            }
            console.log("Record Inserted Successfully");
        });

        return res.redirect('signup_successful.html');
    } catch (err) {
        console.error("Error during sign-up:", err);
        res.status(500).send("Internal server error");
    }
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email: email }, async (err, user) => {
        if (err) {
            return res.status(500).send('An error occurred during the process.');
        }
        if (!user) {
            return res.status(401).send('Incorrect email.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send('Incorrect password.');
        }

        // If credentials are correct, proceed to the next step (e.g., generate a session or token)
        // res.redirect('/nextpage'); // Uncomment if using redirect

        // Example response for successful login
        res.status(200).send('signup_successful.html');
    });
});

app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.redirect('signup.html');
});

<<<<<<< HEAD
// app.listen(3000);
// console.log("Listening on port 3000");




// Define routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/addRecipe', (req, res) => {
    res.sendFile(__dirname + '/addRecipe.html');
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
=======
app.listen(3000, () => console.log("Listening on port 3000"));
>>>>>>> ab99b5a87f361e41497f52e1fcaaa6aa16f69e69
