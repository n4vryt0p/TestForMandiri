// get colors array from the string
function getChartColorsArray(chartId) {
    if (document.getElementById(chartId) !== null) {
        var colors = document.getElementById(chartId).getAttribute("data-colors");
        colors = JSON.parse(colors);
        return colors.map(function (value) {
            var newValue = value.replace(" ", "");
            if (newValue.indexOf(",") === -1) {
                var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
                if (color) return color;
                else return newValue;;
            } else {
                var val = value.split(',');
                if (val.length == 2) {
                    var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
                    rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
                    return rgbaColor;
                } else {
                    return newValue;
                }
            }
        });
    }
}

function generateData(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
        var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;;
        var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
        var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

        series.push([x, y, z]);
        baseval += 86400000;
        i++;
    }
    console.log(series);
    return series;
}

//  Spline Area Charts
var areachartSplineColors = getChartColorsArray("area_chart_spline");
if(areachartSplineColors){
var options = {
    series: [{
        name: 'Detik',
        data: [31, 40, 28, 51, 42, 109, 100]
    }, {
        name: 'Tempo',
        data: [11, 32, 45, 32, 34, 52, 41]
    }],
    chart: {
        height: 350,
        type: 'area',
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    colors: areachartSplineColors,
    xaxis: {
        type: 'datetime',
        categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        },
    },
};

var chart = new ApexCharts(document.querySelector("#area_chart_spline"), options);
chart.render();
}

var areachartSalesColors = getChartColorsArray("sentiment-chart");
if (areachartSalesColors) {
    var options = {
        series: [
            {
                name: 'Netral',
                data: [10]
            },
            {
                name: 'Positif',
                data: [20]
            },
            {
                name: 'Negatif',
                data: [3]
            }
        ],
        chart: {
            type: 'bar',
            height: 341,
            toolbar: {
                show: false,
            },
            //events: {
            //    dataPointSelection: function (event, chartContext, config) {
            //        $.ajax({
            //            type: "GET",
            //            url: `../ReadTopModal?uid=${config.dataPointIndex}`,
            //            headers: {
            //                "RequestVerificationToken": document.getElementsByName("__RequestVerificationToken")[0].value
            //            },
            //            success: function (result) {
            //                let sentName;
            //                if (config.dataPointIndex == 0) {
            //                    sentName = "Neutral Sentiment";
            //                } else if (config.dataPointIndex == 1) {
            //                    sentName = "Positive Sentiment";
            //                } else {
            //                    sentName = "Negative Sentiment";
            //                }

            //                $("#nUrl").html(sentName);
            //                $("#modalGrid").dxDataGrid("instance").option('dataSource', result);
            //                $("#dynamicBackdrop").modal('show');
            //            }
            //        });
            //    }
            //}
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '65%',
            },
        },
        stroke: {
            show: true,
            width: 5,
            colors: ['transparent']
        },
        xaxis: {
            categories: [''],
            axisTicks: {
                show: false,
                borderType: 'solid',
                color: '#78909C',
                height: 6,
                offsetX: 0,
                offsetY: 0
            },
            title: {
                text: 'Total Sentiment',
                offsetX: 0,
                offsetY: -30,
                style: {
                    color: '#78909C',
                    fontSize: '12px',
                    fontWeight: 400,
                },
            },
        },
        yaxis: {
            tickAmount: 5,
            min: 0
        },
        fill: {
            opacity: 1
        },
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            fontWeight: 500,
            offsetX: 0,
            offsetY: -14,
            itemMargin: {
                horizontal: 8,
                vertical: 0
            },
            markers: {
                width: 10,
                height: 10,
            }
        },
        colors: areachartSalesColors
    };
    var chartSentiment = new ApexCharts(document.querySelector("#sentiment-chart"), options);
    chartSentiment.render();
}


var chartBubbleColors = getChartColorsArray("bubble_chart");
if (chartBubbleColors) {
    var options = {
        series: [{
            name: 'Total News',
            data: [
                [1,0,0],
                [2, 16, 5],
                [3, 35, 5],
                [4, 40, 5],
                [5, 2, 5],
                [6, 24, 5],
                [7, 54, 5],
                [8, 13, 5],
                [9,0,0]
            ]
        }
        ],
        chart: {
            height: 350,
            type: 'bubble',
            toolbar: {
                show: false,
            }
        },
        dataLabels: {
            enabled: false
        },
        labels: [
            '',
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat',
            ''
        ],
        tooltip: {
            z: {
                formatter: function () {
                    return;
                },
                title: ''
            },
        },
        fill: {
            opacity: 0.8
        },
        xaxis: {
            //overwriteCategories: [
            //    'Sun',
            //    'Mon',
            //    'Tue',
            //    'Wed',
            //    'thu',
            //    'Fri',
            //    'Sat'
            //],
            //tickAmount: 'dataPoints',
            type: 'category',
            labels: {
                rotate: 0,
            },
        },
        yaxis: {
            max: 70
        },
        theme: {
            palette: 'palette2'
        },
        colors: chartBubbleColors
    };

    var chart = new ApexCharts(document.querySelector("#bubble_chart"), options);
    chart.render();
}

var chartBubbleColors = getChartColorsArray("bubble_chart2");
if (chartBubbleColors) {
    var options = {
        series: [{
            name: 'Total News',
            data: [
                [1, 0, 0],
                [2, 16, 16],
                [3, 35, 35],
                [4, 40, 5],
                [5, 2, 5],
                [6, 24, 5],
                [7, 54, 5],
                [8, 13, 5],
                [9, 0, 0]
            ]
        }
        ],
        chart: {
            height: 350,
            type: 'bubble',
            toolbar: {
                show: false,
            }
        },
        dataLabels: {
            enabled: false
        },
        labels: ['01/01/2023', '02/01/2023', '03/01/2023', '04/01/2023', '05/01/2023', '06/01/2023', '07/01/2023', '08/01/2023', '09/01/2023', '10/01/2023', '11/01/2023'],
        tooltip: {
            z: {
                formatter: function () {
                    return;
                },
                title: ''
            },
        },
        fill: {
            opacity: 0.8
        },
        xaxis: {
            type: 'datetime',
            labels: {
                rotate: 0,
            },
        },
        yaxis: {
            max: 70
        },
        theme: {
            palette: 'palette2'
        },
        colors: chartBubbleColors
    };

    var chart = new ApexCharts(document.querySelector("#bubble_chart2"), options);
    chart.render();
}