'use strict';

(function($) {

	function Chart(data) {
		
		this.data = data;
		
		this.init = function() {

			var self = this;
			this.graph = d3.select(document.getElementById('chart'));
			this.width = 800;
			this.height = 800;
			
			var width = 960,
			    height = 500,
			    radius = Math.min(width, height) / 2,
	        	color = d3.scale.ordinal()
    				.range(["#27ae60", "#2980b9"]),
    			blueHues = d3.scale.ordinal()
    				.range(["#9fa8da", "#7986cb", "#5c6bc0", "#3f51b5", "#303f9f"]),
    			greenHues = d3.scale.ordinal()
    				.range(["#81c784", "#4caf50", "#388e3c", "#2e7d32", "#1b5e20", "#c8e6c9"]);

    		var arc = d3.svg.arc()
			    .outerRadius(radius - 10)
			    .innerRadius(radius - 100);

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
		    	});

		    g.append('path')
		    	.attr("d", arc)
		    	.style("fill", function(d, i) { return greenHues(i); });

		    g.append("text")
				.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
				.attr("dy", ".35em")
				.text(function(d) { return d.data.value; });

			var g1 = g.selectAll(".arc")
		    	.data(function(d, i) {
		    		return pie(self.data[i].categories);
		    	})
		    	.enter().append("g")
		    	.attr("class", "categories");
		    
		    g1.append("path")
				.attr("d", arc)
				.style("fill", function(d, i) {
					if(d.data.fundType === 'stocks') {
						return greenHues(i);
					} else if(d.data.fundType === 'debts') {
						return blueHues(i);
					}
				});

		   	g1.append("text")
				.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
				.attr("dy", ".35em")
				.text(function(d) { return d.data.value; });
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