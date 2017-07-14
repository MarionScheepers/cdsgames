/*  
 *  Copyright © 2017 Colby Brown, Sam Heil. All rights reserved.
 *  This software is released under the MIT Licence. 
 *  See LICENSE for more information.
*/

var NODE_COUNT = 12;
var OFFSET = 50;
var RADIUS = 250;
var NODE_RADIUS = 20;
var SENSE_DIST = 10;

var perm = getPermMatrix(NODE_COUNT);
var matrix = perm['matrix'];

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


var edges = [];
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
updateEdges(matrix, edges, 100 * (NODE_COUNT + 2));

var nodePos = [];
for (var i=0; i<NODE_COUNT; ++i) {
	nodePos[i] = [node_x(i), node_y(i)];
}

stage.on('click', function(e) {
	var edge = getChosenEdge(e.x, e.y);
	if (edge[0] != -1) {
		matrix = doClick(edge[0], edge[1]);
		updateEdges(matrix, edges, 0);
	}
});


//// HELPER FUNCTIONS

function getChosenEdge(x, y) {
	var minDist = SENSE_DIST, bestEdge = [-1, -1];
	var	x1, y1, a, b, dist;
	for (var i=0; i<NODE_COUNT; ++i) {
		x1 = nodePos[i][0];
		y1 = nodePos[i][1];
		for (var j=i+1; j<NODE_COUNT; ++j) {
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
    return RADIUS * Math.sin(i * 2. * Math.PI / NODE_COUNT) + RADIUS + OFFSET;
}
function node_y(i) {
    return RADIUS * -Math.cos(i * 2. * Math.PI / NODE_COUNT) + RADIUS + OFFSET;
}

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
	var n = state.perm.length-2;
	for (var i=1; i<n; ++i) {
		permStr += state.perm[i].toString()+",";
	}
	permStr += state.perm[n] + ")$";
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
}
