(function() {
    document.addEventListener("DOMContentLoaded", function() {
        var config = {
            apiKey: "AIzaSyCw9tFan0QLYEbK9uOtO5tLCv8koy1PoV4",
            authDomain: "fir-nearby.firebaseapp.com",
            databaseURL: "https://fir-nearby.firebaseio.com",
            projectId: "fir-nearby",
            storageBucket: "fir-nearby.appspot.com",
            messagingSenderId: "633280542284"
          };
          firebase.initializeApp(config);
        
        window.nearby = new geoOnFire('entries', firebase.database().ref());    
        nearby.createEntry({ location: { lat: 33.8324, lng: -112.5584 }, name: 'yoho' })
          .then(data => {
            console.log('created');
          });

        /*nearby.getLocationsByBoundaries({ sw: { lat: 33.8224, lng: -112.5684 }, ne: { lat: 33.84924, lng: -112.5484 } }, 1,  5).on('value')
        .then(data => {
          const filtered = data.filter(val => val.val().name == 'orlandster')
          filtered.forEach((element) => {
            console.log(element.val())
          });
        });*/

        setTimeout(() => {
          nearby.createEntry({ location: { lat: 33.8324, lng: -112.5584 }, name: 'yoho' })
          .then(data => {
            console.log('created');
          });
        }, 3000)

        setTimeout(() => {
          nearby.createEntry({ location: { lat: 33.8324, lng: -112.5584 }, name: 'yoho' })
          .then(data => {
            console.log('created');
          });

        }, 7000)


        setTimeout(() => {
          nearby.updateEntryLocation('-Kv06PT7BdhC6cQbFR3v', { location: {lat: 35.8324, lng: 104.5584}, name: 'MisterONoh', minPrecision: 5, maxPrecision: 9}).then(
            () => {
              console.log('updated');
            }
          );

        }, 10000)


        setTimeout(() => {
          nearby.createEntry({ location: { lat: 33.8324, lng: -112.5584 }, name: 'yoho' })
          .then(data => {
            console.log('created');
          });

        }, 13000)

        setTimeout(() => {
          nearby.deleteEntry('-Kv06PT7BdhC6cQbFR3v').then(data => {
            console.log('deleted');
          })

        }, 13000)
        
          


        nearby.getLocationsByRadius({ lat: 33.8324, lng: -112.5584 }, 8.5, 1, 5).on('value')
        .then(data => {
          const filtered = data.filter(val => val.val().name == 'orlandster')
          filtered.forEach((element) => {
            console.log(element.val())
          });
        });

        /*nearby.updateEntryLocation('-KuVr8odlAWF4KHHmKAB', { location: {lat: 35.8324, lng: 104.5584}, name: 'MisterONoh', minPrecision: 5, maxPrecision: 9}).then(
          () => {
            console.log('updated');
          }
        );*/

       /* document.getElementById("btnn").addEventListener("click", nearby.deleteEntry('-KuPhUIBZKMouj5m1MM-').then(data => {
            console.log('deleted');
        }));*/
      });
 })();
