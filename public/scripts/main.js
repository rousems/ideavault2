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
	date = new Date();
	constructor(title, description, tags, content, date){
		this.title = title;
		this.description = description;
		this.tags = tags;
		this.content = content;
		this.date = date;
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
	getDate = function(){
		return this.date.getTime();
	}
}

rhit.resultsController = class {
	//this is a temporary list of results that is used to generate the ideas
	resultList = [];

	showList = [];
	
	tempList = [new rhit.Result("Test1Title", "Test1Desc", ["Test1Tag1", "Test1Tag2"], "Test1Content", new Date("1995-12-17T03:24:00")),
				new rhit.Result("Test2Title", "Test2Desc", ["Test2Tag1", "Test2Tag2"], "Test2Content", new Date("1996-12-17T03:24:00")),
				new rhit.Result("Test3Title", "Test3Desc", ["Test3Tag1", "Test3Tag2"], "Test3Content", new Date("1997-12-17T03:24:00")),
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
		switch(searchBy){
			case "by Date":
				this.showList = this.filterByDate();
				this.updateView();
				break;
			case "by Tag":
				this.showList = this.filterByTag(search);
				this.updateView();
				break;
			case "by Name":
				this.showList = this.filterByName(search);
				this.updateView();
				break;
			case "by Desc.":
				this.showList = this.filterByDesc(search);
				this.updateView();
				break;
			default:
				return resultList;
		}
	}
	filterByDate = function(){
		let sortedList = this.resultList.sort((a, b) => a.getDate() - b.getDate());
		console.log("sorted list:", sortedList);
		// for (let i = 0; i < this.resultList.length; i++){
			
		// }
		return sortedList;
	}
	filterByName = function(search){
		let unsortedList = this.resultList;
		console.log(unsortedList);
		let sortedList = [];
		for(let i = 0; i < unsortedList.length; i++){
			let instanceName = unsortedList[i].getTitle();
			let searchLength = search.length;
			for(let j = 0; j < instanceName.length - searchLength + 1; j++){
				console.log("searching", instanceName.substring(j, j+searchLength));
				if (instanceName.substring(j, j+searchLength) === search){
					sortedList.push(unsortedList[i]);
					break;
				}
			}
		}
		sortedList = sortedList.sort((a, b) => a.getDate() - b.getDate());
		console.log("sorted list:", sortedList);
		return sortedList;
	}
	filterByTag = function(search){
		let unsortedList = this.resultList;
		let matched = false;
		console.log(unsortedList);
		let sortedList = [];
		for(let i = 0; i < unsortedList.length; i++){
			let tags = unsortedList[i].getTags();
			let searchLength = search.length;
			for(let k = 0; k < tags.length; k++){
				for(let j = 0; j < tags[k].length - searchLength + 1; j++){
					console.log("searching", tags[k].substring(j, j+searchLength));
					if (tags[k].substring(j, j+searchLength) === search){
						sortedList.push(unsortedList[i]);
						matched = true;
						break;
					}
				}
				if (matched){
					break;
				}
			}
		}
		sortedList = sortedList.sort((a, b) => a.getDate() - b.getDate());
		console.log("sorted list:", sortedList);
		return sortedList;
	}
	filterByDesc = function(search){
		let unsortedList = this.resultList;
		console.log(unsortedList);
		let sortedList = [];
		for(let i = 0; i < unsortedList.length; i++){
			let instanceName = unsortedList[i].getDesc();
			let searchLength = search.length;
			for(let j = 0; j < instanceName.length - searchLength + 1; j++){
				console.log("searching", instanceName.substring(j, j+searchLength));
				if (instanceName.substring(j, j+searchLength) === search){
					sortedList.push(unsortedList[i]);
					break;
				}
			}
		}
		sortedList = sortedList.sort((a, b) => a.getDate() - b.getDate());
		console.log("sorted list:", sortedList);
		return sortedList;
	}
	updateView = function(){
		console.log("filtering by", document.querySelector("#searchbar").value);
		//this.filterBy(document.querySelector("#searchbar").value);
		this.addCard(this.showList);
	}
	_createResultCard = function(title, desc, date){
		//This function will get info from the database to create its cards. For now they will be identical and created via a for loop
		var defaultString = `<div id="idea-container">
        						<div class="card">
									  <div class="card-body">
									  	<p class = "date">Date</p>
							            <h5 class="card-title">Idea title</h5>
							            <p class="card-text">This is the description of the idea</p>
						            </div>
								</div>
							  </div>`
		var string = defaultString;
		var testString = `<div id="idea-container">
							  <div class="card">
									<div class="card-body">
									<p class = "date">${date}</p>
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
		let numChildren = document.querySelector("#resultsbox").childElementCount;
		//maybe refine removing children later
		console.log("children", numChildren);
		for(let i = 0; i < numChildren; i++){
			document.querySelector("#resultsbox").removeChild(document.querySelector("#resultsbox").lastChild);
		}
		for(let i = 0; i < sList.length; i++){
			document.querySelector("#resultsbox").appendChild(this._createResultCard(sList[i].getTitle(), sList[i].getDesc(), sList[i].getDate()));
		}
	}
}


/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	if (document.querySelector("#firstPage")){
		window.location.href = "/login.html";
	}
	
	var rc = new rhit.resultsController();
	console.log(rc);
	document.querySelector("#searchbutton").onclick = (event) => {
		rc.filterBy(document.querySelector("#searchbar").value);
	}
	//rc.addCard(5);
};

rhit.main();
