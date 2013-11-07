'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing');

// Create all of the dummy things if Thing is empty
Thing.find(function (err, things) {
  if (things.length === 0) {
    console.log('populating database');
		Thing.create(
			{ name : 'HTML5 Boilerplate', awesomeness: 10},
			{ name : 'AngularJS', awesomeness: 10},
			{ name : 'Karma', awesomeness: 10},
			{ name : 'Express', awesomeness: 10},
			{ name : 'Mongoose', awesomeness: 10}, function(err) {
				console.log('finished populating');
			}
		);
	}
});
