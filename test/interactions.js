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
		expect(14);
	
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
		
		downEvent = $.Event('keydown');
		downEvent.which = 40;
		
		upEvent = $.Event('keydown');
		upEvent.which = 38;		
		
		seatCharts.get('1_1').node().trigger(rightEvent);
		
		//right arrow
		
		equal(document.activeElement, document.getElementById('1_2'), 'Right arrow moves focus to the right seat.');
		
		equal($seatCharts.attr('aria-activedescendant'), seatCharts.get('1_2').node().attr('id'), 'Test if aria-activedescendant has been populated with the correct id.');
		
		seatCharts.get('1_2').node().trigger(rightEvent);
		
		equal(document.activeElement, document.getElementById('1_4'), 'Right arrow moves focus to the right seat skipping the empty space.');		
		
		seatCharts.get('1_4').node().trigger(rightEvent);
		seatCharts.get('1_5').node().trigger(rightEvent);
			
		equal(document.activeElement, document.getElementById('2_1'), 'Right arrow moves focus to the first seat of the next row when it reaches the end of the current row.');
		
		seatCharts.get('5_5').node().trigger(focusEvent);
		
		seatCharts.get('5_5').node().trigger(rightEvent);
		
		equal(document.activeElement, document.getElementById('7_1'), 'Right arrow moves focus to the first seat skipping empty spaces.');
		
		seatCharts.get('9_1').node().trigger(focusEvent);
		
		seatCharts.get('9_1').node().trigger(rightEvent);
		
		seatCharts.get('9_2').node().trigger(rightEvent);
		
		equal(document.activeElement, document.getElementById('1_1'), 'Right arrow moves focus to the first seat skipping empty spaces and starting over when the last seat is reached.');
		
		//left arrow
		
		seatCharts.get('2_3').node().trigger(focusEvent);
		
		seatCharts.get('2_3').node().trigger(leftEvent);
		
		equal(document.activeElement, document.getElementById('2_2'), 'Left arrow moves focus to the left seat.');
		
		seatCharts.get('2_2').node().trigger(leftEvent);
		
		seatCharts.get('2_1').node().trigger(leftEvent);
		
		equal(document.activeElement, document.getElementById('1_5'), 'Left arrow moves focus to the last seat of the previous row when the beginning of the current row is reached.');
		
		seatCharts.get('9_1').node().trigger(focusEvent);
		
		seatCharts.get('9_1').node().trigger(leftEvent);
		
		equal(document.activeElement, document.getElementById('7_5'), 'Left arrow moves focus to the last seat of the previous row when the beginning of the current row is reached skipping empty spaces.');
		
		seatCharts.get('1_1').node().trigger(focusEvent);
		
		seatCharts.get('1_1').node().trigger(leftEvent);
		
		equal(document.activeElement, document.getElementById('9_2'), 'Left arrow moves focus to the last seat when pressed on the first seat skipping empty spaces.');
		
		//down		
		
		seatCharts.get('2_2').node().trigger(focusEvent);
		
		seatCharts.get('2_2').node().trigger(downEvent);
				
		equal(document.activeElement, document.getElementById('3_2'), 'Down arrow moves focus to the seat below.');
		
		seatCharts.get('5_3').node().trigger(focusEvent);
		
		seatCharts.get('5_3').node().trigger(downEvent);
		
		equal(document.activeElement, document.getElementById('2_3'), 'Down arrow moves focus to the seat below skipping empty spaces.');
		
		//up
		
		seatCharts.get('4_4').node().trigger(focusEvent);
		
		seatCharts.get('4_4').node().trigger(upEvent);
		
		equal(document.activeElement, document.getElementById('3_4'), 'Up arrow moves focus to the seat above.');
		
		$(document.activeElement).trigger(upEvent);
		$(document.activeElement).trigger(upEvent);
		$(document.activeElement).trigger(upEvent);
		$(document.activeElement).trigger(upEvent);	
		
		equal(document.activeElement, document.getElementById('5_4'), 'Up arrow moves focus to the seat above skipping empty spaces.');
	});
	
	test('Testing default click callback with mouse', function () {
		expect(7);
	
		var $seatCharts = interactionsMapSetup(),
			seatCharts = $seatCharts.seatCharts(),
			clickEvent,
			focusEvent;
		
		//disable some seats
		seatCharts.get(['1_4', '4_2']).status('unavailable');
		
		clickEvent = $.Event('click');
		
		focusEvent = $.Event('focus');
		
		$('#5_2').trigger(clickEvent);
		
		equal(seatCharts.find('selected').length, '1', 'Clicking on an available seat should change its status to selected.');
		
		equal(seatCharts.get('5_2').style(), 'selected', 'Selected seat should return selected style.');
		
		equal(seatCharts.get('5_2').status(), 'selected', 'Selected seat should return selected status.');
		
		ok(seatCharts.get('5_2').node().hasClass('selected'),  'Selected seat should have selected class.');
		
		$('#1_4').trigger(clickEvent);
		
		equal(seatCharts.find('selected').length, '1', 'You can not select an unavailable seat.');
		
		$('#5_2').trigger(clickEvent);
		
		equal(seatCharts.find('selected').length, '0', 'Clicking on a selected seat should change its status to available.');
		
		$('#3_3').trigger(focusEvent);
		
		$('#3_3').trigger(clickEvent);
		
		equal(seatCharts.get('3_3').status(), 'selected', 'Clicking on a focused seat should change its status to selected.');
	});
	
	test('Testing default click callback with keyboard', function () {
		expect(7);
		
		var $seatCharts = interactionsMapSetup(),
			seatCharts = $seatCharts.seatCharts(),
			spacebarEvent,
			focusEvent;
		
		//disable some seats
		seatCharts.find('c').status('unavailable');
		
		spacebarEvent = $.Event('keydown');
		spacebarEvent.which = 32;
		
		focusEvent = $.Event('focus');
		
		$('#1_1').trigger(spacebarEvent);
		
		equal(seatCharts.find('selected').length, '1', 'Pressing spacebar on an available seat should change its status to selected.');
		
		equal(seatCharts.get('1_1').style(), 'selected', 'Selected seat should return selected style.');
		
		equal(seatCharts.get('1_1').status(), 'selected', 'Selected seat should return selected status.');
		
		ok(seatCharts.get('1_1').node().hasClass('selected'),  'Selected seat should have selected class.');
		
		$('#7_2').trigger(spacebarEvent);
		
		equal(seatCharts.find('selected').length, '1', 'You can not select an unavailable seat.');
		
		$('#1_1').trigger(spacebarEvent);
		
		equal(seatCharts.find('selected').length, '0', 'Pressing spacebar on a selected seat should change its status to available.');
		
		$('#2_5').trigger(focusEvent);
		
		$('#2_5').trigger(spacebarEvent);
		
		equal(seatCharts.get('2_5').status(), 'selected', 'Pressing spacebar on a focused seat should change its status to selected.');		
	});	
	
})(jQuery);
