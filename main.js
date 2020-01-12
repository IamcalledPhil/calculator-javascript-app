var calculation = [];
var displayCalculation = "";

function isOperatorValid (){
  // checks to see if last value was an operator also. If so, syntax error
  var isValid = false;
  var lastElement = calculation[calculation.length-1];

  if (typeof lastElement != 'undefined'){
    if (lastElement.type === "operator"){
    //  console.log("not valid");
    }else{
    //    console.log("valid");
      isValid = true;
    }
  } else {
    isValid = false;
    //console.log("first");
  }
  return isValid;
}

function numClick (value){
  addToCalculation(value, "number");
//  console.log(calculation);
}

function decimalClick (){
  //check that is the first dot in number: walk back along array until we find an operator (beginning of number) or a decimal
  var existingDecimal = false;
 for (var i = calculation.length-1; i>=0; i--){
   var val = calculation[i];
   console.log(val.type);
   if (val.type === "decimal"){
     existingDecimal = true;
   } else if (val.type === "operator"){
     break;
   }
 }
 if (!existingDecimal){
   addToCalculation(".", "decimal");
 }
  // console.log(calculation);

}

function opClick (value){
  if (isOperatorValid()){
    addToCalculation(value, "operator");
  }
//  console.log(calculation);
}

function eqClick (){
  if (isOperatorValid()){
    var operator = new Object();
    operator.value = "=";
    operator.type = "equals";
    calculation.push(operator);
    //here I use custom functions instead of eval() to make the app faster and more secure, allowing for the future posibility of typing caluculations in
    var result = parseCalc();
    sResult = result.toString();
    calculation = [];
    displayCalculation = "";
    for (var i = 0; i<sResult.length; i++){ //iterate through result and add each diget to array
      var newNumber = sResult.charAt(i);
      console.log(newNumber);
      addToCalculation(newNumber, "number");
    }
    //console.log("result:" +result);
  }
}

function parseCalc(){
  //sort into numbers and operators
 var parsed = [];
 var number = ""; //an empy string, which will hold the value of each whole number as a string
 calculation.forEach(function(element) {
  if (element.type === "number" || element.type === "decimal"){
    number+=element.value;
  }else if (element.type ==="operator" || element.type ==="equals") {
    if (number.length >0){
      parsed.push(number);
    }
    parsed.push(element.value);
    //clear the number ready for the next one
    number = "";
  }
 });
 //calculate result, using BODMAS
 var opOrder = ["/","x","+","-"];
 for (var i = 0; i<opOrder.length; i++){
   for (var j = 0; j<parsed.length; j++){
     if (parsed[j] === opOrder[i]){
         var tempNum = evaluate(parsed[j-1],parsed[j], parsed[j+1]);
         //remove this calculation from the array, and replace it with the result
         parsed.splice(j-1,3,tempNum);
     }
   }
 }
 return parsed[0];
}

function evaluate (firstNumber, operator, secondNumber){
  var result = 0;
  //convert explicitly to numbers to prevent being parsed as strings (e.g the plus operator)
  firstNumber = Number(firstNumber);
  secondNumber = Number(secondNumber);

  if (operator === "/"){
    result = firstNumber/secondNumber;
  } else if (operator === "x") {
    result = firstNumber*secondNumber;
  }else if (operator === "+") {
    result = firstNumber+secondNumber;
  }else if (operator === "-") {
    result = firstNumber-secondNumber;
  } else {
    result = "error";
  }
  return result;
}

function addToCalculation (value, type){
  //Don't want it to go off screen
  if (calculation.length <= 25){
    //make it an object to keep track of type of number, helps for syntax checking
    var newElement = new Object();
    newElement.value = value;
    newElement.type = type;
    calculation.push(newElement);
    displayCalculation+=value;
    document.getElementById("calculatorDisplay").innerHTML = displayCalculation;
  }
}

function clrClick (){
  calculation = [];
  displayCalculation = "";
  document.getElementById("calculatorDisplay").innerHTML = displayCalculation;
}

function delClick (){
  calculation.pop();
  displayCalculation = displayCalculation.substring(0, displayCalculation.length - 1);
  document.getElementById("calculatorDisplay").innerHTML = displayCalculation;
}
