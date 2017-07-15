/*  
 *  Copyright © 2017 Colby Brown, Sam Heil. All rights reserved.
 *  This software is released under the MIT Licence. 
 *  See LICENSE for more information.
*/

var NODE_COUNT = 12;
var OFFSET = 50;
var RADIUS = 250;
var NODE_RADIUS = 20;
var HANDLE_RADIUS = 30;
var SENSE_DIST = 10;

var perm;
var edges = [];

if (stage.options.sorttype == "sortable") {
	perm = sortablePermMatrix(NODE_COUNT);
} else if (stage.options.sorttype == "unsortable") {
	perm = unsortablePermMatrix(NODE_COUNT);
} else {
	perm = getPermMatrix(NODE_COUNT);
}

var matrix = perm["matrix"];

var nodePos = [];
for (var i=0; i<NODE_COUNT; ++i) {
	nodePos[i] = [node_x(i), node_y(i)];
}
for (var i = 0; i < NODE_COUNT; i++) {
	edges[i] = [];
	for (var j = i; j < NODE_COUNT; j++) {
		edges[i][j] =  new Path([
							node_x(i), node_y(i),
							node_x(j), node_y(j)
						]).stroke(color.parse('#00000000'), 5)
						/*.on('click', function(p,q) {
							return function(e) {
								matrix = doClick(p,q);
								updateEdges(matrix,edges,0); 
							};
						}(i,j))*/
						.addTo(stage);
	}
	if (i == 0 || i == NODE_COUNT-1) {
		var x = nodePos[i][0], y = nodePos[i][1];
		new Path([x, y+HANDLE_RADIUS, x-HANDLE_RADIUS, y,
				  x, y-HANDLE_RADIUS, x+HANDLE_RADIUS, y,
				  x, y+HANDLE_RADIUS])
			.attr('fillColor', 'white')
			.stroke('white', 5)
			.animate('500ms', { 
				strokeColor: 'black' 
			}, {
				delay: (i * 100) + 'ms'
			})
			.addTo(stage);
	} else {
		new Circle(node_x(i), node_y(i), NODE_RADIUS)
			.attr('fillColor', 'white')
			.stroke('white', 5)
			.animate('500ms', { 
				strokeColor: 'black' 
			}, {
				delay: (i * 100) + 'ms'
			})
			.addTo(stage);
	}
}
updateEdges(matrix, edges, 100 * (NODE_COUNT + 2));

stage.on('click', function(e) {
	var edge = getChosenEdge(e.x, e.y);
	if (edge[0] != -1) {
		matrix = doClick(edge[0], edge[1]);
		updateEdges(matrix, edges, 0);
	}
});

function doClick(p,q) {
    if (!matrix[p][q]) return matrix;
    var res = [];
    for (var i = 0; i < NODE_COUNT; i++) {
        res[i] = [];
        for (var j = 0; j < NODE_COUNT; j++) {
            if ((matrix[i][p] && matrix[j][q]) ^ (matrix[i][q] && matrix[j][p])) {
                res[i][j] = matrix[i][j] ^ 1;
            } else {
                res[i][j] = matrix[i][j];
            }
        } 
    }  
    return res;
}

function updateEdges(mat,edges,delay) {
    delay = delay + 'ms';
    for (var i = 0; i < NODE_COUNT; i++) {
        for (var j = i; j < NODE_COUNT; j++) {
            var edgeColor = mat[i][j] ? '#000000FF' : '#00000000';
            edges[i][j].animate('250ms', {
                strokeColor: color.parse(edgeColor)
            }, {
                delay: delay 
            });
        } 
    }
}

//// HELPER FUNCTIONS

function getChosenEdge(x, y) {
	var minDist = SENSE_DIST, bestEdge = [-1, -1];
	var	x1, y1, a, b, dist;
	for (var i=1; i<NODE_COUNT-1; ++i) {
		x1 = nodePos[i][0];
		y1 = nodePos[i][1];
		for (var j=i+1; j<NODE_COUNT-1; ++j) {
			if (!matrix[i][j]) continue;
			a = nodePos[j][0]-x1;
			b = nodePos[j][1]-y1;
			dist = Math.abs((y1-y)*a-(x1-x)*b)/Math.sqrt(a*a+b*b);
			if (dist < minDist) {
				minDist = dist;
				bestEdge = [i,j];
			}
		} 
	}
	return bestEdge;
}

function node_x(i) {
    return RADIUS * Math.sin((i * 2.+1.) * Math.PI / NODE_COUNT) + RADIUS + OFFSET;
}
function node_y(i) {
    return RADIUS * -Math.cos((i * 2.+1.) * Math.PI / NODE_COUNT) + RADIUS + OFFSET;
}

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

function getAdjMat(perm) {
	var n = perm.length;
	var pi = [0].concat(perm).concat([n+1]);
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
	return A;
}

function getPermMatrix(n) {
	var pi = getPermutation(n-1);
	return {"perm": pi, "matrix": getAdjMat(pi)};
}

function sortablePermMatrix(n) {
	var pi;
	do {
		pi = getPermutation(n-1);
	} while (SP(pi).length > 0);
	return {"perm": pi, "matrix": getAdjMat(pi)};
}

function unsortablePermMatrix(n) {
	var pi;
	do {
		pi = getPermutation(n-1);
	} while (SP(pi).length == 0);
	return {"perm": pi, "matrix": getAdjMat(pi)};
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

function showObjects(state) {
	var permStr = "$(";
	var n = state.perm.length;
	for (var i=0; i<n-1; ++i) {
		permStr += state.perm[i].toString()+",";
	}
	permStr += state.perm[n-1] + ")$";
	document.getElementById("permutation").innerHTML = permStr;
	var matStr = "$\\begin{pmatrix}";
	for (var i=0; i<n; ++i) {
		for (var j=0; j<n-1; ++j) {
			matStr += state.matrix[i][j].toString()+"&";
		}
		matStr += state.matrix[i][n-1].toString();
		if (i < n-1) {
			matStr += "\\\\";
		}
	}
	matStr += "\\end{pmatrix}$";
	document.getElementById("matrix").innerHTML = matStr;
}
