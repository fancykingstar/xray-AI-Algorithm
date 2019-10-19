import * as THREE from 'three'
import * as THREEEXT from "./threeext"

export default canvas => {

   var camera, scene, renderer ;
   var material;
   var object, cube, nurb;

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

      //var aspect = canvas.width / canvas.height;

      //camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );
      camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 2000 );
		camera.position.y = 400;

      scene = new THREE.Scene();
		var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
		scene.add( ambientLight );
      var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
      camera.add( pointLight );
      scene.add( camera );

      var map = new THREE.TextureLoader().load( '/cxr.png' )
		map.wrapS = map.wrapT = THREE.RepeatWrapping;
		map.anisotropy = 16;

		material = new THREE.MeshPhongMaterial( { map: map, side: THREE.DoubleSide } );
      var geometry ;

		geometry = new THREE.ParametricBufferGeometry( THREEEXT.ParametricGeometries.plane( 400, 400 ), 10, 10 );
		geometry.center();

		object = new THREE.Mesh( geometry, material );
		object.position.set( - 200, 0, 200 );
		scene.add( object );

      var cube_geom = new THREE.BoxBufferGeometry( 100, 100, 100 );
		var cube_mat = new THREE.MeshBasicMaterial( { map: map } );
		cube = new THREE.Mesh( cube_geom, cube_mat );
		cube.position.set( 300, 0, 200 );
		scene.add( cube );

      // NURBS surface
      var nsControlPoints = [
         [
            new THREE.Vector4( - 100, - 100, 50, 1 ),
            new THREE.Vector4( - 100, - 50, - 100, 1 ),
            new THREE.Vector4( - 100, 50, 125, 1 ),
            new THREE.Vector4( - 100, 100, - 50, 1 )
         ],
         [
            new THREE.Vector4( 0, - 100, 0, 1 ),
            new THREE.Vector4( 0, - 50, - 50, 5 ),
            new THREE.Vector4( 0, 50, 75, 5 ),
            new THREE.Vector4( 0, 100, 0, 1 )
         ],
         [
            new THREE.Vector4( 100, - 100, - 50, 1 ),
            new THREE.Vector4( 100, - 50, 100, 1 ),
            new THREE.Vector4( 100, 50, - 75, 1 ),
            new THREE.Vector4( 100, 50, 50, 1 )
         ]
      ];
      var degree1 = 2;
      var degree2 = 3;
      var knots1 = [ 0, 0, 0, 1, 1, 1 ];
      var knots2 = [ 0, 0, 0, 0, 1, 1, 1, 1 ];
      var nurbsSurface = new THREEEXT.NURBSSurface( degree1, degree2, knots1, knots2, nsControlPoints );

      function getSurfacePoint( u, v, target ) {
         return nurbsSurface.getPoint( u, v, target );
      }

      var map1 = new THREE.TextureLoader().load( '/edisonpowered.png' )
		map1.wrapS = map1.wrapT = THREE.RepeatWrapping;
		map1.anisotropy = 16;

		var nurb_geom = new THREE.ParametricBufferGeometry( getSurfacePoint, 20, 20 );
		var nurb_mat = new THREE.MeshLambertMaterial( { map: map1, side: THREE.DoubleSide } );
		nurb = new THREE.Mesh( nurb_geom, nurb_mat );
		nurb.position.set( 500, 100, 0 );
		nurb.scale.multiplyScalar( 1 );
		scene.add( nurb );

		renderer = new THREE.WebGLRenderer( { canvas: canvas,  antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( canvas.width, canvas.height );
	}


   function animate() {
      var timer = Date.now() * 0.0001;

		camera.position.x = Math.cos( timer ) * 800;
		camera.position.z = Math.sin( timer ) * 800;

		camera.lookAt( scene.position );
	   if ( object.isMesh === true ) {
				object.rotation.x = timer * 5;
				object.rotation.y = timer * 2.5;
	   }
	   if ( cube.isMesh === true ) {
				cube.rotation.x = timer * 5;
				cube.rotation.y = timer * 10;
	   }
	   if ( nurb.isMesh === true ) {
				nurb.rotation.x = timer * 4;
				nurb.rotation.y = timer * 8;
	   }

      renderer.render( scene, camera );
      requestAnimationFrame( animate );
	}
}
