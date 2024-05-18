import RecipeManager from './recipemanager.js';
import FormHandler from './formhandler.js';

document.addEventListener('DOMContentLoaded', function() {
    const recipeManager = new RecipeManager('recipes.json');
    
    if (document.getElementById('recipeForm')) {
        new FormHandler('#recipeForm', recipeManager);
    }
});
