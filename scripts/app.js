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
    			color1 = d3.scale.ordinal()
    				.range(["#9fa8da", "#7986cb", "#5c6bc0", "#3f51b5", "#303f9f", "#1a237e"]);

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

			var stocks = svg.append("g")
			  	.attr('class', 'stocks');

			var debts = svg.append("g")
			  	.attr('class', 'debts');

			var g = stocks.selectAll(".arc")
		    	.data(pie(self.data[0].categories))
		    	.enter().append("g")
		    	.attr("class", function(d, i) {
		    		return d.data.fundType;
		    	})
		    	.append("path")
				.attr("d", arc)
				.style("fill", function(d, i) { return color(i); })
				.append("text")
				.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
				.attr("dy", ".35em")
				.text(function(d) { return d.data.fundType; });

			var g1 = debts.selectAll(".arc1")
		    	.data(pie(self.data[1].categories))
		    	.enter().append("g")
		    	.attr("class", function(d, i) {
		    		return d.data.fundType;
		    	})
		    	.append("path")
				.attr("d", arc)
				.style("fill", function(d, i) { return color(i); })
				.append("text")
				.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
				.attr("dy", ".35em")
				.text(function(d) { return d.data.fundType; });
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