class Data {
  
  constructor() {
    this.dataSet=[];
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
        console.log("Ops...Something wrong happy, it might a Dinossaur but we couldn't connected to the server, but it returned an error.");
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
          xtrctNames = xtrctNames.trim()
          xtrctCode = text.substr(0, equal);
          code = parseInt(xtrctCode);

          // if code is a Number, add it to the list
          if(!isNaN(code)){
            this.dataSet.push({
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
  
  constructor(){
    super();
    this.input = document.getElementById('search'); 
    this.focus = -1;
    this.main = document.body.childNodes[1]; // main_div
    this.boxOpt = this.main.childNodes[3]; // main_result
    this.lastNodeTree = [];
    this.multRows;
  }

  preSet() {
    //Loop in the dataSet array
      for ( var i = 0; i < this.dataSet.length; i++ ) {
        //create container for each option matched
        var boxOpt_option = document.createElement("DIV");
        boxOpt_option.innerHTML += this.dataSet[i].name;
        boxOpt_option.id = this.dataSet[i].code;
        boxOpt_option.classList.add('txt-alg-center');
        boxOpt_option.addEventListener("click", function(e) {
          window.open(
            'http://www.netflix.com/browse/genre/'+this.id,
            '_blank'
          );
        });// [/boxOpt_optionListener]
        this.boxOpt.appendChild(boxOpt_option);
        this.boxOpt.childNodes[i].classList.add("main__result-fadein");
        this.boxOpt.childNodes[i].style.animationDelay = i+'0ms';
      }// [/for]
      this.lastNodeTree = this.boxOpt;
    return false;    
  }

  search() {
    var _this = this;
    
    this.preSet();
    
    //if input is "clicked" it call the event 
    this.input.addEventListener("input", function(e) {
      var typedvalue = this.value;
      var itemToBeMatchLowerC;
      var itemToBeMatchUpperC;
      //close open lists
      _this.closeAllLists();
      
      //Loop in the dataSet array
      for ( var i = 0; i < _this.dataSet.length; i++ ) {
        itemToBeMatchLowerC = _this.dataSet[i].name.toLowerCase(); 
        itemToBeMatchUpperC = _this.dataSet[i].name.toUpperCase(); 
        if (_this.dataSet[i].name.indexOf(typedvalue) >= 0 || itemToBeMatchLowerC.indexOf(typedvalue) >= 0 || itemToBeMatchUpperC.indexOf(typedvalue) >= 0) {
          var boxOpt_option = document.createElement("DIV");
          boxOpt_option.innerHTML += _this.dataSet[i].name;
          boxOpt_option.id = _this.dataSet[i].code;
          boxOpt_option.classList.add('txt-alg-center');
          boxOpt_option.addEventListener("click", function(e) {
             window.open(
              'http://www.netflix.com/browse/genre/'+this.id,
              '_blank'
            );
          });// [/boxOpt_optionListener]
          _this.boxOpt.appendChild(boxOpt_option);
        }// [/if]
      }// [/for]  
      _this.lastNodeTree = _this.boxOpt;

    });// [/inputListener]


    window.addEventListener("keydown", function(e) {
        // space and arrow keys
        if([38, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);
    //==================================================
    //==================================================
     /*execute a function presses a key on the keyboard:*/
    document.addEventListener("keydown", function(e) {
        var childCntr = []; 
        
        if (_this.boxOpt) { childCntr = _this.boxOpt.getElementsByTagName("div") }
        
        //checking number of columns each row 
        _this.multRows = _this.checkPosition(_this.boxOpt , childCntr);
        
        if ( childCntr.length > 0 ) {
          if (e.keyCode == 40) {
            // DOWN
            if (_this.focus > -1){
              _this.focus = _this.focus + (_this.multRows);  
            } else {
              _this.focus++;
            }
            _this.addActive(childCntr);
          } else if (e.keyCode == 38) { 
              // UP
              if (_this.focus >= _this.multRows){
                _this.focus = _this.focus - (_this.multRows);  
              } else if(_this.focus == -1) {
              } 
              else {
                _this.focus --;
              }
              _this.addActive(childCntr);
          } else if (e.keyCode == 37) { 
              // RIGHT
              _this.focus --;
              
              _this.addActive(childCntr);
          } else if (e.keyCode == 39) { 
              // LEFT
              _this.focus ++;

              _this.addActive(childCntr);        
          } else if (e.keyCode == 13) {
            window.open(
              'http://www.netflix.com/browse/genre/'+childCntr[_this.focus].id,
              '_blank'
            );
          }  
        }
        
    });
  }
  
  checkPosition( cntr, childCntr ){
    var qttPerRow = null;
    if(cntr && childCntr[0]) {
      var cntWdth = cntr.offsetWidth;
      var smCntWdth = childCntr[0].offsetWidth;
      var margin = 10;
      qttPerRow = cntWdth / ( smCntWdth + margin*2 );
      qttPerRow = Math.floor(qttPerRow);
    }
    return qttPerRow;   
  }

  addActive(childCntr) {
    if (!childCntr) { return false; }
    if (this.focus !== -1) {
      /*remove the "active" class on all items:*/
      this.removeActive(childCntr);
      if (this.focus >= childCntr.length) { this.focus = 0; }
      if (this.focus < 0) { this.focus = (childCntr.length - 1); }

      /*add class "main__result-active":*/
      childCntr[this.focus].classList.add("main__result-active");
      var hashPoint = this.focus;
      if (childCntr[hashPoint]) {
        childCntr[hashPoint].scrollIntoView({ 
          behavior: 'smooth', 
        });
      }
    }
  }

  removeActive(childCntr) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < childCntr.length; i++) {
      childCntr[i].classList.remove("main__result-active");
    }
  } 

  closeAllLists() {
    this.boxOpt.innerHTML = '';
  }// [/closeAllLists] 

  display(){
    this.search();   
  }
}

var inst = new App();
inst.getData();
