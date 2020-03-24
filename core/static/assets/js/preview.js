// Auto Refresh
// function autoRefreshPage() {
//   window.location = window.location.href;
// }
// setInterval("autoRefreshPage()", 5000);

// setInterval(function() {
//   console.log("interval 1 detik");
//   $(".content").load(location.href + " .content");
// }, 1000); // 60000 = 1 minute

var config_MQTT = false; // use mqtt or not

// Slider
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

var last;
$(function() {
  $.ajax({
    method: "GET",
    url: "/getSlider",
    success: function(data) {
      last = data[data.length - 1]["fields"]["slider_value"];
      console.log(last);
      $("#amount").val(parseInt(last));
    },
    async: false
  });
  console.log(last);
  $("#slider-range-max").slider({
    range: "max",
    min: 0,
    max: 180,
    value: last,
    slide: function(event, ui) {
      $("#amount").val(ui.value);
      var values = ui.value;

      var csrftoken = getCookie("csrftoken");

      function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method);
      }
      $.ajaxSetup({
        beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
        }
      });
      // post slider value
      $.ajax({
        type: "PUT",
        url: "/slider_detail/1/",
        data: {
          // csrfmiddlewaretoken: csrftoken,
          id: 1,
          slider_value: values.toString()
        },
        success: "hai"
      });

      var mqtt;
      var reconnectTimeout = 2000;
      // var host = "broker.hivemq.com"; //change this
      // var port = 8000;
      var host = "test.mosquitto.org"; //change this
      var port = 8080;
      // var host = "192.168.100.137"; //change this
      // var host = "ghiscure.ddns.net"; //change this
      // var port = 9001;
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
      if (config_MQTT == true) {
        MQTTconnect();
      }
    }
  });
  // $("#amount").val($("#slider-range-max").slider("value"));
  // var value = $("#slider-range-max").slider("option", "value");
  // console.log(value);
});

// get Data Sensor
// Plot to Chart Line
// var tmp = "95";
var endpoint = "/getData";
$.ajax({
  method: "GET",
  url: endpoint,
  success: function(data) {
    // var last = data[data.length - 1]["fields"]["sensor_value"];
    // console.log(typeof (tmp));
    // console.log(typeof (last));
    // console.log((tmp));
    // console.log((last));
    // if (last.toString() != tmp.toString()) {
    //   console.log("not same");
    //   tmp = last;
    //   location.reload();
    // }

    // // location.reload();
    max = 100;
    var sensor_004 = [];
    var sensor_003 = [];
    var sensor_005 = [];
    var sensor_0001 = [];

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
      } else if (x["fields"]["sensor_id"] == "0001") {
        // sensor_004[0] = x["fields"]["sensor_value"];
        values = x["fields"]["sensor_value"];
        sensor_0001.push(values);
      }
    }
    // sensor_003.push("20");
    // console.log(sensor_0001);
    // console.log(sensor_004);
    // console.log(sensor_005);
    var data = {
      labels: ["-9", "-8", "-7", "-6", "-5", "-4", "-3", "-2", "-1", "now"],
      series: [sensor_0001]
    };
    var optionsSales = {
      lineSmooth: false,
      low: 0,
      high: 60,
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
