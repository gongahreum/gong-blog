
function init() {
	var stats = initStats();

	var scene = new THREE.Scene(); 
	var renderer = new THREE.WebGLRenderer(); 
	renderer.setClearColor(new THREE.Color(0x000000)); 
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.Enabled = true;

	// 축
	var axes = new THREE.AxesHelper(20); // 20 : 라인의 사이즈
	scene.add(axes);

	// 평면
	var planeGeometry = new THREE.PlaneGeometry(100, 100); // width, height
	// var planeMaterial = new THREE.MeshBasicMaterial({color: 0xAAAAAA}); // 색상 설정하기
	var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff}); // 그림자 설정하기
	var plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.rotation.x = -0.5 * Math.PI;
	plane.position.set(15, 0, 0);
	plane.castShadow = true;
	scene.add(plane);


	// 정육면체
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
	// var cubeMaterial = new THREE.MeshBasicMaterial({
	// 	color: 0xFF0000,
	// 	wireframe: true
	// });
    var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000, wireframe: true});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    cube.castShadow = true;
    scene.add(cube);

    // 구
    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
	// var sphereMaterial = new THREE.MeshBasicMaterial({
	// 	color: 0x7777FF,
	// 	wireframe: true
	// });
	var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff, wireframe: true}); 
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 4, 2);
    sphere.castShadow = true;
    scene.add(sphere);

    // 조명
	var spotLight = new THREE.SpotLight(0xFFFFFF);
	spotLight.position.set(-40, 40, -15);
	spotLight.castShadow = true; //그림자
	spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
	spotLight.shadow.camera.far = 130;
	spotLight.shadow.camera.near = 40;
	scene.add(spotLight);

	// 조명
	var ambientLight = new THREE.AmbientLight(0x3c3c3c);
	scene.add(ambientLight);


	// 컨트롤 
	var controls = new (function() {
		// default 값
		this.rotationSpeed = 0.02;
		this.bouncingSpeed = 0.04;
		// this.fogNear = 10;
		// this.fogFar = 300;
		this.numberOfObjects = scene.children.length;

		this.removeCube = function() {
			var allChildren = scene.children;
			var lastObject = allChildren[allChildren.length-1];
			if (lastObject instanceof THREE.Mesh) {
				scene.remove(lastObject);
				this.numberOfObjects = scene.children.length;
			}
		}
		this.addCube = function() {
			var newSize = Math.ceil(Math.random() * 10);
			var cubeGeometryAdd = new THREE.BoxGeometry(newSize, newSize, newSize);
			var cubeMaterialAdd = new THREE.MeshLambertMaterial({color: 0x22aa55, wireframe: true});
			var cubeAdd = new THREE.Mesh(cubeGeometryAdd, cubeMaterialAdd);
			var newPos = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ).normalize().multiplyScalar( 100 * Math.random() );
			cubeAdd.position.copy(newPos);
		    cubeAdd.castShadow = true;
		    scene.add(cubeAdd);
		    this.numberOfObjects = scene.children.length;
		}
		this.outputObjects = function() {
			console.log(scene.children);
		}
	})();
	var gui = new dat.GUI();

	var guiSpeed = gui.addFolder('Speed');
	guiSpeed.add(controls, "rotationSpeed", 0, 0.5);
	guiSpeed.add(controls, "bouncingSpeed", 0, 0.5);

	// gui.add(controls, "fogNear", 0, 100);
	// gui.add(controls, "fogFar", 0, 500);

	gui.add(controls, "addCube");
	gui.add(controls, "removeCube");
	gui.add(controls, "outputObjects");
	gui.add(controls, "numberOfObjects").listen();


	// 안개효과	
	// scene.fog = new THREE.Fog(0xffffff, 10, 300);
	// scene.fog = new THREE.FogExp2( 0xffffff, 0.01 );

	// overridematerial
	// scene.overrideMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

	// 애니메이션 
	var step = 0;
	renderScene();
	function renderScene() {
		stats.update();

		step += controls.bouncingSpeed;
		sphere.position.x = 20 + 10 * Math.cos(step);
		sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

		scene.traverse(function(obj) {
			if (obj instanceof THREE.Mesh && obj != plane ) {
				obj.rotation.x+=controls.rotationSpeed;
				obj.rotation.y+=controls.rotationSpeed;
				obj.rotation.z+=controls.rotationSpeed;
			}
		});

		// scene.fog = new THREE.Fog(0xffffff, controls.fogNear, controls.fogFar);

		requestAnimationFrame(renderScene);
		renderer.render(scene, camera);
	}


	// 카메라
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000); 
	camera.position.set(-30, 40, 30); //x, y, z
	camera.lookAt(scene.position); // scene 중앙을 향해 바라봄
	document.getElementById("webgl-output").appendChild(renderer.domElement);
	renderer.render(scene, camera);
	
	// 카메라 방향 제어 
	var orbitControls = initOrbitControls(camera, renderer);
	var clock = new THREE.Clock();
	function initOrbitControls(camera, renderer) {
		var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
		orbitControls.rotateSpeed = 1.0;
		orbitControls.zoomSpeed = 1.2;
		orbitControls.panSpeed = 0.8;
		orbitControls.noZoom = false;
		orbitControls.noPan = false;
		orbitControls.staticMoving = true;
		orbitControls.dynamicDampingFactor = 0.3;
		orbitControls.keys = [65, 83, 68];

		return orbitControls;
	}
	function render() {
		orbitControls.update(clock.getDelte());
	}
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


	// 리사이즈
	window.addEventListener('resize', onResize, false);
	function onResize() {
		camera.aspect = window.innerWidth / window.innerHeight; 
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

}
window.onload = init;















