// DOM элементы
const elements = {
	hero: document.querySelector(".hero"),
	heroBoy: document.querySelector(".heroBoy"),
	ghost: document.querySelector(".vilan"),
	pursuer: document.querySelector(".pursuer"),
	heart: document.querySelector(".heart"),
	heart0: document.querySelector(".heart0"),
	heart1: document.querySelector(".heart1"),
	tomb: document.querySelector(".tomb"),
	scoreText: document.querySelector(".scoreText"),
	timeText: document.querySelector(".timeText"),
	container: document.querySelector(".container")
};


let _ghostPosition = {x:450,testJump:false};
let _deadHero = {dead:false,time:0,countLife:3,score:0};

let _moveLeft = 80;
let _heroBoyPosition = 100;
let _moveRight = 0;
let _time=0;

let heroJump = false;
let _heroJumpTime = 0;

elements.tomb.style.visibility = 'hidden';


function jump() {
	heroJump = true;
	_heroJumpTime = _time;
	setTimeout(function() {
		elements.hero.style.top = '150px';
		heroJump = false;
		
		console.log(_heroJumpTime+"  JUM t Jump = "+container)
	}, 500);
	//ressurection
	if (_deadHero.dead===true) {
		elements.container.style.backgroundImage = "url('public/forest1.gif')";
		elements.ghost.style.visibility = "visible";
		elements.pursuer.style.visibility = "visible";
		_moveRight =0;
		elements.pursuer.style.left =_moveRight +'px';
		elements.tomb.style.visibility = "hidden";
		elements.hero.style.visibility = 'visible';
		elements.heart.style.visibility = 'visible';
		elements.heart0.style.visibility = 'visible';
		elements.heart1.style.visibility = 'visible';


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
	let heroTop = parseInt(window.getComputedStyle(elements.hero).getPropertyValue("top"));
	let ghostLeft = parseInt(window.getComputedStyle(elements.ghost).getPropertyValue("top"));

	if(ghostLeft<40 && ghostLeft>20 && heroTop <=130) {
		elements.ghost.style.animation = "none";
		
	}

	_ghostPosition.x-=1;

	elements.ghost.style.left = _ghostPosition.x +'px';

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
					elements.heart.style.visibility = 'hidden';
					_deadHero.countLife--;
					return;
				}
				if (_deadHero.countLife==2){
					elements.heart0.style.visibility = 'hidden';
					_deadHero.countLife--;
					return;
				}
				if (_deadHero.countLife==1){
					elements.heart1.style.visibility = 'hidden';
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
			elements.hero.style.left = _moveLeft+'px';
			elements.tomb.style.left = _moveLeft+'px';
			_moveLeft--;
		}
		if(_moveRight<=450)
		{
			elements.pursuer.style.left =_moveRight +'px';
			_moveRight++;
		}
	} else {
		// hero life
		_heroBoyPosition+=0.05;
		elements.hero.style.left = _heroBoyPosition+'px';
	}
	//jump grafic
	if (heroJump===true){
		let coefJumpUp = 20;
		if(_time<_heroJumpTime+coefJumpUp){
			let jumpHeight = _time-_heroJumpTime;
			elements.hero.style.top = (150-jumpHeight*7)+'px';
			
			
			
		} 
		
		if(_time>=_heroJumpTime+coefJumpUp){
			let jumpHeight = _time-_heroJumpTime-coefJumpUp;
			elements.hero.style.top = (10+jumpHeight*5)+'px';
		}
		
	}
   //dead заставка
   if (_deadHero.dead===true) {
		console.log((_deadHero.time+500)+  " # um  = "+_deadHero.time +"   t = "+_time);
		if(_deadHero.time+500<_time)
		{
			elements.container.style.backgroundImage = "url('public/forestDead.gif')";
			elements.ghost.style.visibility = "hidden";
			elements.pursuer.style.visibility = "hidden";
			elements.tomb.style.visibility = "hidden";
		}
   } else {
		elements.scoreText.textContent ="      Score:"+_deadHero.score;
   }
	
	elements.timeText.textContent ="      Time:"+_time;
	_time++;
	
},10);
function deadHero() {
	elements.tomb.style.visibility = 'visible';
	elements.hero.style.visibility = 'hidden';
	_deadHero.dead = true;
	_deadHero.time = _time;
}