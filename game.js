


kaboom({
    background: [ 255, 255, 255, ],
})


// load assets
loadSprite("bean", "bean.jpg")
loadSprite("ghosty", "ghosty.png")
loadSprite("spike", "spike.png")
loadSprite("spike-op", "spike-op.png")
loadSprite("grass", "grass.png")
loadSprite("prize", "jumpy.png")
loadSprite("apple", "apple.png")
loadSprite("portal", "portal.png")
loadSprite("coin", "coin.png")

/*loadSound("coin", "score.mp3")
loadSound("powerup", "powerup.mp3")
loadSound("blip", "blip.mp3")
loadSound("hit", "hit.mp3")
loadSound("portal", "hit.mp3")*/

// custom component controlling enemy patrol movement
function patrol(speed = 60, dir = 1) {
	return {
		id: "patrol",
		require: [ "pos", "area", ],
		add() {
			this.on("collide", (obj, col) => {
				if (col.isLeft() || col.isRight()) {
					dir = -dir
				}
			})
		},
		update() {
			this.move(speed * dir, 0)
		},
	}
}

// custom component that makes stuff grow big
function big() {
	let timer = 0
	let isBig = false
	let destScale = 1
	return {
		// component id / name
		id: "big",
		// it requires the scale component
		require: [ "scale" ],
		// this runs every frame
		update() {
			if (isBig) {
				timer -= dt()
				if (timer <= 0) {
					this.smallify()
				}
			}
			this.scale = this.scale.lerp(vec2(destScale), dt() * 16)
		},
		// custom methods
		isBig() {
			return isBig
		},
		smallify() {
			destScale = 1
			timer = 0
			isBig = false
		},
		biggify(time) {
			destScale = 2
			timer = time
			isBig = true
		},
	}
}

// custom component that makes stuff grow big
function small() {
	let timer = 0
	let isSmall = false
	let destScale = 1
	return {
		// component id / name
		id: "small",
		// it requires the scale component
		require: [ "scale" ],
		// this runs every frame
		update() {
			if (isSmall) {
				timer -= dt()
				if (timer <= 0) {
					this.biggify()
				}
			}
			this.scale = this.scale.lerp(vec2(destScale), dt() * 16)
		},
		// custom methods
		isSmall() {
			return isSmall
		},
		smallify(time) {
			destScale = 0.4
			timer = time
			isSmall = true
		},
		biggify() {
			destScale = 1
			timer = 0
			isSmall = false
		},
	}
}

// define some constants
const JUMP_FORCE = 1320
const MOVE_SPEED = 580
const FALL_DEATH = 2400

const LEVELS = [
	[
		"                      ^   $",
		"                     ==   $",
		"                     v=   $",
		"      ===         -   =   $",
		"      vv              =   $",
		"     -      $         =   $",
		"  %      ======       =   $",
		"                      =   $",
		"                      =    ",
		"     > ^^  >    = >   = ^ @",
		"===========================",
	],
	[
		"     $    $    $    $     $",
		"     $    $    $    $     $",
		"                           ",
		"                           ",
		"                           ",
		"                           ",
		"                           ",
		" ^^^^>^^^^>^^^^>^^^^>^^^^^@",
		"===========================",
	],
    [
		"     $    $    $    $     $",
		"     $    $    $    $     $",
		"                           ",
		"            %%             ",
		"                           ",
		"        %%%   ===          ",
		"                           ",
		"^^^  >     >^^^^>^^^^>^^^^^@",
		"===========================",
	],
	[
		"     $    $    $    $     $",
		"     $    $    $    $     $",
		"            ^              ",
		"            %%             ",
		"        ^ -            -   ",
		"        %%%   ===          ",
		"              -         -  ",
		"  -       -          -  - @",
		"              -            ",
	],
	[
		"     $    $    $    $     $",
		"     $    $    $    $     $",
		"            v              ",
		" -  -         -   $      = ",
		"      $   -   $        - = ",
		"      v  v  v  v  v   vvv =",
		"  -      $   $   - $ $  -= ",
		"  ^   ^   ^   ^  ^   ^ ^ = ",
		"  -   $    $   0 -$   $  = ",
	],
	[
		" >$vv$ vvvv v>>$v >> v$ vvv",
		"  ^   $ >>> $ - $ ^  >- $ @",
		" - = - >>   - v >> v   >> =",
		"          >> -- >  ^->>  = ",
		"       -   -   -  ^  > - = ",
		"       - >      >        = ",
		"        -   >-         > = ",
		"          >          >  > =",
		"===========================",
	],
	[
		"                      =    ",
		"                      =    ",
		"                      =    ",
		"                      =    ",
		"                      =    ",
		"        $   %   $     =    ",
		"        $       $     =    ",
		"                      =    ",
		"                      $    ",
		"          > =>        = ^ @",
		"===========================",
	]
]

// define what each symbol means in the level graph
const levelConf = {
	// grid size
	width: 64,
	height: 64,
	// define each object as a list of components
	"=": () => [
		sprite("grass"),
		area(),
		solid(),
		origin("bot"),
	],
	"$": () => [
		sprite("coin"),
		area(),
		pos(0, -9),
		origin("bot"),
		"coin",
	],
	"%": () => [
		sprite("prize"),
		area(),
		solid(),
		origin("bot"),
		"prize",
	],
	"v":() => [
		sprite("spike-op"),
		area(),
		solid(),
		origin("bot"),
		"danger",
	],
	"^": () => [
		sprite("spike"),
		area({ scale: 0.5, }),
		solid(),
		origin("bot"),
		"danger",
	],
	"#": () => [
		sprite("apple"),
		area(),
		origin("bot"),
		body(),
		"apple",
	],
    "-": () => [
		sprite("grass"),
		area(),
		origin("bot"),
		solid(),
		patrol(),
	],
	">": () => [
		sprite("ghosty"),
		area(),
		origin("bot"),
		body(),
		patrol(),
		"enemy",
	],
	"@": () => [
		sprite("portal"),
		area({ scale: 0.5, }),
		origin("bot"),
		pos(0, -12),
		"portal",
	],
	"0": () => [
		sprite("portal"),
		area({ scale: 0.5, }),
		origin("bot"),
		patrol(),
		"portal",
	],
}

//character animation
const anims = {
    x: 0, 
    y: 0, 
    height: 1344, 
    width: 832, 
    sliceX: 13, 
    sliceY: 21,
    anims: {
        'walk-up': {from: 104, to: 112}, 
        'walk-left': {from: 117, to: 125}, 
        'walk-down': {from: 130, to: 138}, 
        'walk-right': {from: 143, to: 151}, 
        'idle-up': {from: 104, to: 104}, 
        'idle-left': {from: 117, to: 117}, 
        'idle-down': {from: 130, to: 130}, 
        'idle-right': {from: 143, to: 143}, 
    }
}

const corpusAnims = {
    corpus: anims
};

loadSpriteAtlas("spritemerge_corpus.png", corpusAnims)


scene("start", () => {

	/*add([
		sprite("bean"),
		pos(center().sub(0, 240)),
		scale(2),
		origin("center"),
	])*/

	add([
		sprite('corpus'),
		scale(2),
		pos(center().add(-128, 0)),
		origin("center"),
		area(),
		body()
	])

	add([
		text("On9 game"),
		pos(center().sub(0, 100)),
		scale(1),
		origin("center"),
	])

	add([
		text("Press [SPACE] to start"),
		pos(center().add(0, 100)),
		scale(1),
		origin("center"),
	])
	add([
		text("version 0.1"),
		pos(center().add(0, 330)),
		scale(1),
		origin("center"),
	])

	onKeyPress(() => go("game"))
})


scene("game", ({ levelId, coins } = { levelId: 0, coins: 0 }) => {

	gravity(3800)

	// add level to scene
	const level = addLevel(LEVELS[levelId ?? 0], levelConf)

	// define player object
	const player = add([
		sprite('corpus'),
		pos(0, 0),
		area(),
		scale(1),
		// makes it fall to gravity and jumpable
		body(),
		// the custom component we defined above
		small(),
		big(),
		origin("bot"),
	])

	// action() runs every frame
	player.onUpdate(() => {
		// center camera to player
		camPos(player.pos)
		// check fall death
		if (player.pos.y >= FALL_DEATH) {
			go("lose", coins)
		}
	})

	// if player onCollide with any obj with "danger" tag, lose
	player.onCollide("danger", () => {
		go("lose", coins)
		//play("hit")
	})

	player.onCollide("portal", () => {
		//play("portal")
		if (levelId + 1 < LEVELS.length) {
			go("game", {
				levelId: levelId + 1,
				coins: coins,
			})
		} else {
			go("win", coins)
		}
	})

	player.onGround((l) => {
		if (l.is("enemy")) {
			player.jump(JUMP_FORCE * 1.5)
			destroy(l)
			addKaboom(player.pos)
			//play("powerup")
		}
	})

	player.onCollide("enemy", (e, col) => {
		// if it's not from the top, die
		if (!col.isBottom()) {
			go("lose", coins)
			//play("hit")
		}
	})

	let hasApple = false

	// grow an apple if player's head bumps into an obj with "prize" tag
	player.onHeadbutt((obj) => {
		if (obj.is("prize") && !hasApple) {
			const apple = level.spawn("#", obj.gridPos.sub(0, 1))
			apple.jump()
			hasApple = true
			//play("blip")
		}
	})

	// player grows big onCollide with an "apple" obj
	player.onCollide("apple", (a) => {
		destroy(a)
		// as we defined in the big() component
		player.smallify(3)
		hasApple = false
		//play("powerup")
	})

	let coinPitch = 0

	onUpdate(() => {
		if (coinPitch > 0) {
			coinPitch = Math.max(0, coinPitch - dt() * 100)
		}
	})

	player.onCollide("coin", (c) => {
		destroy(c)
		//play("coin", {
		//	detune: coinPitch,
		//})
		coinPitch += 100
		coins += 1
		coinsLabel.text = coins
		//alert(coins)
	})

	const coinsLabel = add([
		text(coins),
		pos(24, 24),
		fixed(),
	])

	// jump with space
	onKeyPress("space", () => {
		// these 2 functions are provided by body() component
		if (player.isGrounded()) {
			player.jump(JUMP_FORCE)
		}
	})

	onKeyDown('left', () => {
		DIRECTION = 'left';
		switchAnimation('walk');
		player.move(-MOVE_SPEED, 0)
	})
	onKeyDown('right', () => {
		DIRECTION = 'right';
		switchAnimation('walk');
		player.move(MOVE_SPEED, 0)
	})

	onKeyPress("down", () => {
		player.weight = 3
	})

	onKeyRelease(['left', 'right', 'down', 'up'], () => {
		switchAnimation('idle');
		player.weight = 1
	})

	onKeyPress("f", () => {
		fullscreen(!fullscreen())
	})


function switchAnimation(type) {
	if (player.curAnim() !== type+'-'+DIRECTION) {
        player.play(type+'-'+DIRECTION, {loop: true});
    }

}
const getInfo = () => `
	Level: ${levelId}
	`.trim()

	// Add some text to show the current animation
	const label = add([
		text(getInfo()),
		pos(4),
	])

	label.onUpdate(() => {
		label.text = getInfo()
	})


})

scene("lose", (coins) => {
	add([
		text("You Lose , " + "Collected coins: " + coins),
		pos(center().sub(700, 100)),
	])
	onKeyPress(() => go("game"))
})

scene("win", (coins) => {
	add([
		text("You Win, " + "Collected coins: " + coins),
		pos(center().sub(700, 100))
	])
	onKeyPress(() => go("game"))
})


go("start")