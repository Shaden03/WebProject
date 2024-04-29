document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission
  
    // Retrieve username and password
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
  
    // Perform validation (you can add your own logic here)
    if (username === "your_username" && password === "your_password") {
      alert("Login successful!");
      // Redirect to another page or perform other actions
    } else {
      alert("Invalid username or password. Please try again.");
    }
  });
  
  document.getElementById("forgotPassword").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default link behavior
    
    // Redirect to forgot password page (you can replace 'forgot_password.html' with your actual forgot password page)
    window.location.href = "forgot_password.html";
  });
  
  document.getElementById("addRecipeForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission
  
    // Retrieve form data
    var recipeName = document.getElementById("recipeName").value;
    var category = document.getElementById("category").value;
    var time = parseInt(document.getElementById("time").value); // Convert to integer
    var image = document.getElementById("image").files[0]; // Assuming only one image is selected
  
    // Perform form validation (you can add your own validation logic here)
  
    // For demonstration, simply log the data to the console
    console.log("Recipe Name: " + recipeName);
    console.log("Category: " + category);
    console.log("Time (seconds): " + time);
    console.log("Image:", image);
  
    // You can perform other actions here, such as sending the data to a server
  });
  