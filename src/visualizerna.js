function visCytoscapeJs(graph) {
	var cy = cytoscape({
  		container: document.getElementById('cy'),
  
  		style: cytoscape.stylesheet()
	    		.selector('node')
	      		.css({
			        'content': 'data(label)',
			        'text-valign': 'center',
			        'color': 'white',
			        'text-outline-width': 2,
			        'text-outline-color': '#778899',
			        'font-size': 70
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
  
  		elements: toCytoscapeElements(graph),
  		
  		layout: {
    		name: 'cose',
			ready: function() {},
			stop: function() {},
			animate: true,
			refresh: 4,
			fit: true, 
			padding: 30,
			boundingBox: undefined,
			randomize: true,
			debug: false,
			nodeRepulsion: 30000000,
			nodeOverlap: 6,
			idealEdgeLength: 1,
			edgeElasticity: 1,
			nestingFactor: 1, 
			gravity: 0, 
			numIter: 200,
			initialTemp: 300,
			coolingFactor: 0.95, 
			minTemp: 1.0
  		},			
      
      	ready: function(){
      		cy.center();
			cy.fit();
			document.getElementById('cy').childNodes[0].childNodes[4].style.position = "relative";
      		document.getElementById('cy').childNodes[0].style.position = "relative";
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