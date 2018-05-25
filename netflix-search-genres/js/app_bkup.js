class Data {
  
  constructor() {
    this.data=[];
  } 

  getData() {
    var _this = this;
    
    var XHR = new XMLHttpRequest();
    XHR.open('GET', 'https://www.whats-on-netflix.com/wp-json/wp/v2/posts?slug=the-netflix-id-bible-every-category-on-netflix');
    
    XHR.onload = function() {
      if (XHR.status >= 200 && XHR.status < 400) {
        var data = JSON.parse(XHR.responseText);
        _this.storageData(data[0].content.rendered);
      } else {
        console.log("We connected to the server, but it returned an error.");
      }
    };
    
    XHR.onerror = function() {
      console.log("Connection error");
    };
    
    XHR.send();
  }

  storageData(data) {
    var code, xtrctCode, xtrctNames, lngthSize; 
    var div = document.createElement('div');
    div.innerHTML = data;
    var tree = div.childNodes;
    var len = tree.length;

    var searchText = "Netflix Categories by Genre";
    for (var i = 0; i < len; i++) {
      if (tree[i].nodeType === 1 && tree[i].tagName.toLowerCase() === "p" && tree[i].textContent !== "") {

        // get the content
        var text = tree[i].textContent;
        
        // check for "equal sign"
        var equal = text.indexOf('=');

        // check for code at the start
        if(equal > 0){
          lngthSize = text.length;
          xtrctNames = text.substr((equal+1), lngthSize); 
          xtrctCode = text.substr(0, equal);
          code = parseInt(xtrctCode);

          // if code is a Number, add it to the list
          if(!isNaN(code)){
            this.data.push({
                code: code,
                name: xtrctNames
            });
          }//[/if]
        }//[/if equal]
      }//[/if three.node]
    }//[/for]
    this.display();
  }//[/storage]
}//[Data]

class App extends Data {
  
  search(input, cakesArr) {
    var focus = -1;
    
    //if input is "clicked" it call the event 
    input.addEventListener("input", function(e) {
      var typedvalue = this.value;

      //close open lists
      closeAllLists();
      
      //if value is not 
      if (!typedvalue) { return false;}
      // focus = -1;
      var boxOpt = document.createElement("DIV");
      boxOpt.setAttribute("id", this.id + "__main_result");
      boxOpt.setAttribute("class", "main__result");

      //attach the newElement to THIS object parent
      this.parentNode.parentNode.appendChild(boxOpt);

      //Loop in the cakesArr selection position name
      for ( var i = 0; i < cakesArr.length; i++ ) {
        if (cakesArr[i].name.substr(0, typedvalue.length).toUpperCase() == typedvalue.toUpperCase()) {

          //create container for each option matched
          var boxOpt_option = document.createElement("DIV");
          boxOpt_option.innerHTML += cakesArr[i].name;
          boxOpt_option.addEventListener("click", function(e) {
           
          });// [/boxOpt_optionListener]
          boxOpt.appendChild(boxOpt_option);
        }// [/if]
      }// [/for]  
    });// [/inputListener]

    //==================================================
    //==================================================
     /*execute a function presses a key on the keyboard:*/
    input.addEventListener("keydown", function(e) {
        var y = document.getElementById("search__main_result");
        var multRows;
        if (y) { var x = y.getElementsByTagName("div") }
        multRows = checkPosition(y, x);

        if (e.keyCode == 40) {
            // DOWN
            focus = focus + (multRows);
            addActive(x);
        } else if (e.keyCode == 38) { 
            //UP
            if (focus > multRows){
              focus = focus - (multRows);  
            } else {
              focus --;
            }
            addActive(x);
        } else if (e.keyCode == 37) { 
            //UP
            focus --;
            
            addActive(x);
        } else if (e.keyCode == 39) { 
            //UP
            
            focus ++;

            addActive(x);        
        } else if (e.keyCode == 13) {
            
            // if (focus > -1) {
            //   and simulate a click on the "active" item:
            //   if (x) x[focus].click();
            // }
        }
    });
    function checkPosition( y, x ){
      var qttPerRow = null;
      if(y && x) {
        var cntWdth = y.offsetWidth;
        var smCntWdth = x[0].offsetWidth;
        var margin = 10;
        qttPerRow = cntWdth / ( smCntWdth + margin*2 );
        console.log(qttPerRow);
        qttPerRow = Math.floor(qttPerRow);
      }
      return qttPerRow;   
    }

    //==================================================
    //==================================================
    function addActive(x) {
        if (!x) { return false; }
        
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (focus >= x.length) { focus = 0; }
        if (focus < 0) { focus = (x.length - 1); }

        /*add class "autocomplete-active":*/
        x[focus].classList.add("main__result-active");
    }

    //==================================================
    //==================================================
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
          x[i].classList.remove("main__result-active");
        }
    }

    //==================================================
    //==================================================
      //close list functions
      function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("main__result");
        for (var i = 0; i < x.length; i++) {
          if (elmnt != x[i] && elmnt != input) {
            x[i].parentNode.removeChild(x[i]);
            }
        }
      }// [/closeAllLists]
}
  display(){
    console.log(this.data);
    this.search(document.getElementById('search'), this.data);   
  }
}

const inst = new App();
inst.getData();
