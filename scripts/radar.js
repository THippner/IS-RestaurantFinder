// Radar JavaScript for Restaurant Finder



// KEEP THIS COMMENTED FOR NOW
// this should be replaced with actual data pulled from G-Maps
//var center = [55.8574, -4.256899];
//var restaurants = [ // lat, long, rating, distance
//					[55.857126, -4.25743, 1, 0],
//					[55.857183, -4.257108, 2, 0],
//					[55.857738, -4.25596, 3, 0],
//					[55.857876, -4.257022, 4, 0],
//					[55.857545, -4.257296, 5, 0],
//				];


// THIS WILL SHOW YOU VALUES IN CONSOLE WHEN YOU INSPECT

// empty data to be filled later
var center = [0,0]; // 
var restaurants = [ // lat, long, rating, distance
					[0, 0, 0, 0, 1],
					[0, 0, 0, 0, 2],
					[0, 0, 0, 0, 3],
					[0, 0, 0, 0, 4],
					[0, 0, 0, 0, 5],
				];

// fill data from global
//	center[0] = orgn.lat;
//	center[1] = orgn.lon;

// d3 function to move elements to front
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
	this.parentNode.appendChild(this);
  });
};

// d3 function to move element to back
d3.selection.prototype.moveToBack = function() { 
    return this.each(function() { 
        var firstChild = this.parentNode.firstChild; 
        if (firstChild) { 
            this.parentNode.insertBefore(this, firstChild); 
        } 
    }); 
};

function loadRadar(results, orgn){
	d3.select("#radar-location").selectAll("*").remove();
	center[0] = orgn.lat;
	center[1] = orgn.lng;
	
	for(i = 0; i < restaurants.length; i++){
		
			restaurants[i][0] = results[i].geometry.location.lat();
			restaurants[i][1] = results[i].geometry.location.lng();
			if(results[i].rating == 0 || results[i].rating == undefined)
				restaurants[i][2]= 1;
			else
			restaurants[i][2] = results[i].rating;
	}

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
		restaurants[i][0] -=  center[0];
		restaurants[i][1] -= center[1];	
		//restaurants[i][0] = restaurants[i][0] * 1000; // Whats this for????
		//restaurants[i][1] = restaurants[i][1] * 1000;			
	}

	// SVG attrib
	var svg_w = 500;
	var svg_h = svg_w; // square



	// Create scales for restaurant dots *****************************************************

	// find absolute highets value and scale to it in both ways
	var max_val = absMax(restaurants);

	// create scale
	var ScaleDot = d3.scale.linear()
		.domain([-max_val , max_val])	
		.range([svg_w/8, svg_w - svg_w/8]); // padded range


	var rtgScaleDot = d3.scale.linear()
		.domain([1, 5])
		.range([svg_w*0.03, svg_w*0.06]); 
		
	var rtgScaleTxt = d3.scale.linear()
		.domain([1,5])
		.range([15,40]); // <====================== Should probably be scaled off svg size

	// Radar Circle attrib
	var radar_pad = svg_w / 70; 
	var t0 = Date.now();


	// SVG ********************************************************** SVG

	// static svg background
	var bsvg = d3.select("#radar-location").append("svg")
		.attr("width", svg_w)
		.attr("height", svg_h)
		.style("position", "absolute")		
		.style("margin-left", "auto")
		.style("margin-right", "auto");
	//svg.selectAll("*").empty();
	
	//svg for dots
	var svg = d3.select("#radar-location").append("svg")
		.attr("width", svg_w)
		.attr("height", svg_h)
		.attr("display", "block")
		.style("position", "absolute")		
		.style("margin-left", "auto")
		.style("margin-right", "auto");
	svg.selectAll("*").empty();

	// Radar Circle Body
	var radar_circ_body = bsvg.append("circle")
		.attr("cx", svg_w/2)
		.attr("cy", svg_h/2)
		.attr("r", svg_w/2 - radar_pad) 
		.attr("stroke-width", radar_pad * 1.5) 
		.attr("class", "radar-body");
		
	// Radar Range Circles *************************************************

	// outer
	bsvg.append("circle")
		.attr("cx", radar_circ_body.attr("cx"))
		.attr("cy", radar_circ_body.attr("cy"))
		.attr("r", radar_circ_body.attr("r"))
		.attr("stroke-width", radar_pad) 
		.attr("class", "radar-range-circle");  

	// middle	
	bsvg.append("circle")
		.attr("cx", radar_circ_body.attr("cx"))
		.attr("cy", radar_circ_body.attr("cy"))
		.attr("r", radar_circ_body.attr("r") * 2 / 3)
		.attr("stroke-width", radar_pad) 
		.attr("class", "radar-range-circle");

	// inner	
	bsvg.append("circle")
		.attr("cx", radar_circ_body.attr("cx"))
		.attr("cy", radar_circ_body.attr("cy"))
		.attr("r", radar_circ_body.attr("r") * 1 / 3)
		.attr("stroke-width", radar_pad) 
		.attr("class", "radar-range-circle");			


	// Radar Range Grid **********************************************************

	// horizontal
	bsvg.append("line")
		.attr("x1", radar_pad)
		.attr("y1", svg_h/2)
		.attr("x2", svg_w - radar_pad)
		.attr("y2", svg_h/2)
		.attr("stroke-width", radar_pad)
		.attr("class", "radar-grid-line");
		
	// vertical
	bsvg.append("line")
		.attr("x1", svg_h/2)
		.attr("y1", radar_pad)
		.attr("x2", svg_h/2)
		.attr("y2", svg_h - radar_pad)
		.attr("stroke-width", radar_pad)
		.attr("class", "radar-grid-line");
		
		
	// Radar detector line **********************************************************	
	var detector = bsvg.append("line")
		.attr("x1", svg_w/2)
		.attr("y1", svg_h/2)
		.attr("x2", svg_w)
		.attr("y2", svg_h/2)
		.attr("stroke-width", radar_pad *1.5)
		.attr("class", "radar-detector-line");
		
			
	// Center Point
	bsvg.append("circle")
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
		.attr("id", function(d, i){
			return "dot" + d[4];
		})
		.attr("cx", function(d){ return ScaleDot(d[1]);})
		.attr("cy", function(d){ return svg_h - ScaleDot(d[0]);})
		.attr("r", function(d){ return rtgScaleDot(d[2]);})
		.attr("fill", function(d){
			// change color based on rating
			var rating = d[2];					
			if(rating < 2.5) return "#ff0000";
			else if (rating >= 2.5 && rating < 4) return "#e5e600";
			else return "#00cc00";					
			})
		.on("mouseover", function(d,i){ // enrlage circle and give it a highlight border
			    $('#listitem' + i).css('background-color','lightBlue');
				d3.select(this).attr("r", d3.select(this).attr("r")*1.1);
				d3.select(this).attr("stroke", "#00ffff");
				d3.select(this).attr("stroke-width", 3);
				
				// moves dot and coreponding text to front
				var this_id = d3.select(this).attr("id");
				var dottext = d3.select("#dottext" + this_id.substr(this_id.length - 1)); 
				d3.select(this).moveToFront(); 
				dottext.moveToFront(); 
				
				
			})
		.on("mouseout", function(d,i){ // shrink circle and remove its highlight border
			    $('#listitem' + i).css('background-color','white');
				d3.select(this).attr("r", d3.select(this).attr("r")*0.9);
				d3.select(this).attr("stroke", "none");
		
				
				
				var this_id = d3.select(this).attr("id");
				var dottext = d3.select("#dottext" + this_id.substr(this_id.length - 1)); 
				dottext.moveToBack(); // brings corresponsinf text to front
				d3.select(this).moveToBack(); // brings circle to front
				

			})
		.on("click", function(d, i) {
			    
			displayLocation(places[i], i);
			});
		

	// rating values *******************************************************************
	svg.selectAll("dot-text")
		.data(restaurants)
		.enter()
		.append("text")
		.attr("class", "dot-text")
		.attr("id", function(d, i){
			return "dottext" + d[4];
		})
		.text(function(d){ return d[2];})
		.attr("x", function(d){ return ScaleDot(d[1]);})
		.attr("y", function(d){ return svg_h - ScaleDot(d[0]);})
		.attr("font-size", function(d){ return rtgScaleTxt(d[2]) + "px"; })									
		.attr("text-anchor", "middle")
		.attr("dominant-baseline", "central");


	// Radar range boxes *******************************************************************

	// 1st range box
	svg.append("rect").attr("class", "radar-text-box")
		.attr("x", svg_w/2 + (radar_circ_body.attr("r") * 1 / 3) - radar_pad*5)
		.attr("y", svg_h/2 - radar_pad*1.5)
		.attr("width", radar_pad*10)
		.attr("height", radar_pad*3)
		.attr("rx", 10);

	// 2nd range box
	svg.append("rect").attr("class", "radar-text-box")
		.attr("x", svg_w/2 + (radar_circ_body.attr("r") * 2 / 3) - radar_pad*5)
		.attr("y", svg_h/2 - radar_pad*1.5)
		.attr("width", radar_pad*10)
		.attr("height", radar_pad*3)
		.attr("rx", 10);	


	// Radar range text *******************************************************************

	// 1st range from center
	svg.append("text").attr("class", "radar-range-text")
		.text(function(){
			var max_dot_distance = d3.max(restaurants, function(d){ return d[3];});
			var max_dot_x = svg_w - svg_w/8 - svg_w/2;
			var this_x = radar_circ_body.attr("r") * 1 / 3				
			a = (max_dot_distance * this_x) / max_dot_x;
			
			// rescale to kilometers if exceeds 1000m
			if( a > 1000 ) return Math.round(a/1000) + "km"; 
			
			return Math.round(a) + "m";	
		})
		.attr("x", svg_w/2 + radar_circ_body.attr("r") * 1 / 3)
		.attr("y", svg_h/2)
		.attr("font-size", "17px") // TODO change to scaling with size			
		.attr("text-anchor", "middle")
		.attr("dominant-baseline", "central");

	// 2nd range forom center					
	svg.append("text").attr("class", "radar-range-text")
		.text(function(){
			var max_dot_distance = d3.max(restaurants, function(d){ return d[3];});
			var max_dot_x = svg_w - svg_w/8 - svg_w/2;
			var this_x = radar_circ_body.attr("r") * 2 / 3				
			a = (max_dot_distance * this_x) / max_dot_x;
			
			// rescale to kilometers if exceeds 1000m
			if( a > 1000 ) return Math.round(a/1000) + "km"; 
			
			return Math.round(a) + "m";
			
			
		})
		.attr("x", svg_w/2 + radar_circ_body.attr("r") * 2 / 3)
		.attr("y", svg_h/2)
		.attr("font-size", "16px")	// TODO change to scaling with size		
		.attr("text-anchor", "middle")
		.attr("dominant-baseline", "central");
				

	// North indicator *******************************************************************

	// north box
	svg.append("polygon")
		.attr("class", "radar-text-box")
		.attr("points", (svg_w/2 - radar_pad*4) + "," + 0 + " " +
						(svg_w/2 + radar_pad*4) + "," + 0 + " " +
						svg_w/2 + "," + radar_pad*5)
		.attr("stroke-width" , radar_pad/3);
		
						
	// "N" text			
	svg.append("text").attr("class", "radar-range-text")
		.text("N")
		.attr("x", svg_w/2)
		.attr("y", radar_pad*3)
		.attr("text-anchor", "middle")
		.attr("font-size", "25px"); // TODO change to scaling with size


		
		
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
	
	
	
}

// Testing code ********************************************** Testing code

//var range1 = document.getElementByClass

//svg.selectAll("text-distance")
//		.data(restaurants)
//		.enter()
//		.append("text")
//		.attr("class", "text-distance")
//		.text(function(d){ return d[3] + "m";})
//		.attr("x", function(d){ return xScaleDot(d[1])+20;})
//		.attr("y", function(d){ return svg_h - xScaleDot(d[0])+20;})
//		.attr("font-size", function(d){ return rtgScaleTxt(d[2]) + "px"; })									
//		//.attr("text-anchor", "middle")
//		.attr("dominant-baseline", "middle")
//		.attr("fill", "gray");
	






