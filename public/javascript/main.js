'use strict';
let isProcessPending = false; // for stop multiple request simultaneously
let recordsPerPage = 30; // you can set as you want to get data per ajax request
let recordsOffset = 1; // get data from given no
let recordsTotal = 1000; // store total number of record
let to = 30;
let searchText = '';
// get first time article as page load
// loadArticle({ action: 'initialization' }, '');

function sum(total, num) {
  return total + num;
}

function printHtml(dishes) {
  let html = '';
  Object.keys(dishes.data).forEach((d) => {
    const dish = dishes.data[d];
    const id = dish.recipe.uri.split('#')[1];
    if (typeof (Storage) !== 'undefined') {
      // Store
      const retrievedObject = sessionStorage.getItem(id);
      if (retrievedObject === null) {
        sessionStorage.setItem(id, JSON.stringify(dish.recipe));
      }
    }
    const percentages = [];
    const nutrients = dish.recipe.digest.slice(0, 3);
    const nutrientCal = (Number(nutrients[0].total.toFixed(0)) * 9)
      + (Number(nutrients[1].total.toFixed(0)) * 4)
      + (Number(nutrients[2].total.toFixed(0)) * 4);
    let tbl = '';
    const cal = dish.recipe.calories;
    Object.keys(nutrients).forEach((k) => {
      const digest = nutrients[k];
      const total = digest.total.toFixed(0);
      let per = 0;
      switch (digest.label) {
      case 'Fat':
        per = Number((((total * 9) / nutrientCal) * 100).toFixed(0));
        break;
      case 'Carbs':
        per = Number((((total * 4) / nutrientCal) * 100).toFixed(0));
        break;
      case 'Protein':
        per = Number((((total * 4) / nutrientCal) * 100).toFixed(0));
        break;
      default:
      // code block
      }
      percentages.push(per);
      const h = `<tr><td>${digest.label}</td><td>${total}</td><td>${digest.unit}</td></tr>`;
      tbl += h;
    });

    if (percentages.reduce(sum) > 100) {
      const diff = percentages.reduce(sum) - 100;
      percentages[1] -= diff;
    }

    const dishCard = `
            <div class="search-column">
            <div class="card">
              <img src="${dish.recipe.image}" alt="${dish.recipe.label}" class="card-image" onerror="this.src='/images/noimage.png'">
              <div class="search-container">
              <div class="title">${dish.recipe.label}</div>
              <div class="card-nutrients">
              <table>
              <tr>
                <th></th>
                <th>Total</th>
                <th>Unit</th>
              </tr>
              ${tbl}
              <tr>
                <td>Calories</td><td>${(cal).toFixed(0)}</td><td>kcal</td>
              </tr>
              </table>
              <figure>
                <div class="graphic">
                <div class="row-chart">
                  <div class="chart">
                  <span class="block-chart" title="Fat">
                    <span class="value">${percentages[0]}%</span>
                  </span>
                  <span class="block-chart" title="Carbs">
                    <span class="value">${percentages[1]}%</span>
                  </span>
                  <span class="block-chart" title="Protine">
                    <span class="value">${percentages[2]}%</span>
                  </span>
                  </div>
                </div>
              </figure>
              </div>
              </div>
              <a href="/details/recipe?rid=${dish.id}" target="_blank">+More Details</a>
              <button class="bclass" id="save" data-id="${dish.id}" onClick="getDishDetails(this);">Save</button>
            </div>
          </div>
        `;
    html += dishCard;
  });

  return html;
}

function loadArticle(params, query) {
  searchText = query;
  let html = '';
  if (!!params && params.action === 'VIEW_MORE') {
    recordsOffset += recordsPerPage;
    to += recordsPerPage;
  } else {
    recordsPerPage = 30; // you can set as you want to get data per ajax request
    recordsOffset = 1; // get data from given no
    recordsTotal = 1000; // store total number of record
    to = 30;
  }
  $.ajax({
    url: `/api/recipe?q=${searchText}&from=${recordsOffset}&to=${to}`,
    type: 'get', // send it through get method
    success(response) {
      // Do Something
      isProcessPending = false; // for make process done so new data can be get on scroll
      if (!!params && params.action === 'VIEW_MORE') {
        html = printHtml(response);
        document.getElementById('display-dishes').innerHTML += html;
      } else if (!!params && params.action === 'initialization') {
        html = printHtml(response);
        document.getElementById('display-dishes').innerHTML = html;
      }
      $('.value').each(function chart() {
        const text = $(this).text();
        $(this).parent()
          .css('width', text);
      });
    },
    error(xhr) {
      // Do Something to handle error
      console.log(xhr);
      isProcessPending = false; // for make process done so new data can be get on scroll
    }
  });
}

// on scroll new get data
$(window).scroll(() => {
  const scrollPercent = (
    (Math.round(($(window).scrollTop()))
    / (($(document).height() - $(window).height()))) * 100
  );
  // get new data only if scroll bar is greater 70% of screen
  if (document.getElementById('lazy').value ==='true' && scrollPercent > 70) {
    // this condition only satisfy ony one pending ajax completed
    // and records offset is less than  total record

    if (isProcessPending === false && recordsOffset < recordsTotal) {
      isProcessPending = true;
      loadArticle({ action: 'VIEW_MORE' }, searchText);
    }
  }
});

// adds event listner to a tags to pass attribute to loadDish function
[].forEach.call(document.getElementsByTagName('a'), (el) => {
  el.addEventListener('click', () => {
    if (el.getAttribute('data-id') !== null) {
      loadArticle({ action: 'initialization' }, el.getAttribute('data-id'));
    }
  });
});

// adds event listner to a save dish to profile
$(":button").click(function() {
  getDishDetails(this);
});

const maxCal = document.getElementById('maxcal');
const maxIng = document.getElementById('maxing');
const output2 = document.getElementById('demo2');
const output3 = document.getElementById('demo3');
output2.innerHTML = maxCal.value;
output3.innerHTML = maxIng.value;

maxCal.oninput = function updateCal() {
  output2.innerHTML = this.value;
};

maxIng.oninput = function updateIng() {
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
detailsspan.onclick = function hideModal() {
  detailsmodal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function closeModal(event) {
  if (event.target === detailsmodal) {
    detailsmodal.style.display = 'none';
  }
};

/* eslint-disable no-unused-vars */
function getDishDetails(el) {
  const id = el.getAttribute('data-id');
  const i = el.getAttribute('id');
  if(i==='save'){
    $.post('/addrecepie', {
      rid: id
    },
    (data, status) => {
      if(status==='success'){
        el.disabled = true;
      }
      console.log(`Data: ${data}\nStatus: ${status}`);
    });
  }
}
