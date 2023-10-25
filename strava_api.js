const auth_link = "https://www.strava.com/oauth/token";

function getActivites(res) {
  const activities_link = `https://www.strava.com/api/v3/athlete/activities?access_token=${res.access_token}`;
  fetch(activities_link)
    .then((res) => res.json())
    .then(function (data) {
      // console.log(data)
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = "0" + dd;
      }

      if (mm < 10) {
        mm = "0" + mm;
      }

      today = yyyy + "-" + mm + "-" + dd;
      console.log(today);
      console.log(data[0].start_date.slice(0, 10));

      //   if (today===data[0].start_date.slice(0,10)){
      //     document.getElementById('run').innerHTML = `user ran ${data[0].distance} kilometres today`
      //   }
      //   else {
      //     document.getElementById('run').innerHTML = `user has not run today!!`;
      //   }

      var map = L.map("map").setView([59.912, 10.635], 11);
      //   L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      //     maxZoom: 19,
      //     attribution: "© OpenStreetMap",
      //   }).addTo(map);

      //       L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
      // 	maxZoom: 20,
      // 	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
      // }).addTo(map);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 20,
        }
      ).addTo(map);

      var run_color = "red";
      var weight = 5;

      console.log(data.length);

      for (var x = 0; x < data.length; x++) {
        // console.log(data[x].map.summary_polyline);

        var act_id = data[x];
        console.log(act_id);

        var coordinates = L.Polyline.fromEncoded(
          data[x].map.summary_polyline
        ).getLatLngs();
        console.log(coordinates[0]);

        if (x === 0) {
          weight = 7;
          run_color = "red";
        } else if (x === 1) {
          weight = 6;
          run_color = "purple";
        } else {
          weight = 3;
          run_color = "green";
        }

        L.polyline(coordinates, {
          color: run_color,
          weight: weight,
          opacity: 0.5,
          lineJoin: "round",
        }).addTo(map);

        var startIcon = L.icon({
          iconUrl: "flag.png",
          // shadowUrl: 'leaf-shadow.png',

          iconSize: [38, 50], // size of the icon
        //   shadowSize: [50, 64], // size of the shadow
          iconAnchor: [5, 50], // point of the icon which will correspond to marker's location
          // shadowAnchor: [4, 62],  // the same for the shadow
        //   popupAnchor: [-50, -100], // point from which the popup should open relative to the iconAnchor
        });

        L.marker([coordinates[0]["lat"], coordinates[0]["lng"]], {
          icon: startIcon,
        }).addTo(map);
      }
    });
}

function reAuthorize() {
  fetch(auth_link, {
    method: "post",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      client_id: "112034",
      client_secret: "ee0f304fd3e16a1c5824f481e0831a12726bcd95",
      refresh_token: "879c97a29d250b71e15c8a60fbb84a8c7a645fc7",
      grant_type: "refresh_token",
    }),
  })
    .then((res) => res.json())
    .then((res) => getActivites(res));
}

reAuthorize();
