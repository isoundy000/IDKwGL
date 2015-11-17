//Empty model constructor
function Model()
{
	//Model Data
	this.size = 0; //Size amount of triangles
	this.vertex = [];
	this.normals = [];
	this.colors = [];

	//Tranformations Control
	this.position = new Vector3(0,0,0);
	this.rotation = new Vector3(0,0,0);
	this.scale = new Vector3(1,1,1);

	//Tranformation Matrix
	this.transformationMatrix = new Matrix(4,4);
}

//Function Prototypes
Model.prototype.draw = draw;
Model.prototype.update = update;
Model.prototype.loadOBJ = loadOBJ;
Model.prototype.toString = toString;
Model.prototype.computeVertexNormals = computeVertexNormals;

//Draw Model to camera
function draw(camera)
{	
    //Clone Camera Global transformation Matrix and multiply
    camTransformationMatrix = this.transformationMatrix.clone();
	camTransformationMatrix.mul(camera.transformationMatrix);

	// Passing the Model View Matrix to apply the current transformation
	gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uMVMatrix"), false, camTransformationMatrix.flatten());

	// Vertex
	var triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertex), gl.STATIC_DRAW);
	
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems = this.vertex.length / 3;			

	// Associating to the vertex shader
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	
	// Colors
	var triangleVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);

	triangleVertexColorBuffer.itemSize = 3;
	triangleVertexColorBuffer.numItems = this.colors.length / 3;			

	// Associating to the vertex shader
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

	//Draw Model into screen
	gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems); 	
}

//Recalculate Tranformation Matrix
function update()
{
	this.transformationMatrix = MatrixGenerator.translation(this.position.x, this.position.y, this.position.z);
    this.transformationMatrix.mul(MatrixGenerator.rotationMatrix(this.rotation.x, this.rotation.y, this.rotation.z));
    this.transformationMatrix.mul(MatrixGenerator.scalingMatrix(this.scale.x, this.scale.y, this.scale.z));
}

//OBJ file read from string
function loadOBJ(data)
{
	var lines = data.split("\n");

	//Clear Data
	this.vertex = [];
	this.normals = [];
	this.colors = [];
	this.size = 0;

	// Check every line and store 
	for(var i = 0; i < lines.length; i++)
	{
		// The tokens/values in each line Separation between tokens is 1 or mode whitespaces
	    var tokens = lines[i].split(/\s\s*/);

	    if(tokens[0] == "v") //Vertices
	    {
	    	this.vertex.push(parseFloat(tokens[1]));
	    	this.vertex.push(parseFloat(tokens[2]));
	    	this.vertex.push(parseFloat(tokens[3]));

	    	//TODO <READ COLOR FROM OBJ FILE>
	    	this.colors.push(Math.random());
	    	this.colors.push(Math.random());
	    	this.colors.push(Math.random());
	    	this.size += 3;
		}
	    else if(tokens[0] == "vn") //Normals
	    {
	    	this.normals.push(parseFloat(tokens[1]));
	    	this.normals.push(parseFloat(tokens[2]));
	    	this.normals.push(parseFloat(tokens[3]));
		}
	}
	
	// Checking to see if the normals are defined on the file
	if(this.normals.length == 0)
	{
		this.computeVertexNormals();
	}
	
	// Reset Tranformations Control
	this.position = new Vector3(0,0,0);
	this.rotation = new Vector3(0,0,0);
	this.scale = new Vector3(1,1,1);
}

//Computing the triangle unit normal vector to vertex 
function computeVertexNormals()
{
	//Clearing the new normals array
	this.normals = [];
	
    //Taking 3 vertices from the coordinates array 
    for(i = 0; i < this.vertex.length; i += 9)
    {
		//Compute unit normal vector for each triangle
        var normalVector = MathUtils.computeNormalVector(new Vector3(this.vertex[i], this.vertex[i+1], this.vertex[i+2]), new Vector3(this.vertex[i+3], this.vertex[i+4], this.vertex[i+5]), new Vector3(this.vertex[i+6], this.vertex[i+7], this.vertex[i+8]));

        //Store normal 3 times
        this.normals.push(normalVector.x);
        this.normals.push(normalVector.y);
        this.normals.push(normalVector.z);
		this.normals.push(normalVector.x);
		this.normals.push(normalVector.y);
		this.normals.push(normalVector.z);
		this.normals.push(normalVector.x);
		this.normals.push(normalVector.y);
		this.normals.push(normalVector.z);
	}
}

//Create string with model info
function toString()
{
	return "Model (Size:"+this.size+" VertexCount:"+this.vertex.length+" NormalCount:"+this.normals.length+" ColorsCount:"+this.colors.length+")"; 
}
