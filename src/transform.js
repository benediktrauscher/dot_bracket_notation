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
	var coords = getCoords(seq, dotbr, links);
	return {nodes: nodes,
			links: links,
			coords: coords};
}

function toCytoscapeElements(graph){
	var elements = [];
	var el;

	var nodes = graph.nodes;
	var coords = graph.coords;
	for(var i = 0; i < nodes.length; i++){
		el = {
			group: 'nodes',
			data: {
				id: i.toString(),
				label: nodes[i].name
			},
			position: {
				x: coords[i].x,
				y: coords[i].y
			},
			selected: false,
			selectable: true,
			locked: false,
			grabbable: true,
			css: {
				'background-color': getColor(nodes[i].name)
				//'width': 100,
				//'height': 100
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
		col = $("#acolor").spectrum('get').toHexString();
	}
	else if (element === "C"){
		col = $("#ccolor").spectrum('get').toHexString();
	}
	else if (element === "U"){
		col = $("#ucolor").spectrum('get').toHexString();
	}
	else if (element === "G"){
		col = $("#gcolor").spectrum('get').toHexString();
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

function getCoords(seq, dotbr, links){
	var coords = [];
	var centers = [];
	var angles = [];
	var dirAngle = -1;

	for(var i = 0; i < seq.length; i++){
		coords[i] = {x: 0, y: 0};
		centers[i] = {x: 0, y: 0};
	}

	dirAngle += 1.0 - Math.PI / 2.0;
	var i = 0;
	var x = 0.0;
	var y = 0.0;
	var vx = -Math.sin(dirAngle);
	var vy = Math.cos(dirAngle);

	while(i < seq.length){
		coords[i].x = x;
		coords[i].y = y;
		centers[i].x = x + 65 * vy;
		centers[i].y = y - 65 * vx;
		var j = getPartner(i, links);
		
		if(j > i){
			drawLoop(i, j, 	x + (65 * vx / 2.0), y
								+ (65 * vy / 2.0), dirAngle,
								coords, centers, angles, seq, links);
			centers[i].x = coords[i].x + 65 * vy;
			centers[i].y = y - 65 * vx;
			i = j;
			x += 65 * vx;
			y += 65 * vy;
			centers[i].x = coords[i].x + 65 * vy;
			centers[i].y = y - 65 * vx;
		}
		x += 35 * vx;
		y += 35 * vy;
		//debug(coords[i].x + " " + coords[i].y);
		i += 1;
	}

	return coords;
}

function getPartner(srcIndex, links){
	var partner = -1;
	for(var i = 0; i < links.length; i++){
		if(links[i].type === "hbond"){
			if(links[i].source === srcIndex){
				partner = links[i].target;
				break;
			}
			else if(links[i].target === srcIndex){
				partner = links[i].source;
				break;
			}
			else {
				continue;
			}
		}
	}
	return partner;
}

function drawLoop(i, j, x, y, dirAngle, coords, centers, angles, seq, links){
	//debug(i);
	//debug(j);
	if (i > j) {
		return;
	}

	// BasePaired
	if (getPartner(i, links) === j) {
		var normalAngle = Math.PI / 2.0;
		centers[i] = {x: x, y: y};
		centers[j] = {x: x, y: y};
		coords[i].x = (x + 65 * Math.cos(dirAngle - normalAngle) / 2.0);
			coords[i].y = (y + 65 * Math.sin(dirAngle - normalAngle) / 2.0);
			coords[j].x = (x + 65 * Math.cos(dirAngle + normalAngle) / 2.0);
			coords[j].y = (y + 65 * Math.sin(dirAngle + normalAngle) / 2.0);
			drawLoop(i + 1, j - 1, x + 40 * Math.cos(dirAngle), y + 40 * Math.sin(dirAngle), dirAngle, coords,
					centers, angles, seq, links);
	} 
	else {
		//debug("multi loop now");
		var k = i;
		var basesMultiLoop = [];
		var helices = [];
		var l;
		while (k <= j) {
			l = getPartner(k, links);
			if (l > k) {
				basesMultiLoop.push(k);
				basesMultiLoop.push(l);
				helices.push(k);
				k = l + 1;
			}
			else {
				basesMultiLoop.push(k);
				k++;
			}
		}
		var mlSize = basesMultiLoop.length + 2;
		var numHelices = helices.length + 1;
		var totalLength = 35 * (mlSize - numHelices) + 65 * numHelices;
		var multiLoopRadius;
		var angleIncrementML;
		var angleIncrementBP;
		if (mlSize > 3) {
			multiLoopRadius = determineRadius(numHelices, mlSize - numHelices, (totalLength) / (2.0 * Math.PI), 65, 35);
			angleIncrementML = -2.0 * Math.asin(35 / (2.0 * multiLoopRadius));
			angleIncrementBP = -2.0 * Math.asin(65 / (2.0 * multiLoopRadius));
		}
		else {
			multiLoopRadius = 35.0;
			angleIncrementBP = -2.0 * Math.asin(65 / (2.0 * multiLoopRadius));
			angleIncrementML = (-2.0 * Math.PI - angleIncrementBP) / 2.0;
		}
		var centerDist = Math.sqrt(Math.max(Math.pow(multiLoopRadius, 2) - Math.pow(65 / 2.0, 2), 0.0)) - 40;
		var mlCenter = {x: x + (centerDist * Math.cos(dirAngle)),
						y: y + (centerDist * Math.sin(dirAngle))}
		// Base directing angle for (multi|hairpin) loop, from the center's
		// perspective
		var baseAngle = dirAngle
				// U-turn
				+ Math.PI
				// Account for already drawn supporting base-pair
				+ 0.5 * angleIncrementBP
				// Base cannot be paired twice, so next base is at
				// "unpaired base distance"
				+ 1.0 * angleIncrementML;
			
		var currUnpaired = [];
		var currInterval = {el1: 0, el2: baseAngle-1.0 * angleIncrementML};
		var intervals = [];
			
		for (k = basesMultiLoop.length - 1; k >= 0; k--) {
			l = basesMultiLoop[k];
			centers[l] = mlCenter;
			var isPaired = (getPartner(i, links) != -1);
			var isPaired3 = isPaired && (getPartner(i) < l);
			var isPaired5 = isPaired && !isPaired3;
			if (isPaired3) {
				baseAngle = correctHysteresis(baseAngle+angleIncrementBP/2.)-angleIncrementBP/2.;
				currInterval.el1 = baseAngle;
				intervals.push({el1: currUnpaired, el2: currInterval });
				currInterval = { el1: -1., el2: -1. };  
				currUnpaired = [];
			}
			else if (isPaired5)
			{
				currInterval.el2 = baseAngle;
			}
			else
			{
				currUnpaired.push(l);
			}
			angles[l] = baseAngle;
			if (isPaired3)
			{ 
				baseAngle += angleIncrementBP;
			}
			else {
				baseAngle += angleIncrementML;
			}
		}
		currInterval.el1 = dirAngle - Math.PI - 0.5 * angleIncrementBP;
		intervals.push( {el1: currUnpaired, el2: currInterval } );

		for(var z = 0; z < intervals.length; z++){
			var mina = intervals[z].el2.el1;
			var maxa = normalizeAngle(intervals[z].el2.el2, mina);
			
			for (var n = 0; n < intervals[z].el1.length; n++){
				var ratio = (1. + n)/(1. + intervals[z].el1.length);
				var b = intervals[z].el1[n];
				angles[b] = mina + (1.-ratio)*(maxa-mina);
			}
		}
				
		for (k = basesMultiLoop.length - 1; k >= 0; k--) {
			l = basesMultiLoop[k];
			coords[l].x = mlCenter.x + multiLoopRadius * Math.cos(angles[l]);
			coords[l].y = mlCenter.y + multiLoopRadius * Math.sin(angles[l]);
		}	
			
		var newAngle;
		var m, n;
		for (k = 0; k < helices.length; k++) {
			//debug("herrrro");
			m = helices[k];
			n = getPartner(m, links);
			newAngle = (angles[m] + angles[n]) / 2.0;
			drawLoop(m + 1, n - 1, (40 * Math.cos(newAngle)) + (coords[m].x + coords[n].x) / 2.0,
						(40 * Math.sin(newAngle))
								+ (coords[m].y + coords[n].y) / 2.0, newAngle,
						coords, centers, angles, seq, links);
			}
		}
}

function determineRadius(nbHel, nbUnpaired, startRadius, bpdist, multidist) {
	var xmin = bpdist / 2.0;
	var xmax = 3.0 * multidist + 1;
	var x = (xmin + xmax) / 2.0;
	var y = 10000.0;
	var ymin = -1000.0;
	var ymax = 1000.0;
	var numIt = 0;
	var precision = 0.00001;
	while ((Math.abs(y) > precision) && (numIt < 10000)) {
		x = (xmin + xmax) / 2.0;
		y = objFun(nbHel, nbUnpaired, x, bpdist, multidist);
		ymin = objFun(nbHel, nbUnpaired, xmax, bpdist, multidist);
		ymax = objFun(nbHel, nbUnpaired, xmin, bpdist, multidist);
		if (ymin > 0.0) {
			xmax = xmax + (xmax - xmin);
		} else if ((y <= 0.0) && (ymax > 0.0)) {
			xmax = x;
		} else if ((y >= 0.0) && (ymin < 0.0)) {
			xmin = x;
		} else if (ymax < 0.0) {
			xmin = Math.max(xmin - (x - xmin),
					Math.max(bpdist / 2.0, multidist / 2.0));
			xmax = x;
		}
		numIt++;
	}
	return x;
}

function objFun(n1, n2, r, bpdist, multidist) {
	return ( n1 * 2.0 * Math.asin(bpdist / (2.0 * r)) + n2 * 2.0
				* Math.asin( multidist / (2.0 * r)) - (2.0 * Math.PI));
}

function correctHysteresis(angle){
	var hystAttr = [ 0., Math.PI/4., Math.PI/2., 3.*Math.PI/4., Math.PI, 5.*(Math.PI)/4., 3.*(Math.PI)/2, 7.*(Math.PI)/4.];
	var result = normalizeAngle(angle);
	for (var i = 0; i < hystAttr.length; i++){
		var att = hystAttr[i];
		if (Math.abs(normalizeAngle(att-result,-Math.PI)) < .15){
			result = att;
		}
	}
	return result;
}

function normalizeAngle(angle){
	return normalizeAngle(angle,0.);
}
	
function normalizeAngle(angle,fromVal) {
	var toVal = fromVal +2.*Math.PI;
	var result = angle;
	while(result<fromVal){
		result += 2.*Math.PI;
	}
	while(result >= toVal)
	{
		result -= 2.*Math.PI;
	}
	return result;		
}
/*
var seq = "CGCUUCAUAUAAUCCUAAUGAUAUGGUUUGGGAGUUUCUACCAAGAGCCUUAAACUCUUGAUUAUGAAGUG";
var dotbr = "(((((((((...((((((.........))))))........((((((.......))))))..)))))))))";
var struct = transformDotBracket(seq, dotbr);
for(var i = 0; i < struct.coords.length; i++){
//	debug(struct.coords[i].x + " " + struct.coords[i].y);
//	debug(getPartner(i, struct.links))
}
*/