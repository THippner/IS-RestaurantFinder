// Radar Java Script for Restaurant Finder



// this should be replaced with actual data pulled from G-Maps
var center = [55.8574, -4.256899];
var restaurants = [ // lat, long, rating, distance
					[55.857126, -4.25743, 1, 0],
					[55.857183, -4.257108, 2, 0],
					[55.857738, -4.25596, 3, 0],
					[55.857876, -4.257022, 4, 0],
					[55.857545, -4.257296, 5, 0],
				];

// get distance form center to points

for(i = 0; i < restaurants.length; i++){
	
	var point1 = {
		latitude: center[0],
		longitude: center[1]
	};
	
	var point2 = {
		latitude: restaurants[i][0],
		longitude: restaurants[i][1]
	};
		
	restaurants[i][3] = distance(point1, point2);	
}


				
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

// find absolute highets value and scale to it in both ways

var max_val = absMax(restaurants);
//var max
var xScaleDot = d3.scale.linear()
	.domain([-max_val , max_val])
	.range([svg_w/8, svg_w - svg_w/8]); // padded range
		
				
//var yScaleDot = d3.scale.linear()
//	.domain([d3.min(restaurants, function(d){ return d[1]; }),
//			d3.max(restaurants, function(d){ return d[1]; })])
//	.range([svg_h/5, svg_h - svg_h/5]); // padded range



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
	.attr("cx", function(d){ return xScaleDot(d[1]);})
	.attr("cy", function(d){ return svg_h - xScaleDot(d[0]);})
	.attr("r", function(d){ return rtgScaleDot(d[2]);})
	.attr("fill", function(d){
		// change color based on rating
		var rating = d[2];					
		if(rating < 2.5) return "#ff0000";
		else if (rating >= 2.5 && rating < 4) return "#e5e600";
		else return "#00cc00";					
		});
	//.attr("transform", "rotate("+ -90 +"," + svg_w/2 + "," + svg_h/2 + ")"); // correction of svg coordinates to normal coordinates

// rating values
svg.selectAll("dot-text")
		.data(restaurants)
		.enter()
		.append("text")
		.attr("class", "dot-text")
		.text(function(d){ return d[2];})
		.attr("x", function(d){ return xScaleDot(d[1]);})
		.attr("y", function(d){ return svg_h - xScaleDot(d[0]);})
		.attr("font-size", function(d){ return rtgScaleTxt(d[2]) + "px"; })									
		.attr("text-anchor", "middle")
		.attr("dominant-baseline", "middle");
		//.attr("transform", "rotate("+ -90 +"," + svg_w/2 + "," + svg_h/2 + ") rotate(90)"); // correction of svg coordinates to normal coordinates
		
//svg.selectAll("dot-text").attr("transform", "");

// Testing code ********************************************** Testing code

svg.selectAll("text-distance")
		.data(restaurants)
		.enter()
		.append("text")
		.attr("class", "text-distance")
		.text(function(d){ return d[3] + "m";})
		.attr("x", function(d){ return xScaleDot(d[1])+20;})
		.attr("y", function(d){ return svg_h - xScaleDot(d[0])+20;})
		.attr("font-size", function(d){ return rtgScaleTxt(d[2]) + "px"; })									
		//.attr("text-anchor", "middle")
		.attr("dominant-baseline", "middle")
		.attr("fill", "gray");
	
	
	
// Helper Functions ***************************************** Helper Functions	

// Rotating function	
d3.timer(function() {
	var delta = (Date.now() - t0);
	detector.attr("transform", "rotate("+ delta / 5 +"," + svg_w/2 + "," + svg_h/2 + ")");
});

// Find absoulte maximum of latitude/longitude
function absMax(data){
	
	var max = 0;
	for(i = 0; i < data.length; i++){
			
		var i_max = Math.max(Math.abs(data[i][0]), Math.abs(data[i][1]));
		if(i_max > max) max = i_max;
		
	}
	
	return max;
}

// Convert value to radians
function toRadians(value){	
	return value * Math.PI / 180;
}

// Calculate distance between two points
// returns distance between two points in meters
function distance(point1, point2){
	
	var R = 6371000; // earth radius in meters
	
	// center point
	var lat1 = toRadians(point1.latitude);
	var lon1 = toRadians(point1.longitude);
	
	// distant point
	var lat2 = toRadians(point2.latitude);
	var lon2 = toRadians(point2.longitude);
	
	// calculate deltas
	var dlat = lat2 - lat1;
	var dlon = lon2 - lon1;
	
	// calculate mathy things oO
	var a = Math.sin(dlat/2) * Math.sin(dlat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon/2) * Math.sin(dlon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	
	// calculate distance
	var d = R * c;
	
	 	
	return Math.round(d);
}














			
