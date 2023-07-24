$(function () {
  /* ChartJS
   * -------
   * Here we will create a few charts using ChartJS
   */

  //--------------
  //- AREA CHART -
  //--------------

  // Get context with jQuery - using jQuery's .get() method.
  let areaChartCanvas = $("#areaChart").get(0).getContext("2d");

  let areaChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Digital Goods",
        backgroundColor: "rgba(60,141,188,0.9)",
        borderColor: "rgba(60,141,188,0.8)",
        pointRadius: false,
        pointColor: "#3b8bba",
        pointStrokeColor: "rgba(60,141,188,1)",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(60,141,188,1)",
        data: [28, 48, 40, 19, 86, 27, 90],
      },
      {
        label: "Electronics",
        backgroundColor: "rgba(210, 214, 222, 1)",
        borderColor: "rgba(210, 214, 222, 1)",
        pointRadius: false,
        pointColor: "rgba(210, 214, 222, 1)",
        pointStrokeColor: "#c1c7d1",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  };

  let areaChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
    },
  };

  // This will get the first returned node in the jQuery collection.
  new Chart(areaChartCanvas, {
    type: "line",
    data: areaChartData,
    options: areaChartOptions,
  });

  //-------------
  //- LINE CHART -
  //--------------
  let lineChartCanvas = $("#lineChart").get(0).getContext("2d");
  let lineChartOptions = $.extend(true, {}, areaChartOptions);
  let lineChartData = $.extend(true, {}, areaChartData);
  lineChartData.datasets[0].fill = false;
  lineChartData.datasets[1].fill = false;
  lineChartOptions.datasetFill = false;

  let lineChart = new Chart(lineChartCanvas, {
    type: "line",
    data: lineChartData,
    options: lineChartOptions,
  });

  //-------------
  //- DONUT CHART -
  //-------------
  // Get context with jQuery - using jQuery's .get() method.
  let donutChartCanvas = $("#donutChart").get(0).getContext("2d");
  let donutData = {
    labels: ["Chrome", "IE", "FireFox", "Safari", "Opera", "Navigator"],
    datasets: [
      {
        data: [700, 500, 400, 600, 300, 100],
        backgroundColor: [
          "#f56954",
          "#00a65a",
          "#f39c12",
          "#00c0ef",
          "#3c8dbc",
          "#d2d6de",
        ],
      },
    ],
  };
  let donutOptions = {
    maintainAspectRatio: false,
    responsive: true,
  };
  //Create pie or douhnut chart
  // You can switch between pie and douhnut using the method below.
  new Chart(donutChartCanvas, {
    type: "doughnut",
    data: donutData,
    options: donutOptions,
  });

  //-------------
  //- PIE CHART -
  //-------------
  // Get context with jQuery - using jQuery's .get() method.
  let pieChartCanvas = $("#pieChart").get(0).getContext("2d");
  let pieData = donutData;
  let pieOptions = {
    maintainAspectRatio: false,
    responsive: true,
  };
  //Create pie or douhnut chart
  // You can switch between pie and douhnut using the method below.
  new Chart(pieChartCanvas, {
    type: "pie",
    data: pieData,
    options: pieOptions,
  });

  //-------------
  //- BAR CHART -
  //-------------
  let barChartCanvas = $("#barChart").get(0).getContext("2d");
  let barChartData = $.extend(true, {}, areaChartData);
  let temp0 = areaChartData.datasets[0];
  let temp1 = areaChartData.datasets[1];
  barChartData.datasets[0] = temp1;
  barChartData.datasets[1] = temp0;

  let barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    datasetFill: false,
  };

  new Chart(barChartCanvas, {
    type: "bar",
    data: barChartData,
    options: barChartOptions,
  });

  //---------------------
  //- STACKED BAR CHART -
  //---------------------
  let stackedBarChartCanvas = $("#stackedBarChart").get(0).getContext("2d");
  let stackedBarChartData = $.extend(true, {}, barChartData);

  let stackedBarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          stacked: true,
        },
      ],
      yAxes: [
        {
          stacked: true,
        },
      ],
    },
  };

  new Chart(stackedBarChartCanvas, {
    type: "bar",
    data: stackedBarChartData,
    options: stackedBarChartOptions,
  });
});
