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
