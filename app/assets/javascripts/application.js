//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {


  // Duplicate the content of the General App Type to another input so we can pass a non-result self typed entry to the next page.

$('#appGroups .govuk-radios__item:last-child').before( $( '<div class="govuk-radios__divider">or</div>' ) );
     


  function convertDate(dateStr) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
  
    const [day, month, year] = dateStr.split("/");
  
    return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
  }
  
  // Apply to all elements with the class 'convertDate'
  const dateElements = document.querySelectorAll(".convertDate");
  dateElements.forEach(element => {
      element.textContent = convertDate(element.textContent);
  });
  

  // Add JavaScript here
  var DateTime = luxon.DateTime;

  // Show prisoner name when entering a prison number

  var prisonNumber =  $('input#prisonNumber').val();

  if (prisonNumber === "") {
    $('#prisoner-name-check').hide();
  }

  $('a#prisonNumber-lookup').click(function () {
    // alert('this works');
    var prisonNumber = $('input#prisonNumber').val();
    console.log(prisonNumber);
    //alert(prisonNumber);
    if (prisonNumber.length > 2) {
        $('#prisoner-name-check').show();
        if (prisonNumber == 'G4567NO') {
            $('#prisoner-name-row').text('Prisoner name: Blake, Oliver');
            $('#prisonerName').val('Blake, Oliver'); // Use .val() instead of .value()
        } else if (prisonNumber == 'J6789TU') { // Use else if instead of else
            $('#prisoner-name-row').text('Prisoner name: Gupta, Vikram');
            $('#prisonerName').val('Gupta, Vikram'); // Use .val() instead of .value()
        } else if (prisonNumber == 'D2345HI') { // Use else if instead of else
            $('#prisoner-name-row').text('Prisoner name: Ali, Saeed');
            $('#prisonerName').val('Ali, Saeed'); // Use .val() instead of .value()
        } else if (prisonNumber == 'A1234BC') { // Use else if instead of else
            $('#prisoner-name-row').text('Prisoner name: Wright, Benjamin');
            $('#prisonerName').val('Wright, Benjamin'); // Use .val() instead of .value()
        } else {
            $('#prisoner-name-row').text('Prisoner name: Patel, Taj');
            $('#prisonerName').val('Patel, Taj'); // Use .val() instead of .value()
        }
    }
});

  // Convert spreadsheet date formats to readable dates
  $('td.date').each(function () {
    var due = $(this).html();
    const date = DateTime.fromISO(due)
    $(this).text(date.toLocaleString(DateTime.DATE_FULL));
  })

  // Convert numbers to relative dates 0 = today, -1 = yesterday
  $('.reldate').each(function () {
    var relDate = $(this).html();
    $(this).text(DateTime.now().plus({days: relDate}).toFormat('d MMMM yyyy'));
  })


  // Convert tags after decision to show the right colours
  $('.govuk-tag').each(function () {
    var tagName = $(this).text();

      if (tagName == "New reply") {
        $(this).removeClass('govuk-tag--grey');
        $(this).addClass('govuk-tag--yellow');
      }

      if (tagName == "Approved") {
        $(this).removeClass('govuk-tag--grey');
        $(this).addClass('govuk-tag--green');
      }

      if (tagName == "Rejected") {
        $(this).removeClass('govuk-tag--grey');
        $(this).addClass('govuk-tag--red');
      }
  })

  // Show and hide the Applictions added banner
  $( "#applicationsSuccess" ).delay(5000).fadeOut('slow');


  // Add people to the notify list
  var notifyCount = 0;

  $('a#addName').click(function() {
      var addNewName = $('input#my-autocomplete').val();
      if (addNewName !="") {
        $('dl#notify-list').append('<div class="govuk-summary-list__row"><dd class="govuk-summary-list__value">' + addNewName + '</dd><dd class="govuk-summary-list__actions"><a class="removeName govuk-link">Remove<span class="govuk-visually-hidden"> name</span></a></dd></div>');
        $('input#my-autocomplete').val("");
    };
  });

  $('dl#notify-list').on('click','a.removeName',function() {
   	$(this).closest('div').remove();
    e.preventDefault();
  });


  // POSTCODE

// Hide the full address fields and lookup button
  $('.full-address').hide();
  $('#lookup-address').hide();
  var enterAddress = "lookup";

  // Enter the address mannually
  $('a#enter-manually').click(function(e){
    var enterAddress = "manual";
    $(this).hide();
    $('.address-lookup').hide();
    $('.full-address').show();
    $('#lookup-address').show();
    e.preventDefault();
  });

  // Uuse the address Lookup
  $('a#lookup-address').click(function(e){
    var enterAddress = "lookup";
    $('.full-address').hide();
    $('#lookup-address').hide();
    $('.address-lookup').show();
    $('#enter-manually').show();
    e.preventDefault();
  });

  $('.sensitive-card').click(function(){
    $(this).children('.sensitive').toggle();
  });

  $('span#age').append(contactDOByear);

});
