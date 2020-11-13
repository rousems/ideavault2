/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * MATTHEW ROUSE
 */

/** namespace. */

console.log("localstorage", localStorage);
var rhit = rhit || {};
rhit.IDEA_VAULT = "ideas";
rhit.KEY_NAME = "name";
rhit.KEY_DESC = "description";
rhit.KEY_CONTENT = "content";
rhit.KEY_AUTHOR = "userid";
rhit.KEY_CREATION_DATE = "creationDate";
rhit.KEY_TAGS = "tags";

rhit.USER_VAULT = "users"
rhit.KEY_ID = "id";
rhit.KEY_IP = "ip";
rhit.KEY_PASS = "password";
rhit.KEY_USERNAME = "username";
rhit.KEY_PFP = "pfp";

rhit.resultsManager = null;
rhit.usersManager = null;
rhit.ideaManager = null;
rhit.currentUser = null;
//console.log("we are about to set the auth manager to null again, because the authManager is: ", rhit.authManager);
/*if (rhit.authManager == undefined){
	rhit.authManager = localStorage.getItem("authmanager");
}*/
//else rhit.authManager = null;
rhit.authManager = null;

//from stackoverflow
function htmlToElement(html){
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}


////////////

rhit.User = class {
	id = "";
	ip = "";
	password = "";
	username = "";
	pfp = "";
	constructor(id, ip, password, username, pfp){
		this.id = id;
		this.password = password;
		this.username = username;
		this.ip = ip;
		this.pfp = pfp;
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
	getPfp = function(){
		return this.pfp;
	}
}


rhit.usersController = class {

	constructor(){

		console.log("created usersController");

		
		//temporary functionality
		//this.resultList = this.tempList;
		//list is stuff gotten from firebase

		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.USER_VAULT);
		console.log(this._ref);
		this._unsubscribe = null;
		//this._name = testname;
		//console.log("uid", this._name);
		this.beginListening();

		//by default, show everything;
		

		//update the view
		//this.updateView();
	}

	getNameAndPfpFromIP(){
		let gottenUsers = [];
		//where(rhit.KEY_IP, "==", localStorage.getItem("vistorip"))
		let query = this._ref.limit(50);
		//console.log(query);
		this._unsubscribe = query.onSnapshot((querySnapshot) =>{
			console.log("calling from getnameandpfp (users)");
			console.log("query snapshot:", querySnapshot);
			console.log("query snapshot.docs:", querySnapshot.docs);
			this._documentSnapshots = querySnapshot.docs;
			//console.log(this.getlength());
			for(let i = 0; i < this.getlength(); i++){
				gottenUsers.push(this.getResultAtIndex(i));
			}
			//console.log("gottenUsers", gottenUsers);
			if (gottenUsers.length != 0){
				localStorage.setItem("visitorusername", gottenUsers[0].getUsername());
				localStorage.setItem("visitorpfp", gottenUsers[0].getPfp());
			}
			else {
				localStorage.clear();
				window.location.href = "/accountSetup.html";
			}
		});
	}

	add(id, ip, username, password, pfp) {
		this._ref.add({
			[rhit.KEY_ID]: id,
			[rhit.KEY_IP]: ip,
			[rhit.KEY_USERNAME]: username,
			[rhit.KEY_PASS]: password,
			[rhit.KEY_PFP]: pfp
		})
		.then(function (docRef) {
			console.log("Document written with ID: ", docRef.id);
		})
		.catch(function (error) {
			console.error("Error adding document: ", error);
		});
	}

	beginListening(){

	}

	testPass(testname, testpass) {
		console.log("hello at usersmanager");
		console.log("test name", testname);
		console.log("test pass", testpass);

		this._name = testname;


		//let query =this._ref.orderBy(rhit.KEY_CREATION_DATE, "desc").limit(50);
		// document.querySelector("#logout").onclick=(event)=>{
		// 	rhit.authManager.signOut();
		// };

		if (this._name) {
			let query = this._ref.limit(50).where(rhit.KEY_USERNAME, "==", this._name);
	
		this._unsubscribe = query.onSnapshot((querySnapshot) =>{
			console.log("calling from begin listening (users)");
			console.log("query snapshot:", querySnapshot);
			console.log("query snapshot.docs:", querySnapshot.docs);
			this._documentSnapshots = querySnapshot.docs;
			//console.log(querySnapshot.docs);
			this.userList = [];
			for(let i = 0; i < this.getlength(); i++){
				this.userList.push(this.getResultAtIndex(i));
			}
			console.log("user list", this.userList);

			//if empty
			//tell user the name is not valid
			if (this.userList.length == 0){
				console.log("No users with that username");
			}
			//if not empty
			//check if user list entry 0 is the same password
			else{
				console.log("userlist 0's pass", this.userList[0].getPassword());
				//console.log("userlist 0's pass", this.userList[0].getPassword());
				if (testpass == this.userList[0].getPassword()){
					rhit.authManager.setSignedIn(this.userList[0]);
					console.log("what's in the authManager @ line 153", rhit.authManager);
					rhit.currentUser = this.userList[0];
					localStorage.setItem("userid", this.userList[0].getId());
					localStorage.setItem("userip", this.userList[0].getIp());
					localStorage.setItem("username", this.userList[0].getUsername());
					localStorage.setItem("userpass", this.userList[0].getPassword());
					localStorage.setItem("pfp", this.userList[0].getPfp());
					//console.log("The current user signed in is ", rhit.currentUser);
					return true;
				}
				else{
					console.log("Sign in failed, passwords do not match");
				}
			
			}			
			return false;
			//user list shows the one user, hopefully

			//this.showList = this.resultList;
			//changeListener();
			//// querySnapshot.forEach((doc) => {
			// 	console.log(doc.data());
			// });
		});
	}
	}
	stopListening() { }

	getlength = function() {
		return this._documentSnapshots.length;
	}
	getResultAtIndex(index) {
		console.log("ref", this._ref);
		const docSnapshot =this._documentSnapshots[index];
		console.log("ds", docSnapshot);
		const usor = new rhit.User(
			//docSnapshot.id,
			docSnapshot.get(rhit.KEY_ID),
			docSnapshot.get(rhit.KEY_IP),
			docSnapshot.get(rhit.KEY_PASS),
			docSnapshot.get(rhit.KEY_USERNAME),
			docSnapshot.get(rhit.KEY_PFP)
		);
		console.log("usor", usor);
		return usor;
	}
}






////////////
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

rhit.singleAddResultController = class {
	tagAddList = [];
	constructor(){

	}
	// constructor(idea){
	// 	this.name = idea.getName();
	// 	this.description = idea.getDesc()
	// 	this.tags = idea.getTags();
	// 	this.content = idea.getContent();
	// }

	add = function(name){
		this.tagAddList.push(name);
		this.updateView();
	}

	updateView(){
		this.addTag(this.tagAddList);
	}

	addTag = function(sList){
		console.log(sList);
		let numChildren = document.querySelector("#addTagSection").childElementCount;
		//maybe refine removing children later
		console.log("children", numChildren);
		for(let i = 0; i < numChildren-1; i++){
			console.log("removing: ", document.querySelector("#addTagSection").lastChild);
			document.querySelector("#addTagSection").removeChild(document.querySelector("#addTagSection").lastChild);
			// while (document.querySelector("#resultsbox").lastChild) {
			// 	document.querySelector("#resultsbox").removeChild(document.querySelector("#resultsbox").lastChild);
			// }
		}
		for(let i = 0; i < sList.length; i++){
			console.log("appending");
			document.querySelector("#addTagSection").appendChild(this._createTag(sList[i]));
		}
	}

	_createTag = function(name){
		return htmlToElement(`
		<span id="tag">
			  ${name}
		</span>`
		);
	}

}

rhit.resultsController = class {

	//this is a temporary list of results that is used to generate the ideas

	addTagList = [];

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
		console.log("uid", this._uid);
		this.beginListening(this.updateView.bind(this));

		//by default, show everything;
		

		//update the view
		//this.updateView();
	}

	add(title, description, tags, content) {
		this._ref.add({
			[rhit.KEY_NAME]: title,
			[rhit.KEY_DESC]: description,
			[rhit.KEY_TAGS]: tags,
			[rhit.KEY_CONTENT]: content,
			[rhit.KEY_AUTHOR]: localStorage.getItem("userid"),
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

		
		//let query =this._ref.orderBy(rhit.KEY_CREATION_DATE, "desc").limit(50);
		if (document.querySelector("#logout")){
			document.querySelector("#logout").onclick=(event)=>{
				//rhit.authManager.signOut();
				localStorage.removeItem("userip");
				localStorage.removeItem("userid");
				localStorage.removeItem("username");
				localStorage.removeItem("userpass");
				localStorage.removeItem("pfp");
				window.location.href = "/login.html";
			};
		}

		if (this._uid) {
			let query = this._ref.orderBy(rhit.KEY_CREATION_DATE, "desc").limit(50).where(rhit.KEY_AUTHOR, "==", this._uid);
	
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
			//console.log("this is what we search by: ", search);
			let searchLength = search.length;
			let name = instanceName;
			if (name == undefined){
				name = "";
			}
			for(let j = 0; j < name.length - searchLength + 1; j++){
				console.log("searching", name.substring(j, j+searchLength));
				if (name.substring(j, j+searchLength) === search){
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
		//console.log("filtering by", document.querySelector("#searchbar").value);
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
			tagstring += `<span id="tagstring">${tags[i]}</span>`;
		}
		console.log(tagstring);
		var testString = `<div id="idea-container">
							  <div class="card">
									<div class="card-body">
									<p class = "date">${date}</p>
									
									  <h5 class="card-title">${title}</h5>
									  <p class="card-text">${desc}</p>
									  ${tagstring}
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

rhit.AuthenticationManager = class{
	constructor(){
		this._user=null;
	}
	beginListening(changeListener){
		firebase.auth().onAuthStateChanged((user)=>{
			this._user = user;
			changeListener();

			if(user){
				const displayName=user.displayName;
				const email=user.email;
				const phoneNumber=user.phoneNumber;
				const photoURL=user.photoURL;
				const isAnonymous=user.isAnonymous;
				const uid=user.uid;
				
				console.log(displayName);
				console.log(email);
			}else{
				console.log("There is no user signed in!");
			}
		});

	}

	signOut(){
		firebase.auth().signOut().catch(function(error){
			console.log("Sign Out error");
		});
	}

	get isSignedIn(){
		return !!this._user;
	}
	get uid() {
		return this._user.uid;
	}

	get_current_user(){
		return this._user;
	}

	setSignedIn(user){
		//this.isSignedIn = true;
		this._user = user;
	}
}

rhit.checkForRedirects=function(){
	console.log("is signed in?",rhit.authManager.isSignedIn);
	console.log("the current user is", rhit.authManager);
	if(document.querySelector("#login") && /*rhit.authManager.isSignedIn*/ rhit.authManager.get_current_user() != null){
		//console.log("hello");
		window.location.href = "/mainPage.html";
	}
	if(!document.querySelector("#login") && /*!rhit.authManager.isSignedIn &&*/ rhit.authManager.get_current_user() == null && !document.querySelector("#addAccountPage") && !document.querySelector("#signUpPage")){
		console.log("hello");
		//window.location.href = "/login.html";
	}
	// if(document.querySelector("#addAccountPage") && !rhit.authManager.isSignedIn){
	// 	window.location.href = "/addAccount.html";
	// }
}

/*rhit.startFirebaseUI = function(){
	var uiConfig = {
        signInSuccessUrl: '/',
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
		  firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        ],
        
      };

      const ui = new firebaseui.auth.AuthUI(firebase.auth());
      
      ui.start('#firebaseui-auth-container', uiConfig);
}*/

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");

	rhit.usersManager = new rhit.usersController();

	$.get('https://www.cloudflare.com/cdn-cgi/trace', function(data) {
		//console.log("data", data);
		//console.log("index of ip", data.indexOf("ip"));
		let ipspot = data.indexOf("ip");
		data = data.substring(ipspot+3);
		//console.log("trimmeddata", data);
		let nextspace = data.indexOf("\n");
		data = data.substring(0, nextspace);
		//console.log(data);
		localStorage.setItem("visitorip", data);


		rhit.usersManager.getNameAndPfpFromIP();
		//console.log(localStorage);
	});

	

	if (document.querySelector("#username")){
		document.querySelector("#username").innerHTML = localStorage.getItem("username");
	}
	
	if (document.querySelector(".profilepics")){
		document.querySelectorAll(".profilepics").forEach(element => element.src = `images/${localStorage.getItem("pfp")}`);
		if (document.querySelector("#login")){
			console.log(localStorage);
			console.log(localStorage.getItem("visitorpfp"));
			console.log(localStorage.getItem("visitorusername"));
			document.querySelector("#bigProfilePic").src = `images/${localStorage.getItem("visitorpfp")}`;
			document.querySelector("#displayUsername").innerHTML = localStorage.getItem("visitorusername");
		}
	}

	
	console.log("what is the authmanager right now?", rhit.authManager);
	if (rhit.authManager == null){
		console.log("about to run new authentication manager");
		rhit.authManager = new rhit.AuthenticationManager();
		//console.log(rhit.authManager)
		//localStorage.setItem("authmanager", rhit.authManager);
		
	}
	rhit.authManager.beginListening(()=>{
		//console.log(rhit.authManager.isSignedIn);
		rhit.checkForRedirects();
		//rhit.startFirebaseUI();
	});
	rhit.resultsManager = new rhit.resultsController(localStorage.getItem("userid"));
	//rhit.currentUser = new rhit.User("","","","");

	if (document.querySelector("#firstPage")){
		window.location.href = "/login.html";
		console.log("on the login page");
	
	}

	if (document.querySelector("#login")){
		console.log("clearing localstorage");
		localStorage.clear();
		
		console.log("on the login page");
		document.querySelector("#loginButton").onclick = (event) => {
			rhit.usersManager.testPass(document.querySelector("#displayUsername").innerHTML, document.querySelector("#inputPassword").value);
			setTimeout(
				function() {
				  window.location.href = `/mainPage.html?user=${rhit.currentUser.getId()}`;
				}, 500);
			
			//rhit.checkForRedirects();
		}
	}
	
	if (document.querySelector("#mainPage")){
		//console.log("are we on the main page?");
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		rhit.currentUser = urlParams.get('user');
		//console.log("THIS IS THE CURRENT USER", rhit.currentUser);

		document.querySelector("#searchbutton").onclick = (event) => {
			rhit.resultsManager.filterBy(document.querySelector("#searchbar").value);
		}
		document.querySelector("#addbutton").onclick = (event) => {
			window.location.href = `/addIdea.html?user=${rhit.currentUser}`;
		}
		// document.querySelector("#username").onclick = (event) => {
			
		// }
	}
	if (document.querySelector("#addIdea")){
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		rhit.currentUser = urlParams.get('user');
		console.log("on the add page");
		let adder = new rhit.singleAddResultController();
		document.querySelector("#addTag").onclick = (event) => {
			let tagName = document.querySelector("#inputTag").value;
			document.querySelector("#inputTag").value = "";
			console.log(adder);
			adder.add(tagName);
		}
		document.querySelector("#backsavebutton").onclick = (event) => {
			let name = document.querySelector("#addNameField").value;
			let desc = document.querySelector("#addDescField").value;
			let content = document.querySelector("#addContentField").value;
			let tags = adder.tagAddList;
			rhit.resultsManager.add(name,desc,tags,content);
			adder = null;
			setTimeout(function(){
				window.location.href = "/mainPage.html";
			}, 500);
		}
		
		document.querySelector("#searchbutton").onclick = (event) => {
			rhit.resultsManager.filterBy(document.querySelector("#searchbar").value);
		}
	}
};

rhit.main();
