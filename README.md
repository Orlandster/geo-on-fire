geo on fire (gof) :fire: 
[![CircleCI](https://circleci.com/gh/Orlandster1998/geo-on-fire/tree/master.svg?style=shield&circle-token=c4bc8569819d11ed6f227e38c9507ddc55a4ddcd)](https://circleci.com/gh/Orlandster1998/geo-on-fire/tree/master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/411bd12fdbea4acc8cb7392edbdd0345)](https://www.codacy.com/app/orlando.wenzinger/geo-on-fire?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Orlandster1998/geo-on-fire&amp;utm_campaign=Badge_Grade)
[![Inline docs](http://inch-ci.org/github/Orlandster1998/geo-on-fire.svg?branch=master)](http://inch-ci.org/github/Orlandster1998/geo-on-fire)
[![npm version](https://badge.fury.io/js/gof.svg)](https://badge.fury.io/js/gof)
===========
Geo on fire is an open source library to query location based data in Firebase. It follows a whole new principle of architecture, which makes it extremly fast and highly scaleable. With the right setup you are able to query millions of locations in just fractions of a second. You can learn more about the principle in the advanced usage guide. (not online so far, stay tuned)

In addition it offers you the possibility to listen to the queries in real time and recieve changes based on the event types you've specified. But that's not all. There's a feature which gives you the ability to priorize data and make the user expirience even better.

And by the way, there is not just one query method. You can choose between a radius based query (see dog match demo) and a boundaries based query. (see event map demo) 

And the best, you will automatically recieve the fetched entries. So there is no manual fetching needed.

## Quick links

 * [Download](#download)
 * [Getting started](#getting-started)
 * [Guides](#guides)
 * [Documentation](#documentation)
 * [Demos](#demos)
 * [Contributions](#contributions)
 * [License](#license)


## Download
Currently there are three ways to download the library. But before you download the library make sure Firebase is already installed, since it's not a dependency of gof itslef.

```html
<!-- Firebase -->
<script src="https://www.gstatic.com/firebasejs/4.5.0/firebase.js"></script>
```
or install it from npm

```bash
$ npm install firebase --save
```

### CDN
If you are running gof in the browser you can include gof directly from the CDN like this:

```html
<!-- gof -->
<script src="https://cdn.jsdelivr.net/npm/gof@0.1.0/dist/gof.min.js"></script>
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
 * [update entries](https://github.com/Orlandster1998/geo-on-fire/wiki/Basic-usage#update-entries)
 * [delete entries](https://github.com/Orlandster1998/geo-on-fire/wiki/Basic-usage#delete-entries)
#### reading data (geolocation queries)
 * [query by radius](https://github.com/Orlandster1998/geo-on-fire/wiki/Basic-usage#query-by-radius)
 * [query by boundaries](https://github.com/Orlandster1998/geo-on-fire/wiki/Basic-usage#query-by-boundaries)
### Advanced usage
Here you can find some advanced concept to make the best out from gof.
 * [security rules](https://github.com/Orlandster1998/geo-on-fire/wiki/Security-rules)
 * [performance optimization]() (coming soon)

## Documentation
 * [API Reference](https://orlandster1998.github.io/geo-on-fire/)
 * [Gof core principle]() (coming soon)
 
## Demo's
Currently there are the two demo's available. These are just some basic implementations to give you an idea about how powerful gof is. They are far away from perfect.
 * [dog matching app](https://run.plnkr.co/plunks/AYaN8ABEDcMntgbJyLVW/) (tinder clone - using radius query)
 * [event map app](https://run.plnkr.co/plunks/xJgstAvXYcp0w7MbOOjm/) (airbnb like map - using boundaries query)

Is there any gof using project you want to share with the world? Simply create an issue with the url and I do the rest.

## Contributions
I would love to see your contributions to the project. Till now I was not able to create some guidelines. If there are already any interests so far, we can communicate trough the issues.

## What's next
Check out the [1.0.0 milestone](https://github.com/Orlandster1998/geo-on-fire/milestone/3) to see what's next. Generally I've got tons of ideas, but just a very few time to work on them. So if you are interested in contributing you are more than just welcome!

I'm also looking forward to migrate the library to other db services like mongoDB or pouchDB.

## Motivation
So basically the reason why I'm doing this, is because I've seen a lot of people struggling while buildung their json database structure. Espacially when it comes to more complex queries, firebase does not support you well enough. (by the way I'm so happy to see the new cloud firestore) This library should kind of like give you an idea.

## License
MIT
