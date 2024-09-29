let foods = {}

//functions to run on loading the document (add them to the function):
document.addEventListener("DOMContentLoaded", function() {attachEventListeners()});

//all events/ page interactions here
function attachEventListeners() {
    let ingredient_input = document.getElementById("new_ingredient")
    ingredient_input.addEventListener("input", function() { api_get_suggestions()})
    let add_ingredient_button = document.getElementById("add_ingredient")
    add_ingredient_button.addEventListener("click", function() {add_ingredient()})
    let add_food_button = document.getElementById("add_food")
    add_food_button.addEventListener("click", function() {add_food()})

    // let vehicle_input = document.getElementById("vehicle_select");
    // vehicle_input.addEventListener("change", function() {vehicle_changed()})
    // let button = document.getElementById("order_button")
    // button.addEventListener("click", function() {submit()})
}

//all functions:

function api_get_suggestions() {
    console.log("in api")
    const url = "/api_get_suggestions"
    string = document.getElementById("new_ingredient").value

    //create the request_options
    payload = {args:[], kwargs:{}}
    payload.kwargs.string = string

    requestOptions = {
        method: ["POST"],
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }


    fetch(url, requestOptions)
        .then((response) => response.json())
        .then((api_package) => {
            try {
                if (api_package.rc == 0) {
                    try {
                        //code to be executed (if any)
                        const datalist = document.getElementById('ingredient_suggestions');

                        suggestions = api_package.suggestions

                        // Clear existing options
                        datalist.innerHTML = '';
                    
                        // Add each ingredient from the array as an option in the datalist
                        suggestions.forEach(function(suggestion) {
                            let option = document.createElement('option');
                            option.value = suggestion;
                            datalist.appendChild(option);
                        })

                    } catch {
                        console.log(error)
                    reject(new Error(api_package.message))
                    }
                } else {
                    reject(new Error(api_package.message))
                }
            } catch (error){
                console.log(error);
                reject(new Error("Failed to application logs"))
            }
        })
        .catch((error) => {
            console.log(error)
            reject(new Error("Bad API request"))
        })
}

function api_get_classification(ingredients) {
    const url = "/api_get_classification"

    //create the request_options
    payload = {args:[], kwargs:{}}
    payload.kwargs.ingredient_names = ingredients

    requestOptions = {
        method: ["POST"],
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }

    return fetch(url, requestOptions)
        .then((response) => response.json())
        .then((api_package) => {
            try {
                if (api_package.rc == 0) {
                    try {
                        //code to be executed (if any)

                        //return the classification of the food
                        return api_package.nova_group

                    } catch {
                        console.log(error)
                    reject(new Error(api_package.message))
                    }
                } else {
                    reject(new Error(api_package.message))
                }
            } catch (error){
                console.log(error);
                reject(new Error("Failed to application logs"))
            }
        })
        .catch((error) => {
            console.log(error)
            reject(new Error("Bad API request"))
        })
}

// Function to add an ingredient to the list
function add_ingredient() {
    const ingredientName = document.getElementById('new_ingredient').value;
    if (ingredientName.trim() === "") {
        alert("Please enter a valid ingredient name.");
        return;
    }

    // Create a new list item with a remove button
    const li = document.createElement('li');
    li.textContent = ingredientName;

    // Create a remove button
    const removeButton = document.createElement('button');
    removeButton.textContent = "Remove";
    removeButton.className = "remove-button";
    removeButton.onclick = function() {
        removeIngredient(li);
    };

    // Append the button to the list item
    li.appendChild(removeButton);

    // Add the list item to the unordered list
    document.getElementById('ingredient_list').appendChild(li);

    // Clear the input field
    document.getElementById('new_ingredient').value = "";
}

// Function to remove an ingredient from the list
function removeIngredient(li) {
    li.remove();  // Remove the list item
}

// Function to add a food item to the food list
function add_food() {

    const food_name = document.getElementById('new_food').value;
    if (food_name.trim() === "") {
        alert("Please enter a valid food name.");
        return;
    }
    
    //get the ingredients of the food from ingredient list
    ingredients = get_ingredients()

    //call the api to get the nova_group
    api_get_classification(ingredients).then(nova_group => {
        // Create a new list item with the food name
        const li = document.createElement('li');
        li.textContent = `${food_name} (NOVA Group: ${nova_group})`;

        // Store the NOVA group in a data attribute (for further use)
        li.setAttribute('data-nova-group', nova_group);

        // Create a remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = "Remove";
        removeButton.className = "remove-button";
        removeButton.onclick = function() {
            removeFood(li);
            update_chart()
            check_food_list()
        };

        // Append the remove button to the list item
        li.appendChild(removeButton);

        // Add the list item to the unordered list
        document.getElementById('food_list').appendChild(li);

        // Clear the input field
        document.getElementById('new_food').value = "";

        //Clear ingredient list
        clear_ingredient_list()

        //Update pie chart
        update_chart()

        //make pie chart heading appear if there are foods
        check_food_list()

    })
}

// Function to remove a food item from the food list
function removeFood(li) {
    li.remove();  // Remove the list item
}

// Function to remove a food item from the food list
function removeFood(li) {
    li.remove();  // Remove the list item
}

// Function to get ingredients from the unordered list and return them as an array
function get_ingredients() {
    // Get all the <li> elements inside the <ul> with id="ingredient_list"
    let listItems = document.querySelectorAll('#ingredient_list li');

    // Create an array from the list items by extracting their text content
    let ingredientArray = Array.from(listItems).map(item => item.firstChild.textContent.trim());


    // Return the array of ingredients
    return ingredientArray;
}

//clears the ingredient list
function clear_ingredient_list() {
    const ingredientList = document.getElementById('ingredient_list');
    ingredientList.innerHTML = '';  // Clears all the <li> items
}

// Function to get NOVA groups from the list
function getNovaGroupsFromList() {
    let listItems = document.querySelectorAll('#food_list li');
    let novaGroups = {
        1: 0,  // Unprocessed or minimally processed
        2: 0,  // Processed culinary ingredients
        3: 0,  // Processed foods
        4: 0   // Ultra-processed foods
    };

    // Loop through each list item and increment the count for the corresponding NOVA group
    listItems.forEach(item => {
        let novaGroup = item.getAttribute('data-nova-group');
        novaGroups[novaGroup]++;
    });

    return novaGroups;
}

// Function to calculate percentages
function calculateNovaGroupPercentages(novaGroups) {
    let totalItems = Object.values(novaGroups).reduce((acc, count) => acc + count, 0);
    let percentages = {
        1: (novaGroups[1] / totalItems) * 100,
        2: (novaGroups[2] / totalItems) * 100,
        3: (novaGroups[3] / totalItems) * 100,
        4: (novaGroups[4] / totalItems) * 100
    };
    return percentages;
}

// Create the chart
let novaChart;
function update_chart() {
    let novaGroups = getNovaGroupsFromList();
    let percentages = calculateNovaGroupPercentages(novaGroups);

    // If chart already exists, destroy it before re-rendering
    if (novaChart) {
        novaChart.destroy();
    }

    let ctx = document.getElementById('novaChart').getContext('2d');
    novaChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['NOVA Group 1', 'NOVA Group 2', 'NOVA Group 3', 'NOVA Group 4'],
            datasets: [{
                label: 'NOVA Group Distribution',
                data: [
                    percentages[1], // Percentage for NOVA Group 1
                    percentages[2], // Percentage for NOVA Group 2
                    percentages[3], // Percentage for NOVA Group 3
                    percentages[4]  // Percentage for NOVA Group 4
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 40  // Increase the font size of the legend
                        }
                    }
                }
            }
        }
    });
}

// Function to check if the food list has items and show/hide the heading
function check_food_list() {
    const foodList = document.getElementById('food_list');
    const heading = document.getElementById('chart_heading');
    
    if (foodList.children.length > 0) {
        heading.style.display = 'block';  // Show the heading
    } else {
        heading.style.display = 'none';  // Hide the heading
    }
}

