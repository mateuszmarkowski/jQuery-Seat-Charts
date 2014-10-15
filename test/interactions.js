(function ($) {
	
	module('interactions');
	
//Creates a very simple map and returns map's container.
	function interactionsMapSetup(params) {

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
					'_____',
					'cc_cc',
					'_____',
					'cc___'
				],
				seats: {
					a: {
						classes  : 'a1-seat-class a2-seat-class',
						price    : 45,
						anObject : {
							aProperty: 'testing'
						}
					},
					b: {
						classes  : ['b1-seat-class', 'b2-seat-class'],
						price    : 25,
						anObject2: {
							aProperty2: 23
						}
					}				
				
				}
			}, params)
		);
		
		return $div;
	}

	test('Testing focus/blur with mouse', function () {
		expect(8);
	
		var $seatCharts = interactionsMapSetup(),
			seatCharts = $seatCharts.seatCharts(),
			seat1 = seatCharts.get('3_4'),
			seat2 = seatCharts.get('4_1'),
			mouseenterEvent,
			focusEvent;
			
		//focus the first seat
		mouseenterEvent = $.Event('mouseenter');
			
		seat1.node().trigger(mouseenterEvent);
		
		equal(seat1.style(), 'focused', 'Test if focused using .style function.');
		
		equal(seat1.node()[0], document.activeElement, 'Test if focused using document.activeElement');
		
		equal($seatCharts.attr('aria-activedescendant'), seat1.node().attr('id'), 'Test if aria-activedescendant has been populated with the correct id.');
		
		//move focus to some other seat
		seat2.node().trigger(mouseenterEvent);
		
		equal(seat1.style(), 'available', 'Test if previous seat lost focus using .style function.');
		
		equal(seat2.style(), 'focused', 'Test if focused using .style function.');
		
		equal(seat2.node()[0], document.activeElement, 'Test if focused using document.activeElement');
		
		equal($seatCharts.attr('aria-activedescendant'), '4_1', 'Test if aria-activedescendant has been populated with the correct id.');
		
		focusEvent = $.Event('focus');
		$seatCharts.trigger(focusEvent);
		
		equal(document.getElementById('1_1'), document.activeElement, 'First seat should be focused by default');
		
	});
	

	test('Testing focus/blur with keyboard', function () {
		var $seatCharts = interactionsMapSetup(),
			seatCharts = $seatCharts.seatCharts(),
			focusEvent,
			leftEvent,
			rightEvent,
			upEvent,
			downEvent;
		
		focusEvent = $.Event('focus');
		$seatCharts.trigger(focusEvent);	
			
		leftEvent = $.Event('keydown');
		leftEvent.which = 37;
		
		rightEvent = $.Event('keydown');
		rightEvent.which = 39;
		
		seatCharts.get('1_1').node().trigger(rightEvent);
		
		equal(document.activeElement, document.getElementById('1_2'), 'Right arrow moves focus to the right seat.');
		
		equal($seatCharts.attr('aria-activedescendant'), seatCharts.get('1_2').node().attr('id'), 'Test if aria-activedescendant has been populated with the correct id.');
		
		seatCharts.get('1_2').node().trigger(rightEvent);
		
		equal(document.activeElement, document.getElementById('1_4'), 'Right arrow moves focus to the right seat skipping the empty space.');		
		
		seatCharts.get('1_4').node().trigger(rightEvent);
		seatCharts.get('1_5').node().trigger(rightEvent);
			
		equal(document.activeElement, document.getElementById('2_1'), 'Right arrow moves focus to the first seat of the next row when it reaches the end of the current row.');
	});

	
})(jQuery);
