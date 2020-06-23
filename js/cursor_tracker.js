// Global variables
var screenElement = document.querySelector("#game");
var cursorPos = {x: 0, y: 0};
var scene = new THREE.Scene();
var screenWidth = screenElement.clientWidth;
var screenHeight = screenElement.clientHeight;
var ratio = screenWidth / screenHeight;
var cursorPos = {x: 0, y: 0};

// Init
var camera = new THREE.PerspectiveCamera( 75, ratio, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( screenWidth, screenHeight);
screenElement.appendChild( renderer.domElement );
camera.position.z = 5;

// Set up Scene
var spriteMap = new THREE.TextureLoader().load( "assets/squid.png" );
var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap } );
var sprite = new THREE.Sprite( spriteMaterial );
scene.add( sprite );

// Squid movement
function onMouseMove(event) {
  
  // Update the cursos position
  event.preventDefault();
  let gameScreenPos = getPosition(screenElement);
	cursorPos.x = ((event.clientX - gameScreenPos.x) / screenWidth) * 2 - 1;
	cursorPos.y = - ((event.clientY - gameScreenPos.y) / screenHeight) * 2 + 1;

  // Make the squid follow the cursor
  var vector = new THREE.Vector3(cursorPos.x, cursorPos.y, 0.5);
	vector.unproject( camera );
	var dir = vector.sub( camera.position ).normalize();
	var distance = - camera.position.z / dir.z;
	var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
	sprite.position.copy(pos);
};
document.addEventListener('mousemove', onMouseMove, false);

function getPosition(el) {
  var xPosition = 0;
  var yPosition = 0;
 
  while (el) {
    xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
    yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
    el = el.offsetParent;
  }
  return {
    x: xPosition,
    y: yPosition
  };
}

function animate() {
	requestAnimationFrame( animate );
  renderer.render( scene, camera );
}
animate();