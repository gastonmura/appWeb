(function () {
  'use strict';

  angular
    .module('emoapps')
    .controller('EmoappsMapController', EmoappsMapController);
    
  EmoappsMapController.$inject = ['$scope','$state', '$window','$resource', 'Authentication'];
  
  function EmoappsMapController($scope,$state, $window, $resource,Authentication){

  	// TODO scroll en el link de la foto
  	// TODO controller de configuracion de:
  	// 		 - cant tweets
  	//		 - claves de google drive 
  	//		 - cant fotos a guardar en g drive
  	// TODO controller para ver lo que guarde en mongo db

    init();

	// google map
    function init() {

     var uluru = {lat: -43.253333, lng: -65.309444};
     var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: uluru
      });

      var marker = new google.maps.Marker({
        position: uluru,
        map: map
      });

      google.maps.event.addListener(map, 'click', function(event) {
        obtenerTweets(event.latLng.lat(),event.latLng.lng());
      });
    }

    function obtenerTweets( latitud, longitud){	

      // pongo loading	
      document.getElementById('detalleBusqueda').innerHTML="Cargando Tweets...";
      document.getElementById('spinnerLoading').style.visibility = "visible"; 
      document.getElementById('listaTw').style.visibility = "hidden"; 
      document.getElementById('imgDrive').style.visibility = "hidden"; 
      document.getElementById('detalleBusqueda').style.height ="auto";
      

      var t = $resource('/api/obtenerTweets/:lat/:long',{ lat:latitud,long:longitud }).get(function(){
       
        // saco loading	
        var detalles =	'<h4 style="font-weight: bold; text-decoration: underline;">Detalles</h4>'+
        				'<ul>'+
						'<li><b>Coordenadas:</b> '+t.latitud+', '+t.longitud+', radio '+t.radio+'.</li>'+
						'<li><b>Tweets:</b> <span class="badge">'+t.nTweets+'</span></li>'+
						'<li><b>Tweets Positivos:</b> <span class="label label-success label-pill">'+t.tweetsPositivos+'</span></li>'+
						'<li><b>Tweets Negativos:</b> <span class="label label-danger label-pill">'+t.tweetsNegativos+'</span></li>'+
						'<li><b>Tweets Neutros:</b> <span class="label label-info label-pill">'+t.tweetsNeutros+'</span></li>'+
						'<li><b>Terminos Resumen:</b> [ '+t.terminosResumen.join(', ')+' ]</li>'+
						'</ul>';

        document.getElementById('detalleBusqueda').innerHTML = detalles;
      	document.getElementById('spinnerLoading').style.visibility = "hidden"; 
      	document.getElementById('listaTw').style.visibility = "visible"; 
      	document.getElementById('imgDrive').style.visibility = "visible"; 

      	$scope.items = t;
        //console.log(t);  
      });
    }

  }

}());
