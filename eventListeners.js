let mouseLocked = false;

function mouseDragged() {
	UI.mouseDragged();
	Drag.mouseDragged();
}

function mousePressed() {
	UI.mousePressed();
	Drag.mousePressed();
}

function mouseClicked() {
    UI.mouseClicked();
	Drag.mouseClicked();
	if(!mouseLocked) {
		requestPointerLock();
	} else {
		exitPointerLock();
	}
	mouseLocked = !mouseLocked;
}

function mouseReleased() {
    UI.mouseReleased();
	Drag.mouseReleased();
}

function mouseWheel(event) {
	UI.mouseWheel(event);
}

function keyPressed() {
  UI.keyPressed();
}

function keyTyped() {
	UI.keyTyped();
}

