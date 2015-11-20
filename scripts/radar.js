// Radar Java Script for Restaurant Finder



// Dataset
var center = [55.123, 65.123];

// this should be replaced with actual data pulled from G-Maps
var restaurants = [
					[56.321, 70.123, 4],
					[53.321, 62.123, 3.5],
					[57.321, 68.123, 1],
					[55.321, 55.123, 5],
					[51.321, 76.123, 2],
				];
				
// Process the data for restaruants dots
// change values to ones relative to the center point			
for(i = 0; i < restaurants.length; i++){
	restaurants[i][0] -= center[0];
	restaurants[i][1] -= center[1];				
}			

			
// SVG attrib
var svg_w = 500;
var svg_h = svg_w; // square



// Create scales for restaurant dost
var xScaleDot = d3.scale.linear()
	.domain([d3.min(restaurants, function(d){ return d[0]; }),
			d3.max(restaurants, function(d){ return d[0]; })])
	.range([svg_w/5, svg_w - svg_w/5]); // padded range
				
var yScaleDot = d3.scale.linear()
	.domain([d3.min(restaurants, function(d){ return d[1]; }),
			d3.max(restaurants, function(d){ return d[1]; })])
	.range([svg_h/5, svg_h - svg_h/5]); // padded range

var rtgScaleDot = d3.scale.linear()
	.domain([1, 5])
	.range([svg_w*0.03, svg_w*0.06]); // <=========== replace with some global calibration var maybe?
	
var rtgScaleTxt = d3.scale.linear()
	.domain([1,5])
	.range([15,40]); // <====================== Should probably be scaled off svg size

// Radar Circle attrib
var radar_pad = svg_w / 70; 
var t0 = Date.now();


// SVG ********************************************************** SVG

var svg = d3.select("#radar-location").append("svg")
	.attr("width", svg_w)
	.attr("height", svg_h)
	.attr("display", "block")
	.style("margin-left", "auto")
	.style("margin-right", "auto");
	
// Radar Circle Body

var radar_circ_body = svg.append("circle")
	.attr("cx", svg_w/2)
	.attr("cy", svg_h/2)
	.attr("r", svg_w/2 - radar_pad) 
	.attr("stroke-width", radar_pad * 1.5) 
	.attr("class", "radar-body");
	
// Radar Range Circles

svg.append("circle")
	.attr("cx", radar_circ_body.attr("cx"))
	.attr("cy", radar_circ_body.attr("cy"))
	.attr("r", radar_circ_body.attr("r"))
	.attr("stroke-width", radar_pad) 
	.attr("class", "radar-range-circle");  
	
svg.append("circle")
	.attr("cx", radar_circ_body.attr("cx"))
	.attr("cy", radar_circ_body.attr("cy"))
	.attr("r", radar_circ_body.attr("r") * 2 / 3)
	.attr("stroke-width", radar_pad) 
	.attr("class", "radar-range-circle");
	
svg.append("circle")
	.attr("cx", radar_circ_body.attr("cx"))
	.attr("cy", radar_circ_body.attr("cy"))
	.attr("r", radar_circ_body.attr("r") * 1 / 3)
	.attr("stroke-width", radar_pad) 
	.attr("class", "radar-range-circle");			


// Radar Range Grid

// horiz
svg.append("line")
	.attr("x1", 0)
	.attr("y1", svg_h/2)
	.attr("x2", svg_w)
	.attr("y2", svg_h/2)
	.attr("stroke-width", radar_pad)
	.attr("class", "radar-grid-line");
	
// vert
svg.append("line")
	.attr("x1", svg_h/2)
	.attr("y1", 0)
	.attr("x2", svg_h/2)
	.attr("y2", svg_h)
	.attr("stroke-width", radar_pad)
	.attr("class", "radar-grid-line");
	
	
var detector = svg.append("line")
	.attr("x1", svg_w/2)
	.attr("y1", svg_h/2)
	.attr("x2", svg_w)
	.attr("y2", svg_h/2)
	.attr("stroke-width", radar_pad *1.5)
	.attr("class", "radar-detector-line");
	
	
	
// Center Point

svg.append("circle")
	.attr("cx", radar_circ_body.attr("cx"))
	.attr("cy", radar_circ_body.attr("cy"))
	.attr("r", radar_pad) 
	.attr("stroke-width", radar_pad)
	.attr("class", "radar-range-circle radar-center");	
	
	
	
// Restaurant Dots ***************************************** Restaurant Dots

// dots
svg.selectAll("dot")
	.data(restaurants)
	.enter()
	.append("circle")
	.attr("class", "dot")
	.attr("cx", function(d){ return xScaleDot(d[0]);})
	.attr("cy", function(d){ return yScaleDot(d[1]);})
	.attr("r", function(d){ return rtgScaleDot(d[2]);})
	.attr("fill", function(d){
		// change color based on rating
		var rating = d[2];					
		if(rating < 2.5) return "#ff0000";
		else if (rating >= 2.5 && rating < 4) return "#e5e600";
		else return "#00cc00";					
		});

// rating values
svg.selectAll("dot-text")
		.data(restaurants)
		.enter()
		.append("text")
		.attr("class", "dot-text")
		.text(function(d){ return d[2];})
		.attr("x", function(d){ return xScaleDot(d[0]);})
		.attr("y", function(d){ return yScaleDot(d[1]);})
		.attr("font-size", function(d){ return rtgScaleTxt(d[2]) + "px"; })									
		.attr("text-anchor", "middle")
		.attr("dominant-baseline", "middle");

		
	
	
// Helper Functions ***************************************** Helper Functions	

// Rotating function	
d3.timer(function() {
	var delta = (Date.now() - t0);
	detector.attr("transform", "rotate("+ delta / 5 +"," + svg_w/2 + "," + svg_h/2 + ")");
});
			
