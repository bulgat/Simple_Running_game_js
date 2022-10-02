const hero = document.querySelector(".hero");
const heroBoy = document.querySelector(".heroBoy");
const vilan = document.querySelector(".vilan");
const pursuer = document.querySelector(".pursuer");
const heart = document.querySelector(".heart");
const heart0 = document.querySelector(".heart0");
const heart1 = document.querySelector(".heart1");
const tomb = document.querySelector(".tomb");
const scoreText = document.querySelector(".scoreText");

let _vilanPosition = 450;
let _deadHero = false;
let _moveLeft = 80;
let _moveRight = 0;
let _score = 0;

let heroJump = false;
let countLife = 3;

tomb.style.visibility = 'hidden';


function jump() {
	
hero.style.top = '10px';
heroJump = true;

	setTimeout(function() {
		hero.style.top = '150px';
		heroJump = false;
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

	_vilanPosition-=1;

	vilan.style.left = _vilanPosition +'px';

	if(_vilanPosition<0){
		_vilanPosition = 450;
		_score++;
	}
	if(_vilanPosition==100)
	{
		if (heroJump==false) {
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
	if (_deadHero==true) {
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
	}
	scoreText.textContent ="      Score:"+_score;
},10);
function deadHero() {
	tomb.style.visibility = 'visible';
	
	hero.style.visibility = 'hidden';

	_deadHero = true;
}