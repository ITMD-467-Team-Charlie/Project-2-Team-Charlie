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
	
	//var x = document.getElementsByClassName("dropdown-content");
	//for (i = 0; i < x.length; i++) {
		//x[i].style.display = 'none';
	//}
	
	const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.edamam.com/search?q="+userInput+"&app_id=6d0f970f&app_key=c42f8d8f7aabaf2137f08352df82a7e8", false);
    xhttp.send();

    const dishes = JSON.parse(xhttp.responseText);
	
	if(dishes.hits.length>0){
		document.getElementById('display-dishes').innerHTML="";
	}
	
    for (let dish of dishes.hits) {
		var dishCard='';
		dishCard = `
            <div class="col">
                <div class="card">
					${dish.recipe.label}
					<img id="dishImg" src="${dish.recipe.image}"/>
                </div>
				
            </div>
        `
        document.getElementById('display-dishes').innerHTML += dishCard;
		
    }
}