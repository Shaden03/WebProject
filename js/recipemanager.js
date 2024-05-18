// recipeManager.js
class recipemanager {
    constructor(recipesUrl) {
        this.recipesUrl = recipesUrl;
        this.recipes = [];
        this.loadRecipes();
    }

    loadRecipes() {
        fetch(this.recipesUrl)
            .then(response => response.json())
            .then(data => {
                this.recipes = data;
                this.renderRecipes();
            })
            .catch(error => console.error('Error fetching recipes:', error));
    }

    addRecipe(recipe) {
        this.recipes.push(recipe);
        this.renderRecipes();
    }

    renderRecipes() {
        const recipeList = document.getElementById('recipeList');
        recipeList.innerHTML = this.recipes.map(recipe => `
            <div class="col-12 col-sm-6 col-lg-3" data-title="${recipe.name}" type="${recipe.category}">
                <div class="single-best-receipe-area mb-30">
                    <img src="img/recipes/${recipe.image}" alt="">
                    <div class="receipe-content">
                        <h5>${recipe.name}</h5>
                        <div class="timing d-flex justify-content-between">
                            <div class="delivey-time">
                                <img src="img/core-img/Time (1).png" alt="">
                                <span>30 Minutes</span>
                            </div>
                            <div class="food-catagory">
                                <img src="img/core-img/Time (2).png" alt="">
                                <span>${recipe.category}</span>
                            </div>
                        </div>
                        <div class="ratings">
                            <i class="fa fa-star" aria-hidden="true"></i>
                            <i class="fa fa-star" aria-hidden="true"></i>
                            <i class="fa fa-star" aria-hidden="true"></i>
                            <i class="fa fa-star" aria-hidden="true"></i>
                            <i class="fa fa-star-o" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}
export default recipemanager;
