// const express = require('express');
// const router = express.Router();
// const Recipe = require('../js/Addrecipie');

// // Route to get all recipes and render index.html
// router.get('/', (req, res) => {
//   Recipe.find({}, (err, recipes) => {
//     if (err) {
//       console.log(err);
//     } else {
//       // Serve index.html
//       res.sendFile('index.html', { root: __dirname + '/../' });
//     }
//   });
// });

// // Route to serve add-recipe.html
// router.get('/Addrecipe', (req, res) => {
//   res.sendFile('Addrecipe.html',  { root: __dirname + '/../' });
// });

// // Route to handle form submission
// router.post('/Addrecipe', (req, res) => {
//   const { recipeName, recipeDes, recipievideio, ingredients, forTheSause, directions } = req.body;
//   const recipeImage = req.file.path;
//   const ingredientsArray = ingredients.split(',');
//   const forTheSauseArray = forTheSause.split(',');
//   const directionsArray = directions.split('\n').map((step, index) => ({
//     stepNumber: index + 1,
//     stepsdirections: step.trim()
//   }));

//   const newRecipe = new Recipe({
//     name: recipeName,
//     description: recipeDes,
//     recipievideio: recipievideio,
//     ingredients: ingredientsArray,
//     forTheSause: forTheSauseArray,
//     directions: directionsArray,
//     recipeImage: recipeImage 
//   });

//   newRecipe.save((err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.redirect('/');
//     }
//   });
// });


// // Route to get all recipes
// router.get('/recipes', (req, res) => {
//     Recipe.find({}, (err, recipes) => {
//       if (err) {
//         console.log(err);
//         // Handle error response
//         res.status(500).send('Failed to retrieve recipes.');
//       } else {
//         // Send the recipes as JSON response
//         res.json(recipes);
//       }
//     });
//   });
  


// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const Recipe = require('../js/Addrecipie');
// const multer = require('multer');

// // Multer configuration for handling file uploads
// const upload = multer({ dest: 'uploads/' }); // Specify the directory to store uploaded images

// // Route to handle form submission for adding a recipe
// router.post('/Addrecipe', upload.single('recipeImage'), async (req, res) => {
//     try {
//         // Check if a file was uploaded
//         if (!req.file) {
//             return res.status(400).send('No file uploaded.');
//         }

//         // Extract data from the request body
//         const { recipeName, recipeDes, recipievideio, ingredients, forTheSause, directions, category } = req.body;

//         // Get the path of the uploaded image
//         const image = req.file.path;

//         // Convert ingredients and forTheSause to arrays
//         const ingredientsArray = ingredients.split(',').map(ingredient => ingredient.trim());
//         const forTheSauseArray = forTheSause.split(',').map(sauce => sauce.trim());

//         // Convert directions to an array of objects
//         const directionsArray = directions.split('\n').map((step, index) => ({
//             stepNumber: index + 1,
//             stepsdirections: step.trim()
//         }));

//         // Create a new recipe document with image path
//         const newRecipe = new Recipe({
//             name: recipeName,
//             description: recipeDes,
//             recipievideio: recipievideio,
//             ingredients: ingredientsArray,
//             forTheSause: forTheSauseArray,
//             directions: directionsArray,
//             category: category,
//             recipeImage: image // Store the image path in the database
//         });

//         // Save the new recipe to the database
//         const savedRecipe = await newRecipe.save();

//         // Log the saved recipe document
//         console.log('Recipe created successfully:', savedRecipe);

//         // Redirect to index or any other page
//         res.redirect('/index.html');
//     } catch (error) {
//         console.error('Error adding recipe:', error);
//         res.status(500).send('Internal server error');
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Recipe = require('../js/Addrecipie');
const multer = require('multer');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) // Appends the file extension
    }
});

const upload = multer({ storage: storage });

// Fetch all recipes
router.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).send('Internal server error');
    }
});

// Add a new recipe
router.post('/recipes', upload.single('recipeImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const { name, description, recipievideio, ingredients, forTheSause, directions, category } = req.body;
        // const image = req.file.path.replace(/\\/g, '/');
        const image = req.file.path;  

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
            recipeImage: image
        });

        const savedRecipe = await newRecipe.save();
        console.log('Recipe created successfully:', savedRecipe);
        res.redirect('/index.html');
    } catch (error) {
        console.error('Error adding recipe:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
