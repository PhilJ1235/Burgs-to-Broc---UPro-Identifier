import requests

def test_api_get_suggestions(string):
    print("in test api get suggestions")
    url = "http://127.0.0.1:5000/api_get_suggestions"
    args = []
    kwargs = {"string":string}
    payload = dict(args=args, kwargs=kwargs)
    response = requests.get(url, json=payload)
    api_package = response.json()
    print(api_package)
    
def test_api_get_classification(ingredient_names):  
    print("in test api get classification")
    url = "http://127.0.0.1:5000/api_get_classification"
    args = []
    kwargs = {"ingredient_names":ingredient_names}
    payload = dict(args=args, kwargs=kwargs)
    response = requests.post(url, json=payload)
    api_package = response.json()
    print(api_package)
      
if __name__ == "__main__":
    
    #test_api_get_suggestions("b")
    test_api_get_classification(["butter", "brocolli"])
    

    