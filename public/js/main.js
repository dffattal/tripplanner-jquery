$(function initializeMap (){

  var fullstackAcademy = new google.maps.LatLng(40.705086, -74.009151);

  var styleArr = [{
    featureType: 'landscape',
    stylers: [{ saturation: -100 }, { lightness: 60 }]
  }, {
    featureType: 'road.local',
    stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
  }, {
    featureType: 'transit',
    stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
  }, {
    featureType: 'administrative.province',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'water',
    stylers: [{ visibility: 'on' }, { lightness: 30 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
  }];

  var mapCanvas = document.getElementById('map-canvas');

  var currentMap = new google.maps.Map(mapCanvas, {
    center: fullstackAcademy,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styleArr
  });

  var iconURLs = {
    hotel: '/images/lodging_0star.png',
    restaurant: '/images/restaurant.png',
    activity: '/images/star-3.png'
  };

  var arr = [];

  function drawMarker (type, coords,name) {
    var latLng = new google.maps.LatLng(coords[0], coords[1]);
    var iconURL = iconURLs[type];
    var marker = new google.maps.Marker({
      icon: iconURL,
      position: latLng
    });
    arr.push({name: name, marker: marker });
    marker.setMap(currentMap);
  }

  // drawMarker('hotel', [40.705137, -74.007624]);
  // drawMarker('restaurant', [40.705137, -74.013940]);
  // drawMarker('activity', [40.716291, -73.995315]);

var list = {
  1: {
    hotels: [],
    restaurants: [],
    activities: []
  }
}

for(var i=0;i<hotels.length;i++){
  $('#hotel-choices').append('<option>' + hotels[i].name + '</option>');
}

for(var i=0;i<restaurants.length;i++){
  $('#restaurant-choices').append('<option>' + restaurants[i].name + '</option>');
}

for(var i=0;i<activities.length;i++){
  $('#activity-choices').append('<option>' + activities[i].name + '</option>');
}

$('#hotel-btn').on('click',function(evt){
  var hotel = $('#hotel-choices').val();
  create('#create-hotel',hotel);

  for(var i=0;i<hotels.length;i++){
    if(hotels[i].name === hotel){
      drawMarker('hotel', hotels[i].place.location, hotel);
      break;
    }
  }

  let currDay = $('.current-day')[0].textContent
  if (list[currDay]) {
    if (list[currDay].hotels) {
      list[currDay].hotels.push(hotel)
    } else {
      list[currDay].hotels = [hotel]
    }
  } else {
    list[currDay] = {}
    list[currDay].hotels = [hotel]
  }
})

$('#rest-btn').on('click',function(evt){
  var rest = $('#restaurant-choices').val();
  create('#create-rest',rest);

  for(var i=0;i<restaurants.length;i++){
    if(restaurants[i].name === rest){
      drawMarker('restaurant', restaurants[i].place.location, rest)
      break;
    }
  }

  let currDay = $('.current-day')[0].textContent
  if (list[currDay]) {
    if (list[currDay].restaurants) {
      list[currDay].restaurants.push(rest)
    } else {
      list[currDay].restaurants = [rest]
    }
  } else {
    list[currDay] = {}
    list[currDay].restaurants = [rest]
  }
})

$('#act-btn').on('click',function(evt){
  var act = $('#activity-choices').val();
  create('#create-act',act);

  for(var i=0;i<activities.length;i++){
    if(activities[i].name === act){
      drawMarker('activity', activities[i].place.location, act)
      break;
    }
  }

  let currDay = $('.current-day')[0].textContent
  if (list[currDay]) {
    if (list[currDay].activities) {
      list[currDay].activities.push(act)
    } else {
      list[currDay].activities = [act]
    }
  } else {
    list[currDay] = {}
    list[currDay].activities = [act]
  }
})

$('#itinerary').on('click', '.remove', function(evt) {
  let name = this.parentNode.firstChild.textContent
  for(var i=0;i<arr.length;i++){
    if(arr[i].name === name){
      arr[i].marker.setMap(null);
      arr.splice(i,1);
    }
  }

  this.parentNode.remove()
})

$('#day-add').on('click', function() {
  var newDayNum = Number($('#day-add').prev()[0].textContent) + 1
  $('#day-add').before('<button class="btn btn-circle day-num day-btn">' + newDayNum + '</button>')
})

$('.day-buttons').on('click', '.day-num', function(evt) {
  $('.current-day').removeClass('current-day')
  $(this).addClass('current-day')
  showList(this.textContent)
})


function showList(day) {
  for (var k = 0; k < arr.length; k++) {
    arr[k].marker.setMap(null)
  }
  $('#create-hotel').children().remove()
  $('#create-rest').children().remove()
  $('#create-act').children().remove()
  for(var key in list[day]){
    let data = list[day][key];
    for(var j=0; j<data.length; j++){
      if (key === 'hotels') {
        var keyId = '#create-hotel'
      }
      else if (key === 'restaurants') {
        var keyId = '#create-rest'
      } else {
        var keyId = '#create-act'
      }
      create(keyId, data[j])
      for (var l = 0; l < arr.length; l++) {
        if (data[j] === arr[l].name) {
          arr[l].marker.setMap(currentMap)
          break;
        }
      }
    }
  }
}

$('.btn-xs').on('click', function() {
  var day = $('.current-day')[0].textContent
  var currentDay = $('.current-day')
  currentDay.prev().addClass('current-day')
  var dayChanger = Number(day) - 1
  currentDay.nextAll().textContent = dayChanger++
  currentDay.remove()
  showList(Number(day) - 1)
  var dayList = Object.keys(list)
  for (var i = Number(day); i < dayList.length - 1; i++) {
    console.log(list[i])
    list[i] = list[i+1]
  }
  list[dayList.length] = null


})

function create(classVal, val){
  $(classVal).append('<div class="itinerary-item"><span class="title">'+val+'</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>')
}

});
