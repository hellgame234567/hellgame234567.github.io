


kaboom({
    background: [ 196, 217, 219 ],
})


// load assets
loadSprite("bean", "bean.jpg")
loadSprite("ghosty", "monster.png")
loadSprite("spike", "Pointer1.png")
loadSprite("spike-op", "spike-op.png")
loadSprite("grass", "grass.png")
loadSprite("prize", "IndustrialTile_66.png")
loadSprite("apple", "apple.png")
loadSprite("portal", "portal.png")
loadSprite("coin", "frapment.png")
loadSprite("lift", "lift.png")
loadSprite('bg',"Background.png")
loadSprite('weapon', "lighSaber.png")

//mobile controller
loadSprite("left", "left.png")
loadSprite("right", "right.png")
loadSprite('jump',"jump.png")

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
		"=    >= ^^  >    = >  $= ^ @",
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
		" >$vv$   v    v>>$  >>    $ ",
		"  ^   $ >>> $ - $    >- $ @",
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
	],
	[
		"                      =    ",
		"                      =    ",
		"                      =    ",
		"           >  >       =    ",
		"      -           -   =    ",
		"        $ -  %   $    =    ",
		"       - $    -   -$  =    ",
		"     -      -         = v v",
		"                      $   =",
		" - -  -  -       =    =====@",
		"                      =    ",
	],
	[						
		"                   v =     @",
		"  >^>^>^ ^>^>^>^>^          =    ",
		" ===================  =    ",
		" =                    =    ",
		" ===================  =    ",
		" =>>>>>>>>>>>>>>>>>>  =    ",
		" ==%==%===%=%==%===%  =    ",
		"                      =    ",
		"                      =    ",
		"=======================    ",
		"                          ",
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
		scale(2),
		solid(),
		origin("bot"),
	],
	"$": () => [
		sprite("coin"),
		area(),
		pos(0),
		scale(0.4),
		origin("bot"),
		"coin",
	],
	"%": () => [
		sprite("prize"),
		area(),
		scale(2),
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
		scale(2),
		solid(),
		origin("bot"),
		"danger",
	],
	"#": () => [
		sprite("apple"),
		area(),
		origin("bot"),
		body(),
		scale(2),
		"apple",
	],
    "-": () => [
		sprite("lift"),
		area(),
		origin("bot"),
		solid(),
		patrol(),
		scale(2)
	],
	">": () => [
		sprite("ghosty"),
		area(),
		origin("bot"),
		body(),
		scale(2.5),
		patrol(),
		"enemy",
	],
	"@": () => [
		sprite("portal"),
		area({ scale: 0.5, }),
		scale(2),
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
        'walk-up': {from: 40, to: 44}, 
        'walk-left': {from: 117, to: 125}, 
        'walk-down': {from: 130, to: 138}, 
        'walk-right': {from: 143, to: 151}, 
        'idle-up': {from: 104, to: 104}, 
        'idle-left': {from: 117, to: 117}, 
        'idle-down': {from: 130, to: 130}, 
        'idle-right': {from: 143, to: 143}, 
		'idle': {
			"from": 40,
			"to": 44,
			"speed": 3,
			"loop": true
		},
    }
}


const monsterAnimes = {

}

const corpusAnims = {
    corpus: anims
};

loadSpriteAtlas("spritemerge_corpus.png", corpusAnims)

scene("start", () => {

	add([
		sprite("bg"),
		pos(center().sub(0, 100)),
		scale(3.5),
		origin("center"),
	])

	const player = add([
		sprite('corpus'),
		scale(2),
		pos(center().add(0, -180)),
		origin("center"),
		area(),
		fixed(),
	])

	add([
		text("NAKEDMAN"),
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
	onTouchStart(() => go("game"))
})

scene("game", ({ levelId, coins, time } = { levelId: 0, coins: 0, timer }) => {

	gravity(3800)

	add([
		sprite("bg"),
		pos(center().sub(0, 100)),
		scale(5),
		origin("center"),
	])

	// add level to scene
	const level = addLevel(LEVELS[levelId ?? 0], levelConf)

	// define player object
	const player = add([
		sprite('corpus', { anim: "idle" }),
		pos(0, 0),
		area(),
		scale(4),
		// makes it fall to gravity and jumpable
		body(),
		// the custom component we defined above
		small(),
		big(),
		origin("bot"),
	])

	const sword = add([
		pos(0,0),
		sprite("weapon"),
		origin("bot"),
		rotate(0),
		scale(2),
		area(20),
		follow(player, vec2(20, -20)),
		spin(),
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
		addKaboom(player.pos)
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
		//player.biggify(3)
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

	//mobile control
	const keyDown = {
		left:false,
		right:false
	}

	const jump = () => {
		// these 2 functions are provided by body() component
		DIRECTION = 'up';
		switchAnimation('walk');
		if (player.isGrounded()) {
			player.jump(JUMP_FORCE)
		}
	}

	// jump with space
	//passed the function to the a const 
	onKeyPress("space", jump)

	onKeyDown('left',  () =>{
		DIRECTION = 'left';
		sword.flipX(false)
		sword.follow.offset =  vec2(-20, -20)
		switchAnimation('walk');
		player.move(-MOVE_SPEED, 0)

	})

	onKeyDown('right',() => {
		console.log("running")
		sword.flipY(false)
		sword.follow.offset =  vec2(20, -20)
		DIRECTION = 'right';
		switchAnimation('walk');
		player.move(MOVE_SPEED, 0)
		
	})

	onKeyPress("down", () => {
		player.weight = 3
		DIRECTION = 'down';
		switchAnimation('walk');
	})

	onKeyPress("v", () => {
		let interacted = false
		
		every("enemy", (l) => {
			if (sword.isTouching(l)) {
				sword.spin()
				destroy(l)
				addKaboom(sword.pos)
				//play("powerup")
			}
		})

		if (!interacted) {
			sword.spin()
		}
	})

	onKeyRelease(['left', 'right', 'down', 'up'], () => {
		switchAnimation('idle');
		player.weight = 1
	})

	//mobile control button
	const leftButton = add([
		sprite('right'),
		pos(80, height() - 120),
		scale(0.5),
		opacity(0.5),
		fixed(),
		area()
	])

	const rightButton = add([
		sprite('left'),
		pos(250, height() - 120),
		scale(0.5),
		opacity(0.5),
		fixed(),
		area()
	])

	const actionButton = add([
		sprite('jump'),
		pos(width() -300, height() - 120),
		scale(0.5),
		opacity(0.5),
		fixed(),
		area()
	])	

	onTouchStart((id, pos) => {
		if(leftButton.hasPoint(pos)){
			console.log("left")
			keyDown.left = true
			console.log(keyDown)
			leftButton.opacity = 1
		}
		else if(rightButton.hasPoint(pos)){
			console.log("right")
			keyDown.right = true
			console.log(keyDown)
			rightButton.opacity =1
		}
		else if(actionButton.hasPoint(pos)){
			jump()
			console.log(keyDown)
			actionButton.opacity =1
		}

	})
	//mobile control end

	onKeyPress("f", () => {
		fullscreen(!fullscreen())
	})

function switchAnimation(type) {
	if (player.curAnim() !== type+'-'+DIRECTION) {
        player.play(type+'-'+DIRECTION, {loop: true});
    }
}

function spin() {
	let spinning = false
	return {
		id: "spin",
		update() {
			if (spinning) {
				this.angle += 600 * dt()
				if (this.angle >= 150) {
					this.angle = 0
					spinning = false
				}
			}
		},
		spin() {
			spinning = true
		},
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
		text("You Lose , " + "Collected Data: " + coins),
		pos(center().sub(700, 100)),
	])
	onKeyPress(() => go("game"))
})

scene("win", (coins) => {
	add([
		text("You Win, " + "Collected Data: " + coins),
		pos(center().sub(700, 100))
	])
	onKeyPress(() => go("game"))
})

go("start")