'use strict';

(function($) {

	function Chart() {
		
		this.init = function(chartData) {

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

			var tip = d3.tip()
			  .attr('class', 'd3-tip')
			  .offset([-10, 0])
			  .html(function(d) {
			    return "<div class='tooltip'><span></span>"+ d.data.categoryName +"<span>" + d.data.value + "%</span></div>";
			  });

			var pie = d3.layout.pie()
			    .value(function(d) { return d.value; });

			$('#chart').html('');

			var svg = d3.select($('#chart')[0]).append("svg")
			    .attr("width", width)
			    .attr("height", height)
			    .append('g')
			    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			var gForText = svg.append('g').attr('class', 'gForText');
			var txtGrp1 = gForText.append('g').attr('class','textForstocks');
			var txtGrp2 = gForText.append('g').attr('class', 'slashText');
			var txtGrp3 = gForText.append('g').attr('class', 'textFordebts');
			txtGrp1.append('text').attr('x', -30).attr('y',0).text('');
			txtGrp1.append('text').attr('x', -45).attr('y',20).text('stocks').attr('class', 'fundText');

			txtGrp2.append('text').text('/');
		
			txtGrp3.append('text').attr('x', 15).attr('y',0).text('');
			txtGrp3.append('text').attr('x', 10).attr('y',20).text('debts').attr('class', 'fundText');

			var g = svg.selectAll(".arc")
		    	.data(pie(chartData))
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

		    g.call(tip);

			chartData.forEach(function(d, i) {
				
				var innerData = d.categories;
				d3.select('.textFor'+d.fundType + ' text').text(d.value);				
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

				       	d3.selectAll('.textFor'+d.data.fundType + ' ' +'text').attr('fill', function(){
				       	 	if(d.data.fundType === "stocks") {
				       	 		return '#32783A';
				       	 	} else if(d.data.fundType === "debts"){ 
				       	 		return '#3885D2'; 
				       	 	}
				       	});

				       	tip.show(d);
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

				       	d3.selectAll('.gForText' + ' ' +'text').attr('fill', 'black');
				       	tip.hide(d);
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
				var chart = new Chart();
				chart.init(res);

				$('#slider').on("mousemove", function() {
					var stocksValue = this.value;
					var bondsValue = 100 - this.value;
					$('#stocksValue').html(stocksValue + '%');
					$('#bondsValue').html(bondsValue + '%');
					$('#slider').attr('title', stocksValue + '% Stocks / Moderate');
					res[0].value = stocksValue;
					res[1].value = bondsValue;
					chart.init(res);
		    	});
			},
			error: function() {
				console.log('Error fetching data.');
			}
		});

	});

})($);