import * as t from "./node_modules/three/build/three.module.js";
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';

var w         = window.innerWidth, 
    h         = window.innerHeight;
const scene   = new t.Scene();
const cam     = new t.PerspectiveCamera( 45, w / h, 1, 500 );

const rend    = new t.WebGLRenderer();
rend.setSize( w, h );
document.body.appendChild( rend.domElement );

/* GREEN CUBE */
// const geometry = new t.BoxGeometry( 1, 1, 1 );
// const material = new t.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new t.Mesh( geometry, material );
// scene.add( cube );
// 
/*
function animate() {
	requestAnimationFrame( animate );
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
	rend.render( scene, cam );
}
animate();
*/



/* DRAW LINES */
/*
cam.position.z = 100;
cam.lookAt( 0, 0, 0 );
const material = new t.LineBasicMaterial( { color: 0x0000ff } );
const points = [];
points.push( new t.Vector3( -10, 5, 5 ) );
points.push( new t.Vector3( 5, 10, 5 ) );
points.push( new t.Vector3( 10, 5, 5 ) );
const geometry = new t.BufferGeometry().setFromPoints( points );
const line = new t.Line( geometry, material );
scene.add( line );
rend.render( scene, cam );
function animate() {
	requestAnimationFrame( animate );
    line.rotation.x += 0.01;
    line.rotation.y += 0.01;
	rend.render( scene, cam );
}
animate();
*/

const loader = new GLTFLoader();

loader.load( 'AnyConv.com__Iphone seceond version finished.gltf', function ( gltf ) {
	scene.add( gltf.scene );
}, undefined, function ( error ) {
	console.error( error );
} );

