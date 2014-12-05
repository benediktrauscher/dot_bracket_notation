function transformDotBracket(seq, dotbr){
	var round = new Array();
	var curly = new Array();
	var square = new Array();
	var pointy = new Array();

	var nodes = new Array();
	var links = new Array();

	var src;

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
				src = round.pop();
				console.log("yo");
				links.push({source: src, target: i, type: "hbond"});
				if(nodes[src].name==="G" || nodes[src].name==="C"){
					links.push({source: i, target: src, type: "hbond"});
				}
				break;
			case "}":
				src = curly.pop();
				links.push({source: src, target: i, type: "hbond"});
				if(nodes[src].name==="G" || nodes[src].name==="C"){
					links.push({source: i, target: src, type: "hbond"});
				}
				break;
			case "]":
				src = square.pop();
				links.push({source: src, target: i, type: "hbond"});
				if(nodes[src].name==="G" || nodes[src].name==="C"){
					links.push({source: i, target: src, type: "hbond"});
				}
				break;
			case ">":
				src = pointy.pop();
				links.push({source: src, target: i, type: "hbond"});
				if(nodes[src].name==="G" || nodes[src].name==="C"){
					links.push({source: i, target: src, type: "hbond"});
				}
				break;
			case ".":
				break;
		}
	}
	return {nodes: nodes,
			links: links};
}

function toCytoscapeElements(graph){
	var elements = [];
	var el;

	var nodes = graph.nodes;
	for(var i = 0; i < nodes.length; i++){
		el = {
			group: 'nodes',
			data: {
				id: i.toString(),
				label: nodes[i].name
			},
			selected: false,
			selectable: true,
			locked: false,
			grabbable: true,
			css: {
				'background-color': getColor(nodes[i].name),
				'width': 100,
				'height': 100
			}
		}
		elements.push(el);
	}
	var links = graph.links;
	for(var i = 0; i < links.length; i++){
		el = {
			group: 'edges',
			data: {
				id: links[i].source + "to" + links[i].target,
				source: links[i].source.toString(), 
    			target: links[i].target.toString(),
    			label: links[i].type ,
    			weight: getWeight(links[i].type)
			},
			css: {
				'line-color': getColor(links[i].type),
				'width': getWeight(links[i].type)
			}
		}
		elements.push(el);
	}
	return elements;
}

function getColor(element){
	var col = "";
	if (element === "A"){
		col = "#64F73F";
	}
	else if (element === "C"){
		col = "#FFB340";
	}
	else if (element === "U"){
		col = "#3C88EE";
	}
	else if (element === "G"){
		col = "#EB413C";
	}
	else if (element === "hbond"){
		col = "#3A9AD9";
	}
	else {
		col = "black";
	}
	return col;
}

function getWeight(type) {
	var weight; 
	if(type==="hbond"){
    	weight = 4;
    } else {
    	weight = 5;
    }
    return weight;
}

