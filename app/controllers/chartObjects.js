var horizontalBarChartObj = {
    type: 'horizontalBar',
    options: {
        tooltips: {
            enabled: true,
            intersect : true,
            cornerRadius : 0,
            caretSize : 0,
            bodyFontSize : 10,
            displayColors : false,
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: { 
            display: false
        },
        title: {
            display: false
        },
        scales: {
            xAxes: [{
                display : false,
                gridLines: {
                    display:false
                },
                ticks: {
                    max: 100,
                    min: 0,
                    stepSize: 10,
                },
                
            }],
            yAxes: [{
                gridLines: {
                    display:false
                },
                categoryPercentage: 1.0,
                barPercentage : 0.7,
            }]
        }
    }
};

var verticalBarChartObj = {
    type: 'bar',
    options: {
        tooltips: {
            enabled : true,
            intersect : true,
            cornerRadius : 0,
            caretSize : 0,
            displayColors : false,
        },
        responsive : true,
        maintainAspectRatio : false,
        legend: { 
            display: false, 
        },
        title: {
            display: true,
            text: 'Total votes of each poll'
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display:false
                },
            }],
            yAxes: [{
                gridLines: {
                    display:false
                },
                ticks: {
                    beginAtZero:true,
                    stepSize: 1
                }
            }]
        }
    }
};