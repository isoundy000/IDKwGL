include("math/Vector2.js");
include("math/Vector3.js");
include("math/Vector4.js");
include("math/Matrix.js");
include("math/Conversion.js");
include("math/MathsUtils.js");

include("math/geometry/Geometry.js");
include("math/geometry/Box.js");
include("math/geometry/Sphere.js");

include("input/Key.js");
include("input/Keyboard.js");
include("input/Mouse.js");

include("graphics/Scene.js");
include("graphics/Model.js");
include("graphics/Texture.js");
include("graphics/Material.js");
include("graphics/Sprite.js");
include("graphics/MatrixGenerator.js");
include("graphics/Color.js");
include("graphics/Shader.js");
include("graphics/ModelUtils.js");
include("graphics/Text.js");
include("graphics/Font.js");

include("graphics/light/Light.js");
include("graphics/light/DirectionalLight.js");
include("graphics/light/PointLight.js");

include("graphics/particle/Particle.js");
include("graphics/particle/ParticleEmitter.js");

include("graphics/camera/Camera.js");
include("graphics/camera/OrthographicCamera.js");
include("graphics/camera/PrespectiveCamera.js");

include("physics/Body.js");
include("physics/World.js");

include("data/models/house.js");
include("data/models/tank.js");

include("game/Spectator.js");
include("game/Player.js");
include("game/GameObject.js");
include("game/Referencial.js");

include("game/screen/Arena.js");
include("game/screen/Test2D.js");
include("game/screen/ArenaPhysics.js");

include("Main.js");

//Global App Variables
var gl = null;

//App class
function App(){}

//Time control
App.delta_time = 0;
App.time = 0;

//Input Input
App.keyboard;
App.mouse;

// App Initialization
App.initialize = function()
{
	var canvas = document.getElementById("canvas");
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
	
	//Initialize Input
	App.keyboard = new Keyboard();
	App.mouse = new Mouse();

	//Keyboard OnKeyDown Event
	document.onkeydown = function(event)
	{
		App.keyboard.update(event.keyCode, Key.KEY_DOWN);
	}

	//Keyboard OnKeyUp Event
	document.onkeyup = function(event)
	{
		App.keyboard.update(event.keyCode, Key.KEY_UP);
	}

	//Mouse Move Position
	document.onmousemove = function(event)
	{
		App.mouse.updatePosition(event.clientX, event.clientY, event.movementX, event.movementY);
	}

	//Mouse Button Down
	document.onmousedown = function(event)
	{
		App.mouse.updateKey(event.which-1, Key.KEY_DOWN);
	}

	//Mouse Button Up
	document.onmouseup = function(event)
	{
		App.mouse.updateKey(event.which-1, Key.KEY_UP);
	}

	//Request to lock mouse if canvas is clicked (cross-browser)
	canvas.onclick = function()
	{
		try
		{
			canvas.requestPointerLock = canvas.mozRequestPointerLock || canvas.requestPointerLock || canvas.webkitRequestPointerLock;
			canvas.requestPointerLock();
		}
		catch(e){}
	}

	App.initGL(canvas);
	Main.init(canvas);
	
	App.loop()
}

//Initialize WebGL
App.initGL = function()
{
	try
	{
		gl = canvas.getContext("webgl", {alpha: false}) || canvas.getContext("experimental-webgl", {alpha: false});
		gl.viewport(0, 0, canvas.width, canvas.height);
	}
	catch(e){}

	if(!gl)
	{
		throw "Failed to initialize WebGL";
	}
}

// Timer to update game logic and render stuff (switch to independent timers?)
App.loop = function()
{
	//Update Mouse Values (to keep in sync with game actions)
	App.mouse.update();
	
	//Update and render stuff
	Main.update();
	Main.draw();

	//Update time values
	App.delta_time = new Date - App.time;
	App.time += App.delta_time;

	//Call loop again
	setTimeout(App.loop, 0);
}

// Called every time page is resized
App.resize = function()
{
	var canvas = document.getElementById("canvas");
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;

	App.initGL(canvas);
	Main.resize(canvas);
}

//Should be called by canvas onclicked
App.setFullscreen = function(event)
{
	//Key P Pressed
	if(event.keyCode == 112)
	{
		var canvas = document.getElementById("canvas");
		canvas.webkitRequestFullScreen();
	}
}

//Check if mouse is locked (cross-browser)
App.isMouseLocked = function()
{
	return document.pointerLockElement === canvas || document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas;
}

//Read text file
App.readFile = function(fname)
{
	var file = new XMLHttpRequest();
	file.overrideMimeType("text/plain");
	
	var data = null;

	//Request file to server
	file.open("GET", fname, false);

	//Get file
	file.onreadystatechange = function ()
	{
		if(file.status === 200 || file.status === 0)
		{
			data = file.responseText;
		}
	}

	//Send null to ensure that file was received
	file.send(null);

	return data;
}

//Auxuiliary function to include JS files in app
function include(file)
{
	if(file.endsWith(".js"))
	{
		var js = document.createElement("script");
		js.src = file;
		js.type = "text/javascript";
		js.async = false;
		document.body.appendChild(js);
	}
	else if(file.endsWith(".css"))
	{
		var css = document.createElement("link");
		css.href = file;
		css.rel = "stylesheet";
		document.body.appendChild(css);
	}	
}

