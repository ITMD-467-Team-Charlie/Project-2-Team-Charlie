// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

var searchString = "";

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function show(val){
	if(val=="Male"){
		document.getElementById('women').style.display = 'none';
	}else{
		document.getElementById('women').style.display = 'block';
	}
}

const loadDishes = (userInput) => {
	
	searchString = userInput;
	var cal = minCal.value+"-"+maxCal.value;
	var ing = maxIng.value;
	
	var endpoint = "https://api.edamam.com/search?q="+userInput+"&calories="+cal+"&ingr="+ing+"&app_id=6d0f970f&app_key=c42f8d8f7aabaf2137f08352df82a7e8"
	
	const xhttp = new XMLHttpRequest();
    xhttp.open("GET", endpoint, false);
    xhttp.send();

    const dishes = JSON.parse(xhttp.responseText);
	
	if(dishes.hits.length>0){
		document.getElementById('display-dishes').innerHTML="";
	}
	
    for (let dish of dishes.hits) {
		var dishCard='';
		var ingredientLines = makeUL(dish.recipe.ingredientLines);
		var calories = (dish.recipe.calories/dish.recipe.yield).toFixed(2);
		var totalWeight = (dish.recipe.totalWeight).toFixed(2);
		dishCard = `
            <div class="col">
                <div class="card">
					<div class="card-row">
						<h2>${dish.recipe.label}</h2>
					</div>
					<div class="card-row">
						<div class="card-col">
							<img id="dishImg" src="${dish.recipe.image}"/>
						</div>
					
						<div class="card-col">
							${ingredientLines};
						</div>
					</div>
					<div class="card-row">
						<p>Calories: ${calories}</p>
						<p>Total Weight: ${totalWeight} </p>
					</div>
                </div>
				
            </div>
        `
        document.getElementById('display-dishes').innerHTML += dishCard;
    }
}

function makeUL(array) {
		// Create the list element:
		var list = document.createElement('ul');

		for (var i = 0; i < array.length; i++) {
			// Create the list item:
			var item = document.createElement('li');

			// Set its contents:
			item.appendChild(document.createTextNode(array[i]));

			// Add it to the list:
			list.appendChild(item);
		}
		// Finally, return the constructed list:
		return list.outerHTML;
}

var minCal = document.getElementById("minCal");
var maxCal = document.getElementById("maxCal");
var maxIng = document.getElementById("maxIngredients");
var output1 = document.getElementById("demo1");
var output2 = document.getElementById("demo2");
var output3 = document.getElementById("demo3");
output1.innerHTML = minCal.value;
output2.innerHTML = maxCal.value;
output3.innerHTML = maxIng.value;

minCal.oninput = function() {
  output1.innerHTML = this.value;
}

maxCal.oninput = function() {
  output2.innerHTML = this.value;
}

maxIng.oninput = function() {
  output3.innerHTML = this.value;
}

document.getElementById("filter").addEventListener("click", function() {
	loadDishes(searchString);
});