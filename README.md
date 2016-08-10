# jQuery Seat Charts

### jQuery Seat Charts (JSC) is a full-blown seat map library. It will generate an accessible map, legend, handle mouse & keyboard events and finally give you powerful selectors to control your map.

[Simple demo map](http://jsc.mm-lamp.com/)

## Example:

Basic setup:

	$(document).ready(function() {
	
		var sc = $('#seat-map').seatCharts({
			map: [
				'aaaaaaaaaaaa',
				'aaaaaaaaaaaa',
				'bbbbbbbbbb__',
				'bbbbbbbbbb__',
				'bbbbbbbbbbbb',
				'cccccccccccc'
			],
			seats: {
				a: {
					price   : 99.99,
					classes : 'front-seat' //your custom CSS class
				}
			
			},
			click: function () {
				if (this.status() == 'available') {
					//do some stuff, i.e. add to the cart
					return 'selected';
				} else if (this.status() == 'selected') {
					//seat has been vacated
					return 'available';
				} else if (this.status() == 'unavailable') {
					//seat has been already booked
					return 'unavailable';
				} else {
					return this.style();
				}
			}
		});
	
		//Make all available 'c' seats unavailable
		sc.find('c.available').status('unavailable');
		
		/*
		Get seats with ids 2_6, 1_7 (more on ids later on),
		put them in a jQuery set and change some css
		*/
		sc.get(['2_6', '1_7']).node().css({
			color: '#ffcfcf'
		});
		
		console.log('Seat 1_2 costs ' + sc.get('1_2').data().price + ' and is currently ' + sc.status('1_2'));
	
	});


## Basics:

Building maps is fairly easy with jQuery Seat Charts, you can literally pass an array of strings which represents succeeding rows. Let's take a look at a theatre example:

	//Seat map definition
	[
		'aaaaaa__DDDDD',
		'aaaaaa__aaaaa',
		'aaaaaa__aaaaa',
		'bbbbbb__bbbbb',
		'bbbbbb__bbbbb',
		'bbbbbb__bbbbb',
		'ccccccccccccc'
	]

Each single character represents a different type of seat and you have a freedom of choosing anyone but underscore **_**. Underscore is used to indicate that there shouldn't be any seat at a certain place. In our example I chose **a** seats to be the closest to the screen, **D** meant for disabled and **b** and **c** as just plain seats. I also built a corridor in the middle of our theatre, so people can conviniently reach their seats.

Your chosen characters can carry a hash of data which is a great way to pass crucial seat details such as price or a description that you want to show on hover.
 
	seats: {
		a: {
			price       : 24.55,
			description : 'Fair priced seat!'
		}
	}

Once you build your map and define seats, you can start implementing the booking magic.

## Booking Magic

JSC combines keyboard and mouse events to offer a unified API. There're three types of events which JSC can produce:

* **click**: click or spacebar
* **focus**: mouse or arrows
* **blur**: mouse or arrows


All three events have their default handlers but you're more than likely to overwrite at least one of them. JSC flexible API let you choose where you want to specify your handlers. You can define global click handlers like in the *Basic setup* example at the very beginning or you can implement separate handlers for each *character*:


	a: {
		click    : function () {
			//This will only be applied to a seats
		},
		price    : 34.99,
		category : 'VIP Seats'
	}

Each event handler is fired in *seat* context which gives you an easy access (using *this* variable) to its properties, DOM node and data which you may have specified during the setup:

	click: function () {
		if (this.status() == 'available') {
			//seat's available and can be taken!

			//let's retrieve the data, so we can add the seat to our cart
			var price    = this.data().price,
				category = this.data().category;

			//jQuery element access example
			this.node().css({
				'font-size' : '25px'
			});

			//return new seat status
			return 'selected';
		}
		//…
	}

**Please note**: event handler should return new status of a seat depending on what happended. If user clicks on a seat and the seat's *available*, *selected* status should be returned. If user clicks on a *selected* seat, it most likely should become *available* again. Full status reference:

* **available**: seat which can be taken
* **unavailable**: seat which cannot be taken
* **selected**: seat which has been taken by current user

Since JSC also works with *focus/blur* events, it features a special status called *focused* which actually doesn't apply to seat status but rather to the way it's displayed. If you use *.status* method on a focused seat, you will get its real status. To get an idea of this, please take a look at how events are handled by default:

	click   : function() {

		if (this.status() == 'available') {
			return 'selected';
		} else if (this.status() == 'selected') {
			return 'available';
		} else {
			/*
			If we don't want to change the status (i.e. seat's unavailable) we ought to return this.style(). this.style() is a reference to seat's special status which means that it can be focused as well. You shouldn't return this.status() here
			*/
			return this.style();
		}
		
	},
	focus  : function() {

		if (this.status() == 'available') {
			//if seat's available, it can be focused
			return 'focused';
		} else  {
			//otherwise nothing changes
			return this.style();
		}
	},
	blur   : function() {
		//The only place where you should return actual seat status
		return this.status();
	},

***

Your site's popular and people fight for your tickets? Don't forget to update your map with new bookings live!

	//sc will contain a reference to the map
	var sc = $('#sc-container').seatCharts({
		//... 
	});

	setInterval(function() {
		$.ajax({
			type     : 'get',
			url      : '/bookings/get/100',
			dataType : 'json',
			success  : function(response) {
				//iterate through all bookings for our event 
				$.each(response.bookings, function(index, booking) {
					//find seat by id and set its status to unavailable
					sc.status(booking.seat_id, 'unavailable');
				});
			}
		});
	}, 10000); //every 10 seconds



## Options

Required params are marked with *

### animate

Bool, enables animated status switches.

**Please note**: *animate* uses *switchClass* method of [jQuery UI](http://jqueryui.com/), so if you want to use *animate*, you need to include jQuery UI in the page.

### blur

Blur handler. Fired when seat loses focus due to mouse move or arrow hit. You most likely don't want to overwrite this one.

	//default handler
	blur   : function() {
		return this.status();
	},

### click

Click handler. Fired when user clicks on a seat or hits spacebar on a focused seat. You're most likely to overwrite this one based off this example:

	click   : function() {

		if (this.status() == 'available') {
			//do some custom stuff
			console.log(this.data());

			return 'selected';
		} else if (this.status() == 'selected') {
			//do some custom stuff

			return 'available';
		} else {
			//i.e. alert that the seat's not available

			return this.style();
		}
		
	},

### focus

Focus handler. Fired when seat receives focus. You most likely don't want to overwrite this one.

	//default handler
	focus  : function() {

		if (this.status() == 'available') {
			return 'focused';
		} else  {
			return this.style();
		}
	},

### legend

JSC is able to create an UL element with a map legend based on your seat types and custom CSS. If you want JSC to generate a legend for you, you will just need to pass some basic information:

##### node
jQuery reference to a DIV element where legend should be rendered. If it's missing, JSC will create a DIV container itself.

	node : $('#my-legend-container')

##### items

An array of legend item details. Each array element should be a three-element array: [ *character, status, description* ]

	legend : {
		node  : $('#my-legend-container'),
		items : [
			[ v, 'available',   'VIP seats!' ],
			[ e, 'available',   'Economy seats'],
			[ e, 'unavailable', 'Unavailable economy seats' ]
		]
	}


### map*
An array of strings that represents your map:

	[
		'aaa___aaa',
		'aaaa_aaaa',
		'aaaa_aaaa'
	]

Underscore is used as a spacer between seats.

**Please note**: number of columns must be equal in each row.

**New**: You can now override label and ID per character. This is optional and can be applied to any number of seats:


	[
		'a[ID,LABEL]a[ID2,LABEL2]a___a[JUST_ID1]aa',
		'aaaa_aaaa[,JUST_LABEL1]',
		'aaaa_aaaa'
	]

ID and/or label should be specified after the letter and enclosed in square brackets. ID should go first, optionally followed by custom label. If you just want to specify label without overriding ID, leave ID empty: a[,Just Label]

ID may contain letters, numbers and underscores. Label can contain the same groups of characters as well as spaces.


### naming

You can specify your own column and row labels as well as functions for generating seat ids and labels. 

**columns**

An array of column names, *columns.length* must equal the actual number of columns:

	columns: ['A', 'B', 'C', 'D', 'E']

If you don't define your own columns, succeeding numbers starting from 1 will be used.

**getId**

Callback which may accept the following parameters: *character*, *row*, *column*, where *row* and *column* are names either specified by you using *columns* and *rows* arrays or by default JSC settings. This function should return an id based off passed arguments. Default getId function:

	getId  : function(character, row, column) {
		return row + '_' + column;
	}

Returned id is not only used as an internal identifier but also as a DOM id.

**getLabel**

Callback which may accept the following parameters: *character*, *row*, *column*, where *row* and *column* are names either specified by you using *columns* and *rows* arrays or by default JSC settings. This function should return a seat label based off passed arguments. Default getLabel function:

	getLabel : function (character, row, column) {
		return column;
	}

Labels will be displayed over seats, so if you don't want any labels, just return an empty string.

Sometimes it can be really hard to generate labels you want with getLabel, so now it's possible to specify custom labels per each seat. Please take a look at the map section.


**left**

Bool, defaults to true. If true, JSC will display an additional column on the left of the map with row names as specified by you using *rows* array or by default JSC settings

**rows**

An array of row names, *rows* length must equal the actual number of rows:

	rows: ['I', 'II', 'III', 'IV', 'V']

If you don't define your own rows, succeeding numbers starting from 1 will be used.

**top**

Bool, defaults to true. If true, JSC will display an additional row on the top of the map with column names as specified by you using *columns* array or by default JSC settings

### seats

A hash of seat options, seat *characters* should be used as keys. You can pass the following params:

**blur**

Blur event which should be applied only to seats of a particular *character*.

**classes**

Custom CSS classes which should be applied to seats. Either an array or a string, JSC doesn't care:

	classes : 'seat-red seat-big'
	//equals
	classes : ['seat-red', 'seat-big']

**click**

Custom click handler.

**focus**

Custom focus handler.



## Selectors

JSC offers you two flexible selector methods that are chainable and return *set* of seats:

### .get( ids )

You can pass either one id or an array of ids:

	sc.get('2_3'); //get 2_3 seat
	sc.get(['2_3', '2_4']); //get 2_3 and 2_4 seats

### .find( mixed )

Find method lets you search using *character*, seat status, combination of both (separated with a dot) or a regexp:

	sc.find('a'); //find all a seats
	sc.find('unavailable'); //find all unavailable seats
	sc.find('a.available'); //find all available a seats
	sc.find(/^1_[0-9]+/); //find all seats in the first row
	

#### .get and .find chained together:

	sc.get(['1_2', '1_3', '1_4']).find('available'); //find available seats within specified seat ids

Both methods return either one seat or a set of seats which share similiar methods:

## Set Methods

### .status( ids, status )

Update status for a seat set with given ids. *ids* variable may contain a single id or a an array of ids.

	sc.status('2_15', 'unvailable'); //set status for one seat
	sc.status(['2_15', '2_10'], 'unvailable'); //set status for two seats

### .status( status )

Update status for all seats in the current set.

	sc.find('unavailable').status('available'); //make all unvailable seats available

### .node( )

Returns a jQuery set of seat node references.

	sc.find('unavailable').node().fadeOut('fast'); //make all unavailable seats disappear

### .each( callback )

Iterates through a seat set, callback will be fired in the context of each element. Callback may accept seat id as an argument.

	sc.find('a.unavailable').each(function(seatId) {
		console.log(this.data()); //display seat data
	}); 

You can break the loop returning *false*.

## Seat Methods

### .status( [status] )
If *status* argument is set, it will be used as a new seat status, otherwise current status will be returned.

### .node( )
Returns a reference to jQuery element.

### .data( )
Returns a reference to seat data.

### .char( )
Returns seat *character*.


## Styling

JSC uses a few CSS classes that are pretty self explanatory:

### .seatCharts-container
DIV container where seat chart's rendered.

### .seatCharts-row
DIV element which serves as a row. You're most likely to edit its height.

### .seatCharts-cell
This class is applied to both seats and spacers ( _ ).

### .seatCharts-seat
Applied to all seats regardless of character.

### .seatCharts-space
Applied to spacers.

### .seatCharts-seat.selected
*Selected* seats.

### .seatCharts-seat.focused
*Focused* seats.

### .seatCharts-seat.available
*Available* seats.

### .seatCharts-seat.unavailable
*Unavailable* seats.

**Please note:** if you need each of your seat type (indicated by character) look differently, this is the easiest way:

CSS:
	.seatCharts-seat.selected.vip {
		background-color: #ff4fff;
	}

	.seatCharts-seat.focused.vip {
		background-color: #ccffcc;
	}

	//…

	.seatCharts-seat.selected.economy {
		background-color: #000fff;
	}

	//…

JavaScript:

	var sc = $.seatCharts({
		seats: {
			v: {
				classes: 'vip',
				price  : 300
			},
			e: {
				classes: 'economy',
				price  : 50
			}
		}
		//…
	});
	

### .seatCharts-legendList
UL element which holds the legend.

### .seatCharts-legendItem
LI element of the legend.

## FAQ

#### What licence is jQuery Seat Charts released under?
jQuery Seat Charts is released under [MIT license](http://choosealicense.com/licenses/mit/).

#### How is JSC accessible?
JSC implements [WAI-ARIA](www.w3.org/WAI/intro/aria) standard meaning that people using solely keyboards will share the same experience as mouse-users. You can easily check it yourself navigating with arrows and hitting spacebar instead of mouse click.
