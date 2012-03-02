// Name: Christopher Addington
// Date: 27 February, 2012
// Assignment: Project 1
// ASD Term 0312

$(function(){    
    
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
        var displayNone = css({ display: none });
        var displayInline = css({ display: inline });
        var displayBlock = css({ display: block });
        
        switch(n){
            case "on":
                $('#teamForm').displayNone
                $('#clearData').displayInline
                $('#displayData').displayNone
                $('#addNew').displayInline
                break;
            case "off":
                $('#teamForm').displayBlock
                $('#clearData').displayInline
                $('#displayData').displayInline
                $('#addNew').displayNone
                $('#items').displayNone
                break;
            default:
                return false;
        }
    }
    var saveLocal = function(key) {
        if(!key){
           var id                  = Math.floor(Math.random()*42000000); 
        }else{
            id = key;
        }
        var item                = {};
            item.sports         = ["Sport: ", $('#selectsport').html()];
            item.teamname       = ["Name: ", $('#teamname').html()];
            item.teamsize       = ["Team Size: ", $('#teamsize').html()];
            item.availabletime  = ["Only evening games: ", $('#availabletime').html()];
            item.nextdate       = ["Next available date: ", $('#nextdate').html()];
            item.notes          = ["Notes: ", $('#notes').html()];
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
        $('body')
            .append($('<div id="items"></div>'))
        ;
        $('<ul id="itemsUl"></ul>')
            .appendTo('#items')
        ;
        $('#items').css({
            display: block
        });
        for(i = 0, j = localStorage.length; i < j; i++){
            var key = localStorage.key(i);
            var value = localStorage.getItem(key);
            var obj = JSON.parse(value);
            $('#itemsUl')
                .append('<li></li>')
            ;
            $('#itemsUl li:last')
                .append('<ul></ul>')
            getImage(obj.sports[1]);
            for (var n in obj){
                var optSubText = obj[n][0] + " " + obj[n][1];
                var subLi = $('#subLi');
                $('#itemsUl li:last ul:last')
                    .append('<li id="subLi"></li>')
                    .append('<li id="linksLi"></li>')
                ;
                subLi
                    .html(optSubText)
                ;        
            }            
            makeItemLinks(key); //Create edit/delete links for each item.
        }    
    }
    
    //Function to get a unique image for each sport.
    function getImage(catName){
        $('#itemsUl li:last ul:last')
            .append('<li><img src="images/" + catName + ".png"')
        ;        
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
    var makeItemLinks = function (key){
        var linksLi =   $('#itemsUl li:last ul:last li:last');
            linksLi.key = key;
        linksLi
            .append('<a id="editLink" href="#">Edit Team</a>')
            .append('<br>')
            .append('<a id="deleteLink" href="#">Delete Team</a>')
        ;
        $('#editLink').on("click", editItem);
        $('#deleteLink').on("click", deleteItem);
    }
    
    function editItem(){
        //Retrieve data from specified team.
        var value = localStorage.getItem(this.key);
        var item = JSON.parse(value);
        
        //Display form
        toggleControls("off");
        
        //Populate form with local storage.
        $('#selectsport').html(item.sports[1]);
        $('#teamname').html(item.teamname[1]);
        $('#teamsize').html(item.teamsize[1]);
        $('#availabletime').html(item.availabletime[1]);
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
        var getSport = $('#selectsport');
        var getTeamName = $('#teamname');
        var getNextDate = $('#nextdate');
        
        //Reset error messages
        errMsg.html("");
        getSport.css({
            border: 1px solid black
        });
        getTeamName.css({
            border: 1px solid black
        });

        //Get error messages
        var messageAry = [];
        //Group validation
        if (getSport.html() == "Choose sport..."){
            var sportError = "Please choose a sport.";
            getSport.css({
                border: 1px solid red
            });
            messageAry.push(sportError);
        }
        //Team Name validation
        if (getTeamName.html() == ""){
            var teamNameError = "Please enter a team name."
            getTeamName.css({
                border: 1px solid red
            });
            messageAry.push(teamNameError);
        }
        //Next Date validation
        if (getNextDate).html() == ""){
            var nextDateError = "Please enter a date."
            getNextDate.css({
                border: 1px solid red
            });
            messageAry.push(nextDateError);
        }
        
        //Display errors
        if (messageAry.length >= 1){
            for( var i=0, j=messageAry.length; i<j; i++){
                $('#errors')
                    .append('<li></li>')
                ;
                $('#errors li:last')
                    .html(messageAry[i]);
            }
        return false;
        }else{
            saveLocal(this.key);
        }
    }
    
    var errMsg = $('#errors');
    //Link/Submit Click events
    $('#displayData').on("click", getData);
    $('#clearData').on("click", clearLocal);
    $('#submit').on("click", validate);
});
});