var loadTrendChart = function () {
	var chart = new CanvasJS.Chart('s3TrendChart',
		    {
		      /*title:{
		      	text: 'Usage Trend'
		      },*/
		       data: [
			      {
			        type: 'line',

			        dataPoints: [ 
						{ x: new Date(2013, 04, 1), y: 450 }, 
						{ x: new Date(2013, 05, 1), y: 414 }, 
						{ x: new Date(2013, 06, 1), y: 520 }, 
						{ x: new Date(2013, 07, 1), y: 460 }, 
						{ x: new Date(2013, 08, 1), y: 450 }, 
						{ x: new Date(2013, 09, 1), y: 500 }, 
						{ x: new Date(2013, 10, 1), y: 480 }, 
						{ x: new Date(2013, 11, 1), y: 480 }, 
						{ x: new Date(2013, 12, 1), y: 410 }, 
						{ x: new Date(2014, 01, 1), y: 500 }, 
						{ x: new Date(2014, 02, 1), y: 480 }, 
						{ x: new Date(2014, 03, 1), y: 510 } 
					] 
				   } 
				] 

		    });

			chart.render();
		return chart;
};

$(document).ready(function(){
	$('#trend').on('show.bs.modal', function (e) {
	  setTimeout(function (chart) {
		 loadTrendChart();
	  }, 251);
	});
});

window.onload = function () {
    
    if(typeof CanvasJS !== "undefined")
    {    
		if($("#dbEntnActChart").length === 1)
		{
			var chart = new CanvasJS.Chart("dbEntnActChart",
			{
				/*title:{
					text: "Entitlements and Activations"
				},*/
				toolTip: {
					shared: true
				},
				/*axisX:{
					title: "Products"
				},*/

				axisY: {
					title: ""
				},
				axisY2: {
					title: ""
				},

				legend:{
					verticalAlign: "top",
					horizontalAlign: "center"
				},
				data: [ 
				{
					type: "column",	
					name: "Entitlements",
					legendText: "Entitlements",
					showInLegend: true, 
					dataPoints:[
					{label: "Product A", y: 262},
					{label: "Product B", y: 211},
					{label: "Product C", y: 175},
					{label: "Product D", y: 137},
					{label: "Product E", y: 115}


					]
				},
				{
					type: "column",	
					name: "Activations",
					legendText: "Activations",
					axisYType: "secondary",
					showInLegend: true,
					dataPoints:[
					{label: "Product A", y: 300},
					{label: "Product B", y: 175},
					{label: "Product C", y: 350},
					{label: "Product D", y: 95},
					{label: "Product E", y: 175}
					]
				}
				
				],
	          legend:{
	            cursor:"pointer",
	            fontSize: 16,
	            itemclick: function(e){
	              if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
	              	e.dataSeries.visible = false;
	              }
	              else {
	                e.dataSeries.visible = true;
	              }
	            	chart.render();
	            }
	          },
	        });

	chart.render();
		}
		if($("#dbCurrUsg").length === 1)
		{
			var chart = new CanvasJS.Chart("dbCurrUsg", {
            /*title: {
                text: "Current Usage"
            },
            axisY: {
                tickThickness: 0,
                lineThickness: 0,
                valueFormatString: " ",
                gridThickness: 0                    
            },
            axisX: {
                tickThickness: 0,
                lineThickness: 0,
                labelFontSize: 18,
                labelFontColor: "Peru"

            },*/
            data: [
            {
                //indexLabelFontSize: 26,
                //toolTipContent: "<span style='\"'color: {color};'\"'><strong>{indexLabel}</strong></span><span style='\"'font-size: 20px; color:peru '\"'><strong>{y}</strong></span>",

                //indexLabelPlacement: "inside",
                //indexLabelFontColor: "white",
                //indexLabelFontWeight: 600,
                //indexLabelFontFamily: "Verdana",
                color: "#62C9C3",
                type: "bar",
                dataPoints: [
                    { y: 105, label: "Product C", indexLabel: "105%" },
                    { y: 90, label: "Product D", indexLabel: "90%" },
                    { y: 85, label: "Product B", indexLabel: "85%" },
                    { y: 80, label: "Product A", indexLabel: "80%" },
                    { y: 10, label: "Product E", indexLabel: "10%" }


                ]
            }
            ]
        });

        chart.render();
    }
		
	}
  };