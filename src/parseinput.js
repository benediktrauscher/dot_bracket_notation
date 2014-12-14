function getInputSequences() {
  var seqBox = document.getElementById('SEQ_BOX');
  var dotbrBox = document.getElementById('DOTBR_BOX');
  var sequence = seqBox.value;
  var dotbr = dotbrBox.value;

  return [sequence, dotbr];
}

function main() {
  //initalize input boxes with example structure
  document.getElementById('SEQ_BOX').value = "CGCUUCAUAUAAUCCUAAUGAUAUGGUUUGGGAGUUUCUACCAAGAGCCUUAAACUCUUGAUUAUGAAGUG";
  document.getElementById('DOTBR_BOX').value = "(((((((((...((((((.........))))))........((((((.......))))))..)))))))))";
  //init colors
  $("#acolor").spectrum({ color: "#64F73F" });
  $("#ccolor").spectrum({ color: "#FFB340" });
  $("#gcolor").spectrum({ color: "#EB413C" });
  $("#ucolor").spectrum({ color: "#3C88EE" });

  var input = getInputSequences();
  var struct = transformDotBracket(input[0], input[1]);
  visCytoscapeJs(struct);
  //d3test(struct);

  var runButton = document.getElementById('PERFORM_VIS');
  runButton.addEventListener('click', function(){ 
  	var input = getInputSequences();
  	if(input[0].length === input[1].length && input[0].length > 0 && input[1].length > 0){
  		var struct = transformDotBracket(input[0], input[1]);
  		visCytoscapeJs(struct);
      //d3test(struct);
  	}
  }, false);
}
$( document ).ready(main);
$( document ).ready(main);