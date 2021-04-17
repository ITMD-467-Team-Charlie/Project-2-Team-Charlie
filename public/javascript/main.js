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
	document.getElementById("mySidenav").style.width = "0";
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
	var dishCard='';
	var html = '';
    for (let dish of dishes.hits) {
		
		var ingredientLines = makeUL(dish.recipe.ingredientLines);
		var calories = (dish.recipe.calories/dish.recipe.yield).toFixed(0);
		dishCard = `
            <div class="search-column">
				<div class="card">
				  <img src="${dish.recipe.image}" alt="${dish.recipe.label}" class="card-image" onerror="this.src='/images/noimage.png'">
				  <div class="search-container">
					<div class="title">${dish.recipe.label}</div>
					<table>
					<t>
					<tr>
						<th>${calories}</th> 
						<th>${dish.recipe.ingredients.length}</th> 
						<th>${dish.recipe.yield}</th> 
					</tr>
					<tr>
						<td>
							Calories
						</td>
						<td>
							Ingredients
						</td>
						<td>
							Serves
						</td>
					</tr>
					</table>
				  </div>
				</div>
			</div>
        `
		html += dishCard;
    }
	document.getElementById('display-dishes').innerHTML = html;
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

//adds event listner to a tags to pass attribute to loadDish function
[].forEach.call(document.getElementsByTagName("a"),function(el){
	el.addEventListener("click",function(e){
		if(el.getAttribute('data-id')!=null){
			loadDishes(el.getAttribute('data-id'));
		}
	});
});

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

document.getElementById("ham-open").addEventListener("click", function() {
  document.getElementById("mySidenav").style.width = "250px";
});

document.getElementById("ham-close").addEventListener("click", function() {
  document.getElementById("mySidenav").style.width = "0";
});