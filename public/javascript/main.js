var searchString = '';

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

function show(val) {
    if (val == 'Male') {
        document.getElementById('women').style.display = 'none';
    } else {
        document.getElementById('women').style.display = 'block';
    }
}

function makeUL(array, id) {
    // Create the list element:
    var list = document.createElement('ul');
    list.setAttribute('class', id);
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

// adds event listner to a tags to pass attribute to loadDish function
[].forEach.call(document.getElementsByTagName('a'), function(el) {
    el.addEventListener('click', function(e) {
        if (el.getAttribute('data-id') != null) {
            loadArticle({ action: 'initialization' }, el.getAttribute('data-id'));
        }
    });
});

var minCal = document.getElementById('minCal');
var maxCal = document.getElementById('maxCal');
var maxIng = document.getElementById('maxIngredients');
var output1 = document.getElementById('demo1');
var output2 = document.getElementById('demo2');
var output3 = document.getElementById('demo3');
output1.innerHTML = minCal.value;
output2.innerHTML = maxCal.value;
output3.innerHTML = maxIng.value;

minCal.oninput = function() {
    output1.innerHTML = this.value;
};

maxCal.oninput = function() {
    output2.innerHTML = this.value;
};

maxIng.oninput = function() {
    output3.innerHTML = this.value;
};

document.getElementById('filter').addEventListener('click', function() {
    loadArticle({ action: 'initialization' }, searchText);
});

document.getElementById('ham-open').addEventListener('click', function() {
    document.getElementById('mySidenav').style.width = '250px';
});

document.getElementById('ham-close').addEventListener('click', function() {
    document.getElementById('mySidenav').style.width = '0';
});

// Get the modal
var detailsmodal = document.getElementById('details-model');

// Get the <span> element that closes the modal
var detailsspan = document.getElementsByClassName('details-close')[0];

// When the user clicks on <span> (x), close the modal
detailsspan.onclick = function() {
    detailsmodal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == detailsmodal) {
        detailsmodal.style.display = 'none';
    }
};

function getDishDetails(id) {
    var fetched_json = sessionStorage.getItem(id);
    var obj = JSON.parse(fetched_json);
    var nutrients = '';

    document.getElementById('tags').innerHTML = "<div class='details-title'>Labels</div>" + makeUL(obj.healthLabels, 'label') + makeUL(obj.dietLabels, 'label');

    for (let digest of obj.digest) {
        var total = digest.total.toFixed(0);
        var daily = digest.daily.toFixed(0);
        var h = `<tr><td>${digest.label}</td><td>${total}</td><td>${daily}</td><td>${digest.unit}</td><tr>`;
        nutrients += h;
    }
    document.getElementById('digest').innerHTML = "<div class='details-title'>Nutrients</div><table><tr><th></th><th>Total</th><th>Daily</th></tr>" + nutrients + '</table>';
    document.getElementById('ingredientLines').innerHTML = "<div class='details-title'>Ingredients</div>" + makeUL(obj.ingredientLines, 'ing');
    document.getElementById('cautions').innerHTML = "<div class='details-title'>Cautions</div>" + makeUL(obj.cautions, 'cau');
    document.getElementById('details-model').style.display = 'block';
}