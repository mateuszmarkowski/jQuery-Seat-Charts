(function ($) {
	
	module('methods');
	
	//Creates a very simple map and returns map's container.
	function methodsMapSetup(params) {

		var $fixture = $('#qunit-fixture'),
			$div = $('<div id="seat-map">');
				
		$fixture.append($div);

		$div.seatCharts(
			$.extend(true, {}, {
				map: [
					'aa_aa',
					'aaaaa',
					'bbbbb',
					'bbbbb',
					'ccccc',
				],
				seats: {
					a: {
						classes : 'a1-seat-class a2-seat-class',
						price   : 45
					},
					b: {
						classes : ['b1-seat-class', 'b2-seat-class'],
						price   : 25
					}					
				
				}
			}, params)
		);
		
		return $div;
	}
	
	test('Testing Seat methods & properties', function () {
		expect(9);
		
		var $seatCharts = methodsMapSetup(),
			seatCharts = $seatCharts.seatCharts(),
			seat = seatCharts.get('1_2');
			
		equal(typeof seat.blur, 'function', '.blur method present.');
		equal(typeof seat.char, 'function', '.char method present.');
		equal(typeof seat.click, 'function', '.click method present.');
		equal(typeof seat.data, 'function', '.data method present.');
		equal(typeof seat.focus, 'function', '.focus method present.');
		equal(typeof seat.node, 'function', '.node method present.');
		equal(typeof seat.settings, 'object', '.settings property present.');
		equal(typeof seat.status, 'function', '.status method present.');
		equal(typeof seat.style, 'function', '.style method present.');

	});
	
	test('Testing Seat Set methods & properties', function () {
		expect(11);
		
		var $seatCharts = methodsMapSetup(),
			seatCharts = $seatCharts.seatCharts(),
			seat = seatCharts.get(['1_2', '4_3']);
			
		equal(typeof seat.each, 'function', '.each method present.');
		equal(typeof seat.find, 'function', '.find method present.');
		equal(typeof seat.get, 'function', '.get method present.');
		equal(typeof seat.length, 'number', '.length property present.');
		equal(typeof seat.node, 'function', '.node method present.');
		equal(typeof seat.push, 'function', '.push method present.');
		equal(typeof seat.seatIds, 'object', '.seatIds property present.');
		equal(seat.seatIds.length, 2, '.seatIds property correct.');
		equal(typeof seat.seats, 'object', '.seats property present.');
		equal(typeof seat.set, 'function', '.set method present.');
		equal(typeof seat.status, 'function', '.status method present.');
	});	
	
	test('Testing .get selector', function () {
		expect(7);
	
		var $seatCharts = methodsMapSetup(),
			seatCharts = $seatCharts.seatCharts();
		
		equal(typeof seatCharts.get('1_1'), 'object', '.get for one id should return an object.');
		
		equal(typeof seatCharts.get('1_1').length, 'undefined', '.get for one id should return an object without length property.');
		
		equal(typeof seatCharts.get(['1_1', '3_3']), 'object', '.get for two ids should return an object.');
		
		equal(seatCharts.get(['1_1', '3_3', '2_4']).length, 3, '.get for three ids should have a property length with value 3.');
		
		equal(typeof seatCharts.get('99_99'), 'undefined', '.get for invalid id should return undefined.');
		
		equal(typeof seatCharts.get(['99_99', '2_3']), 'object', '.get for invalid and valid id and should return an object.');

		equal(seatCharts.get(['99_99', '2_3']).length, 1, 'With 1 as length.');
		
	});
	
	test('Testing .status method', function () {
		expect(9);
	
		var $seatCharts = methodsMapSetup(),
			seatCharts = $seatCharts.seatCharts(),
			seat1,
			seatsSet;
			
		seat1 = seatCharts.get('2_3');
		
		equal(seat1.status(), 'available', 'Default status is available.');
		
		seat1.status('unavailable');
		
		equal(seat1.status(), 'unavailable', 'Status has been changed.');
		
		seat1.status('selected');
		
		equal(seat1.status(), 'selected', 'Status has been changed again.');
		
		seatsSet = seatCharts.get(['2_2', '2_4']);
		
		seatsSet.status('selected');
		
		equal(seatCharts.get('2_2').status(), 'selected', 'Setting status for the whole set 1.');
		equal(seatCharts.get('2_4').status(), 'selected', 'Setting status for the whole set 2.');
		
		seatCharts.status('3_2', 'unavailable');
		
		equal(seatCharts.get('3_2').status(), 'unavailable', 'Alternative .status usage.');
		
		seatCharts.status(['4_4', '5_2', '5_1'], 'unavailable');
		
		equal(seatCharts.get('4_4').status(), 'unavailable', 'Alternative .status usage for the whole set 1.');
		equal(seatCharts.get('5_2').status(), 'unavailable', 'Alternative .status usage for the whole set 2.');
		equal(seatCharts.get('5_1').status(), 'unavailable', 'Alternative .status usage for the whole set 3.');
	});
	
	test('Testing .find selector', function () {
		expect(14);
	
		var $seatCharts = methodsMapSetup(),
			seatCharts = $seatCharts.seatCharts();
			
		seatCharts.get(['4_1', '1_5', '2_3']).status('unavailable');
		
		seatCharts.get(['5_2', '1_4']).status('selected');
		
		equal(seatCharts.find('available').length, 19, 'Finding by status alone.');
		
		equal(seatCharts.find('avble').length, 0, 'Finding by invalid status alone.');
		
		equal(seatCharts.get(['4_1', '4_2']).find('unavailable').length, 1, 'Finding in set by status alone.');
		
		equal(seatCharts.find('c').length, 5, 'Finding by character alone.');

		equal(seatCharts.find('O').length, 0, 'Finding by invalid character.');
		
		equal(seatCharts.get(['2_1', '3_2', '5_5', '5_3', '4_2']).find('b').length, 2, 'Finding in set by character alone.');
		
		equal(seatCharts.get(['2_1', '3_2', '5_5', '5_3', '4_2']).find('_').length, 0, 'Finding in set by invalid character.');
		
		equal(seatCharts.find('c.available').length, 4, 'Finding by character and status.');
		
		equal(seatCharts.find('c.able').length, 0, 'Finding by character and invalid status.');
		
		equal(seatCharts.find('P.availble').length, 0, 'Finding by invalid character and status.');
		
		equal(seatCharts.get(['2_1', '3_2', '5_5', '5_3', '4_2', '2_3']).find('b.available').length, 2, 'Finding in set by character and status.');
		
		equal(seatCharts.get(['2_1', '3_2', '5_5', '5_3', '4_2', '2_3']).find('X.available').length, 0, 'Finding in set by invalid character and status.');
		
		equal(seatCharts.get(['2_1', '3_2', '5_5', '5_3', '4_2', '2_3']).find('c.invalid-status').length, 0, 'Finding in set by character and invalid status.');
		
		equal(seatCharts.get(['9_12', '', '4_53']).find('b').length, 0, 'Finding in empty set.');
	});
		
})(jQuery);
