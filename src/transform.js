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

var tone = "AAAAAAAAA"
var ttwo = ".<<[.].>>""