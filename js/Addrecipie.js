const mongoose = require('mongoose');

const youtubeUrlRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;

const RecipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    recipeImage: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['breakfast', 'lunch', 'dinner']
    },
    recipievideio: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return youtubeUrlRegex.test(v);
            },
            message: props => `${props.value} is not a valid YouTube URL!`
        }
    },
    ingredients: {
        type: [String],
        required: true
    },
    forTheSause: {
        type: [String],
        required: true
    },

    directions: {
        type: [
            {
                stepNumber: {
                    type: Number,
                    required: true
                },
                stepsdirections: {
                    type: String,
                    required: true
                }
            }
        ],
        required: true
    }
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = Recipe;
