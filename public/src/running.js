// DOM элементы
const elements = {
	hero: document.querySelector(".hero"),
	heroBoy: document.querySelector(".heroBoy"),
	ghost: document.querySelector(".vilan"),
	pursuer: document.querySelector(".pursuer"),
	heartList: [
		document.querySelector(".heart0"),
		document.querySelector(".heart1"),
		document.querySelector(".heart2"),
		document.querySelector(".heart3")
	],
	tomb: document.querySelector(".tomb"),
	scoreText: document.querySelector(".scoreText"),
	timeText: document.querySelector(".timeText"),
	container: document.querySelector(".container")
};

const GAME_CONSTANTS = {
	_ghostPosition : { x: 450, testJump: false },
	_deadHero: { dead: false, time: 0, countLife: 4, score: 0 },
	_moveLeft: 80,
	_heroBoyPosition: 100,
	_moveRight: 0,
	_time:0,
	_heroJump: false,
	_heroJumpTime: 0,
	IMAGES_FON: {
		FOREST: "url('public/forest1.gif')",
		FOREST_DEAD: "url('public/forestDead.gif')"
	}
}

elements.tomb.style.visibility = 'hidden';


function jump() {
	GAME_CONSTANTS._heroJump = true;
	GAME_CONSTANTS._heroJumpTime = GAME_CONSTANTS._time;
	setTimeout(function() {
		elements.hero.style.top = '150px';
		GAME_CONSTANTS._heroJump = false;

	}, 500);
	//ressurection
	if (GAME_CONSTANTS._deadHero.dead===true) {
		elements.container.style.backgroundImage = GAME_CONSTANTS.IMAGES_FON.FOREST;
		elements.ghost.style.visibility = "visible";
		elements.pursuer.style.visibility = "visible";
		GAME_CONSTANTS._moveRight =0;
		elements.pursuer.style.left =GAME_CONSTANTS._moveRight +'px';
		elements.tomb.style.visibility = "hidden";
		elements.hero.style.visibility = 'visible';

		for (let item of elements.heartList) {
			item.style.visibility = 'visible';
		}

		GAME_CONSTANTS._deadHero.dead=false;
		GAME_CONSTANTS._deadHero.countLife =3;
		GAME_CONSTANTS._deadHero.score =0;
	}
}


document.addEventListener("keydown",function(event) {
	if (event.key.toLowerCase() == 'p') {
		stopGame();
	}
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

	GAME_CONSTANTS._ghostPosition.x-=1;

	elements.ghost.style.left = GAME_CONSTANTS._ghostPosition.x +'px';

	if (GAME_CONSTANTS._ghostPosition.x<0){
		GAME_CONSTANTS._ghostPosition.x = 450;
		GAME_CONSTANTS._ghostPosition.testJump = false;
		GAME_CONSTANTS._deadHero.score++;
	}
	if (GAME_CONSTANTS._ghostPosition.testJump === false){
		if (GAME_CONSTANTS._ghostPosition.x > GAME_CONSTANTS._heroBoyPosition + 10 && GAME_CONSTANTS._ghostPosition.x < GAME_CONSTANTS._heroBoyPosition+20)
		{
			GAME_CONSTANTS._ghostPosition.testJump = true;
			
			if (GAME_CONSTANTS._heroJump==false) {
				//damage  hero
				//reset hero
				GAME_CONSTANTS._heroBoyPosition = 100;

				DamageController();

			}

		}
	}
	if (GAME_CONSTANTS._deadHero.dead===true) {
		if (GAME_CONSTANTS._moveLeft>=0){
			elements.hero.style.left = GAME_CONSTANTS._moveLeft+'px';
			elements.tomb.style.left = GAME_CONSTANTS._moveLeft+'px';
			GAME_CONSTANTS._moveLeft--;
		}
		if (GAME_CONSTANTS._moveRight<=450)
		{
			elements.pursuer.style.left =GAME_CONSTANTS._moveRight +'px';
			GAME_CONSTANTS._moveRight++;
		}
	} else {
		// hero life
		GAME_CONSTANTS._heroBoyPosition+=0.05;
		elements.hero.style.left = GAME_CONSTANTS._heroBoyPosition+'px';
	}
	//jump grafic
	if (GAME_CONSTANTS._heroJump===true){
		let coefJumpUp = 20;
		if (GAME_CONSTANTS._time <GAME_CONSTANTS._heroJumpTime+coefJumpUp){
			let jumpHeight = GAME_CONSTANTS._time -GAME_CONSTANTS._heroJumpTime;
			elements.hero.style.top = (150-jumpHeight*7)+'px';
			
			
			
		} 
		
		if (GAME_CONSTANTS._time >=GAME_CONSTANTS._heroJumpTime+coefJumpUp){
			let jumpHeight = GAME_CONSTANTS._time -GAME_CONSTANTS._heroJumpTime-coefJumpUp;
			elements.hero.style.top = (10+jumpHeight*5)+'px';
		}
		
	}
   //dead заставка
	if (GAME_CONSTANTS._deadHero.dead===true) {
		if (GAME_CONSTANTS._deadHero.time + 500 <GAME_CONSTANTS._time)
		{
			elements.container.style.backgroundImage = GAME_CONSTANTS.IMAGES_FON.FOREST_DEAD;
			elements.ghost.style.visibility = "hidden";
			elements.pursuer.style.visibility = "hidden";
			elements.tomb.style.visibility = "hidden";
		}
   } else {
		elements.scoreText.textContent = "      Score:" +GAME_CONSTANTS._deadHero.score;
   }
	
	elements.timeText.textContent = "      Time:" +GAME_CONSTANTS._time;
	GAME_CONSTANTS._time++;
	
},10);
function deadHero() {
	elements.tomb.style.visibility = 'visible';
	elements.hero.style.visibility = 'hidden';
	GAME_CONSTANTS._deadHero.dead = true;
	GAME_CONSTANTS._deadHero.time = GAME_CONSTANTS._time;
}

// Функция для остановки игры (опционально)
function stopGame() {
	clearInterval(isAlive);
}

function DamageController() {

	switch (GAME_CONSTANTS._deadHero.countLife) {
		case 4:
			elements.heartList[3].style.visibility = 'hidden';
			break;
		case 3:
			elements.heartList[2].style.visibility = 'hidden';
			break;
		case 2:
			elements.heartList[1].style.visibility = 'hidden';
			break;
		case 1:
			elements.heartList[0].style.visibility = 'hidden';
			break;
		case 0:
			if (GAME_CONSTANTS._deadHero.dead === false) {
				deadHero();
			}
			break;
		default:
			return;
	}

	GAME_CONSTANTS._deadHero.countLife--;

}