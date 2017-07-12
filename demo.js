var NODE_COUNT = 8;
var OFFSET = 50;
var RADIUS = 250;
var NODE_RADIUS = 20;

var nodes = [];
for (var i = 0; i < NODE_COUNT; i++) {
    nodes[i] = [false,false,false,false,false,false,false,false];
}

var edges = 12 + Math.random()*5;
for (var i = 0; i < edges; i++) {
    var n1 = Math.floor(Math.random()*NODE_COUNT);
    var n2 = Math.floor(Math.random()*NODE_COUNT);
    if (n1 == n2 || nodes[n1][n2]) { i--; }
    else {
        nodes[n1][n2] = true;
        nodes[n2][n1] = true;
    }
}

for (var i = 0; i < NODE_COUNT; i++) {
    for (var j = i; j < NODE_COUNT; j++) {
        if (nodes[i][j]) {
            new Path([
                node_x(i), node_y(i),
                node_x(j), node_y(j)
            ]).stroke('white', 5)
                .animate('250ms', { 
                    strokeColor: 'black' 
                }, {
                    delay: (NODE_COUNT*100 + 200) + 'ms'
                })
                .addTo(stage);
        }
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


//// HELPER FUNCTIONS

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
	return A;
}