const hero = document.querySelector(".hero");
const heroBoy = document.querySelector(".heroBoy");
const ghost = document.querySelector(".vilan");
const pursuer = document.querySelector(".pursuer");
const heart = document.querySelector(".heart");
const heart0 = document.querySelector(".heart0");
const heart1 = document.querySelector(".heart1");
const tomb = document.querySelector(".tomb");
const scoreText = document.querySelector(".scoreText");
const timeText = document.querySelector(".timeText");
const container = document.querySelector(".container");

let _ghostPosition = {x:450,testJump:false};
let _deadHero = {dead:false,time:0,countLife:3,score:0};

let _moveLeft = 80;
let _heroBoyPosition = 100;
let _moveRight = 0;
//let _score = 0;
let _time=0;

let heroJump = false;
let _heroJumpTime = 0;
//let countLife = 3;

tomb.style.visibility = 'hidden';


function jump() {
	//hero.style.top = '10px';
	heroJump = true;
	_heroJumpTime = _time;
	setTimeout(function() {
		hero.style.top = '150px';
		heroJump = false;
		
		console.log(_heroJumpTime+"  JUM t Jump = "+container)
		//container.style.backgroundImage = "url('public/fortestJungle.gif')";
		//container.style.backgroundImage.background-size = "100%";
	}, 500);
	//ressurection
	if (_deadHero.dead===true) {
		container.style.backgroundImage = "url('public/forest1.gif')";
		ghost.style.visibility = "visible";
		pursuer.style.visibility = "visible";
		_moveRight =0;
		pursuer.style.left =_moveRight +'px';
		tomb.style.visibility = "hidden";
		hero.style.visibility = 'visible';
		heart.style.visibility = 'visible';
		heart0.style.visibility = 'visible';
		heart1.style.visibility = 'visible';


		_deadHero.dead=false;
		_deadHero.countLife =3;
		_deadHero.score =0;
	}
}


document.addEventListener("keydown",function(event) {
	jump();
});
document.addEventListener("mousedown",function(event) {
	jump();
});

let isAlive =setInterval(function() {
	let heroTop = parseInt(window.getComputedStyle(hero).getPropertyValue("top"));
	let ghostLeft = parseInt(window.getComputedStyle(ghost).getPropertyValue("top"));

	if(ghostLeft<40 && ghostLeft>20 && heroTop <=130) {
		ghost.style.animation = "none";
		
	}

	_ghostPosition.x-=1;

	ghost.style.left = _ghostPosition.x +'px';

	if(_ghostPosition.x<0){
		_ghostPosition.x = 450;
		_ghostPosition.testJump = false;
		_deadHero.score++;
	}
	if(_ghostPosition.testJump === false){
		if(_ghostPosition.x>_heroBoyPosition+10 &&  _ghostPosition.x < _heroBoyPosition+20)
		{
			_ghostPosition.testJump = true;
			
			if (heroJump==false) {
				//damage  hero
				//reset hero
				_heroBoyPosition = 100;

				if (_deadHero.countLife==3){
					heart.style.visibility = 'hidden';
					_deadHero.countLife--;
					return;
				}
				if (_deadHero.countLife==2){
					heart0.style.visibility = 'hidden';
					_deadHero.countLife--;
					return;
				}
				if (_deadHero.countLife==1){
					heart1.style.visibility = 'hidden';
					_deadHero.countLife--;
					return;
				}
				if (_deadHero.countLife==0){
					if (_deadHero.dead===false) {
						deadHero();
					}
				}
			}

		}
	}
	if (_deadHero.dead===true) {
		if(_moveLeft>=0){
			hero.style.left = _moveLeft+'px';
			tomb.style.left = _moveLeft+'px';
			_moveLeft--;
		}
		if(_moveRight<=450)
		{
			pursuer.style.left =_moveRight +'px';
			_moveRight++;
		}
	} else {
		// hero life
		_heroBoyPosition+=0.05;
		hero.style.left = _heroBoyPosition+'px';
	}
	//jump grafic
	if (heroJump===true){
		let coefJumpUp = 20;
		if(_time<_heroJumpTime+coefJumpUp){
			let jumpHeight = _time-_heroJumpTime;
			hero.style.top = (150-jumpHeight*7)+'px';
			
			
			
		} 
		
		if(_time>=_heroJumpTime+coefJumpUp){
			//hero.style.top = '10px';
			let jumpHeight = _time-_heroJumpTime-coefJumpUp;
			//hero.style.top = '10px';
			hero.style.top = (10+jumpHeight*5)+'px';
			//console.log((10+jumpHeight*5)+  " = Jump = "+jumpHeight+" 000000000"+_heroJumpTime)
		}
		
	}
   //dead заставка
   if (_deadHero.dead===true) {
		console.log((_deadHero.time+500)+  " # um  = "+_deadHero.time +"   t = "+_time);
		if(_deadHero.time+500<_time)
		{
			console.log("  dead screen");
			container.style.backgroundImage = "url('public/forestDead.gif')";
			ghost.style.visibility = "hidden";
			pursuer.style.visibility = "hidden";
			tomb.style.visibility = "hidden";
		}
   } else {
		scoreText.textContent ="      Score:"+_deadHero.score;
   }
	
	timeText.textContent ="      Time:"+_time;
	_time++;
	
},10);
function deadHero() {
	tomb.style.visibility = 'visible';
	hero.style.visibility = 'hidden';
	_deadHero.dead = true;
	_deadHero.time = _time;
}