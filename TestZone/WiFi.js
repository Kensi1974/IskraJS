Serial3.setup(115200);

// логин и пароль WiFi-сети
var SSID = 'CodeRed';
var PSWD = 'LetMeIn2017';

var wifi = require('@amperka/wifi').setup(Serial3, function(err) {
  // подключаемся к Wi-Fi сети
  wifi.connect(SSID, PSWD, function(err) {
    print('Connected');
    // Выполняем запрос
    require('http').get('http://espruino.com', function(res) {
      var response = '';
      res.on('data', function(d) {
        response += d;
      });
      res.on('close', function() {
        print(response);
      });
    });
  });
});