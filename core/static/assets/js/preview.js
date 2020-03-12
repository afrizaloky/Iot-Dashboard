$(function() {
  $("#slider-range-max").slider({
    range: "max",
    min: 0,
    max: 180,
    value: 0,
    slide: function(event, ui) {
      $("#amount").val(ui.value);
      var values = ui.value;
      var mqtt;
      var reconnectTimeout = 2000;
      var host = "broker.hivemq.com"; //change this
      var port = 8000;
      // var host = "test.mosquitto.org"; //change this
      // var port = 8080;
      // var host = "192.168.100.137"; //change this
      // var host = "ghiscure.ddns.net"; //change this
      // var port = 9001;
      // console.log(values);
      function onFailure(message) {
        console.log("Connection Attempt to Host " + host + " Failed");
        setTimeout(MQTTconnect, reconnectTimeout);
      }

      function onMessageArrived(msg) {
        out_msg = "Message received " + msg.payloadString + "<br>";
        out_msg = out_msg + "Message received Topic " + msg.destinationName;
        console.log(out_msg);
      }

      function onConnect() {
        // Once a connection has been made, make a subscription and send a message.

        console.log("Connected ");
        mqtt.subscribe("ghiscure/sensor1");
        console.log(typeof values);
        var msg_tmp = values.toString();

        console.log(msg_tmp);

        message = new Paho.MQTT.Message(msg_tmp);
        message.destinationName = "ghiscure/sensor1";
        mqtt.send(message);
      }

      function MQTTconnect() {
        console.log("connecting to " + host + " " + port);
        mqtt = new Paho.MQTT.Client(host, port, "clientjs");
        //document.write("connecting to "+ host);
        var options = {
          timeout: 3,
          onSuccess: onConnect,
          onFailure: onFailure
        };
        mqtt.onMessageArrived = onMessageArrived;

        mqtt.connect(options); //connect
      }
      MQTTconnect();
      // console.log(values);
    }
  });
  // $("#amount").val($("#slider-range-max").slider("value"));
  // var value = $("#slider-range-max").slider("option", "value");
  // console.log(value);
});

var endpoint = "/getData";
$.ajax({
  method: "GET",
  url: endpoint,
  success: function(data) {
    // console.log(data);

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
    // console.log(sensor_1);
    // console.log(sensor_004);
    // console.log(sensor_005);
    var data = {
      labels: ["-9", "-8", "-7", "-6", "-5", "-4", "-3", "-2", "-1", "now"],
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
            labelInterpolationFnc: function(value) {
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
  },
  error: function(error_data) {
    console.log(error_data);
  }
});
