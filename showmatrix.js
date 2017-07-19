/*
 * Copyright © 2017 Colby Brown, Sam Heil
 * This software is released under the MIT license.
 * See LICENSE for more information.
 */
function showObjects(state) {
	if (state.pile != undefined) {
		/*var pileStr = "$SP(P) = \\{"
		var n = state.pile.length;
		for (var i=0; i<n-1; ++i) {
			pileStr += state.pile[i].toString()+",";
		}
		pileStr += state.pile[n-1] + "\\}$";*/
		document.getElementById("pile").innerHTML = ""//pileStr;
	}
    var permStr = "$(";
    var n = state.perm.length;
    for (var i=0; i<n-1; ++i) {
        permStr += state.perm[i].toString()+",";
    }
    permStr += state.perm[n-1] + ")$";
    document.getElementById("permutation").innerHTML = permStr;
    var matStr = "$\\begin{pmatrix}";
    for (var i=0; i<n+1; ++i) {
        for (var j=0; j<n; ++j) {
            matStr += state.matrix[i][j].toString()+"&";
        }
        matStr += state.matrix[i][n].toString();
        if (i < n) {
            matStr += "\\\\";
        }
    }
    matStr += "\\end{pmatrix}$";
    document.getElementById("matrix").innerHTML = matStr;
    document.getElementById('matrix').style.visibility = "hidden";
	document.getElementById("pile").style.visibility = "hidden";
    document.getElementById('permutation').style.visibility = "hidden";
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,"permutation"]);
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,"pile"]);
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,"matrix"]);
    MathJax.Hub.Queue(function() {
        document.getElementById('matrix').style.visibility = "";
		document.getElementById('pile').style.visibility = "";
        document.getElementById('permutation').style.visibility = "";
    });
}

var NODE_COUNT = 12;

function getPermutation(n) {
    var elems = [];
    for (var i=0; i<n; ++i)
        elems[i] = i+1;
    var pi = [];
    for (var i=n; i>0; --i) {
        var k = Math.floor(Math.random()*i);
        pi[i-1] = elems[k];
        elems.splice(k, 1);
    }
    return pi;
}

function SP(pi) {
    var n = pi.length;
    var Y_pi = [];
    Y_pi[pi[0]] = 0;
    for (var i=1; i<n; ++i) {
        Y_pi[pi[i]] = pi[i-1];
    }
    Y_pi[0] = pi[n-1];
    Y_pi[n+1] = pi[n-1];
    var x = 0;
    while (x != n) {
        x = Y_pi[x+1];
        if (x == 0) {
            return [];
        }
    }
    var pile = []
    while (x != 0) {
        x = Y_pi[x+1];
        pile.push(x);
    }
    pile.pop();
    return pile;
}
