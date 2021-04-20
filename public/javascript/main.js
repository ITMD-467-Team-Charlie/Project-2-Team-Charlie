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
	var html = '';
    for (let dish of dishes.hits) {
		var calories = (dish.recipe.calories/dish.recipe.yield).toFixed(0);
		var id = dish.recipe.uri.split("#")[1];
		if (typeof(Storage) !== "undefined") {
			// Store
			var retrievedObject = sessionStorage.getItem(id);
			if(retrievedObject==null){
				sessionStorage.setItem(id, JSON.stringify(dish.recipe));
			}
		}
		
		var nutrients = dish.recipe.digest.slice(0, 4);
		var tbl = ''
		for (let digest of nutrients) {
			var total = digest.total.toFixed(0);
			var daily = digest.daily.toFixed(0);
			var h = `<tr><td>${digest.label}</td><td>${total}</td><td>${daily}</td><td>${digest.unit}</td><tr>`
			tbl +=h;
		}
		
		var dishCard = `
            <div class="search-column">
				<a id="dish" data-dish="${id}" onclick="getDishDetails(this.getAttribute('data-dish'));">
				<div class="card">
				  <img src="${dish.recipe.image}" alt="${dish.recipe.label}" class="card-image" onerror="this.src='/images/noimage.png'">
				  <div class="search-container">
					<div class="title">${dish.recipe.label}</div>
					<div class="card-nutrients">
					<table>
					<tr>
						<th></th>
						<th>Total</th>
						<th>Daily</th>
						<th></th>
					</tr>
					<tr>
						<td>Calories</td><td>${calories}</td><td></td><td>k.cal</td>
					</tr>
					${tbl}
					</table>
					</div>
				  </div>
				</div>
				</a>
			</div>
        `
		html += dishCard;
    }
	document.getElementById('display-dishes').innerHTML = html;
}

function makeUL(array, id) {
		// Create the list element:
		var list = document.createElement('ul');
		list.setAttribute("class", id);
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
			// loadDishes(el.getAttribute('data-id'));
			loadArticle({ action: "initialization" }, el.getAttribute('data-id'));
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

// Get the modal
var detailsmodal = document.getElementById("details-model");

// Get the <span> element that closes the modal
var detailsspan = document.getElementsByClassName("details-close")[0];

// When the user clicks on <span> (x), close the modal
detailsspan.onclick = function() {
  detailsmodal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == detailsmodal) {
    detailsmodal.style.display = "none";
  }
}

function getDishDetails(id){
	var fetched_json = sessionStorage.getItem(id);
	var obj=JSON.parse(fetched_json);
	var nutrients='';
	
	document.getElementById("tags").innerHTML = "<div class='details-title'>Labels</div>"+makeUL(obj.healthLabels, "label")+ makeUL(obj.dietLabels, "label");
	
	for (let digest of obj.digest) {
		var total = digest.total.toFixed(0);
		var daily = digest.daily.toFixed(0);
		var h = `<tr><td>${digest.label}</td><td>${total}</td><td>${daily}</td><td>${digest.unit}</td><tr>`
		nutrients +=h;
	}
	document.getElementById("digest").innerHTML = "<div class='details-title'>Nutrients</div><table><tr><th></th><th>Total</th><th>Daily</th></tr>"+nutrients+"</table>";
	document.getElementById("ingredientLines").innerHTML = "<div class='details-title'>Ingredients</div>"+makeUL(obj.ingredientLines, "ing");
	document.getElementById("cautions").innerHTML = "<div class='details-title'>Cautions</div>"+makeUL(obj.cautions, "cau");
	document.getElementById("details-model").style.display = "block";	
}
