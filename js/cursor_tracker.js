// Global variables
var screenElement = document.querySelector("#game");
var cursorPos = new THREE.Vector2(0,0);
var pastPos = new THREE.Vector2(0,0);
var scene = new THREE.Scene();
var screenWidth = screenElement.clientWidth;
var screenHeight = screenElement.clientHeight;
var ratio = screenWidth / screenHeight;
var clock = new THREE.Clock();
var deltaTime = 1 / 30;

// Init
var camera = new THREE.PerspectiveCamera( 75, ratio, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({ alpha: true });;
renderer.setSize( screenWidth, screenHeight);
screenElement.appendChild( renderer.domElement );
camera.position.z = 5;

// Set up Scene
var squidTexture = new THREE.TextureLoader().load( "assets/squid.png" );
var squidMaterial = new THREE.SpriteMaterial( { map: squidTexture } );
var squidSprite = new THREE.Sprite( squidMaterial );
squidSprite.scale.set(1.2,1.2,1.2);
scene.add( squidSprite );

/***
 *      __  __                           _   
 *     |  \/  |_____ _____ _ __  ___ _ _| |_ 
 *     | |\/| / _ \ V / -_) '  \/ -_) ' \  _|
 *     |_|  |_\___/\_/\___|_|_|_\___|_||_\__|
 *                                           
 */
function updateSquidPosition(event)
 {
  // Store the last position
  pastPos.copy(cursorPos);

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
  squidSprite.position.copy(pos);
  
};
document.addEventListener('mousemove', updateSquidPosition, false);

/*
  Get the position on the screen where a DOM element starts
  Got from https://www.kirupa.com/html5/getting_mouse_click_position.htm
*/
function getPosition(el) {
  var xPosition = 0;
  var yPosition = 0;
 
  while (el) {
    if (el.tagName == "BODY") {
      // deal with browser quirks with body/window/document and page scroll
      var xScrollPos = el.scrollLeft || document.documentElement.scrollLeft;
      var yScrollPos = el.scrollTop || document.documentElement.scrollTop;
 
      xPosition += (el.offsetLeft - xScrollPos + el.clientLeft);
      yPosition += (el.offsetTop - yScrollPos + el.clientTop);
    } else {
      xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
    }
    el = el.offsetParent;
  }
  return {
    x: xPosition,
    y: yPosition
  };
}

/***
 *      ___     _        _   _          
 *     | _ \___| |_ __ _| |_(_)___ _ _  
 *     |   / _ \  _/ _` |  _| / _ \ ' \ 
 *     |_|_\___/\__\__,_|\__|_\___/_||_|
 *                                      
 */
function rotateSprite(sprite, direction)
{
  let angleFromTop = direction.angle() - THREE.MathUtils.degToRad(90);
  sprite.material.rotation = angleFromTop;
}

function log (string)
{
  let logEl = document.querySelector("#log");
  logEl.innerHTML = string;
}

/*
          ___      _    _    _        
        | _ )_  _| |__| |__| |___ ___
        | _ \ || | '_ \ '_ \ / -_|_-<
        |___/\_,_|_.__/_.__/_\___/__/
                                      
*/
var bubbleTexture = new THREE.TextureLoader().load( "assets/bubble.png" );
var bubbleMaterials = [];
var bubbleSprites = [];
var nBubbles = 8;
var bubbleVel = 0.7;
for (let x = 0;x < nBubbles; x++)
{
  let newMaterial = new THREE.SpriteMaterial( { 
    map: bubbleTexture,
    transparent: true,
    opacity: 1
   } );
  bubbleMaterials.push(newMaterial);

  let newSprite = new THREE.Sprite(newMaterial);
  newSprite.scale.set(0.2,0.2,0.2);
  newSprite.visible = false;
  bubbleSprites.push(newSprite);
  scene.add(newSprite);
}

var bubbleTimeToAppear = 0.1; // every 0.3s a buble appears
var bubbleDuration = bubbleTimeToAppear * nBubbles;
var bubbleTimer = 0, bubbleIndex = 0;

function renderBubbles() 
{
  bubbleTimer += deltaTime;

  if (bubbleTimer >= bubbleTimeToAppear)
  {
    let bubble = bubbleSprites[bubbleIndex];
    bubble.visible = true;
    bubble.position.copy(squidSprite.position);
    bubble.position.z = -0.01;

    let material = bubbleMaterials[bubbleIndex];
    material.opacity = 1;

    bubbleIndex++;
    bubbleIndex %= nBubbles;

    bubbleTimer = 0;
  }

  bubbleSprites.forEach(function (bubble){
    bubble.position.y += bubbleVel * deltaTime;
  })

  bubbleMaterials.forEach(function (material) {
    material.opacity *= 0.98;
  })
}

function animate() {
	requestAnimationFrame( animate );
  renderer.render( scene, camera );
  deltaTime = clock.getDelta();

  let dir = new THREE.Vector2(0,0);
  dir.subVectors(cursorPos, pastPos);
  if (dir.length() > 0.011)
  {
    rotateSprite(squidSprite, dir);
  }

  renderBubbles();
}
animate();

window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize()
{
  screenWidth = screenElement.clientWidth;
  screenHeight = screenElement.clientHeight;
  ratio = screenWidth / screenHeight;
  camera.aspect = ratio;
  camera.updateProjectionMatrix();

  renderer.setSize( screenWidth, screenHeight );

}