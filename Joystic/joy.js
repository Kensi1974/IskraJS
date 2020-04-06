// Настраиваем интерфейс I2C и подключаем библиотеку
PrimaryI2C.setup({sda: SDA, scl: SCL, bitrate: 100000});
var matrix = require('@amperka/led-matrix').connect(PrimaryI2C);
var prox = require('@amperka/proximity').connect({
  i2c: I2C1,
  irqPin: P4
});

//Начальная дистанция для сенсора приближения
var Range=200;

//Определяем пины
var X_PIN=A5; // X PIN
var Y_PIN=A4; // Y PIN

// Global initial X and Y values
var InitX;
var InitY;

//Перменные слепой зоны для джойстика
var Low;
var High;

//Радиус слепой зоны
var Level=8;

//начальное значение спрайта
var AA=[3,3];
var AB=[3,4];
var BA=[4,3];
var BB=[4,4];


function OnInit(){
	
	//On Init read initial X and Y values, set the Blind Zone
	InitX = Math.round(analogRead(X_PIN)*100);
	InitY = Math.round(analogRead(Y_PIN)*100);
	Low=(InitX+InitY)/2-Level;
	High=(InitX+InitY)/2+Level;
	
	//Set brightness to mid
	matrix.brightness(0.5);
	matrix.clear();
}

//Измеряем расстояние, пишем в глобальную пременную Range
function getRange() {
  prox.range(function(error, value) {
  if (error) {
    Range=200;
  } else {
    Range=value;
  }
});
}


//Returns array of X and Y
function Joy (){
	var _Coord = [0,0];
	var X,Y;
    
	X=Math.round(analogRead(X_PIN)*100);
	Y=Math.round(analogRead(Y_PIN)*100);
	
	if (X<Low) { _Coord[0]=1;}
	else if (X>High) { _Coord[0]=-1;}
	
	if (Y<Low) { _Coord[1]=1;}
	else if (Y>High) { _Coord[1]=-1;}
	
	return _Coord;
}

function Draw(){
	matrix.clear();
	matrix.write(AA[0],AA[1], 1).write(AB[0], AB[1], 1)
	      .write(BA[0], BA[1], 1).write(BB[0], BB[1], 1);
}



function Go(){
	
	var Coord = Joy();
	var Foo;
	
	getRange();
	
	Foo=Math.round((200-Range)/80);


		
	AA[0]=AA[0]+Coord[1]-Foo;
	AA[1]=AA[1]+Coord[0]-Foo;
	AB[0]=AB[0]+Coord[1]-Foo;
	AB[1]=AB[1]+Coord[0]+Foo;
	
	BA[0]=BA[0]+Coord[1]+Foo;
	BA[1]=BA[1]+Coord[0]-Foo;
	BB[0]=BB[0]+Coord[1]+Foo;
	BB[1]=BB[1]+Coord[0]+Foo;
	
	if(AA[0] > 7) AA[0]=0;
	if(AA[1] > 7) AA[1]=0;
	if(AB[0] > 7) AB[0]=0;
	if(AB[1] > 7) AB[1]=0;
	if(BA[0] > 7) BA[0]=0;
	if(BA[1] > 7) BA[1]=0;
	if(BB[0] > 7) BB[0]=0;
	if(BB[1] > 7) BB[1]=0;
	
	if(AA[0] < 0) AA[0]=7;
	if(AA[1]  < 0) AA[1]=7;
	if(AB[0]  < 0) AB[0]=7;
	if(AB[1]  < 0) AB[1]=7;
	if(BA[0]  < 0) BA[0]=7;
	if(BA[1]  < 0) BA[1]=7;
	if(BB[0] < 0) BB[0]=7;
	if(BB[1]  < 0) BB[1]=7;
	
	Draw();
}

OnInit();

setInterval("Go()", 100);