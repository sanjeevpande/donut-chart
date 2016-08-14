'use strict';

(function($) {

	function Chart(data) {
		
		this.data = data;
		
		this.init = function() {

			var self = this;
			
			var width = 400,
			    height = 400,
			    radius = Math.min(width, height) / 2,
	        	color = d3.scale.ordinal()
    				.range(["#27ae60", "#2980b9"]),
    			blueHues = d3.scale.ordinal()
    				.range(["#9fa8da", "#7986cb", "#5c6bc0", "#3f51b5", "#303f9f"]),
    			greenHues = d3.scale.ordinal()
    				.range(["#81c784", "#4caf50", "#388e3c", "#2e7d32", "#1b5e20", "#c8e6c9"]);

    		var arc = d3.svg.arc()
			    .outerRadius(radius - 150)
			    .innerRadius(radius - 110);

			var pie = d3.layout.pie()
			    .value(function(d) { return d.value; });

			var svg = d3.select("body").append("svg")
			    .attr("width", width)
			    .attr("height", height)
			    .append('g')
			    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			var g = svg.selectAll(".arc")
		    	.data(pie(self.data))
		    	.enter().append("g")
		    	.attr("class", function(d) {
		    		return d.data.fundType;
		    	})
		    	.attr('startAngle', function(d) {
		    		return d.startAngle;
		    	})
		    	.attr('endAngle', function(d) {
		    		return d.endAngle;
		    	});

		    g.append('path')
		    	.attr("d", arc)
		    	.style("fill", function(d, i) { return greenHues(i); });

		    g.append("text")
				.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
				.attr("dy", ".35em")
				.text(function(d) { return d.data.value; });

			self.data.forEach(function(d, i) {
				
				var innerData = d.categories;
				
				pie.startAngle(+d3.select('.' + d.fundType).attr("startAngle"));
				pie.endAngle(+d3.select('.' + d.fundType).attr("endAngle"));
			
				var innerGroup = svg.append('g')
					.attr('class', function() { return 'innerArc' + i; })
					.on('mouseover', function(){

					})
					.selectAll(".innerArc")
					.data(pie(innerData))
					.enter()
					.append('path')
					.attr("d", arc)
					.style("fill", function(d, i) { 
						if(d.data.fundType === "stocks") {
							return greenHues(i);
						} else if(d.data.fundType === "debts") {
							return blueHues(i);
						}
					});
			});
		}
	}

	$(document).ready(function() {

		$.ajax({
			url: '/data.json',
			method: 'GET',
			success: function(res) {
				var chart = new Chart(res);
				chart.init();
			},
			error: function() {
				console.log('Error fetching data.');
			}
		});

	});

})($);