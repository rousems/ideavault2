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

rhit.Result = class {
	title = "";
	description = "";
	tags = [];
	content = "";
	constructor(title, description, tags, content){
		this.title = title;
		this.description = description;
		this.tags = tags;
		this.content = content;
	}
	getTitle = function(){
		return this.title;
	}
	getDesc = function(){
		return this.description;
	}
	getTags = function(){
		return this.tags;
	}
	getContent = function(){
		return this.content;
	}
}

rhit.resultsController = class {
	//this is a temporary list of results that is used to generate the ideas
	resultList = [];

	showList = [];
	
	tempList = [new rhit.Result("Test1Title", "Test1Desc", ["Test1Tag1", "Test1Tag2"], "Test1Content"),
				new rhit.Result("Test2Title", "Test2Desc", ["Test2Tag1", "Test2Tag2"], "Test2Content"),
				new rhit.Result("Test3Title", "Test3Desc", ["Test3Tag1", "Test3Tag2"], "Test3Content"),
				];

	constructor(list){
		//temporary functionality
		this.resultList = this.tempList;
		//list is stuff gotten from firebase

		//by default, show everything;
		this.showList = this.resultList;

		//update the view
		this.updateView();
	}
	addResult = function(result){
		this.showList.push(result);
		console.log("added", result);
	}
	clear = function(){
		this.showList = [];
		console.log("list cleared");
	}
	update = function(){
		//gets the newest list of results
	}
	filterBy = function(search){
		//filter the results displayed by searchBy
		var searchBy = document.querySelector("#sortBy").value;
		console.log("search By:", searchBy);
	}
	updateView = function(){
		this.filterBy("help");
		this.addCard(this.showList);
	}
	_createResultCard = function(title, desc){
		//This function will get info from the database to create its cards. For now they will be identical and created via a for loop
		var defaultString = `<div id="idea-container">
        						<div class="card">
          							<div class="card-body">
							            <h5 class="card-title">Idea title</h5>
							            <p class="card-text">This is the description of the idea</p>
						            </div>
								</div>
							  </div>`
		var string = defaultString;
		var testString = `<div id="idea-container">
							  <div class="card">
									<div class="card-body">
									  <h5 class="card-title">${title}</h5>
									  <p class="card-text">${desc}</p>
								  </div>
							  </div>
							</div>`
		string = testString;
		return htmlToElement(string);
	}
	
	addCard = function(sList){
		console.log(sList);
		for(let i = 0; i < sList.length; i++){
			document.querySelector("#resultsbox").appendChild(this._createResultCard(sList[i].getTitle(), sList[i].getDesc()));
		}
	}
}


/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	var rc = new rhit.resultsController();
	console.log(rc);
	//rc.addCard(5);
};

rhit.main();
