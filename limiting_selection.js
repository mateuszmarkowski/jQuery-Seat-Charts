<script>
                          var firstSeatLabel = 1;
                          var count = 0;
                          var $maxseats = 3;
                        
                          $(document).ready(function() {
                            var $cart = $('#selected-seats'),
                              $counter = $('#counter'),
                              $total = $('#total'),
                              sc = $('#seat-map').seatCharts({
                              map: [
                                '____f',
                                'ff_ff',
                                'ee_ee',
                                'ee_ee',
                                'ee_ee',
                                'ee_ee',
                                'ee_ee',
                                'ee_ee',
                                'ee_ee',
                                'ee_ee',
                                'eeeee',
                              ],
                              seats: {
                                f: {
                                  price   : 2100,
                                  classes : 'first-class', //your custom CSS class
                                  category: 'VIP'
                                },
                                e: {
                                  price   : 1600,
                                  classes : 'economy-class', //your custom CSS class
                                  category: 'Economy'
                                }         
                              
                              },
                              naming : {
                                top : false,
                                getLabel : function (character, row, column) {
                                  return firstSeatLabel++;
                                },
                              },
                              legend : {
                                node : $('#legend'),
                                  items : [
                                  [ 'f', 'available',   'VIP' ],
                                  [ 'e', 'available',   'Economy'],
                                  [ 'f', 'unavailable', 'Already Booked']
                                  ]         
                              },
                              click: function () {
                                if (this.status() == 'available') {
                                  count++;
                                  if (count>$maxseats) {
                                    alert('You can only select a maximum of three seats.')
                                    count--;
                                    return('available');
                                  };

                                  //let's create a new <li> which we'll add to the cart items
                                  

                                  $('<tr><td>'+this.data().category+'</td> <td># '+this.settings.label+'</td><td> KSh. <b>'+this.data().price+'</b> <a href="#" class="cancel-cart-item"><i class="fa fa-times maroon-glyph"></i></a></td></tr>')
                                    .attr('id', 'cart-item-'+this.settings.id)
                                    .data('seatId', this.settings.id)
                                    .appendTo($cart);

                                    /*$('<li>'+this.data().category+' #'+this.settings.label+': KSh. <b>'+this.data().price+'</b> <a href="#" class="cancel-cart-item"><i class="fa fa-times maroon-glyph"></i></a></li>')
                                    .attr('id', 'cart-item-'+this.settings.id)
                                    .data('seatId', this.settings.id)
                                    .appendTo($cart);*/


                                  
                                  /*
                                   * Lets update the counter and total
                                   *
                                   * .find function will not find the current seat, because it will change its stauts only after return
                                   * 'selected'. This is why we have to add 1 to the length and the current seat price to the total.
                                   */
                                  $counter.text(sc.find('selected').length+1);
                                  $total.text(recalculateTotal(sc)+this.data().price);
                                  
                                  return 'selected';
                                } else if (this.status() == 'selected') {
                                  //update the counter
                                  count--;
                                  $counter.text(sc.find('selected').length-1);
                                  //and total
                                  $total.text(recalculateTotal(sc)-this.data().price);
                                
                                  //remove the item from our cart
                                  $('#cart-item-'+this.settings.id).remove();
                                
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

                            //this will handle "[cancel]" link clicks
                            $('#selected-seats').on('click', '.cancel-cart-item', function () {
                              //let's just trigger Click event on the appropriate seat, so we don't have to repeat the logic here
                              sc.get($(this).parents('li:first').data('seatId')).click();
                            });

                            //let's pretend some seats have already been booked
                            sc.get(['1_5', '7_1', '7_4']).status('unavailable');
                        
                        });

                        function recalculateTotal(sc) {
                          var total = 0;
                        
                          //basically find every selected seat and sum its price
                          sc.find('selected').each(function () {
                            total += this.data().price;
                          });
                          
                          return total;
                        }
                        
                        </script>