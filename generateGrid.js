var sizeTab = 5;
var nbrTente = Math.floor((sizeTab*sizeTab) * 0.20);
var pickedPos = [];
var index = 0;
var x,y;
var temp = 0;

for (var i =0; i<nbrTente; i++) {
    temp = 0;   
    do {
        x = Math.floor(Math.random()*sizeTab)+1;
        y = Math.floor(Math.random()*sizeTab)+1;
        temp++;
    } while(!checkValidity(x,y) && temp < 1000)

    pickedPos.push({
        'x':x,
        'y':y
    })
}

console.log(pickedPos)
displayAsTable()

function checkValidity(x,y) {
    var returnStatus = true;
    pickedPos.forEach(function(value) {
        if (value.x -1 <= x && x <= value.x + 1) {
            if (value.y -1 <= y && y <= value.y + 1) {
                returnStatus = false;
            }
        }
    })
    return returnStatus;
}

function displayAsTable() {
    var stringToLog = "";
    var IsIn = false;
    for(var i = 0;i< sizeTab;i++) {
        for(var j = 0;j< sizeTab;j++) {
            IsInTag : for(var h = 0;h< pickedPos.length;h++) {
                if (pickedPos[h].x == i+1 && pickedPos[h].y == j+1) {
                    IsIn = true;
                    break IsInTag;
                }
            }
            if (IsIn) {
                stringToLog += "T"
            } else {
                stringToLog += "O"
            }
            IsIn = false;
        }
        console.log(stringToLog)
        stringToLog = "";
    }
}