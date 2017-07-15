/*
 * Copyright © 2017 Colby Brown, Sam Heil
 * This software is released under the MIT license.
 * See LICENSE for more information.
 */
function getPermMatrix(n) {
    n--;
    var elems = [];
    for (var i=0; i<n; ++i)
        elems[i] = i+1;
    var pi = [0];
    for (var i=n; i>0; --i) {
        var k = Math.floor(Math.random()*i);
        pi[i] = elems[k];
        elems.splice(k, 1);
    }
    pi.push(n+1);
    var P = [];
    for (var i=0; i<n+2; ++i) {
        P[pi[i]] = [];
        for (var j=0; j<=i; ++j) {
            P[pi[i]][pi[j]] = 0;
        }
        for (var j=i+1; j<n+2; ++j) {
            P[pi[i]][pi[j]] = 1;
        }
    }
    var A = [];
    for (var i=0; i<n+1; ++i) {
        A[i] = [];
        for (var j=0; j<n+1; ++j) {
            A[i][j] = P[i][j]^P[i+1][j]^P[i][j+1]^P[i+1][j+1];
        }
    }
    for (var i=0; i<2; ++i) {
        for (var j=i; j<n+1; ++j) {
            A[j-i][j] ^= 1;
        }
    }
    return {"perm": pi, "matrix": A};
}

function showObjects(state) {
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
    document.getElementById('permutation').style.visibility = "hidden";
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,"permutation"]);
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,"matrix"]);
    MathJax.Hub.Queue(function() {
        document.getElementById('matrix').style.visibility = "";
        document.getElementById('permutation').style.visibility = "";
    });
}
