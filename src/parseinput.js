function getInputSequences() {
  var seqBox = document.getElementById('SEQ_BOX');
  var dotbrBox = document.getElementById('DOTBR_BOX');
  var sequence = seqBox.value;
  var dotbr = dotbrBox.value;

  return [sequence, dotbr];
}

function main() {
  //initalize input boxes with example structure
  document.getElementById('SEQ_BOX').value = "GAGUACAAUAUGUACCG";
  document.getElementById('DOTBR_BOX').value = "..((((.....))))..";
  var input = getInputSequences();
  var struct = transformDotBracket(input[0], input[1]);
  visCytoscapeJs(struct);

  var runButton = document.getElementById('PERFORM_VIS');
  runButton.addEventListener('click', function(){ 
  	var input = getInputSequences();
  	if(input[0].length === input[1].length && input[0].length > 0 && input[1].length > 0){
  		var struct = transformDotBracket(input[0], input[1]);
  		visCytoscapeJs(struct);
  	}
  }, false);
}
$( document ).ready(main);
$( document ).ready(main);