Ext.application({
    name: 'app',

    extend: 'app.Application',

    requires: [
        'app.view.main.Main', 'Ext.Window', 'Ext.Panel' 
    ],

    launch: function () {
      Ext.Ajax.request({                                         
        headers: {
          'Authorization': 'Basic aXZhbl9yZXNzZXI6VTJGc2RHVmtYMTlBbmd3U3E4M1JhTFVoY01EOFhJV0lSOU8wRlEzb1UwUT0='},                              
        url: 'http://rastreo.resser.com/api/Messages?vehicleId=53614&startDate=07-06-2017%2000%3A00%20-5&endDate=07-06-2017%2015%3A23%20-5&lite=true',                                         
        method: 'GET',                                         
        success: function(response, opts) {
          var la, lo, coor;
          var coordenadas = [];
          var resp = response.responseText;
          var marcadores = Ext.encode(response.responseText);
          
          Ext.define('Item', {
               extend: 'Ext.data.Model',
               fields: [
                 {name: 'mId', type: 'int'},
                 {name: 'Id',  type: 'int'},
                 {name: 'da',  type: 'string'},
                 {name: 'ti',  type: 'string'},
                 {name: 'la',  type: 'float'},
                 {name: 'lo',  type: 'float'},
                 {name: 'sp',  type: 'float'},
                 {name: 'of',  type: 'int'}
               ]
           });
          

           var myStore = Ext.create('Ext.data.Store', {
               model: 'Item',
               proxy: {
                   type: 'rest',
                   headers: {
                    'Authorization': 'Basic aXZhbl9yZXNzZXI6VTJGc2RHVmtYMTlBbmd3U3E4M1JhTFVoY01EOFhJV0lSOU8wRlEzb1UwUT0='},
                   url: 'http://rastreo.resser.com/api/Messages?vehicleId=53614&startDate=07-06-2017%2000%3A00%20-5&endDate=07-06-2017%2015%3A23%20-5&lite=true',
                   actionMethods: {
                     read: 'GET'
                   },
                   reader: /*new Ext.data.JsonReader(*/{
                      rootProperty: 'items',
                      fields:['la','lo']                
                   }
               },
               autoLoad: true
           });

          //console.log(resp.length);
          //Ext.Msg.alert("Success", response.status);
          //Ext.Msg.alert("respuesta", marcadores);
          //Ext.Msg.alert("Response", response.responseText);
          var mainPanel = Ext.create('Ext.panel.Panel', {
            renderTo: Ext.getBody(),
            width: 1500,
            height: 800,
            id: 'panelPrincipal',
            title: 'Mapa',
            items: [{
              xtype: 'panel',
              id: 'mainMapPanel',
              width: 1500,
              height: 780
            }]
          });
          
          var map = new google.maps.Map(document.getElementById('mainMapPanel'), {
            center: new google.maps.LatLng(19.834098, -98.937095),
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
          });
          
          
          myStore.load({
            callback: function(records){
             
              for(var i = 0; i < records.length; i++){
                //var lat, lon
                
                  //console.log(records[i].data.la+" "+ records[i].data.lo);
                  la = records[i].data.la;
                  lo = records[i].data.lo;
                  coor = new google.maps.LatLng(la, lo);
                  var lat, lng;
                  var coorde = {lat: la, lng:lo}
                  coordenadas.push(coorde); 
                  //polyline(coordenadas);
                if(i==0){
                markerInicio(la, lo);
                }
                if(i==records.length-1){
                  markerFin(la, lo);
                }
                  
              }
              
              polyline(coordenadas);
              
              
              function markerInicio(la, lo){
                new google.maps.Marker({
                    position: new google.maps.LatLng(la,lo),
                    title: "Ruta",
                    map: map 
                });
              }
              
              function polyline(coordenadas){
                console.log(coordenadas);
                var ruta = new google.maps.Polyline({
                  path: coordenadas,
                  geodesic: true,
                  strokeColor: '#FF0000',
                  strokeOpacity: 1.0,
                  strokeWeight: 2
                });
                ruta.setMap(map);
              }
              
              function markerFin(la, lo){
                new google.maps.Marker({
                    position: new google.maps.LatLng(la,lo),
                    title: "Ruta",
                    icon: "pinkball.png",
                    map: map 
                });
              }
            }
          });
          
        },                                           
        failure: function(response, opts) {                                              
          Ext.Msg.alert("Failure", response.status);                                           
        }                                        
      }); 
    }
});

