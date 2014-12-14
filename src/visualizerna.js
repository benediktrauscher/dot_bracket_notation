function d3test(graph){
	d3.select("svg")
       .remove();

	var width = 960,
    height = 500;

	var color = d3.scale.category20();

	var force = d3.layout.force()
	    .charge(-300)
	    .linkDistance(10)
	    .size([width, height]);

	var svg = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height);

	  force
	      .nodes(graph.nodes)
	      .links(graph.links)
	      .start();

	  var link = svg.selectAll(".link")
	      .data(graph.links)
	    .enter().append("line")
	      .attr("class", "link")
	      .style("stroke-width", function(d) { return Math.sqrt(4); });

	  var node = svg.selectAll(".node")
	      .data(graph.nodes)
	    .enter().append("circle")
	      .attr("class", "node")
	      .attr("r", 12)
	      .style("fill", function(d) { return  "blue"; })
	      .call(force.drag);

	  node.append("title")
	      .text(function(d) { return d.name; });

	  force.on("tick", function() {
	    link.attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });

	    node.attr("cx", function(d) { return d.x; })
	        .attr("cy", function(d) { return d.y; });
	  });

}


function visCytoscapeJs(graph) {
	var cyEle = toCytoscapeElements(graph);
	var noHBond = [];
	var hbonds = [];
	for(var i = 0; i < cyEle.length; i++){
		if(cyEle[i].data.label === "hbond"){
			hbonds.push(cyEle[i]);
		} 
		else {
			noHBond.push(cyEle[i]);
		}
	}

	var cy = cytoscape({
  		container: document.getElementById('cy'),
  
  		style: cytoscape.stylesheet()
	    		.selector('node')
	      		.css({
			        'content': 'data(label)',
			        'text-valign': 'center',
			        'color': 'white',
			        'text-outline-width': 2,
			        'text-outline-color': '#778899'
	      		})
	    		.selector(':selected')
	      		.css({
			        'background-color': 'black',
			        'line-color': 'black',
			        'target-arrow-color': 'black',
			        'source-arrow-color': 'black',
			        'text-outline-color': 'black'
	      		})
	      		.selector('edge')
	      		.css({
	      			
	      		}),
  
  		elements: cyEle,
  		
  		layout: {
    		name: 'preset',
  		},			
      
      	ready: function(){
			cy.viewport({
  				zoom: 2,
 				pan: { x: 100, y: 100 }
			});
			cy.fit();
			document.getElementById('cy').childNodes[0]
				.childNodes[4].style.position = "relative";
      		document.getElementById('cy').childNodes[0]
      			.style.position = "relative";
      		document.getElementById('cy').style.position = "relative";
      	}
	})
	
	  
	cy.on('tap', 'node', function(){
	  try { // your browser may block popups
	    window.open( this.data('href') );
	  } catch(e){ // fall back on url change
	    window.location.href = this.data('href'); 
	  } 
	});
}