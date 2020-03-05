var endpoint = "/getData";
$.ajax({
  method: "GET",
  url: endpoint,
  success: function (data) {
    console.log(data);

    max = 100;
    var sensor_004 = [];
    var sensor_003 = [];
    var sensor_005 = [];
    var sensor_1 = [];

    // get last 10 data
    for (x of data.slice(Math.max(data.length - 10, 0))) {
      if (x["fields"]["sensor_id"] == "0004") {
        // sensor_004[0] = x["fields"]["sensor_value"];
        values = x["fields"]["sensor_value"];
        sensor_004.push(values);
      } else if (x["fields"]["sensor_id"] == "0003") {
        // sensor_004[0] = x["fields"]["sensor_value"];
        values = x["fields"]["sensor_value"];
        sensor_003.push(values);
      } else if (x["fields"]["sensor_id"] == "0005") {
        // sensor_004[0] = x["fields"]["sensor_value"];
        values = x["fields"]["sensor_value"];
        sensor_005.push(values);
      } else if (x["fields"]["sensor_id"] == "1") {
        // sensor_004[0] = x["fields"]["sensor_value"];
        values = x["fields"]["sensor_value"];
        sensor_1.push(values);
      }
    }
    // sensor_003.push("20");
    console.log(sensor_1);
    // console.log(sensor_004);
    // console.log(sensor_005);
    var data = {
      labels: [
        "-9",
        "-8",
        "-7",
        "-6",
        "-5",
        "-4",
        "-3",
        "-2",
        "-1",
        "now"
      ],
      series: [sensor_1]
    };
    var optionsSales = {
      lineSmooth: false,
      low: 0,
      high: 100,
      showArea: false,
      height: "245px",
      axisX: {
        showGrid: false
      },
      lineSmooth: Chartist.Interpolation.simple({
        divisor: 3
      }),
      showLine: true,
      showPoint: true,
      fullWidth: false
    };
    var responsiveSales = [
      [
        "screen and (max-width: 640px)",
        {
          axisX: {
            labelInterpolationFnc: function (value) {
              return value[0];
            }
          }
        }
      ]
    ];
    var chartHours = Chartist.Line(
      "#chart_line",
      data,
      optionsSales,
      responsiveSales
    );
    Chartist.Pie(
      "#chartDonut", {
        series: sensor_004
      }, {
        donut: true,
        donutWidth: 60,
        donutSolid: true,
        startAngle: 270,
        total: 180,
        showLabel: true
      }
    );
  },
  error: function (error_data) {
    console.log(error_data);
  }
});