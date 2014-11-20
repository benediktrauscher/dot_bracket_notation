function getInputSequences() {
  var seqBox = document.getElementById('SEQ_BOX');
  var dotbrBox = document.getElementById('DOTBR_BOX');
  var sequence = seqBox.value;
  var dotbr = dotbrBox.value;

  return [sequence, dotbr];
}

function main() {
  var runButton = document.getElementById('PERFORM_VIS');
  runButton.addEventListener('click', function(){ 
  	var input = getInputSequences();
  	if(input[0].length === input[1].length && input[0].length > 0 && input[1].length > 0){
  		var struct = transformDotBracket(input[0], input[1]);
  		visRna(struct.nodes, struct.links);
  	}
  }, false);
}
$( document ).ready(main);