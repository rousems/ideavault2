/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * MATTHEW ROUSE
 */

/** namespace. */
var rhit = rhit || {};
rhit.IDEA_VAULT = "ideas";
rhit.KEY_NAME = "name";
rhit.KEY_DESC = "description";
rhit.KEY_CONTENT = "content";
rhit.KEY_AUTHOR = "userid";
rhit.KEY_CREATION_DATE = "creationDate";
rhit.KEY_TAGS = "tags";

rhit.KEY_ID = "id";
rhit.KEY_IP = "ip";
rhit.KEY_PASS = "password";
rhit.KEY_USERNAME = "username";

rhit.resultsManager = null;
rhit.ideaManager = null;
rhit.currentUser = null;

//from stackoverflow
function htmlToElement(html){
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.User = class {
	id = "";
	ip = "";
	password = "";
	username = "";
	constructor(id, password, username){
		this.id = id;
		this.password = password;
		this.username = username;
		this.ip = ip;
	}
	getId = function(){
		return this.id;
	}
	getIp = function(){
		return this.ip;
	}
	getPassword = function(){
		return this.password;
	}
	getUsername = function(){
		return this.username;
	}
}

rhit.Result = class {
	id = "";
	title = "";
	description = "";
	tags = [];
	content = "";
	author = "";
	date = firebase.firestore.Timestamp.fromDate(new Date());
	constructor(id, title, description, tags, content, date, author){
		this.id = id;
		this.title = title;
		this.description = description;
		this.tags = tags;
		this.content = content;
		this.date = date;
		this.author = author;
	}
	getId = function(){
		return this.id;
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
		console.log('date', this.date);
		let datime = this.date.toDate();
		const month = datime.toLocaleString('default', { month: 'long' });
		let retstring = month + " " + datime.getDate() + ", " + datime.getFullYear();
		return retstring;
	}
}

rhit.resultsController = class {

	//this is a temporary list of results that is used to generate the ideas
	resultList = [];

	showList = [];
	
	tempList = [new rhit.Result("Test1Title", "Test1Desc", ["Test1Tag1", "Test1Tag2"], "Test1Content", new Date("1995-12-17T03:24:00"), "author"),
				new rhit.Result("Test2Title", "Test2Desc", ["Test2Tag1", "Test2Tag2"], "Test2Content", new Date("1996-12-17T03:24:00"), "author"),
				new rhit.Result("Test3Title", "Test3Desc", ["Test3Tag1", "Test3Tag2"], "Test3Content", new Date("1997-12-17T03:24:00"), "author"),
				];

	constructor(uid){
		//temporary functionality
		//this.resultList = this.tempList;
		//list is stuff gotten from firebase

		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.IDEA_VAULT);
		console.log(this._ref);
		this._unsubscribe = null;
		this._uid = uid;
		this.beginListening(this.updateView.bind(this));

		//by default, show everything;
		

		//update the view
		//this.updateView();
	}

	add(title, description, tags, content) {
		this._ref.add({
			[rhit.KEY_TITLE]: title,
			[rhit.KEY_DESC]: description,
			[rhit.KEY_TAGS]: tags,
			[rhit.KEY_CONTENT]: content,
			[rhit.KEY_AUTHOR]: rhit.KEY_ID,
			[rhit.KEY_CREATION_DATE]: firebase.firestore.Timestamp.now()
		})
		.then(function (docRef) {
			console.log("Document written with ID: ", docRef.id);
		})
		.catch(function (error) {
			console.error("Error adding document: ", error);
		});
	}

	beginListening(changeListener) {

		let query =this._ref.orderBy(rhit.KEY_CREATION_DATE, "desc").limit(50);

		if (this._uid) {
			query = query.where(rhit.KEY_AUTHOR, "==", this._uid);
		}
	
		this._unsubscribe = query.onSnapshot((querySnapshot) =>{
			console.log("calling from begin listening");
			console.log("query snapshot:", querySnapshot);
			console.log("query snapshot.docs:", querySnapshot.docs);
			this._documentSnapshots = querySnapshot.docs;
			//console.log(querySnapshot.docs);
			this.resultList = [];
			for(let i = 0; i < this.getlength(); i++){
				this.resultList.push(this.getResultAtIndex(i));
			}
			console.log("result list", this.resultList);
			this.showList = this.resultList;
			changeListener();
			// querySnapshot.forEach((doc) => {
			// 	console.log(doc.data());
			// });
		});
	}
	stopListening() { }

	getlength = function() {
		return this._documentSnapshots.length;
	}
	getResultAtIndex(index) {
		console.log("ref", this._ref);
		const docSnapshot =this._documentSnapshots[index];
		console.log("ds", docSnapshot);
		const newIdea = new rhit.Result(
			docSnapshot.id,
			docSnapshot.get(rhit.KEY_NAME),
			docSnapshot.get(rhit.KEY_DESC),
			docSnapshot.get(rhit.KEY_TAGS),
			docSnapshot.get(rhit.KEY_CONTENT),
			docSnapshot.get(rhit.KEY_CREATION_DATE),
			docSnapshot.get(rhit.KEY_AUTHOR)
		);
		return newIdea;
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
					matched = false;
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
	_createResultCard = function(title, desc, date, tags){
		//This function will get info from the database to create its cards. For now they will be identical and created via a for loop
		var defaultString = `<div id="idea-container">
        						<div class="card">
									  <div class="card-body">
										<p class = "date">Date</p>
										 <p class = "card-text-right">Right text</p>
							            <h5 class="card-title">Idea title</h5>
							            <p class="card-text">This is the description of the idea</p>
						            </div>
								</div>
							  </div>`
		var string = defaultString;
		let tagstring = "";
		for(let i = 0; i < tags.length; i++){
			tagstring += tags[i] + "  ";
		}
		console.log(tagstring);
		var testString = `<div id="idea-container">
							  <div class="card">
									<div class="card-body">
									<p class = "date">${date}</p>
									
									  <h5 class="card-title">${title}</h5>
									  <p class="card-text">${desc}</p>
									  <h7>${tagstring}</h7>
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
			console.log("removing: ", document.querySelector("#resultsbox").lastChild);
			document.querySelector("#resultsbox").removeChild(document.querySelector("#resultsbox").lastChild);
			// while (document.querySelector("#resultsbox").lastChild) {
			// 	document.querySelector("#resultsbox").removeChild(document.querySelector("#resultsbox").lastChild);
			// }
		}
		for(let i = 0; i < sList.length; i++){
			document.querySelector("#resultsbox").appendChild(this._createResultCard(sList[i].getTitle(), sList[i].getDesc(), sList[i].getDate(), sList[i].getTags()));
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
	
	if (document.querySelector("#mainPage")){
		var rc = new rhit.resultsController();
		console.log(rc);
		document.querySelector("#searchbutton").onclick = (event) => {
			rc.filterBy(document.querySelector("#searchbar").value);
		}
		document.querySelector("#addbutton").onclick = (event) => {
			window.location.href = "/addIdea.html";
		}
		document.querySelector("#username").onclick = (event) => {
			
		}
	}
	if (document.querySelector("#addIdea")){
		document.querySelector("#backbutton").onclick = (event) => {
			window.location.href = "/mainPage.html";
		}
	}
};

rhit.main();
