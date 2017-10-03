geo on fire (gof) :fire: 
[![CircleCI](https://circleci.com/gh/Orlandster1998/geo-on-fire/tree/master.svg?style=shield&circle-token=c4bc8569819d11ed6f227e38c9507ddc55a4ddcd)](https://circleci.com/gh/Orlandster1998/geo-on-fire/tree/master)
===========
Geo on fire is an open source library to query location based data in Firebase. It follows a whole new principle of architecture, which makes it extremly fast and highly scaleable. With the right setup you are able to query millions of locations in just fractions of a second. You can learn more about the principle in the advanced usage guide. (not online so far, stay tuned)

In addition it offers you the possibility to listen to the queries in real time and recieve changes based on the event types you've specified. But that's not all. There's a feature which gives you the ability to priorize data and make the user expirience even better.

And by the way, there is not just one query method. You can choose between a radius based query (see dog match demo) and a boundaries based query. (see event map demo) 

And the best, you will automatically recieve the fetched entries. So there is no manual fetching needed.

## Quick links

 * [Download](#download)
 * [Getting started](#getting-started)
 * [Guides](#guides)
 * [Documentation](#examples)
 * [Demos](#demos)
 * [Contribution](#contributing)
 * [License](#license)


## Download
Currently there are two ways to download the library. But before you download the library make sure Firebase is already installed, since it's not a dependency of gof itslef.

```bash
$ npm install firebase --save
```

### npm
Download it from the npm repository the following way:
```bash
$ npm install gof --save
```
### bower
Or download it from bower the following way:
```bash
$ bower install gof --save
```

### CDN
In the future you will also be able to load the library directly from a CDN. Subscribe to the existing issue for updates.

## Getting started
Now let's get started. As you will see, the usage is very simple. As a first step you need to include the library in your HTML. (make sure Firebase is also included)

```html
<script src="{path_to}/gof.min.js"></script>
```

> Notice: NodeJS is not supported so far, but it will be added soon. Subscribe [here](https://github.com/Orlandster1998/geo-on-fire/issues/10) to get mentioned when the time is ready.

Well done! Before you're able to use gof you need to initialize your firebase project.

```js
var fb = firebase.initializeApp(config); // get 'config' from firebase
```

Now you are able to create a gof reference by simply doing the following.

```js
// the name of your database nodes e.g. events, hotels - is totally up to you
var name = 'entries'; 

// the firebase database ref - must be passed with the .ref()
var ref = fb.database().ref();

// creates a new geoOnFire instance
var gof = new geoOnFire(name, ref);
```

That's it! Now you are able to run gof operations. Go trough the guides to see how it works.

## Guides
### Basic usage
Basically all the user operations proivded by gof can be splitted in two cateogries. There are writing and there are reading operations. Make sure you always use the built-in methods the library provides to modify your geolocations data. Otherwise there's a chance that you get corrupt and invalid data.

#### writing data
 * [create entries](https://github.com/Orlandster1998/geo-on-fire/wiki/Basic-usage#create-entries)
 * [update entreis](https://github.com/Orlandster1998/geo-on-fire/wiki/Basic-usage#update-entries)
 * [delete entries](https://github.com/Orlandster1998/geo-on-fire/wiki/Basic-usage#delete-entries)
#### reading data (geolocation queries)
 * [query by radius](https://github.com/Orlandster1998/geo-on-fire/wiki/Basic-usage#query-by-radius)
 * [query by boundaries](https://github.com/Orlandster1998/geo-on-fire/wiki/Basic-usage#query-by-boundaries)
### Advanced usage
Here you can find some advanced concept to make the best out from gof.
 * [security rules (coming soon)]()
 * [performance optimization (coming soon)]()

## Documentation
 * [API Reference](https://orlandster1998.github.io/geo-on-fire/)
 * [Gof core principle (coming soon)](https://run.plnkr.co/plunks/xJgstAvXYcp0w7MbOOjm/)
 
## Demo's
Currently there are the two demo's available. These are just some basic implementations to give you an idea about how powerful gof is. They are far away from perfect.
 * [dog matching app (tinder clone - using radius query)](https://run.plnkr.co/plunks/AYaN8ABEDcMntgbJyLVW/)
 * [event map app (airbnb like map - using boundaries query)]()

Is there any gof using project you want to share with the world? Simply create an issue with the url and I do the rest.

## Contributions
I would love to see your contributions to the project. Till now I was not able to create some guidelines. If there are already any interests so far, we can communicate trough the issues.

## License
MIT
