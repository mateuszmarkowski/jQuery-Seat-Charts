(function ($) {
	
	module('multiple');
	
	//testing multiple maps on page to ensure there are no conflicts
	function multipleMapSetup(params) {

		multipleMapSetup.counter = multipleMapSetup.counter || 1;

		var $fixture = $('#qunit-fixture'),
			$div = $('<div id="seat-map-'+(multipleMapSetup.counter++)+'">');
				
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
	
	test('Testing selectors for multi maps', function () {
		var $seatCharts1 = multipleMapSetup(),
			seatCharts1 = $seatCharts1.seatCharts(),
			$seatCharts2 = multipleMapSetup({
				map: [
					'eeeeeeeee',
					'baaabaaaa',
					'bbbbb____'
				],
			}),
			seatCharts2 = $seatCharts2.seatCharts();
			
		seatCharts1.find('a.available').status('unavailable');
		
		equal(seatCharts1.find('unavailable').length, 4, 'Status has been changed correctly');
		
		equal(seatCharts2.find('unavailable').length, 0, 'Status has not been changed for the other map.');
			
	});
	
})(jQuery);
