'use strict';

(function($) {

	function Chart(data) {
		
		this.data = data;
		
		this.init = function() {

			var self = this;
			
			var width = 500,
			    height = 500,
			    radius = Math.min(width, height) / 2,
	        	color = d3.scale.ordinal()
    				.range(["#A6D5A3", "#C4E3F4"]),
    			blueHues = d3.scale.ordinal()
    				.range(["#2F567D", "#3885D2", "#489FF6", "#89C1F8", "#B6D5F5"]),
    			greenHues = d3.scale.ordinal()
    				.range(["#D1E7AD", "#A6D57E", "#8BBD34", "#709C49", "#32783A", "#385A3C"]);

    		var arc = d3.svg.arc()
			    .outerRadius(radius - 170)
			    .innerRadius(radius - 100);

			var hiddenArcExpand = d3.svg.arc()
				.outerRadius(radius - 80)
				.innerRadius(radius - 100);

			var arcMouseOver = d3.svg.arc()
			    .outerRadius(radius - 170)
			    .innerRadius(radius - 90);

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
		    	.style("fill", function(d, i) { return color(i); });

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
					.selectAll(".innerArc")
					.data(pie(innerData))
					.enter()
					.append('path')
					.attr("d", arc)
					.on("mouseover", function(d) {
				   		d3.select('.'+d.data.fundType + ' ' +'path')
				   			.transition()
				   			.duration(500)
				   			.attr("d", hiddenArcExpand);

				    	d3.select(this)
				    		.transition()
				        	.duration(800)
				        	.attr("d", arcMouseOver);
				    })
				    .on("mouseout", function(d) {
				   		d3.select('.'+d.data.fundType + ' ' +'path')
				   			.transition()
				   			.duration(500)
				   			.attr("d", arc);

				    	d3.select(this)
				    		.transition()
				        	.duration(800)
				        	.attr("d", arc);
				    })
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