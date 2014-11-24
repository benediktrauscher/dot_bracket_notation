function transformDotBracket(seq, dotbr){
	var round = new Array();
	var curly = new Array();
	var square = new Array();
	var pointy = new Array();

	var nodes = new Array();
	var links = new Array();

	for(var i = 0; i < seq.length; i++){
		nodes.push({name: seq[i]});
		if(i > 0){
			links.push({source: i-1, target: i, type: "phosphodiester"});
		}
		switch(dotbr[i]){
			case "(":
				round.push(i);
				break;
			case "{":
				curly.push(i);
				break;
			case "[":
				square.push(i);
				break;
			case "<":
				pointy.push(i);
				break;
			case ")":
				links.push({source: round.pop(), target: i, type: "hbond"});
				break;
			case "}":
				links.push({source: curly.pop(), target: i, type: "hbond"});
				break;
			case "]":
				links.push({source: square.pop(), target: i, type: "hbond"});
				break;
			case ">":
				links.push({source: pointy.pop(), target: i, type: "hbond"});
				break;
			case ".":
				break;
		}
	}
	return {nodes: nodes,
			links: links};
}

function toJson(graph){
	var network = {
		dataSchema: {
            nodes: [{ name: "label", type: "string"} ],
            edges: [{ name: "label", type: "string"},
            		{ name: "weight", type: "integer"} ]
        },
        data: {
            nodes: [],
            edges: []
        }
    };

    var nodes = graph.nodes;
    for(var i = 0; i < nodes.length; i++){
    	network.data.nodes.push({ id: i.toString(),
    							label: nodes[i].name });
    }

    var links = graph.links;
    for(var i = 0; i < links.length; i++){
    	network.data.edges.push({ id: links[i].source + "to" + links[i].target,
    							source: links[i].source.toString(), 
    							target: links[i].target.toString(),
    							label: links[i].type ,
    							weight: getWeight(links[i].type)
    						});
    }

    return network;
}

function getWeight(type) {
	var weight; 
	if(type==="hbond"){
    	weigth = 3000;
    } else {
    	weight = 3000;
    }
    return weight;
}

