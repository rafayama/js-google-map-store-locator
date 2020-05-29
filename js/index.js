var map;
var infoWindow;
var markers = [];
function initMap() {
    var losAngeles = {lat: 34.063380, lng: -118.358080};
    
    map = new google.maps.Map(document.getElementById('map'), {
      center: losAngeles,
      zoom: 11,
      mapTypeId: 'roadmap',
    });
    infoWindow = new google.maps.InfoWindow();
    searchStores();
    // displayStores();
    // showStoresMarkers();
    // setOnClickListener();
    // var marker = new google.maps.Marker({
    //     position: losAngeles,
    //     map: map,
    //     title: 'Los Angeles'
    //   });

}
function searchStores() {
    let foundStores = [];
    let zipCode = document.getElementById('zip-code-input').value;
    // console.log(zipCode);

    if(zipCode) {
      stores.forEach(function(store) {
        let postal = store.address.postalCode.substring(0,5);
        // console.log(postal);
        if(postal == zipCode) {
            foundStores.push(store);
        }
      });
    } else {
      // if there is no zip code input, display all stores from the store-data.js
      foundStores = stores;
    }
    
    // console.log(foundStores);
    clearLocations();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    setOnClickListener(foundStores);
}

function setOnClickListener() {
  // console.log(markers);
  let storeElements = document.querySelectorAll('.store');
  // console.log(storeElements);
  storeElements.forEach(function(elem, index){
    elem.addEventListener('click', function(){
      google.maps.event.trigger(markers[index], 'click');
    })
  })
}

function clearLocations() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;

}

function displayStores(stores) {
  var storesHTML = "";
  stores.forEach(function(store, index) {
    var address = store.addressLines;
    var phone = store.phoneNumber;
    // console.log(store);
    storesHTML += `
        <div class="store">
          <div class="store-bg">
            <div class="info">
                <div class="street">${address[0]}</div>
                <div class="city">${address[1]}</div>
                <div class="phone">${phone}</div>
            </div>
            <div class="order"><div class="number">${index+1}</div></div>
          </div>
        </div>
    `;
  });
  document.querySelector('.store-list').innerHTML = storesHTML;
}

function showStoresMarkers(stores) {
  var bounds = new google.maps.LatLngBounds();
  stores.forEach(function(store, index) {
    var latlng = new google.maps.LatLng(
      store.coordinates.latitude,
      store.coordinates.longitude);
    var name = store.name;
    var address = store.addressLines[0];
    var open = store.openStatusText;
    var phone = store.phoneNumber;
    var storeLat = store.coordinates.latitude;
    var storeLon = store.coordinates.longitude;
    bounds.extend(latlng);
    createMarker(latlng, name, address, index, open, phone, storeLat, storeLon);
  })
  map.fitBounds(bounds);
}

function createMarker(latlng, name, address, index, open, phone, storeLat, storeLon) {
  // var html = "<h4>" + name + "</h4><p class='open'>" + open + "</p><p><a href='https://www.google.com/maps/dir/Current+Location/" + storeLat + "," + storeLon + "' target='_blank'><i class='fas fa-paper-plane'></i>" + address + "</a></p><p><a href='tel:" + phone + "'><i class='fas fa-phone-alt'></i>" + phone + "</a></p>";
  var html = `
      <h4>${name}</h4>
      <p class='open'>${open}</p>
      <p>
        <a href='https://www.google.com/maps/dir/Current+Location/${storeLat},${storeLon}' target='_blank'>
          <i class='fas fa-paper-plane'></i>${address}
        </a>
      </p>
      <p>
        <a href='tel:${phone}'>
          <i class='fas fa-phone-alt'></i>${phone}
        </a>
      </p>`;
  
  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    // label: (index+1).toString()
    label: `${index+1}`
  });
  
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}
