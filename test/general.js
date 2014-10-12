(function ($) {
	
	module('general');
	
	//Creates a very simple map and returns map's container.
	function simpleMapSetup(params) {

		var $fixture = $('#qunit-fixture'),
			$div = $('<div id="seat-map">');
				
		$fixture.append($div);

		$div.seatCharts(
			$.extend(true, {}, params, {
				map: [
					'aaaaa',
					'bbbbb',
					'bbbbb',
				],
				seats: {
					a: {
						price   : 100,
						classes : 'a1-seat-class a2-seat-class'
					},
					b: {
						price   : 40,
						classes : ['b1-seat-class', 'b2-seat-class']
					}					
				
				}
			})
		);
		
		return $div;
	}
	

	test('Testing general structure of a simple map.', function () {
		expect(4);
	
		var $seatCharts = simpleMapSetup();

		equal($seatCharts.find('.seatCharts-row').length, 4, 'Number of rows.');

		for (var i = 1; i <= 3; i += 1) {
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
	
	test('Testing default seat labels and IDs', function () {
		expect(4);
	
		var $seatCharts = simpleMapSetup();

		equal($seatCharts.find('.seatCharts-row:eq(1) .seatCharts-seat:eq(0)').text(), '1', 'First seat in the first row label.');

		equal($seatCharts.find('.seatCharts-row:eq(1) .seatCharts-seat:eq(2)').text(), '3', 'Third seat in the first row label.');
		
		equal($seatCharts.find('#3_5').length, 1, 'Seat with id 3_5 exists.');
		
		equal($seatCharts.find('#3_6').length, 0, 'And it is the last seat id.');
	});
	
	
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

})(jQuery);
