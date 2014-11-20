function transformDotBracket(seq, dotbr){
	var round = new Array();
	var curly = new Array();

	var nodes = new Array();
	var links = new Array();

	for(var i = 0; i < seq.length; i++){
		nodes.push({name: seq[i]});
		if(i > 0){
			links.push({source: i-1, target: i, type: "phosphodiester"});
		}
		if(dotbr[i] === "("){
			round.push(i);
		}
		else if(dotbr[i] === "{"){
			curly.push(i);
		}
		else if(dotbr[i] === ")"){
			links.push({source: round.pop(), target: i, type: "hbond"});
		}
		else if(dotbr[i] === "}"){
			links.push({source: curly.pop(), target: i, type: "hbond"});
		}
		else {
			continue;
		}
	}
	return {nodes: nodes,
			links: links};
}