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
