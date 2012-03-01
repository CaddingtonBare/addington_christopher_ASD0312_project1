// Name: Christopher Addington
// Date: 27 February, 2012
// Assignment: Project 1
// ASD Term 0312

$(function(){

var saveLocal = function(key){
    if(!key){
        var id                  = Math.floor(Math.random()*42000000); 
    }else{
        id = key;
    }
    var item                    = {};
    item.sports                 = ["Sport: ", $('#sports').value];
    item.teamname               = ["Name: ", $('#teamname').value];
    item.teamsize               = ["Team Size: ", $('#teamsize').value];
    item.nextdate               = ["Next available date: ", $('#nextdate').value];
//Save data into Local Storage: Use Stringify to convert our object to a string
    localStorage.setItem(id, JSON.stringify(item));
}   
    var tmform = $('#teamform');
    
    tmform.validate({
        invalidHandler: function(form, validator){},
        submitHandler: function(){
            var data = tmform.serializeArray();
            parseTeamForm(data);
            saveLocal();
            alert("Team saved!");

    //Create select field and populate with options

    //Checkbox function
    function getCheckboxValue(){
        if($('#playtime').checked){
            availableValue = $('#playtime').value;
        }else{
            availableValue = "No"
        }
    }
    
    /* Multi-component checkbox function, not using it for this week's project.  May not be very close to an ideal solution but I feel like I get the basic approach
      after having thought it over for a while.  Stopped trying to get it done for this project because it was taking up too much time.
    function getCheckbox() {
        var times = ["morning", "afternoon", "evening"],
            timeValues = ["Morning", "Afternoon", "Evening"],
            availableValue = [];
        for (i = 0; i < times.length; i++) {
            var whichTime = document.getElementById(times[i]);
            if (whichTime.checked) {
                availableValue.push(timeValues[i]);
            }else{
                availableValue.push("Not available in the" + timeValues[i]);
            }
        }
        return availableValue;
    }
    */

    var toggleControls = function(n){
        switch(n){
            case "on":
                $('#teamForm').style.display = "none";
                $('#clearData').style.display = "inline";
                $('#displayData').style.display = "none";
                $('#addNew').style.display = "inline";
                break;
            case "off":
                $('#teamForm').style.display = "block";
                $('#clearData').style.display = "inline";
                $('#displayData').style.display = "inline";
                $('#addNew').style.display = "none";
                $('#items').style.display = "none";
                break;
            default:
                return false;
        }
    }
    function saveLocal(key) {
        if(!key){
           var id                  = Math.floor(Math.random()*42000000); 
        }else{
            id = key;
        }
        getCheckboxValue();
        var item                = {};
            item.sports         = ["Sport: ", $('#sports').value];
            item.teamname       = ["Name: ", $('#teamname').value];
            item.teamsize       = ["Team Size: ", $('#teamsize').value];
            item.availabletime  = ["Only evening games: ", availableValue];
            item.nextdate       = ["Next available date: ", $('#nextdate').value];
            item.notes          = ["Notes: ", $('#notes').value];
        //Save data into Local Storage: Use Stringify to convert our object to a string
        localStorage.setItem(id, JSON.stringify(item));
        alert("Team saved!");
    }
    var getData = function(){
        toggleControls("on");
        if(localStorage.length === 0){
            autoFillData();
            alert("There is no data in storage so default data was added.");
        }
        var makeDiv = document.createElement('div');
        makeDiv.setAttribute("id", "items");
        var makeList = document.createElement('ul');
        makeDiv.appendChild(makeList);
        document.body.appendChild(makeDiv);
        $('#items').style.display = "block";
        for(i = 0, j = localStorage.length; i < j; i++){
            var makeli = document.createElement('li');
            var linksLi = document.createElement('li');
            makeList.appendChild(makeli);
            var key = localStorage.key(i);
            var value = localStorage.getItem(key);
            var obj = JSON.parse(value);
            var makeSubList = document.createElement('ul');
            makeli.appendChild(makeSubList);
            getImage(obj.sports[1], makeSubList);
            for (var n in obj){
                var makeSubli = document.createElement('li');
                makeSubList.appendChild(makeSubli);
                var optSubText = obj[n][0] + " " + obj[n][1];
                makeSubli.innerHTML = optSubText;
                makeSubList.appendChild(linksLi);
            }
            makeItemLinks(localStorage.key(i), linksLi); //Create edit/delete links for each item.
        }    
    }
    
    //Function to get a unique image for each sport.
    function getImage(catName, makeSubList){
        var imageLi = document.createElement('li');
        makeSubList.appendChild(imageLi);
        var makeImg = document.createElement('img');
        var setSrc = makeImg.setAttribute("src", "images/" + catName + ".png");
        imageLi.appendChild(makeImg);
        
    }
    
    //JSON OBJECT to autofill default localStorage data.
    function autoFillData(){
        //Store JSON to localStorage
        for (var n in json){
            var id = Math.floor(Math.random()*42000000);
            localStorage.setItem(id, JSON.stringify(json[n]));
        }
    }
    autoFillData();
    
    //makeItemLinks function
    //Incorporates edit/delete links for local storage on display.
    function makeItemLinks(key, linksLi){
        var editLink = document.createElement('a');
        editLink.href = "#";
        editLink.key = key;
        var editText = "Edit Team";
        editLink.on("click", editItem);
        editLink.innerHTML = editText;
        linksLi.appendChild(editLink);
        
        //Line break to separate edit & delete links.
        var breakTag = document.createElement('br');
        linksLi.appendChild(breakTag);
        
        //Add a delete item link in local storage display.
        var deleteLink = document.createElement('a');
        deleteLink.href = "#";
        deleteLink.key = key;
        var deleteText = "Delete Team";
        deleteLink.on("click", deleteItem);
        deleteLink.innerHTML = deleteText;
        linksLi.appendChild(deleteLink);
    }
    
    function editItem(){
        //Retrieve data from specified team.
        var value = localStorage.getItem(this.key);
        var item = JSON.parse(value);
        
        //Display form
        toggleControls("off");
        
        //Populate form with local storage.
        $('#sports').value = item.sports[1];
        $('#teamname').value = item.teamname[1];
        $('#teamsize').value = item.teamsize[1];
        if (item.availabletime[1] == "Yes") {
            $('#playtime').setAttribute("checked", "checked");
        }
        $('#nextdate').value = item.nextdate[1];
        $('#notes').value = item.notes[1];
        
        //Remove listener from Add Team submission.
        save.removeEventListener("click", saveLocal);
        //Change Add Team value to Edit Team
        $('#submit').value = "Edit Team";
        var editSubmit = $('#submit');
        editSubmit.addEventListener("click", validate);
        editSubmit.key = this.key;
    }
    
    var deleteItem = function(){
        var ask = confirm("Are you sure you want to delete this team?");
        if (ask == true){
            localStorage.removeItem(this.key);
            alert("The team was deleted.");
            window.location.reload();
        }else{
            alert("Team was not deleted.");
        }
    }
    
    var clearLocal = function(){
        if(localStorage.length === 0){
            alert("There is no data to clear.");
        }else{
            localStorage.clear();
            alert("All teams have been deleted!");
            window.location.reload();
            return false;
        }
    }
    
    var validate = function(e){
        //Define elements to validate
        var getSport = $('#sports');
        var getTeamName = $('#teamname');
        
        //Reset error messages
        errMsg.innerHTML = "";
        getSport.style.border = "1px solid black";
        getTeamName.style.border = "1px solid black";

        
        //Get error messages
        var messageAry = [];
        //Group validation
        if (getSport.value == "Choose sport..."){
            var sportError = "Please choose a sport.";
            getSport.style.border = "1px solid red";
            messageAry.push(sportError);
        }
        //Team Name validation
        if (getTeamName.value == ""){
            var teamNameError = "Please enter a team name."
            getTeamName.style.border = "1px solid red";
            messageAry.push(teamNameError);
        }
        //Display errors
        if (messageAry.length >= 1){
            for( var i=0, j=messageAry.length; i<j; i++){
                var text = document.createElement('li')
                text.innerHTML = messageAry[i];
                errMsg.appendChild(text);
            }
        e.preventDefault();
        return false;
        }else{
            saveLocal(this.key);
        }
    }
    
    var selectSport = ["Choose sport...", "Basketball", "Football", "Racquetball", "Soccer", "Tennis"],
        errMsg = $('#errors');
    fillOptions();
    //Link/Submit Click events
    var displayLink = $('#displayData');
    displayLink.on("click", getData);
    var clearLink = $('#clearData');
    clearLink.on("click", clearLocal);
    var save = $('#submit');
    save.on("click", validate);
});
});