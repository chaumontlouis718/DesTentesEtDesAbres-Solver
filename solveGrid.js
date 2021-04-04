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

{
    'taille' : 5,
    'sommeColonnes' : [2,0,2,0,2],
    'sommeLignes' : [1,2,0,3,1], 
    'grid' : [
        [0,0,0,1,0],
        [0,1,0,0,0],
        [0,0,1,0,1],
        [0,0,0,1,0],
        [0,1,0,0,0]
    ]  
}

*/

var gridToSolve = {
    'taille' : 6,
    'sommeColonnes' : [3,0,1,1,1,1],
    'sommeLignes' : [1,2,1,1,2,1], 
    'grid' : [
        [0,0,1,0,0,0],
        [1,0,0,1,0,0],
        [0,0,0,1,0,0],
        [1,0,0,0,0,0],
        [0,1,1,0,0,0],
        [0,0,0,0,0,1]
    ],
    'gridInversed' : [
        [0,1,0,1,0,0],
        [0,0,0,0,1,0],
        [1,0,0,0,1,0],
        [0,1,1,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,1]
    ]
}

var casesModifie = 0;
var tempBoucle = 0;

function cycleResolve() {
    applyStrategieZero();
    do {
        console.log("Cycle "+tempBoucle+" /////")
        tempBoucle++;
        casesModifie = 0;
        applyStrategieUn();
    } while(tempBoucle < 50 && casesModifie != 0)
}

function applyStrategieZero() {
    // Une tente est forcément à côté d'un arbre
    // Donc il n'y a pas de tente sur les cases isolées, c'est à dire sans aucun arbre à côté, donc c'est forcément du gazon.
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

function applyStrategieUn() {
    // Regarder les valeurs dans sommeColonnes et sommeLignes, et mettre des tentes dans toutes les cases noires d'une ligne/colonnes si le nbr est égal au nbr de cases noirs
    //  :: Il y a 3 cases noirs et 0 tente sur une lignes, et le chiffres de la ligne est 3.
    //  :: Il y a 2 cases noirs et 2 tente sur une colonne, et le chiffre de la colonnes est 4.

    /*gridToSolve.sommeColonnes.forEach(function(indicateurColonne, indexSommeColonnes) {
        gridToSolve.grid[indexSommeColonnes].forEach(function(case,))
    })*/

    gridToSolve.sommeColonnes.forEach(function(indicateurColonne, indexSommeColonne) {
        if (indicateurColonne == 0) {
            replaceAllBlackSquareByGazonColonne(indexSommeColonne)
        } else {
            var caseDisponible = countCaseDisponibles(gridToSolve.gridInversed[indexSommeColonne])
            if (caseDisponible.nbrTenteDejaPlaces == indicateurColonne && caseDisponible.nbrBlackSquare != 0) {
                console.log("Remplace all by gazon colonne : "+indexSommeColonne)
                replaceAllBlackSquareByGazonColonne(indexSommeColonne)
            } else if (caseDisponible.nbrBlackSquare == indicateurColonne    - caseDisponible.nbrTenteDejaPlaces) {
                console.log("Remplace all by tente colonne : "+indexSommeColonne)
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
                console.log("Remplace all by gazon ligne : "+indexSommeLigne)
                replaceAllBlackSquareByGazonLigne(indexSommeLigne)
            } else if (caseDisponible.nbrBlackSquare == indicateurLigne - caseDisponible.nbrTenteDejaPlaces) {
                console.log("Remplace all by tente ligne : "+indexSommeLigne)
                replaceAllBlackSquareByTenteLigne(indexSommeLigne)
            }
        }
    })
}

function replaceAllBlackSquareByGazonLigne(indexLigne) {
    gridToSolve.grid[indexLigne] = gridToSolve.grid[indexLigne].map(function(valeurCase, indexColonne) {
        if (valeurCase == 0) {
            applyChangeToInversedGrid(3,indexLigne,indexColonne)
            casesModifie++;
            return 3;
        }
        else return valeurCase;
    })
}

function replaceAllBlackSquareByGazonColonne(indexColonne) {
    gridToSolve.gridInversed[indexColonne] = gridToSolve.gridInversed[indexColonne].map(function(valeurCase, indexLigne) {
        if (valeurCase == 0) {
            applyChangeToGrid(3,indexLigne,indexColonne)
            casesModifie++;
            return 3;
        }
        else return valeurCase;
    })
}

function replaceAllBlackSquareByTenteLigne(indexLigne) {
    gridToSolve.grid[indexLigne] = gridToSolve.grid[indexLigne].map(function(valeurCase, indexColonne) {
        if (valeurCase == 0) {
            applyChangeToInversedGrid(2,indexLigne,indexColonne)
            casesModifie++;
            return 2;
        }
        else return valeurCase;
    })
}

function replaceAllBlackSquareByTenteColonne(indexColonne) {
    gridToSolve.gridInversed[indexColonne] = gridToSolve.gridInversed[indexColonne].map(function(valeurCase, indexLigne) {
        if (valeurCase == 0) {
            applyChangeToGrid(2,indexLigne,indexColonne)
            casesModifie++;
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
        accumulator.nbrBlackSquare = accumulator.nbrBlackSquare + 1;
    } else if (currentValue == 2) {
        accumulator.nbrTenteDejaPlaces = accumulator.nbrTenteDejaPlaces + 1;
    }
    return accumulator;
}

function applyChangeToInversedGrid(value, indexLigne,indexColonne) {
    gridToSolve.gridInversed[indexColonne][indexLigne] = value;
}

function applyChangeToGrid(value, indexLigne,indexColonne) {
    gridToSolve.grid[indexLigne][indexColonne] = value;
}

function logGrid() {
    console.log("Normal Grid : ")
    console.log(gridToSolve.grid)
    console.log("Inversed Grid : ")
    console.log(gridToSolve.gridInversed)
}

logGrid();
cycleResolve()
console.log("////////////////////////////////////////////////////////////")
logGrid();