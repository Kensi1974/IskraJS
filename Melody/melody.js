var pitches = {
  'A':440.00, 'B':493.88, 'C':523.25, 'D':587.33,
  'E':659.26, 'F':698.46, 'G':783.99, 'a':880
};

var tune = "E E F G G F E D C C D E E D";
var pos=0;
var len = tune.length;


function play() {
  var i = 0, ch = 0;

  let timerId = setInterval(function() {
    ch=tune[i]; 
    if (ch in pitches) {
            
              analogWrite(C9, 0.5, {freq:pitches[ch]});
             
              
      } else pinMode(C9, "input");
    
    
    if (i == len) {
      clearInterval(timerId);
      print("Cleared");
    }
    i++;
  }, 100);
}


setInterval(function() {
  
  play();
      

  
}, 5000);