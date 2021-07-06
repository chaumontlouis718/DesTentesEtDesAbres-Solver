$( document ).ready(function() {
    appendGridToDocument("gridToSolve")
    cycleResolve()
    logGrid();
    appendGridToDocument("gridResolved")
});

/*
Grille : 
    OOTAO
    TAOOT
    OOAOA
    OOTAT
    TAOOO

0 : Case noir
1 : A : Arbre
2 : T : Tente
3 : Gazon

*/

var gridToSolve = {
    'sommeColonnes' : [3,1,2,1,2,1,0,4],
    'sommeLignes' : [2,1,3,1,2,1,1,3], 
    'grid' : [
        [0,0,0,0,0,0,1,0],
        [0,1,0,0,1,0,0,1],
        [0,1,0,0,0,0,0,0],
        [0,1,0,1,1,0,0,0],
        [0,0,0,0,0,0,1,0],
        [0,0,0,0,0,1,0,0],
        [1,1,0,0,0,0,0,0],
        [0,0,0,1,0,0,1,0]
    ],
    'gridInversed' : [
        [0,0,0,0,0,0,1,0],
        [0,1,1,1,0,0,1,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,1,0,0,0,1],
        [0,1,0,1,0,0,0,0],
        [0,0,0,0,0,1,0,0],
        [1,0,0,0,1,0,0,1],
        [0,1,0,0,0,0,0,0]
    ]
}

var casesModifie = 0;
var tempBoucle = 0;

function cycleResolve() {
    applyStrategieZero();
    do {
        tempBoucle++;
        casesModifie = 0;
        applyStrategieUn();
        applyStrategieDeux()
    } while(tempBoucle < 50 && casesModifie != 0)
}

// Une tente est forcément à côté d'un arbre
// Donc il n'y a pas de tente sur les cases isolées, c'est à dire sans aucun arbre à côté, donc c'est forcément du gazon.    
function applyStrategieZero() {
    gridToSolve.grid = gridToSolve.grid.map(function(ligne, indexLigne) {
        return ligne.map(function(valeurCase, indexColonne) {
            if (valeurCase == 0) {
                if (gridToSolve.grid[indexLigne - 1] != undefined && gridToSolve.grid[indexLigne - 1][indexColonne] == 1) return 0;
                if (gridToSolve.grid[indexLigne][indexColonne - 1] != undefined && gridToSolve.grid[indexLigne][indexColonne - 1] == 1) return 0;
                if (gridToSolve.grid[indexLigne + 1] != undefined && gridToSolve.grid[indexLigne + 1][indexColonne] == 1) return 0;
                if (gridToSolve.grid[indexLigne][indexColonne + 1] != undefined && gridToSolve.grid[indexLigne][indexColonne + 1] == 1) return 0;
                applyChangeToInversedGrid(3, indexLigne, indexColonne)
                return 3;
            } else return valeurCase;
        })
    })
}

// Regarder les valeurs dans sommeColonnes et sommeLignes, et mettre des tentes dans toutes les cases noires d'une ligne/colonnes si le nbr est égal au nbr de cases noirs
//  :: Il y a 3 cases noirs et 0 tente sur une lignes, et le chiffres de la ligne est 3.
//  :: Il y a 2 cases noirs et 2 tente sur une colonne, et le chiffre de la colonnes est 4.
function applyStrategieUn() {
    
    gridToSolve.sommeColonnes.forEach(function(indicateurColonne, indexSommeColonne) {
        if (indicateurColonne == 0) {
            replaceAllBlackSquareByGazonColonne(indexSommeColonne)
        } else {
            var caseDisponible = countCaseDisponibles(gridToSolve.gridInversed[indexSommeColonne])
            if (caseDisponible.nbrTenteDejaPlaces == indicateurColonne && caseDisponible.nbrBlackSquare != 0) {
                replaceAllBlackSquareByGazonColonne(indexSommeColonne)
            } else if (caseDisponible.nbrBlackSquare == indicateurColonne - caseDisponible.nbrTenteDejaPlaces) {
                replaceAllBlackSquareByTenteColonne(indexSommeColonne)
            }
        }
    })

    gridToSolve.sommeLignes.forEach(function(indicateurLigne, indexSommeLigne) {
        if (indicateurLigne == 0) {
            replaceAllBlackSquareByGazonLigne(indexSommeLigne)
        } else {
            var caseDisponible = countCaseDisponibles(gridToSolve.grid[indexSommeLigne])
            if (caseDisponible.nbrTenteDejaPlaces == indicateurLigne && caseDisponible.nbrBlackSquare != 0) {
                replaceAllBlackSquareByGazonLigne(indexSommeLigne)
            } else if (caseDisponible.nbrBlackSquare == indicateurLigne - caseDisponible.nbrTenteDejaPlaces) {
                replaceAllBlackSquareByTenteLigne(indexSommeLigne)
            }
        }
    })
}


// Analyser le nombre de cases noires disponibles et leurs positions, afin de déterminer les cases ou il y a forcément une tente.
// On analyse chaque combinaisation possibles afin de trouver les cases qui reviennent dans chaque configuration
function applyStrategieDeux() {

    gridToSolve.grid.forEach(function(ligne, indexLigne) {
        var caseDisponible = countCaseDisponibles(ligne)
        var positions = getFreeSquarePosition(ligne)
        var indicateurNbrTenteLigne = gridToSolve.sommeLignes[indexLigne]

        var results = generateCombinations(positions, indicateurNbrTenteLigne-caseDisponible.nbrTenteDejaPlaces);
        results = results.filter(function(combinaisons) {
            var flag = false;
            combinaisons.forEach(function(position) {
                if (!(combinaisons.indexOf(position+1) < 0 && combinaisons.indexOf(position-1) < 0)) {
                    flag = true;
                }
            })
            return !flag;
        })

        var temps = results[0];
        results.forEach(function(combinaisons) {
            temps = temps.filter(function(element) {
                return combinaisons.includes(element)
            })
        })

        if (typeof temps !== 'undefined' && temps > 0) {
            temps.forEach(function(element) {
                applyChangeToGrid(2,element,indexColonne)
            })
        }
    })



    gridToSolve.gridInversed.forEach(function(colonne, indexColonne) {
        var caseDisponible = countCaseDisponibles(colonne)
        var positions = getFreeSquarePosition(colonne)
        var indicateurNbrTenteColonne = gridToSolve.sommeColonnes[indexColonne]

        var results = generateCombinations(positions, indicateurNbrTenteColonne-caseDisponible.nbrTenteDejaPlaces);
        results = results.filter(function(combinaisons) {
            var flag = false;
            combinaisons.forEach(function(position) {
                if (!(combinaisons.indexOf(position+1) < 0 && combinaisons.indexOf(position-1) < 0)) {
                    flag = true;
                }
            })
            return !flag;
        })

        var temps = results[0];
        results.forEach(function(combinaisons) {
            temps = temps.filter(function(element) {
                return combinaisons.includes(element)
            })
        })

        if (typeof temps !== 'undefined' && temps > 0) {
            temps.forEach(function(element) {
                applyChangeToGrid(2,element,indexColonne)
            })
        }
    })
}

function generateCombinations(sourceArray, comboLength) {
    const sourceLength = sourceArray.length;
    if (comboLength > sourceLength) return [];
  
    const combos = []; // Stores valid combinations as they are generated.
  
    // Accepts a partial combination, an index into sourceArray, 
    // and the number of elements required to be added to create a full-length combination.
    // Called recursively to build combinations, adding subsequent elements at each call depth.
    const makeNextCombos = (workingCombo, currentIndex, remainingCount) => {
        const oneAwayFromComboLength = remainingCount == 1;
  
        // For each element that remaines to be added to the working combination.
        for (let sourceIndex = currentIndex; sourceIndex < sourceLength; sourceIndex++) {
            // Get next (possibly partial) combination.
            const next = [ ...workingCombo, sourceArray[sourceIndex] ];
  
            if (oneAwayFromComboLength) {
                // Combo of right length found, save it.
                combos.push(next);
            }
            else {
                // Otherwise go deeper to add more elements to the current partial combination.
                makeNextCombos(next, sourceIndex + 1, remainingCount - 1);
            }
        }
    }
    makeNextCombos([], 0, comboLength);
    return combos;
}




function replaceAllBlackSquareByGazonLigne(indexLigne) {
    gridToSolve.grid[indexLigne] = gridToSolve.grid[indexLigne].map(function(valeurCase, indexColonne) {
        if (valeurCase == 0) {
            applyChangeToInversedGrid(3,indexLigne,indexColonne)
            return 3;
        }
        else return valeurCase;
    })
}

function replaceAllBlackSquareByGazonColonne(indexColonne) {
    gridToSolve.gridInversed[indexColonne] = gridToSolve.gridInversed[indexColonne].map(function(valeurCase, indexLigne) {
        if (valeurCase == 0) {
            applyChangeToGrid(3,indexLigne,indexColonne)
            return 3;
        }
        else return valeurCase;
    })
}

function replaceAllBlackSquareByTenteLigne(indexLigne) {
    gridToSolve.grid[indexLigne] = gridToSolve.grid[indexLigne].map(function(valeurCase, indexColonne) {
        if (valeurCase == 0) {
            applyChangeToInversedGrid(2,indexLigne,indexColonne)
            return 2;
        }
        else return valeurCase;
    })
}

function replaceAllBlackSquareByTenteColonne(indexColonne) {
    gridToSolve.gridInversed[indexColonne] = gridToSolve.gridInversed[indexColonne].map(function(valeurCase, indexLigne) {
        if (valeurCase == 0) {
            applyChangeToGrid(2,indexLigne,indexColonne)
            return 2;
        }
        else return valeurCase;
    })
}

function countCaseDisponibles(arr) {
    return arr.reduce(reducerCountCaseDisponibles, {
        'nbrBlackSquare' : 0,
        'nbrTenteDejaPlaces' : 0
    })
}

function reducerCountCaseDisponibles(accumulator, currentValue) {
    if (currentValue == 0) {
        accumulator.nbrBlackSquare++;
    } else if (currentValue == 2) {
        accumulator.nbrTenteDejaPlaces++;
    }
    return accumulator;
}



function getFreeSquarePosition(arr) {
    returnArray = []
    arr.forEach(function(element,index) {
        if (element == 0) {
            returnArray.push(index)
        }
    })
    return returnArray;
}

function reducerFreeSquarePosition(array, currentValue) {
    return arr.reduce(reducerCountCaseDisponibles, {
        'nbrBlackSquare' : 0,
        'nbrTenteDejaPlaces' : 0
    })
}



function applyChangeToInversedGrid(value, indexLigne,indexColonne) {
    gridToSolve.gridInversed[indexColonne][indexLigne] = value;
    casesModifie++;
    applyChangeToGridSecondCall(value, indexLigne,indexColonne)
}

function applyChangeToInversedGridSecondCall(value, indexLigne,indexColonne) {
    gridToSolve.gridInversed[indexColonne][indexLigne] = value;
}

function applyChangeToGrid(value, indexLigne,indexColonne) {
    gridToSolve.grid[indexLigne][indexColonne] = value;
    casesModifie++;
    applyChangeToInversedGridSecondCall(value, indexLigne,indexColonne)
    if(value == 2) {
        gazonAutourTente(indexLigne,indexColonne);
    }
}

function applyChangeToGridSecondCall(value, indexLigne,indexColonne) {
    gridToSolve.grid[indexLigne][indexColonne] = value;
}

function gazonAutourTente(indexLigne, indexColonne) {
    if (gridToSolve.grid[indexLigne-1] != null && gridToSolve.grid[indexLigne-1][indexColonne-1] != null && gridToSolve.grid[indexLigne-1][indexColonne-1] == 0) {
        applyChangeToGrid(3,indexLigne-1,indexColonne-1);
    }
    if (gridToSolve.grid[indexLigne-1] != null && gridToSolve.grid[indexLigne-1][indexColonne] != null && gridToSolve.grid[indexLigne-1][indexColonne] == 0) {
        applyChangeToGrid(3,indexLigne-1,indexColonne);
    }
    if (gridToSolve.grid[indexLigne-1] != null && gridToSolve.grid[indexLigne-1][indexColonne] != null && gridToSolve.grid[indexLigne-1][indexColonne+1] == 0) {
        applyChangeToGrid(3,indexLigne-1,indexColonne+1);
    }
    if (gridToSolve.grid[indexLigne][indexColonne-1] != null && gridToSolve.grid[indexLigne][indexColonne-1] == 0) {
        applyChangeToGrid(3,indexLigne,indexColonne-1);
    }
    if (gridToSolve.grid[indexLigne][indexColonne+1] != null && gridToSolve.grid[indexLigne][indexColonne+1] == 0) {
        applyChangeToGrid(3,indexLigne,indexColonne+1);
    }
    if (gridToSolve.grid[indexLigne+1] != null && gridToSolve.grid[indexLigne+1][indexColonne-1] != null && gridToSolve.grid[indexLigne+1][indexColonne-1] == 0) {
        applyChangeToGrid(3,indexLigne+1,indexColonne-1);
    }
    if (gridToSolve.grid[indexLigne+1] != null && gridToSolve.grid[indexLigne+1][indexColonne] != null && gridToSolve.grid[indexLigne+1][indexColonne] == 0) {
        applyChangeToGrid(3,indexLigne+1,indexColonne);
    }
    if (gridToSolve.grid[indexLigne+1] != null && gridToSolve.grid[indexLigne+1][indexColonne+1] != null && gridToSolve.grid[indexLigne+1][indexColonne+1] == 0) {
        applyChangeToGrid(3,indexLigne+1,indexColonne+1);
    }
}

function logGrid() {
    console.log("Normal Grid : ")
    console.log(gridToSolve.grid.map(function(line) {
        return line.join()
    }))
    console.log("Inversed Grid : ")
    console.log(gridToSolve.gridInversed.map(function(line) {
        return line.join()
    }))
}

function appendGridToDocument(idTable) {
    gridToSolve.grid.forEach(function(line) {
        var trContent = "";
        line.forEach(function(cases) {
            if (cases == 0) {
                trContent += "<td class='vide'></td>"
            } else if (cases == 1) {
                trContent += "<td class='arbre'></td>"
            } else if (cases == 2) {
                trContent += "<td class='tente'></td>"
            } else if (cases == 3) {
                trContent += "<td class='gazon'></td>"
            }
        })
        $("#"+idTable).append("<tr>"+trContent+"</tr>")
    })
}