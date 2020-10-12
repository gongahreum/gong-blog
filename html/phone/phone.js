
function init() {
	var scene = new THREE.Scene(); 
	var renderer = new THREE.WebGLRenderer(); 
	renderer.setClearColor(new THREE.Color(0x000000)); 
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.Enabled = true;

	// 축
	var axes = new THREE.AxesHelper(1000); // 20 : 라인의 사이즈
	scene.add(axes);

	// 평면
	var planeGeometry = new THREE.PlaneGeometry(100, 100); // width, height
	// var planeMaterial = new THREE.MeshBasicMaterial({color: 0xAAAAAA}); // 색상 설정하기
	var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, wireframe: true}); // 그림자 설정하기
	var plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.rotation.x = -0.5 * Math.PI;
	plane.position.set(0, 0, 0);
	plane.castShadow = true;
	scene.add(plane);


	// obj 로드
	var object;
	var objLoader = new THREE.OBJLoader().load( './images/galaxy-s20-ultra-low.obj', function ( obj ) {
		object = obj;
		object.children[0].material = new THREE.MeshStandardMaterial({
			map: (new THREE.TextureLoader).load('./images/texture/map-galaxy-s20-ultra-cosmic-gray.jpg'),
			envMap: (new THREE.TextureLoader).load('./images/texture/light-master-back.jpg'),
			envMapIntensity: .8,
			roughness: .25,
			metalness: .2,
			metalnessMap: (new THREE.TextureLoader).load('./images/texture/map-galaxy-s20-ultra-metallic.jpg'),
			side: THREE.FrontSide
		});
		object.children[1].material = new THREE.MeshPhysicalMaterial({
			color: "#000",
			transparent: !0,
			opacity: .1,
			envMap: (new THREE.TextureLoader).load('./images/texture/light-master-back.jpg'),
			envMapIntensity: 30,
			reflectivity: 1,
			roughness: 0,
			side: THREE.FrontSide
		})

		object.castShadow = true;
		object.receiveShadow = true;
		object.rotation.y = 0;
		object.position.set(0, 0, 0);
		object.scale.set(1, 1, 1);
		scene.add( object );

		objRotateY(new Date().getTime());
	});
	function objRotateY(t) {
		if(object.rotation.y < Math.PI * 2){
			requestAnimationFrame(objRotateY);
			object.rotation.y += 0.08;
		}
	}


	// 조명 (전체 조명)
	var ambientLight = new THREE.AmbientLight(0x4e4e4e);
	ambientLight.castShadow = true;
	scene.add(ambientLight);

	// 두곳의 광원을 가지는 빛
	var hemisphereLight = new THREE.HemisphereLight(0x820abf,0x16e89b);
	hemisphereLight.castShadow = true;
	hemisphereLight.position.set( 200, 200, 10 );
	// scene.add(hemisphereLight);

	// 조명 (전구)
	var pointLight = new THREE.PointLight(0xffffff, 1.5);
	pointLight.position.set( 50, 50, 200 );
	// scene.add(pointLight);

	// 조명
	// var spotLight = new THREE.SpotLight(0xffffff);
	// spotLight.angle = Math.PI/6;
	// spotLight.penumbra = 1;
	// spotLight.shadow.mapSize.width = 1024;
	// spotLight.shadow.mapSize.height = 1024;
	// spotLight.position.set(-25, 50, 120);
	// spotLight.castShadow = true; //그림자
	// scene.add(spotLight);
	// var spotLightHelper = new THREE.SpotLightHelper(spotLight);
	// scene.add(spotLightHelper);
	// var shadowCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
	// scene.add( shadowCameraHelper );



	// 조명 (태양같은 조명)
	var directionLight1 = new THREE.DirectionalLight( 0xFFFFFF );
	directionLight1.castShadow = true;
	directionLight1.position.set( 50, 50, 200 );
	scene.add( directionLight1 );



	// 카메라
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000); 
	// var camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 10, 10000 ); 
	camera.position.set(0, 0, 400); //x, y, z
	camera.lookAt(scene.position); // scene 중앙을 향해 바라봄
	document.getElementById("webgl-output").appendChild(renderer.domElement);
	renderer.render(scene, camera);
	// var cameraHelper = new THREE.CameraHelper( camera );
	// scene.add( cameraHelper );
	
	// 카메라 방향 제어 
	var orbitControls = initOrbitControls(camera, renderer);
	function initOrbitControls(camera, renderer) {
		var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
		orbitControls.zoomSpeed = 1.2;
		orbitControls.enablePan = false;
		orbitControls.enableRotate = false;
		orbitControls.enableZoom = true; 
		
		orbitControls.maxDistance = 500; 
		orbitControls.minDistance = 100; 

		return orbitControls;
	}

	var stats = initStats();
	function initStats() {
		var stats = new Stats();

		stats.setMode(0); // 0: fps, 1: ms

		// Align top-left
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';

		document.getElementById("Stats-output").appendChild(stats.domElement);

		return stats;
	}




	// 컨트롤 
	var gui = new dat.GUI();
	// var params = {
	// 	'light color': spotLight.color.getHex(),
	// 	intensity: spotLight.intensity,
	// 	distance: spotLight.distance,
	// 	angle: spotLight.angle,
	// 	penumbra: spotLight.penumbra,
	// 	decay: spotLight.decay
	// };
	// gui.addColor( params, 'light color' ).onChange( function ( val ) {
	// 	spotLight.color.setHex( val );
	// 	renderScene();
	// } );
	// gui.add( params, 'intensity', 0, 2 ).onChange( function ( val ) {
	// 	spotLight.intensity = val;
	// 	renderScene();
	// } );

	// gui.add( params, 'distance', 50, 200 ).onChange( function ( val ) {
	// 	spotLight.distance = val;
	// 	renderScene();
	// } );

	// gui.add( params, 'angle', 0, Math.PI / 3 ).onChange( function ( val ) {
	// 	spotLight.angle = val;
	// 	renderScene();
	// } );

	// gui.add( params, 'penumbra', 0, 1 ).onChange( function ( val ) {
	// 	spotLight.penumbra = val;
	// 	renderScene();
	// } );

	// gui.add( params, 'decay', 1, 2 ).onChange( function ( val ) {
	// 	spotLight.decay = val;
	// 	renderScene();
	// } );
	gui.open();



	// var clock = new THREE.Clock();
	renderScene();
	function renderScene() {
		stats.update();
		// orbitControls.update();
		// orbitControls.update(clock.getDelte());


		// scene.children[4].rotation.y += 0.01;
		// console.log(THREE.Math.radToDeg(scene.children[1].rotation.y));

		requestAnimationFrame(renderScene);
		renderer.render(scene, camera);
	}



	// 리사이즈
	window.addEventListener('resize', onResize, false);
	function onResize() {
		camera.aspect = window.innerWidth / window.innerHeight; 
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}


	var isDragging = false;
	var previousMousePosition = {
		x: 0,
		y: 0
	};
	$(renderer.domElement).on('mousedown', function(e) {
		isDragging = true;
	})
	.on('mousemove', function(e) {
		// console.log(e);
		var deltaMove = {
			x: e.offsetX-previousMousePosition.x,
			y: e.offsetY-previousMousePosition.y
		};

		if(isDragging) {
			object.rotation.x += (deltaMove.y * 0.5 * (Math.PI / 180));
			object.rotation.y += (deltaMove.x * 0.5 * (Math.PI / 180));
		}
		
		previousMousePosition = {
			x: e.offsetX,
			y: e.offsetY
		};
	});

	$(document).on('mouseup', function(e) {
		isDragging = false;
	});


function toRadians(angle) {
	return angle * (Math.PI / 180);
}

function toDegrees(angle) {
	return angle * (180 / Math.PI);
}

}
window.onload = init;















