var isProcessPending = false; // for stop multiple request simultaneously
var recordsPerPage = 30; // you can set as you want to get data per ajax request
var recordsOffset = 1; // get data from given no
var recordsTotal = 1000; // store total number of record
var to = 30;
var searchText = '';
// get first time article as page load
//loadArticle({ action: 'initialization' }, '');

function sum(total, num) {
    return total + num;
}

function printHtml(dishes) {
    var html = '';

    for (let dish of dishes.data) {
        var calories = (dish.recipe.calories / dish.recipe.yield).toFixed(0);
        var id = dish.recipe.uri.split('#')[1];
        if (typeof(Storage) !== 'undefined') {
            // Store
            var retrievedObject = sessionStorage.getItem(id);
            if (retrievedObject == null) {
                sessionStorage.setItem(id, JSON.stringify(dish.recipe));
            }
        }
        var percentages = [];
        var nutrients = dish.recipe.digest.slice(0, 3);
        var nutrient_cal = (parseInt(nutrients[0].total.toFixed(0)) * 9) + (parseInt(nutrients[1].total.toFixed(0)) * 4) + (parseInt(nutrients[2].total.toFixed(0)) * 4);
        var tbl = '';
        var cal = dish.recipe.calories;
        for (let digest of nutrients) {
            var total = digest.total.toFixed(0);
            var per = 0;
            switch (digest.label) {
                case 'Fat':
                    per = parseInt((((total * 9) / nutrient_cal) * 100).toFixed(0));
                    break;
                case 'Carbs':
                    per = parseInt((((total * 4) / nutrient_cal) * 100).toFixed(0));
                    break;
                case 'Protein':
                    per = parseInt((((total * 4) / nutrient_cal) * 100).toFixed(0));
                    break;
                default:
                    // code block
            }
            percentages.push(per);
            var h = `<tr><td>${digest.label}</td><td>${total}</td><td>${digest.unit}</td></tr>`;
            tbl += h;
        }

        if (percentages.reduce(sum) > 100) {
            var diff = percentages.reduce(sum) - 100;
            percentages[1] -= diff;
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
				</div>
				</a>
			</div>
        `;
        html += dishCard;
    }
    return html;
}

function loadArticle(params, query) {
    searchText = query;
    var html = '';
    if (!!params && params.action === 'VIEW_MORE') {
        recordsOffset += recordsPerPage;
        to += recordsPerPage;
    } else {
        recordsPerPage = 30; // you can set as you want to get data per ajax request
        recordsOffset = 1; // get data from given no
        recordsTotal = 1000; // store total number of record
        to = 30;
    }
    var cal = minCal.value + '-' + maxCal.value;
    var ing = maxIng.value;
    $.ajax({
        url: 'http://localhost:3000/api/recepie?from=' + recordsOffset + '&to=' + to,
        type: 'get', // send it through get method
        success: function(response) {
            // Do Something
            isProcessPending = false; // for make process done so new data can be get on scroll
            if (!!params && params.action === 'VIEW_MORE') {
                html = printHtml(response);
                document.getElementById('display-dishes').innerHTML += html;
            } else if (!!params && params.action === 'initialization') {
                html = printHtml(response);
                document.getElementById('display-dishes').innerHTML = html;
            }
            $('.value').each(function() {
                var text = $(this).text();
                $(this).parent().css('width', text);
            });
            console.log('dish list');
        },
        error: function(xhr) {
            // Do Something to handle error
            isProcessPending = false; // for make process done so new data can be get on scroll
        }
    });
}

// on scroll new get data
$(window).scroll(function() {
    var scrollPercent = Math.round(($(window).scrollTop()) / ($(document).height() - $(window).height()) * 100);
    // get new data only if scroll bar is greater 70% of screen
    if (scrollPercent > 70) {
        // this condition only satisfy ony one pending ajax completed and records offset is less than  total record

        if (isProcessPending === false && recordsOffset < recordsTotal) {
            isProcessPending = true;
            loadArticle({ action: 'VIEW_MORE' }, searchText);
        }
    }
});