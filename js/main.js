// Fetch recipe data from the backend
fetch('/recipes')
    .then(response => response.json())
    .then(data => {
        // Select the container element where recipes will be displayed
        const recipesContainer = document.getElementById('recipes-container');

        // Loop through each recipe and create HTML elements to display them
        data.forEach(recipe => {
            // Create a div element for each recipe
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');

            // Populate the div with recipe information
            recipeDiv.innerHTML = `
                <h2>${recipe.name}</h2>
                <p>${recipe.category}</p>
                <img src="${recipe.recipeImage}" alt="${recipe.name}"> <!-- Add the image -->
                <p>${recipe.description}</p>
                <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
                <p><strong>For the Sauce:</strong> ${recipe.forTheSause.join(', ')}</p>
                <p><strong>Directions:</strong></p>
                <ol>${recipe.directions.map(step => `<li>${step.stepsdirections}</li>`).join('')}</ol>
            `;

            // Append the recipe div to the recipes container
            recipesContainer.appendChild(recipeDiv);
        });
    })
    .catch(error => console.error('Error fetching recipes:', error));



