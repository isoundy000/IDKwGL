function Test2D()
{
	this.camera = new OrthographicCamera(canvas, 20);

	this.wall = new Sprite();
	this.wall.setTexture(Texture.createTexture("data/texture/wallrunner/wall.png"));
	this.wall.scale.set(5,5,0);
	this.wall.update();

	this.wall2 = this.wall.clone();
	this.wall2.position.set(5,0,0);
	this.wall2.update();

	this.wall2 = this.wall.clone();
	this.wall2.position.set(5,0,0);
	this.wall2.update();

	this.fence = new Sprite();
	this.fence.setTexture(Texture.createTexture("data/texture/wallrunner/spikes.png"));
	this.fence.scale.set(12,3,0);
	this.fence.update();
}

Test2D.prototype.draw = draw;
Test2D.prototype.update = update;
Test2D.prototype.resize = resize;

function update(){}

function draw()
{
	//Clear screen
	gl.clearColor(0.5, 0.5, 0.5, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//Disable depth test and enable alpha blend
	gl.disable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	this.camera.startFrame();
	this.camera.useShader(shaderLightPixel);
	
	this.wall.draw(this.camera);
	this.wall2.draw(this.camera);
	this.fence.draw(this.camera);
}

function resize()
{
	this.camera.resize(canvas.width, canvas.height);
}