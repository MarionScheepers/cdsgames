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
var MIN_SP_GAME = 3;

var perm;
var edges = [];

var gameOn = false;

if (stage.options.sorttype == "sortable") {
    perm = sortablePermMatrix(NODE_COUNT);
} else if (stage.options.sorttype == "unsortable") {
    perm = unsortablePermMatrix(NODE_COUNT);
} else if (stage.options.sorttype == "game") {
	do {
		perm = unsortablePermMatrix(NODE_COUNT);
	} while (SP(perm.perm).length < MIN_SP_GAME);
	gameOn = true;
} else {
    perm = getPermMatrix(NODE_COUNT);
}
if (gameOn) {
	perm["pile"] = SP(perm.perm);
	perm["pile"].sort(function(a,b) { return a-b; });
}
stage.sendMessage('change', perm);
var matrix = perm["matrix"];
var nodes = [];
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
        nodes.push(new Path([x, y+HANDLE_RADIUS, x-HANDLE_RADIUS, y,
                  x, y-HANDLE_RADIUS, x+HANDLE_RADIUS, y,
                  x, y+HANDLE_RADIUS, x-HANDLE_RADIUS, y]));
		nodes[i].attr('fillColor', 'white')
            .stroke('white', 5)
            .animate('500ms', { 
                strokeColor: 'black' 
            }, {
                delay: (i * 100) + 'ms'
            })
            .addTo(stage);
    } else {
		var inPile = false;
		if (gameOn) {
			for (var k=0; k<perm['pile'].length; ++k) {
				if (perm['pile'][k] == i) {
					inPile = true;
				}
			}
		}
		if (gameOn && inPile) {
			nodes.push(new Circle(node_x(i), node_y(i), NODE_RADIUS));
			nodes[i].attr('fillColor', 'green')
            .stroke('green', 5)
            .animate('500ms', { 
                strokeColor: 'black' 
            }, {
                delay: (i * 100) + 'ms'
            })
            .addTo(stage);
		} else {
			nodes.push(new Circle(node_x(i), node_y(i), NODE_RADIUS));
            nodes[i].attr('fillColor', 'white')
            .stroke('white', 5)
            .animate('500ms', { 
                strokeColor: 'black' 
            }, {
                delay: (i * 100) + 'ms'
            })
            .addTo(stage);
		}
    }
}
counted = [];
for (var i=0; i<NODE_COUNT; ++i)
	counted.push(0);

updateEdges(matrix, edges, 100 * (NODE_COUNT + 2));
stage.on('click', function(e) {
	if (gameOn) {
		var vtx = getChosenVertex(e.x, e.y);
		if (vtx != -1) {
			counted[vtx] = 1;
			nodes[vtx].attr('fillColor', 'red');
		}
		var ctdSum = 0;
		for (var v = 0; v < NODE_COUNT; ++v)
			ctdSum += counted[v];
		if ((ctdSum+1)*2 > perm['pile'].length) {
			gameOn = false;
			for (var j=0; j<perm['pile'].length; ++j) {
				if (!counted[perm['pile'][j]]) {
					nodes[perm['pile'][j]].attr('fillColor', 'blue');
				}
			}
		}
		return;
	}
    var edge = getChosenEdge(e.x, e.y);
    if (edge[0] != -1) {
        matrix = doClick(edge[0], edge[1]);
        perm['perm'] = cds(perm['perm'], edge[0], edge[1]);
        perm['matrix'] = matrix;
		if (gameOn) {
			perm["pile"] = SP(perm.perm);
			perm["pile"].sort(function(a,b) { return a-b; });
		}
        stage.sendMessage('change', perm);
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

function cds(pi, p, q) {
    pptrs = [];
    qptrs = [];
    for (var i=0; i<pi.length; ++i) {
        if (pi[i] == p) {
            pptrs.push(2*i+2);
        }
        if (pi[i] == p+1) {
            pptrs.push(2*i+1);
        }
        if (pi[i] == q) {
            qptrs.push(2*i+2);
        }
        if (pi[i] == q+1) {
            qptrs.push(2*i+1);
        }
    }
    pi2 = []
    if (pptrs[0] < qptrs[0]) {
        if (pptrs[1] < qptrs[0] || pptrs[1] > qptrs[1]) {
            return undefined;
        }
        pptrs[0] >>= 1; pptrs[1] >>= 1;
        qptrs[0] >>= 1; qptrs[1] >>= 1;
        for (var i=0; i<pptrs[0]; ++i)
            pi2.push(pi[i]);
        for (var i=pptrs[1]; i<qptrs[1]; ++i)
            pi2.push(pi[i]);
        for (var i=qptrs[0]; i<pptrs[1]; ++i)
            pi2.push(pi[i]);
        for (var i=pptrs[0]; i<qptrs[0]; ++i)
            pi2.push(pi[i]);
        for (var i=qptrs[1]; i<pi.length; ++i)
            pi2.push(pi[i]);
    } else {
        if (qptrs[1] < pptrs[0] || qptrs[1] > pptrs[1]) {
            return undefined;
        }
        pptrs[0] >>= 1; pptrs[1] >>= 1;
        qptrs[0] >>= 1; qptrs[1] >>= 1;
        for (var i=0; i<qptrs[0]; ++i)
            pi2.push(pi[i]);
        for (var i=qptrs[1]; i<pptrs[1]; ++i)
            pi2.push(pi[i]);
        for (var i=pptrs[0]; i<qptrs[1]; ++i)
            pi2.push(pi[i]);
        for (var i=qptrs[0]; i<pptrs[0]; ++i)
            pi2.push(pi[i]);
        for (var i=pptrs[1]; i<pi.length; ++i)
            pi2.push(pi[i]);    
    }
    return pi2;
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

function getChosenVertex(x, y) {
	for (var j=0; j<perm['pile'].length; ++j) {
		var i = perm['pile'][j];
		var x1 = nodePos[i][0];
        var y1 = nodePos[i][1];
		if ((x1-x)**2+(y1-y)**2 < NODE_RADIUS**2) {
			return i;
		}
	}
	return -1;
}

function getChosenEdge(x, y) {
	for (var i=0; i<NODE_COUNT; ++i) {
		if ((x-nodePos[i][0])**2+(y-nodePos[i][1])**2 < NODE_RADIUS**2) {
			return -1;
		}
	}
    var minDist = SENSE_DIST, bestEdge = [-1, -1];
    var x1, y1, a, b, dist;
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
