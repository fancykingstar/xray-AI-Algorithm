import * as THREE from 'three'

export default canvas => {

   var camera, scene, renderer, curobj;
   var ambientLight, pointLight;
   var material;
   var initialized = false;

   var theta = 0.0;
   var k = 7.0/6.0;

	init(canvas);
   window.onresize = resizeCanvas;
   resizeCanvas();	

	animate();

   function resizeCanvas() {        
     canvas.style.width = '100%';
     canvas.style.height= '100%';
        
     canvas.width  = window.innerWidth;
     canvas.height = window.innerHeight-80;
     camera.aspect = canvas.width/canvas.height;
	  camera.updateProjectionMatrix();
     renderer.setSize( canvas.width, canvas.height );
   }

   function init() {

      var aspect = canvas.width / canvas.height;
      var frustumSize = 1000;
      var object;

		camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );
      camera.position.z = 400;

      scene = new THREE.Scene();

		ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
		scene.add( ambientLight );

      pointLight = new THREE.PointLight( 0xffffff, 0.9 );
      camera.add( pointLight );

      scene.add( camera );
      material = new THREE.MeshBasicMaterial( { color: 0xfe7f9c } );

      curobj  = new THREE.Mesh( new THREE.SphereBufferGeometry( 10, 20, 10 ), material );
      var sx = Math.cos( k * theta ) * 300 * Math.cos( theta );
      var sy = Math.cos( k * theta ) * 300 * Math.sin( theta );
      curobj .position.set( sx, sy, 200 );
      scene.add( curobj  );

		var points = [];

		for ( var i = 0; i < 50; i ++ ) {
					points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * Math.sin( i * 0.1 ) * 15 + 50, ( i - 5 ) * 2 ) );
		}

		renderer = new THREE.WebGLRenderer( { canvas: canvas,  antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( canvas.width, canvas.height );
	}

   function clearScene() {
      var obj;
      for( var i=scene.children.length - 1; i >= 0  ; i-- ) {
         obj = scene.children[i];
         scene.remove(obj);
      }
   }

   function animate() {
      renderer.render( scene, camera );
      theta = theta + 0.02
      if ( theta > 12 * Math.PI ) {
         theta = 0.0
         clearScene()
         //requestAnimationFrame( animate );
      }
      var tmp = curobj.clone();
      tmp.position.x = Math.cos( k * theta ) * 300 * Math.cos( theta );
      tmp.position.y = Math.cos( k * theta ) * 300 * Math.sin( theta );
      scene.add(tmp);
      curobj = tmp;
      requestAnimationFrame( animate );
	}
}
