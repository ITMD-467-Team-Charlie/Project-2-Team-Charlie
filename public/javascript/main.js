const searchString = '';

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
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
  const list = document.createElement('ul');
  list.setAttribute('class', id);
  for (let i = 0; i < array.length; i++) {
    // Create the list item:
    const item = document.createElement('li');

    // Set its contents:
    item.appendChild(document.createTextNode(array[i]));

    // Add it to the list:
    list.appendChild(item);
  }
  // Finally, return the constructed list:
  return list.outerHTML;
}

// adds event listner to a tags to pass attribute to loadDish function
[].forEach.call(document.getElementsByTagName('a'), (el) => {
  el.addEventListener('click', (e) => {
    if (el.getAttribute('data-id') != null) {
      loadArticle({ action: 'initialization' }, el.getAttribute('data-id'));
    }
  });
});

const maxCal = document.getElementById('maxcal');
const maxIng = document.getElementById('maxing');
const output1 = document.getElementById('demo1');
const output2 = document.getElementById('demo2');
const output3 = document.getElementById('demo3');
output2.innerHTML = maxCal.value;
output3.innerHTML = maxIng.value;

maxCal.oninput = function () {
  output2.innerHTML = this.value;
};

maxIng.oninput = function () {
  output3.innerHTML = this.value;
};

document.getElementById('filter').addEventListener('click', () => {
  loadArticle({ action: 'initialization' }, searchText);
	  document.getElementById('mySidenav').style.width = '0';
});

document.getElementById('ham-open').addEventListener('click', () => {
  document.getElementById('mySidenav').style.width = '250px';
});

document.getElementById('ham-close').addEventListener('click', () => {
  document.getElementById('mySidenav').style.width = '0';
});

// Get the modal
const detailsmodal = document.getElementById('details-model');

// Get the <span> element that closes the modal
const detailsspan = document.getElementsByClassName('details-close')[0];

// When the user clicks on <span> (x), close the modal
detailsspan.onclick = function () {
  detailsmodal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == detailsmodal) {
    detailsmodal.style.display = 'none';
  }
};

function getDishDetails(id) {
  $.post('/addrecepie', {
    rid: id,
  },
  (data, status) => {
    console.log(`Data: ${data}\nStatus: ${status}`);
  });

  /** var fetched_json = sessionStorage.getItem(id);
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
    document.getElementById('details-model').style.display = 'block';* */
}
