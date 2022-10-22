const hero = document.querySelector(".hero");
const heroBoy = document.querySelector(".heroBoy");
const vilan = document.querySelector(".vilan");
const pursuer = document.querySelector(".pursuer");
const heart = document.querySelector(".heart");
const heart0 = document.querySelector(".heart0");
const heart1 = document.querySelector(".heart1");
const tomb = document.querySelector(".tomb");
const scoreText = document.querySelector(".scoreText");
const timeText = document.querySelector(".timeText");
const container = document.querySelector(".container");

let _vilanPosition = {x:450,testJump:false};
let _deadHero = false;
let _moveLeft = 80;
let _heroBoyPosition = 100;
let _moveRight = 0;
let _score = 0;
let _time=0;

let heroJump = false;
let _heroJumpTime = 0;
let countLife = 3;

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


}


document.addEventListener("keydown",function(event) {
	jump();
});
document.addEventListener("mousedown",function(event) {
	jump();
});

let isAlive =setInterval(function() {
	let heroTop = parseInt(window.getComputedStyle(hero).getPropertyValue("top"));
	let vilanLeft = parseInt(window.getComputedStyle(vilan).getPropertyValue("top"));

	if(vilanLeft<40 && vilanLeft>20 && heroTop <=130) {
		vilan.style.animation = "none";
		
	}

	_vilanPosition.x-=1;

	vilan.style.left = _vilanPosition.x +'px';

	if(_vilanPosition.x<0){
		_vilanPosition.x = 450;
		_vilanPosition.testJump = false;
		_score++;
	}
	if(_vilanPosition.testJump === false){
		if(_vilanPosition.x>_heroBoyPosition+10 &&  _vilanPosition.x < _heroBoyPosition+20)
		{
			_vilanPosition.testJump = true;
			
			if (heroJump==false) {
				//damage  hero
				//reset hero
				_heroBoyPosition = 100;

				if (countLife==3){
					heart.style.visibility = 'hidden';
					countLife--;
					return;
				}
				if (countLife==2){
					heart0.style.visibility = 'hidden';
					countLife--;
					return;
				}
				if (countLife==1){
					heart1.style.visibility = 'hidden';
					countLife--;
					return;
				}
				if (countLife==0){
					deadHero();
				}
			}

		}
	}
	if (_deadHero===true) {
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
			
			//console.log( (150-jumpHeight*7)+" ## heroJump = "+jumpHeight)
		} 
		
		if(_time>=_heroJumpTime+coefJumpUp){
			//hero.style.top = '10px';
			let jumpHeight = _time-_heroJumpTime-coefJumpUp;
			//hero.style.top = '10px';
			hero.style.top = (10+jumpHeight*5)+'px';
			//console.log((10+jumpHeight*5)+  " = Jump = "+jumpHeight+" 000000000"+_heroJumpTime)
		}
		
	}


	scoreText.textContent ="      Score:"+_score;
	timeText.textContent ="      Time:"+_time;
	_time++;
	
},10);
function deadHero() {
	tomb.style.visibility = 'visible';
	hero.style.visibility = 'hidden';
	_deadHero = true;
}