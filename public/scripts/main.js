/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * MATTHEW ROUSE
 */

/** namespace. */
var rhit = rhit || {};

//from stackoverflow
function htmlToElement(html){
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.resultsController = class {
	_createResultCard = function(){
		//This function will get info from the database to create its cards. For now they will be identical and created via a for loop
		var defaultString = `<div id="idea-container">
        						<div class="card">
          							<div class="card-body">
							            <h5 class="card-title">Idea title</h5>
							            <p class="card-text">This is the description of the idea</p>
						            </div>
						        </div>
	  						</div>`
		return htmlToElement(defaultString);
	}
	
	addCard = function(max){
		for(let i = 0; i < max; i++)
			document.querySelector("#resultsbox").appendChild(this._createResultCard());
	}
}


/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	var rc = new rhit.resultsController();
	console.log(rc);
	rc.addCard(5);
};

rhit.main();
