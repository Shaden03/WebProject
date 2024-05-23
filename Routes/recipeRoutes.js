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
