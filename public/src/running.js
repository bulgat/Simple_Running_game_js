(() => {
	const qs = (selector) => {
		const el = document.querySelector(selector);
		if (!el) throw new Error(`Missing element: ${selector}`);
		return el;
	};

	// DOM элементы
	const elements = {
		hero: qs(".hero"),
		ghost: qs(".vilan"),
		pursuer: qs(".pursuer"),
		heartList: [qs(".heart0"), qs(".heart1"), qs(".heart2"), qs(".heart3")],
		tomb: qs(".tomb"),
		scoreText: qs(".scoreText"),
		timeText: qs(".timeText"),
		container: qs(".container"),
	};

	const CONFIG = {
		tickMs: 10,
		ghostStartX: 450,
		ghostSpeedPxPerTick: 1,
		pursuerMaxX: 450,
		deathScreenDelayTicks: 500,
		heroStartX: 100,
		heroDeadAnimStartX: 80,
		heroMoveSpeedPxPerTick: 0.05,
		jumpDurationMs: 500,
		jumpUpTicks: 20,
		jumpUpFactor: 7,
		jumpDownBaseTopPx: 10,
		jumpDownFactor: 5,
		heroGroundTopPx: 150,
		images: {
			forest: "url('public/forest1.gif')",
			forestDead: "url('public/forestDead.gif')",
		},
	};

	const state = {
		time: 0,
		hero: {
			x: CONFIG.heroStartX,
			isJumping: false,
			jumpStartTime: 0,
		},
		ghost: {
			x: CONFIG.ghostStartX,
			hasCheckedHitThisPass: false,
		},
		death: {
			isDead: false,
			deadAtTime: 0,
			lifeCount: 4,
			score: 0,
			deadAnimHeroX: CONFIG.heroDeadAnimStartX,
			deadAnimPursuerX: 0,
		},
	};

	elements.tomb.style.visibility = "hidden";

	function setAllHeartsVisible() {
		for (const item of elements.heartList) item.style.visibility = "visible";
	}

	function respawn() {
		elements.container.style.backgroundImage = CONFIG.images.forest;
		elements.ghost.style.visibility = "visible";
		elements.pursuer.style.visibility = "visible";
		state.death.deadAnimPursuerX = 0;
		elements.pursuer.style.left = `${state.death.deadAnimPursuerX}px`;
		elements.tomb.style.visibility = "hidden";
		elements.hero.style.visibility = "visible";

		setAllHeartsVisible();

		state.death.isDead = false;
		// сохраняю текущее поведение (после “воскрешения” остаётся 3 жизни)
		state.death.lifeCount = 3;
		state.death.score = 0;
	}

	function jump() {
		state.hero.isJumping = true;
		state.hero.jumpStartTime = state.time;

		setTimeout(() => {
			elements.hero.style.top = `${CONFIG.heroGroundTopPx}px`;
			state.hero.isJumping = false;
		}, CONFIG.jumpDurationMs);

		// resurrection
		if (state.death.isDead) respawn();
	}

	let gameUpdate = null;

	function stopGame() {
		if (gameUpdate) clearInterval(gameUpdate);
		gameUpdate = null;
	}

	document.addEventListener("keydown", (event) => {
		if (event.key.toLowerCase() === "p") stopGame();
		jump();
	});
	document.addEventListener("mousedown", () => jump());

	function updateDeathScreen() {
		if (state.death.deadAtTime + CONFIG.deathScreenDelayTicks < state.time) {
			elements.container.style.backgroundImage = CONFIG.images.forestDead;
			elements.ghost.style.visibility = "hidden";
			elements.pursuer.style.visibility = "hidden";
			elements.tomb.style.visibility = "hidden";
		}
	}

	function deadHero() {
		elements.tomb.style.visibility = "visible";
		elements.hero.style.visibility = "hidden";
		state.death.isDead = true;
		state.death.deadAtTime = state.time;
		state.death.deadAnimHeroX = CONFIG.heroDeadAnimStartX;
		state.death.deadAnimPursuerX = 0;
	}

	function applyDamage() {
		switch (state.death.lifeCount) {
			case 4:
				elements.heartList[3].style.visibility = "hidden";
				break;
			case 3:
				elements.heartList[2].style.visibility = "hidden";
				break;
			case 2:
				elements.heartList[1].style.visibility = "hidden";
				break;
			case 1:
				elements.heartList[0].style.visibility = "hidden";
				break;
			case 0:
				if (!state.death.isDead) deadHero();
				break;
			default:
				return;
		}

		state.death.lifeCount--;
	}

	function heroMovementController() {
		if (state.death.isDead) return;
		state.hero.x += CONFIG.heroMoveSpeedPxPerTick;
		elements.hero.style.left = `${state.hero.x}px`;
	}

	function UIController() {
		elements.scoreText.textContent = `Score: ${state.death.score}`;
		elements.timeText.textContent = `Time: ${state.time}`;
	}

	function updateJumpAnimation() {
		if (!state.hero.isJumping) return;

		if (state.time < state.hero.jumpStartTime + CONFIG.jumpUpTicks) {
			const jumpHeight = state.time - state.hero.jumpStartTime;
			elements.hero.style.top = `${CONFIG.heroGroundTopPx - jumpHeight * CONFIG.jumpUpFactor}px`;
			return;
		}

		const jumpHeight = state.time - state.hero.jumpStartTime - CONFIG.jumpUpTicks;
		elements.hero.style.top = `${CONFIG.jumpDownBaseTopPx + jumpHeight * CONFIG.jumpDownFactor}px`;
	}

	function updateDeadAnimation() {
		if (!state.death.isDead) return;

		if (state.death.deadAnimHeroX >= 0) {
			elements.hero.style.left = `${state.death.deadAnimHeroX}px`;
			elements.tomb.style.left = `${state.death.deadAnimHeroX}px`;
			state.death.deadAnimHeroX--;
		}
		if (state.death.deadAnimPursuerX <= CONFIG.pursuerMaxX) {
			elements.pursuer.style.left = `${state.death.deadAnimPursuerX}px`;
			state.death.deadAnimPursuerX++;
		}
	}

	function tick() {
		const heroTop = parseInt(window.getComputedStyle(elements.hero).getPropertyValue("top"));
		// bugfix: это должна быть позиция по X (left), а не top
		const ghostLeft = parseInt(window.getComputedStyle(elements.ghost).getPropertyValue("left"));

		if (ghostLeft < 40 && ghostLeft > 20 && heroTop <= 130) {
			elements.ghost.style.animation = "none";
		}

		state.ghost.x -= CONFIG.ghostSpeedPxPerTick;
		elements.ghost.style.left = `${state.ghost.x}px`;

		if (state.ghost.x < 0) {
			state.ghost.x = CONFIG.ghostStartX;
			state.ghost.hasCheckedHitThisPass = false;
			state.death.score++;
		}

		if (!state.ghost.hasCheckedHitThisPass) {
			if (state.ghost.x > state.hero.x + 10 && state.ghost.x < state.hero.x + 20) {
				state.ghost.hasCheckedHitThisPass = true;

				if (!state.hero.isJumping) {
					state.hero.x = CONFIG.heroStartX;
					applyDamage();
				}
			}
		}

		heroMovementController();
		updateDeadAnimation();
		updateJumpAnimation();

		if (state.death.isDead) updateDeathScreen();
		UIController();

		state.time++;
	}

	gameUpdate = setInterval(tick, CONFIG.tickMs);
})();