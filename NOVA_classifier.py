import json
import os

this_directory = os.path.abspath(os.path.dirname(__file__))

def upload_file_to_database(filename, group):
    
    path_to_file = os.path.join(this_directory, filename)
    
    # Open the file in read mode
    with open(path_to_file, 'r') as file_handle:
        # Loop through each line in the file
        for line in file_handle:
            # Remove any trailing whitespace (like newlines)
            ingredient_name = line.strip()

            add_new_ingredient(ingredient_name, group)
            
def remove_duplicates():
    file_path = os.path.join(this_directory, "ingredients_index.json")
    # Step 1: Read the current ingredients from the file
    with open(file_path, 'r') as file:
        ingredients_data = json.load(file)
    
    # Step 2: Remove duplicates
    unique_ingredients = remove_duplicate_ingredients(ingredients_data)
    
    # Step 3: Overwrite the file with the unique ingredients
    with open(file_path, 'w') as file:
        json.dump(unique_ingredients, file, indent=4)


def add_new_ingredient(name, group):        #adds a new ingredient to the database (json file)
    #create ingredient object
    ingredient = dict(name=name, nova_group=group)
    filename = "ingredients_index.json"
    path_to_save = os.path.join(this_directory, filename)
    
    #Load existing data into list / initialize
    if os.path.exists(path_to_save):
        with open(path_to_save,"r") as file_handle:
            try:
                ingredients = json.load(file_handle)
                if not isinstance(ingredients, list): #ensure the file contains a list
                    ingredients = []
            except json.JSONDecodeError:
                ingredients = [] #if no list or invalid data
    else:
        ingredients = [] #if no file found/created yet
        
    #Append the new ingredient to the list of ingredients
    ingredients.append(ingredient)
    
    #Write the updated list back to the file
    with open(path_to_save, "w") as file_handle:
        json.dump(ingredients, file_handle, indent=4)
    
    return

    
    return

def classification(ingredient_names):       #recieves a list and classifys it, returns nova group and a reason
    nova_groups = get_nova_groups(ingredient_names)
    nova_classification = max(nova_groups)

    return nova_classification

def get_nova_groups(ingredient_names):
    filename = "ingredients_index.json"
    path_to_file = os.path.join(this_directory, filename)
    
    #initialize a nova groups list
    nova_groups = []
    
    # Check if the file exists
    if os.path.exists(path_to_file):
        # Load the JSON data from the file
        with open(path_to_file, "r") as file_handle:
            try:
                ingredients = json.load(file_handle)
            except json.JSONDecodeError:
                return nova_groups  # Return empty list if file is invalid
            
        #Iterate over the list given to find in the ingredients list
        for ingredient_name in ingredient_names:
            for ingredient in ingredients:
                if ingredient_name.lower() == ingredient["name"].lower():
                    nova_groups.append(ingredient["nova_group"])
                    break # move on to next ingredient
            else:       
                nova_groups.append(4) #Assume nova group 4 if not found
    else:
        print("Ingredient database not found.")
        
    return nova_groups

def get_ingredient_suggestions(string):
    filename = "ingredients_index.json"
    path_to_file = os.path.join(this_directory, filename)
    
    # Initilise list to store suggestions
    suggestions = []
    
    # Check if the file exists
    if os.path.exists(path_to_file):
        # Load the JSON data from the file
        with open(path_to_file, "r") as file_handle:
            try:
                ingredients = json.load(file_handle)
            except json.JSONDecodeError:
                return suggestions  # Return empty list if file is invalid
        
        # Iterate through all the ingredients in the database
        for ingredient in ingredients:
            # Check if the ingredient name starts with the given string (case-insensitive)
            if ingredient["name"].lower().startswith(string.lower()):
                suggestions.append(ingredient["name"])
    else:
        print("Ingredient database not found.")
    
    return suggestions

def remove_duplicate_ingredients(ingredients_list):
    # Create an empty set to keep track of ingredient names we've seen
    seen = set()
    
    # Create a new list to store the unique ingredients
    unique_ingredients = []
    
    # Loop through the ingredients list
    for ingredient in ingredients_list:
        # If the ingredient name hasn't been seen yet, add it to the unique list and mark it as seen
        if ingredient['name'] not in seen:
            unique_ingredients.append(ingredient)
            seen.add(ingredient['name'])
    
    return unique_ingredients
    

if __name__ == "__main__":
    # upload_file_to_database("group1.txt", 1)
    # upload_file_to_database("group2.txt", 2)
    # upload_file_to_database("group3.txt", 3)
    upload_file_to_database("group4.txt", 4)
    remove_duplicates()
    
    1/0
    