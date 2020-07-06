let zoomSld, scaleSld;
let drawPtsBtn, drawLnBtn, cropBtn, rotBtn;
let scene = []; // Array of objects
let cam;

function setup() {
	textFont("Orbitron");
	createCanvas(windowWidth, windowHeight);
	background(32);

	// Create UI elements
	zoomSld = new Slider(0.01, 100, 1, 0,0, width/12, height/60, null, "Zoom");
	scaleSld = new Slider(0.01, 100, 50, 0,0, width/12, height/60, null, "Scale");
	drawPtsBtn = new ToggleButton(0,0, width/12, height/30, "Points", null, true);
	drawLnBtn = new ToggleButton(0,0, width/12, height/30, "Lines", null, true);
	cropBtn = new ToggleButton(0,0, width/12, height/30, "Crop", null, true);
	rotBtn = new ToggleButton(0,0, width/12, height/30, "Rotate", () => {
		if(rotBtn.active) {
			requestPointerLock();
		} else {
			exitPointerLock();
		}
	}, false);

	// Start UI
	UI.tableWidth = 1;
	UI.tableHeight = 100;
	UI.distrubute();

	// Start scene objects
	cam = new AbstractCamera(new Vector([3,3,3]), new Vector([PI/4,-3*PI/4,0]));
		// Temp
	scene.push(addCube());
	scene.push(addCube().move(new Vector([2,0,0])));
	scene.push(addCube().move(new Vector([0,2,0])));
	scene.push(addCube().move(new Vector([0,0,2])));
}

function draw() {
	// Draw UI and draggable elements
	background(32);
	UI.update();
	UI.draw();

	
	translate(13/24*width, height/2);
	scale(1,-1);

	// Update the camera position and rotation
	cam.update();
	// Make the camera draw the objects in the scene
	cam.render(scene);
	//scene[0].move(new Vector([0.1, 0,0.1]));
}

function addCube() {
	// Manually add cube
	return new SolidObj(new Vector([0,0,0]), [
		new Vector([1,1,1]),
		new Vector([1,1,-1]),
		new Vector([1,-1,1]),
		new Vector([1,-1,-1]),
		new Vector([-1,1,1]),
		new Vector([-1,1,-1]),
		new Vector([-1,-1,1]),
		new Vector([-1,-1,-1])],
		[
			[0,1,3,2],
			[0,2,6,4],
			[0,1,5,4],
			[4,5,7,6],
			[1,3,7,5],
			[2,3,7,6]
		]
		);
}