
import {useEffect} from 'react'
import * as THREE from 'three';
import { PlaneGeometry } from 'three';
import Stats from './Stats.js'

export default function Shader1(){

const vertexShader = `
precision mediump float;
varying vec2 vUv;

void main(){
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

const fragmentShader = `
	precision mediump float;
	uniform float u_time;
	uniform vec2 u_resolution;
	uniform vec2 u_mouse;
	uniform sampler2D u_texture;
	varying vec2 vUv;

	float random (in vec2 st) {
		return fract(sin(dot(st.xy,
							 vec2(12.9898,78.233)))
					* 43758.5453123);
	}
	
	// Value noise by Inigo Quilez - iq/2013
	// https://www.shadertoy.com/view/lsf3WH
	float noise(vec2 st) {
		vec2 i = floor(st);
		vec2 f = fract(st);
		vec2 u = f*f*(3.0-2.0*f);
		return mix( mix( random( i + vec2(0.0,0.0) ),
						 random( i + vec2(1.0,0.0) ), u.x),
					mix( random( i + vec2(0.0,1.0) ),
						 random( i + vec2(1.0,1.0) ), u.x), u.y);
	}

	vec2 displace( vec2 uv, in float offset )
	{
    uv.x += 0.1*sin( u_time + 2.0*uv.y ) ;
    uv.y += 0.1*sin( u_time + 2.0*uv.x ) ;
    
    float a = noise(uv*1.5+sin(0.1*u_time))*6.2831;
    a += offset;
    return vec2( cos(a), sin(a) );
	}

	void main() {
	
	//vertex coordinates from vertex shader
	vec2 uv = vUv;

	float offset = u_time + gl_FragCoord.x/u_resolution.y;
    vec2 displacement = displace(uv*10., offset*3.0 );
    uv += 0.015*displacement;

    //import texture and give it displacement effect
	vec4 texture = texture2D(u_texture, uv);

	//output result
	gl_FragColor = vec4(texture);
}
`

useEffect(() => {

	//GET PERFORMACE STATS, COMMENT TO HIDE
	(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()

	// (FRONT-END) CHOOSE SHADER CONTAINER 
	let container = document.getElementById('webgl-canvas');
	const video = document.getElementById( 'video' );

	//DEFINE SIZE
	let sizes = {
		width: window.innerWidth,
		height: window.innerHeight
	}

	//MOUSE POSITIONS
	let mouseX;
	let mouseY;

    //CREATE SHADER CANVAS AND APPEND TO CHOSEN CONTAINER
	const renderer = new THREE.WebGLRenderer(); 
	renderer.setPixelRatio(window.devicePixelRatio); 	
	renderer.setSize(sizes.width, sizes.height); 
	container.appendChild(renderer.domElement); 

	// CREATE SCENE
	const scene = new THREE.Scene();
	
	// CREATE GEOMETRY
	const geometry = new PlaneGeometry( 2, 2, 1);

	// CREATE CUSTOM MATERIAL
	var texture = new THREE.VideoTexture(video);
	const material = new THREE.ShaderMaterial({
		uniforms: {
			u_time: {value: 1.0 },
			u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
			u_mouse: {value: new THREE.Vector2(0, 0)},
			u_texture: {type:'t', value:texture}
		},
		vertexShader: vertexShader,
		fragmentShader: fragmentShader
	});
	
	// CREATE MESH
	const mesh = new THREE.Mesh( geometry, material );
	scene.add(mesh);

	// CREATE CAMERA
	const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 1000 );
	scene.add(camera)

	// FOR VALUES THAT UPDATE EACH FRAME
	function render() {
		renderer.render(scene, camera);
		//SHADER UNIFORMS
		material.uniforms.u_time.value += 0.04;
		material.uniforms.u_mouse.value = new THREE.Vector2(mouseX,mouseY);
	}

	function animate() {
		requestAnimationFrame(animate);
		render();
	}
	animate();

	// EVENT LISTENERS
	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener('mousemove', mousePosition, false);

	// GET MOUSE POSITIONS
	function mousePosition(e){
		mouseX = e.pageX;
		mouseY = e.pageY;
	}

	// WINDOW RESIZE
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
	});

return(
   null
)
}



