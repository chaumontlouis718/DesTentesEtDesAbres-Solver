var gridSize = 5;
var nbrTente = Math.round((gridSize*gridSize) * 0.20);

var pickedPos = []


for (var i=0;i<nbrTente;i++) {
    var valid = false;
    var stamp = 0;
    while(!valid && stamp < 100) {
        valid = true;
        var pickedX = Math.floor(Math.random()*5) + 1
        var pickedY = Math.floor(Math.random()*5) + 1

        pickedPos.forEach(function(alreadyPickedPos) {
            if (alreadyPickedPos.x >= pickedX -1 && alreadyPickedPos.x <= pickedX + 1 &&
                alreadyPickedPos.y >= pickedY -1 && alreadyPickedPos.y <= pickedY + 1) {
                    valid = false;
                }
        })

        var treeAvailable = false
        var pickedTreeX
        var pickedTreeY

        if (valid) {
            pickedTreeX = pickedX-1
            pickedTreeY = pickedY
            treeAvailable = true;
            pickedPos.forEach(function(alreadyPickedPos) {
                if ((alreadyPickedPos.x == pickedTreeX && alreadyPickedPos.y == pickedTreeY) ||
                    (alreadyPickedPos.treeX == pickedTreeX && alreadyPickedPos.treeY == pickedTreeY)) {
                        treeAvailable = false;
                    }
            })
        }

        if (valid && !treeAvailable) {
            pickedTreeX = pickedX
            pickedTreeY = pickedY-1
            treeAvailable = true;
            pickedPos.forEach(function(alreadyPickedPos) {
                if ((alreadyPickedPos.x == pickedTreeX && alreadyPickedPos.y == pickedTreeY) ||
                    (alreadyPickedPos.treeX == pickedTreeX && alreadyPickedPos.treeY == pickedTreeY)) {
                        treeAvailable = false;
                    }
            })
        }

        if (valid && !treeAvailable) {
            pickedTreeX = pickedX
            pickedTreeY = pickedY+1
            treeAvailable = true;
            pickedPos.forEach(function(alreadyPickedPos) {
                if ((alreadyPickedPos.x == pickedTreeX && alreadyPickedPos.y == pickedTreeY) ||
                    (alreadyPickedPos.treeX == pickedTreeX && alreadyPickedPos.treeY == pickedTreeY)) {
                        treeAvailable = false;
                    }
            })
        }

        if (valid && !treeAvailable) {
            pickedTreeX = pickedX+1
            pickedTreeY = pickedY
            treeAvailable = true;
            pickedPos.forEach(function(alreadyPickedPos) {
                if ((alreadyPickedPos.x == pickedTreeX && alreadyPickedPos.y == pickedTreeY) ||
                    (alreadyPickedPos.treeX == pickedTreeX && alreadyPickedPos.treeY == pickedTreeY)) {
                        treeAvailable = false;
                    }
            })
        }

        if (valid && treeAvailable) {
            pickedPos.push({
                'x' : pickedX,
                'y' : pickedY,
                'treeX' : pickedTreeX,
                'treeY' : pickedTreeY
            })
        }
        stamp++;
    }
}

cl(pickedPos)









function cl(message) {
    console.log(message)
}