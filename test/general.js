(function ($) {

	module('general');
	
	//Creates a very simple map and returns map's container.
	function simpleMapSetup(params) {

		var $fixture = $('#qunit-fixture'),
			$div = $('<div id="seat-map">');
				
		$fixture.append($div);

		$div.seatCharts(
			$.extend(true, {}, {
				map: [
					'aa_aa',
					'bbbbb',
					'bbbbb'
				],
				seats: {
					a: {
						classes : 'a1-seat-class a2-seat-class'
					},
					b: {
						classes : ['b1-seat-class', 'b2-seat-class']
					}					
				
				}
			}, params)
		);
		
		return $div;
	}
	
	function Counter() {
		this.click = 0;
		this.focus = 0;
		this.blur  = 0;
		
		this.reset = function () {
			this.click = this.focus = this.blur = 0;
		};
	}

	test('Testing general structure of a simple map.', function () {
		expect(5);
	
		var $seatCharts = simpleMapSetup(),
			$space = $seatCharts.find('.seatCharts-row:eq(1) .seatCharts-cell:eq(3)');

		equal($seatCharts.find('.seatCharts-row').length, 4, 'Number of rows.');

		ok($space.hasClass('seatCharts-space') && !$space.hasClass('seatCharts-seat'), 'There should be a spacer cell in the first row.')

		equal($seatCharts.find('.seatCharts-row:eq(1) .seatCharts-seat').length, 4, 'Number of columns in row 1.');

		for (var i = 2; i <= 3; i += 1) {
			equal($seatCharts.find('.seatCharts-row:eq('+(i)+') .seatCharts-seat').length, 5, 'Number of columns in row '+i+'.');
		}		

	});	

	
	test('Testing seat classes', function () {
		expect(6);
		 
		var $seatCharts = simpleMapSetup(),
			$aSeat = $seatCharts.find('.seatCharts-row:eq(1) .seatCharts-seat:eq(0)'),
			$bSeat = $seatCharts.find('.seatCharts-row:eq(2) .seatCharts-seat:eq(3)');

		ok($aSeat.hasClass('a1-seat-class'), 'Seat a has its a1-seat-class assigned using a string.');
		
		ok($aSeat.hasClass('a2-seat-class'), 'Seat a has its a2-seat-class assigned using a string.');
		
		ok($bSeat.hasClass('b1-seat-class'), 'Seat b has its b1-seat-class assigned using an array.');
		
		ok($bSeat.hasClass('b2-seat-class'), 'Seat b has its b2-seat-class assigned using an array.');		

		ok(!($aSeat.hasClass('b1-seat-class') || $aSeat.hasClass('b2-seat-class')), 'Seat a does not have any b seat classes.');
		
		ok(!($bSeat.hasClass('a1-seat-class') || $bSeat.hasClass('a2-seat-class')), 'Seat b does not have any a seat classes.');

	});
	
	test('Testing default column & row labels', function () {
		expect(9);
	
		var $seatCharts = simpleMapSetup();
		
		equal($seatCharts.find('.seatCharts-row:eq(0) .seatCharts-cell:eq(0)').text(), '', 'Top leftmost cell should be empty.');
		
		for (var i = 1; i <= 5; i += 1) {
			equal($seatCharts.find('.seatCharts-row:eq(0) .seatCharts-cell:eq('+i+')').text(), i, 'Column header '+i+' has correct label.');
		}
		
		for (var i = 1; i <= 3; i += 1) {
			equal($seatCharts.find('.seatCharts-row:eq('+i+') .seatCharts-cell:eq(0)').text(), i, 'Row header '+i+' has correct label.');
		}
	});
	
	test('Testing custom column & row labels', function () {
		expect(3);
	
		var $seatCharts = simpleMapSetup({
			naming : {
				columns : ['I', 'II', 'III', 'IV', 'V'],
				rows    : ['a', 'b', 'c']
			}
		});
		
		equal($seatCharts.find('.seatCharts-row:eq(0) .seatCharts-cell:eq(0)').text(), '', 'Top leftmost cell should be empty.');
		
		equal($seatCharts.find('.seatCharts-row:eq(0) .seatCharts-cell:eq(3)').text(), 'III', '3rd column header has correct label.');
		
		equal($seatCharts.find('.seatCharts-row:eq(2) .seatCharts-cell:eq(0)').text(), 'b', '2nd row header has correct label.');
		
	});	
	
	test('Testing default seat labels and IDs', function () {
		expect(4);
	
		var $seatCharts = simpleMapSetup();

		equal($seatCharts.find('.seatCharts-row:eq(1) .seatCharts-seat:eq(0)').text(), '1', 'First seat in the first row label.');

		equal($seatCharts.find('.seatCharts-row:eq(1) .seatCharts-seat:eq(2)').text(), '4', 'Third seat in the first row label.');
		
		equal($seatCharts.find('#3_5').length, 1, 'Seat with id 3_5 exists.');
		
		equal($seatCharts.find('#3_6').length, 0, 'And it is the last seat id.');
	});
	
	test('Testing custom seat labels and IDs', function () {
		expect(4);
	
		var getIdExecutions = 0,
			getLabelExecutions = 0,
			$seatCharts = simpleMapSetup({
				naming : {
					getId : function (character, row, column) {
						getIdExecutions += 1
						//return all arguments separated with -
						return [].slice.call(arguments).join('-');
					},
					getLabel : function (character, row, column) {
						getLabelExecutions += 1;
						//return all arguments separated with +
						return [].slice.call(arguments).join('+');
					}
				}			
			});

		equal(getIdExecutions, 14, 'getId has been called for each seat.');
		equal(getLabelExecutions, 14, 'getLabel has been called for each seat.');

		equal($seatCharts.find('.seatCharts-row:eq(1) .seatCharts-seat:eq(2)').text(), 'a+1+4', 'Correct label assigned.');
		
		equal($seatCharts.find('.seatCharts-row:eq(3) .seatCharts-seat:eq(4)').attr('id'), 'b-3-5', 'Correct id assigned.');

	});	
	
	test('Testing overriding labels and IDs', function () {
		expect(10);
	
		var $seatCharts = simpleMapSetup({
			map: [
				'a[1_A1,A1]a[1_A2,A2]_aa',
				'bbbbb',
				'bb[3_B2]bbb[,B5]'
			]
		}),
		//a[1_A1,A1]
		$seat1 = $seatCharts.find('.seatCharts-row:eq(1) .seatCharts-seat:eq(0)'),
		//a[1_A2,A2]
		$seat2 = $seatCharts.find('.seatCharts-row:eq(1) .seatCharts-seat:eq(1)'),
		//a
		$seat3 = $seatCharts.find('.seatCharts-row:eq(1) .seatCharts-seat:eq(2)'),
		//b[3_B2]
		$seat4 = $seatCharts.find('.seatCharts-row:eq(3) .seatCharts-seat:eq(1)'),
		//b[,B5]
		$seat5 = $seatCharts.find('.seatCharts-row:eq(3) .seatCharts-seat:eq(4)');
		
		equal($seat1.text(), 'A1', 'Seat 1 has correct label assigned.');
		equal($seat1.attr('id'), '1_A1', 'Seat 1 has correct id assigned.');
		
		equal($seat2.text(), 'A2', 'Seat 2 has correct label assigned.');
		equal($seat2.attr('id'), '1_A2', 'Seat 2 has correct id assigned.');
		
		equal($seat3.text(), '4', 'Seat 3 has correct label assigned.');
		equal($seat3.attr('id'), '1_4', 'Seat 3 has correct id assigned.');
		
		equal($seat4.text(), '2', 'Seat 4 has correct label assigned.');
		equal($seat4.attr('id'), '3_B2', 'Seat 4 has correct id assigned.');
		
		equal($seat5.text(), 'B5', 'Seat 5 has correct label assigned.');
		equal($seat5.attr('id'), '3_5', 'Seat 5 has correct id assigned.');								
	});
	
	test('Testing overriding+custom labels and IDs', function () {
		expect(12);
	
		var getIdExecutions = 0,
			getLabelExecutions = 0,
			$seatCharts = simpleMapSetup({
			naming : {
				getId : function (character, row, column) {
					getIdExecutions += 1
					//return all arguments separated with -
					return [].slice.call(arguments).join('-');
				},
				getLabel : function (character, row, column) {
					getLabelExecutions += 1;
					//return all arguments separated with +
					return [].slice.call(arguments).join('+');
				}
			},		
			map: [
				'a[1_A1,A1]a[1_A2,A2]_aa',
				'bbbbb',
				'bb[3_B2]bbb[,B5]'
			]
		}),
		//a[1_A1,A1]
		$seat1 = $seatCharts.find('.seatCharts-row:eq(1) .seatCharts-seat:eq(0)'),
		//a[1_A2,A2]
		$seat2 = $seatCharts.find('.seatCharts-row:eq(1) .seatCharts-seat:eq(1)'),
		//a
		$seat3 = $seatCharts.find('.seatCharts-row:eq(1) .seatCharts-seat:eq(2)'),
		//b[3_B2]
		$seat4 = $seatCharts.find('.seatCharts-row:eq(3) .seatCharts-seat:eq(1)'),
		//b[,B5]
		$seat5 = $seatCharts.find('.seatCharts-row:eq(3) .seatCharts-seat:eq(4)');
		
		equal(getIdExecutions, 11, 'getId has been called for each seat.');
		equal(getLabelExecutions, 11, 'getLabel has been called for each seat.');		
		
		equal($seat1.text(), 'A1', 'Seat 1 has correct label assigned.');
		equal($seat1.attr('id'), '1_A1', 'Seat 1 has correct id assigned.');
		
		equal($seat2.text(), 'A2', 'Seat 2 has correct label assigned.');
		equal($seat2.attr('id'), '1_A2', 'Seat 2 has correct id assigned.');
		
		equal($seat3.text(), 'a+1+4', 'Seat 3 has correct label assigned.');
		equal($seat3.attr('id'), 'a-1-4', 'Seat 3 has correct id assigned.');
		
		equal($seat4.text(), 'b+3+2', 'Seat 4 has correct label assigned.');
		equal($seat4.attr('id'), '3_B2', 'Seat 4 has correct id assigned.');
		
		equal($seat5.text(), 'B5', 'Seat 5 has correct label assigned.');
		equal($seat5.attr('id'), 'b-3-5', 'Seat 5 has correct id assigned.');								
	});	
	
	test('Testing disabled left & top containers for labels', function () {
		var $seatCharts = simpleMapSetup({
			naming : {
				top: false,
				left: false
			}
		});

		ok($seatCharts.find('.seatCharts-row:eq(0) .seatCharts-cell:eq(0)').hasClass('seatCharts-seat'), 'Top leftmost cell should contain a seat.');
	})
	
	test('Testing legend with container specified', function () {
		expect(4);
	
		var $fixture = $('#qunit-fixture'),
			$legend = $('<div>').appendTo($fixture),
			$seatCharts = simpleMapSetup({
				legend : {
					node  : $legend,
					items : [
						['a', 'available', 'A seat when available'],
						['b', 'available', 'B seat when available'],
						['a', 'unavailable', 'A seat when unavailable'],
						['b', 'unavailable', 'B seat when unavailable']
					]
				}
			}),
			$item,
			$seat;

		ok($legend.hasClass('seatCharts-legend'), 'Legend class has been assigned to the container');
	
		equal($legend.find('ul.seatCharts-legendList li.seatCharts-legendItem').length, 4, 'There is a list of 4 legend items.');
		
		$item = $legend.find('.seatCharts-legendItem:eq(0)');
		$seat = $item.find('div:first');

		ok($seat.hasClass('seatCharts-seat') && $seat.hasClass('seatCharts-cell') && $seat.hasClass('available') && $seat.hasClass('a1-seat-class') && $seat.hasClass('a2-seat-class'), 'The first legend item has correct classes assigned.');
		
		equal($item.find('.seatCharts-legendDescription').text(), 'A seat when available', 'The first item has correct label assigned.');
		
	});

	test('Testing legend without container specified', function () {
		expect(4);
	
		var $fixture = $('#qunit-fixture'),
			$seatCharts = simpleMapSetup({
				legend : {
					items : [
						['a', 'available', 'A seat when available'],
						['b', 'available', 'B seat when available'],
						['a', 'unavailable', 'A seat when unavailable'],
						['b', 'unavailable', 'B seat when unavailable']
					]
				}
			}),
			$legend,
			$item,
			$seat;

		equal($('div.seatCharts-legend').length, 1, 'Legend div has been created.');
	
		$legend = $('div.seatCharts-legend:eq(0)');
	
		equal($legend.find('ul.seatCharts-legendList li.seatCharts-legendItem').length, 4, 'There is a list of 4 legend items.');
		
		$item = $legend.find('.seatCharts-legendItem:eq(0)');
		$seat = $item.find('div:first');

		ok($seat.hasClass('seatCharts-seat') && $seat.hasClass('seatCharts-cell') && $seat.hasClass('available') && $seat.hasClass('a1-seat-class') && $seat.hasClass('a2-seat-class'), 'The first legend item has correct classes assigned.');
		
		equal($item.find('.seatCharts-legendDescription').text(), 'A seat when available', 'The first item has correct label assigned.');
		
	});	

	test('Testing map-level callbacks', function () {
		var $seatCharts = simpleMapSetup({
				click : function () {
					executions.click += 1;
				
					if (this.status() == 'available') {
						return 'selected';
					} else if (this.status() == 'selected') {
						return 'available';
					} else {
						return this.style();
					}
				},
				focus  : function() {
					executions.focus += 1;

					if (this.status() == 'available') {
						return 'focused';
					} else  {
						return this.style();
					}
				},
				blur   : function() {
					executions.blur += 1;

					return this.status();
				}
			}),
			seatCharts = $seatCharts.seatCharts(),
			//simple counter object
			executions = new Counter,
			clickEvent = $.Event('click'),
			mouseenterEvent = $.Event('mouseenter'),
			mouseleaveEvent = $.Event('mouseleave'),
			focusEvent = $.Event('focus'),
			keyEvent = $.Event('keydown');
		
		seatCharts.get('2_3').status('unavailable');
		
		seatCharts.get('2_1').node().trigger(mouseenterEvent);
		seatCharts.get('2_1').node().trigger(mouseleaveEvent);		
		seatCharts.get('2_2').node().trigger(mouseenterEvent);
		seatCharts.get('2_2').node().trigger(mouseleaveEvent);
		seatCharts.get('2_3').node().trigger(mouseenterEvent);
		
		propEqual(executions, {
			click : 0,
			focus : 3,
			blur  : 4,
			reset : function () {}
		}, 'Blur and focus are correctly triggered.');
		
		//start over
		executions.reset();
		
		seatCharts.get('3_1').node().trigger(mouseenterEvent);
		
		//arrow down
		keyEvent.which = 38;
		seatCharts.get('3_1').node().trigger(keyEvent);
		
		//spacebar
		keyEvent.which = 32;
		
		seatCharts.get('2_1').node().trigger(keyEvent);
		
		propEqual(executions, {
			click : 1,
			focus : 2,
			blur  : 3,
			reset : function () {}
		}, 'Blur, focus and click are correctly triggered.');
	});
	
	test('Testing seat-level callbacks', function () {
		var $seatCharts = simpleMapSetup({
				seats : {
					a : {
						click : function () {
							executionsA.click += 1;
						
							if (this.status() == 'available') {
								return 'selected';
							} else if (this.status() == 'selected') {
								return 'available';
							} else {
								return this.style();
							}
						},
						focus  : function() {
							executionsA.focus += 1;
		
							if (this.status() == 'available') {
								return 'focused';
							} else  {
								return this.style();
							}
						},
						blur   : function() {
							executionsA.blur += 1;
		
							return this.status();
						}
					},
					b : {
						click : function () {
							executionsB.click += 1;
						
							if (this.status() == 'available') {
								return 'selected';
							} else if (this.status() == 'selected') {
								return 'available';
							} else {
								return this.style();
							}
						},
						focus  : function() {
							executionsB.focus += 1;
		
							if (this.status() == 'available') {
								return 'focused';
							} else  {
								return this.style();
							}
						},
						blur   : function() {
							executionsB.blur += 1;
		
							return this.status();
						}
					}
				}

			}),
			seatCharts = $seatCharts.seatCharts(),
			//each seat type has its own callbacks and hence different counters
			executionsA = new Counter,
			executionsB = new Counter,
			clickEvent = $.Event('click'),
			mouseenterEvent = $.Event('mouseenter'),
			mouseleaveEvent = $.Event('mouseleave'),
			focusEvent = $.Event('focus'),
			keyEvent = $.Event('keydown');
		
		seatCharts.get('2_3').status('unavailable');
		
		seatCharts.get('2_1').node().trigger(mouseenterEvent);
		seatCharts.get('2_1').node().trigger(mouseleaveEvent);		
		seatCharts.get('2_2').node().trigger(mouseenterEvent);
		seatCharts.get('2_2').node().trigger(mouseleaveEvent);
		seatCharts.get('2_3').node().trigger(mouseenterEvent);

		propEqual(executionsB, {
			click : 0,
			focus : 3,
			blur  : 4,
			reset : function () {}
		}, 'Blur, focus and click are correctly triggered for B seats.');
		
		seatCharts.get('1_1').node().trigger(mouseenterEvent);
		
		//arrow right
		keyEvent.which = 39;
		seatCharts.get('1_1').node().trigger(keyEvent);
		seatCharts.get('1_2').node().trigger(keyEvent);
		
		//spacebar
		keyEvent.which = 32;
		
		seatCharts.get('1_4').node().trigger(keyEvent);

		propEqual(executionsA, {
			click : 1,
			focus : 3,
			blur  : 4,
			reset : function () {}
		}, 'Blur, focus and click are correctly triggered for A seats.');

	});	

})(jQuery);
