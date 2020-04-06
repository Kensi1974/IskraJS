// Pinout:
// +3V - motor +pin
// +5V - photo resistor pin 1
// GRND1 - resistor 10K pin 1
// A1	- phoro resistor pin 2, resistor 10K pin 2
// GRND2 - Transistor E
// A10	-Transistor B
// Transistor C - motor -pin
// GRND3 - Zummer-
// C9	- Zummer+


var SensorPin=A1; 	// Light sensor pin
var MotorPin=A10; 	// Transistor Base pin
var ZummerPin=C9;	// Zummer pin
var Repeat=3600;  	// Pause before the second pshik in dark mode
var TimeOut=350;	// Pause between pshiks
var Wait=60000;		// How often the system wakes up
var Dark=0.20;		// Level in SensorPin assumed to be darkenss
var Value=0;		// Aux variable
var Battery=100;	// Current battery level
var BatLow=10;		// Low battery level
var Engaged=1;		// Engage trigger, the initial value is 1 = armed

var pitches = {
  'A':440.00, 'B':493.88, 'C':523.25, 'D':587.33,
  'E':659.26, 'F':698.46, 'G':783.99, 'a':880
};											// Pitches definition

var tune = "E E F G G F E D C C D E E D";   // Melody itself
var len = tune.length;						// Length of the melody string


// Plays melody
function play() {
  var i = 0, ch = 0;

  let timerId = setInterval(function() {
    ch=tune[i]; 
    if (ch in pitches) {
            
              analogWrite(ZummerPin, 0.5, {freq:pitches[ch]});
             
              
      } else pinMode(ZummerPin, "input");
    
    
    if (i == len) {
      clearInterval(timerId);
      //print("Cleared");
    }
    i++;
  }, 100); // 100msec bwtween each pitch
}




//this function starts motor for a TimeOut msecs
function Pshik(){
	digitalWrite(MotorPin, 1);
    setTimeout("digitalWrite(MotorPin, 0);",TimeOut);
}




setInterval(function(){
	
	
	Value=analogRead(SensorPin);	// reads light level
	
	
	Battery=analogRead(A0);				// reads battery level
		Battery=Math.round(Battery*100);	// converts and rounds the battery level
		print("Batery level is: ", Battery);
	
	
	
	print("Value :", Value, " Eng: ", Engaged);	
	
	//if it becomes dark and the trigger is armed make 2 pshiks and disarm the trigger
	//when dark is over make 1 pshik and arm the trigger, check battery level
	if (Value<=Dark && Engaged == 1)
	{
		//print("Go");
        Pshik();
		setTimeout("Pshik()",Repeat);
        Engaged=0;
	}
	else if (Value>Dark && Engaged == 0) 
	{
		Engaged =1;
		Pshik();
		
		Battery=analogRead(A0);				// reads battery level
		Battery=Math.round(Battery*100);	// converts and rounds the battery level
		//print("Batery level is: ", Battery);
		//if Battery is below BatLow (expected to be 10%) plays melody
		if(Battery<BatLow) play();
	}
	
	
}, Wait);
setDeepSleep(1);
	




