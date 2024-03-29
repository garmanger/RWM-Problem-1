// The game and gui canvas and the context of the game canvas for drawing.
var canvasGame, canvasGui, guiCtx, gameCtx;

// Some physical bodies, the time step for the engine and a ground body.
var world, timeStep;

// Debugging objects.
var floor, lWall, rWall, ceiling, happyBox, debugDraw, bounceBox, mineBox, mineBodyDef, enemyBox1, enemyBodyDef1, enemyBox2, enemyBodyDef2;

// Enemy Object stuff
var minePos, minePosBool, enemyPos1, enemyPos2;

// Shorthand box2d variables.
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

var playerManager = new PlayerManager();
var enemyManager;
var enemy;
var enemyMine;
var enemyTorpedo;


/**	@Name:	Init 
	@Brief:	Initalise the game.
	@Arguments:N/A
	@Returns:N/A
*/
function init(){

	// Set the timestep.
	timeStep = 1000/60;
	
	/*	Create the world object, with a gravity of 10 in the Y.
	
		As a side note, the Axis are left to right for +X.
		Top to bottom for +Y.
		
		Little wierd but whatever. And the "true" arg is allowSleep if inactive.
		
	*/
	world = new b2World( new b2Vec2( 0,2 ), true);
	
	//world, posX, posY, vel, health, width, height
	enemy = new Enemy(world, 15, 15, b2Vec2( 0, 0 ),3, 0.7,0.7);
	enemyMine = new EnemyMine(world, 7, 7, b2Vec2( 0, 0 ),3, 0.5,0.5);
	
	// Fix the canvas elements.
	initRenderer();
	
	//Create a floor object.
	createGround( );
	
	// Create the walls.
	createWalls( );

	enemyManager = new EnemyManager(world);
	drawStuff();
	
	// Begin the game loop.
	setInterval( "update()", timeStep );
	
};

function update ( ) {

	
	world.Step(1 / 60, 10, 10);
	world.DrawDebugData();
	world.ClearForces();
	enemyManager.update();
};



/**	@Name:	Init Render
	@Brief:	Initalise the renderer and add it to the Html page.
	@Arguments:N/A
	@Returns:N/A
*/
function initRenderer(){

	// Set the game canvas width and height to the size of the window.
	canvasGame = document.getElementById( "canvasGame" );
	canvasGame.width = window.innerWidth;
	canvasGame.height = window.innerHeight;
	
	// Set the GUI canvas width and height to the size of the window.
	canvasGui = document.getElementById( "canvasGui" );
	canvasGui.width = window.innerWidth;
	canvasGui.height = window.innerHeight;
	
	// Get the context of both for drawing.
	guiCtx = canvasGui.getContext( "2d" );
	gameCtx = canvasGame.getContext( "2d" );

};



/**	@Name:	Main
	@Brief:	
	@Arguments: 
	@Returns:N/A
*/
function main(){

	// Update the player.
	playerManager.update();
	// Update the enemies.
	enemyManager.update();

	
	// Draw the gui data.
	drawGui();
	
	// Draw the game.
	drawGame();
	
	drawStuff();
	
	world.DrawDebugData();
	world.ClearForces();
	
	// Render the world.
	//render( ); 
	
	//update( );
	
};



/**	@Name:	On Load
	@Brief:
	@Arguments: 
	@Returns:N/A
*/
function onLoad(){

	init();
};



/**	@Name:	Render.
	@Brief:	
	@Arguments: 
	@Returns:N/A
*/
function render() {
	
		


};



function drawGui(){

	// This is actually the best way for refreshing the canvas'
	canvasGui.width = canvasGui.width;
	
	// Set the font and size.
	guiCtx.font = 'italic 40px Calibri';
	guiCtx.shadowOffsetX = 5;
	guiCtx.shadowOffsetY = 5;
	guiCtx.shadowBlur    = 4;
	guiCtx.shadowColor   = 'rgba( 155, 155, 155, 0.5)';
	guiCtx.fillStyle     = 'rgba(255, 255, 255, 0.5)';
	
	// Draw a border/Box in the corner.
	guiCtx.fillRect( 5, 5, 255, 255 );
	guiCtx.fillStyle     = '#000';
	
	// Draw text in the border/Box area.
	guiCtx.fillText( 'Width : '+ window.innerWidth, 10, 210 );
	guiCtx.fillText( 'Height : '+ window.innerHeight, 10, 240 );

};



function drawGame(){
	
	// Refresh the canvas.
	canvasGame.width = canvasGame.width;
	
	
	/*
		Most objects will be responsible for themselves,
		but maybe we can create static objects in main instead of the OO shit
		and draw them here.
	
	*/
};



function createWalls( ) {
	
	
};



function createGround(  ) {

	/**	
		b2_staticBody (Type = 0)
		A static body does not move under simulation and behaves as if it has infinite mass. Internally, Box2D stores zero for the mass and the inverse mass. Static bodies can be moved manually by the user. A static body has zero velocity. Static bodies do not collide with other static or kinematic bodies.

		b2_kinematicBody (Type = 1)
		A kinematic body moves under simulation according to its velocity. Kinematic bodies do not respond to forces. They can be moved manually by the user, but normally a kinematic body is moved by setting its velocity. A kinematic body behaves as if it has infinite mass, however, Box2D stores zero for the mass and the inverse mass. Kinematic bodies do not collide with other static or kinematic bodies. A kinematic body is very similar to a static body in that when it collides with a dynamic body it always holds its ground and forces the dynamic body to retreat out of the way. The difference is that a kinematic body can move.

		b2_dynamicBody (Type = 2)
		A dynamic body is fully simulated. They can be moved manually by the user, but normally they move according to forces. A dynamic body can collide with all body types. A dynamic body always has finite, non-zero mass. If you try to set the mass of a dynamic body to zero, it will automatically acquire a mass of one kilogram.
		
		Bodies are the backbone for fixtures. Bodies carry fixtures and move them around in the world. Bodies are always rigid bodies in Box2D. That means that two fixtures attached to the same rigid body never move relative to each other.
		Fixtures have collision geometry and density. Normally, bodies acquire their mass properties from the fixtures. However, you can override the mass properties after a body is constructed. This is discussed below.
		You usually keep pointers to all the bodies you create. This way you can query the body positions to update the positions of your graphical entities. You should also keep body pointers so you can destroy them when you are done with them.
	*/
	
	// Create a new body definition.
	var bodyDef = new b2BodyDef;
	// Assign it a type, 0 = static, 1 = kinematic, 2 = rigidBody,
	bodyDef.type = b2Body.b2_staticBody;
	bodyDef.position.Set( 0, window.innerWidth );
	bodyDef.userData = 'Ground';
	
	// Create the body using the definition above.
	floor = world.CreateBody( bodyDef );
	
	/* Go to http://www.box2dflash.org/docs/2.1a/reference/ to so what properties we can now assign to the body.
	   When run at this point the body is in the world but it has no dimentions or stuff so we have to create a fixture.
	   More about fixtures can be found here: http://codingowl.com/readblog.php?blogid=110
	*/
};


function drawStuff( ) {

	debugDraw = new b2DebugDraw();
	debugDraw.SetSprite ( guiCtx);
	debugDraw.SetDrawScale(30); //define scale
	debugDraw.SetFillAlpha(0.7); //define transparency
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	world.SetDebugDraw(debugDraw);

};




/**	@Name:	Handle Key Events.
	@Brief:	Called from the dom's mouse down event listener.
	@Arguments: event object.
	@Returns:N/A
*/
function handleKeyEvents( event ) {

	var key = event.keyCode;

	switch( key ){

		case 38:// UP ARROW	
	
	  		break;
		case 40:// DOWN ARROW
	  		break;
		case 37:// LEFT ARROW
	  		break;
		case 39:// RIGHT ARROW
	  		break;
		case 65:// A
	  		break;
		case 68:// D
	  		break;
		case 87:// W
	  		break;
		case 83:// S
	  		break;
		case 88:
	  		break;
		case 97:// Num pad 1. First Person.
	  		break;
		case 98:// Num pad 2. Test.
	  		break;
		case 99:// Num pad 3. Third Person.
	  		break;
		default:
	  		return;		
	}
};



/**	@Name:	Handle Mouse move.
	@Brief:	Called from the dom's mouse move event listener.
	@Arguments: event object.
	@Returns:N/A
*/
function handleMouseMove( event ) {

	var key = event;

};



/**	@Name:	Handle clicks
	@Brief:	Called from the dom's mouse down event listener.
	@Arguments: event object.
	@Returns:N/A
*/
function handleClicks( event ) {

	var key = event;

};



/**	@Name:	Resize
	@Brief:	Called from the dom's resize listener.
	@Arguments:N/A
	@Returns:N/A
*/
function resize(){
   
	canvasGui.width = window.innerWidth;
	canvasGui.height = window.innerHeight;
	
	canvasGame.width = window.innerWidth;
	canvasGame.height = window.innerHeight;

};

// Listen for a resize event and provide the callback.
window.addEventListener( 'resize', resize, false );

// Listen for an orientation change, probably not needed.
window.addEventListener( 'orientationchange', resize, false );

// Listen for a mouse move and provide the callback.
window.addEventListener( 'mousemove', handleMouseMove, false );

// Listen for keyboard input and provide the callback.
window.addEventListener( 'keydown', handleKeyEvents, false );

// Listen for keyboard input and provide the callback.
window.addEventListener( 'click' , handleClicks, false ) 

// Tell me when the window loads!
window.onload = onLoad;
