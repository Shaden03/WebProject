// formHandler.js
class formhandler {
    constructor(formSelector, recipeManager) {
        this.form = document.querySelector(formSelector);
        this.recipeManager = recipeManager;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    handleSubmit(event) {
        event.preventDefault();

        const recipeName = document.getElementById('recipeName').value;
        const category = document.getElementById('category').value;
        const recipeImage = 'default-image.jpg';

        const newRecipe = {
            name: recipeName,
            category: category,
            image: recipeImage
        };

        this.recipeManager.addRecipe(newRecipe);
    }
}

export default formhandler;
