window.GOVUKPrototypeKit.documentReady(function() {

  // Show and hide the nested checkboxes

      // Open / close the accordions.

        $(".filters-accordion__button").click(function(){
            if ($(this).attr('aria-expanded') === "false") {
            $(this).attr('aria-expanded', 'true');
            $(this).closest(".filters-accordion").toggleClass("js-closed");
            } else {
            // alert ("it's closed");
            $(this).attr('aria-expanded', 'false');
            $(this).closest(".filters-accordion").toggleClass("js-closed");
            }
        })


          // filter the checkboxes by the input

            // Filter function for each instance
            $('.filter-search').on('keyup', function() {
                var searchTerm = $(this).val().toLowerCase();
                var $container = $(this).closest('.filter-container');
                var $checkboxList = $container.find('.checkbox-list');
                var $noResults = $container.find('.no-results');
                var hasVisibleItems = false;
                
                // Loop through each checkbox item in this container
                $checkboxList.find('.checkbox-item').each(function() {
                    var labelText = $(this).find('label').text().toLowerCase();
                    
                    // Check if the label contains the search term
                    if (labelText.includes(searchTerm)) {
                        $(this).show();
                        hasVisibleItems = true;
                    } else {
                        $(this).hide();
                    }
                });
                
                // Show/hide "no results" message for this container
                if (hasVisibleItems || searchTerm === '') {
                    $noResults.hide();
                } else {
                    $noResults.show();
                }
            });
            
            // Optional: Clear search functionality
            $('.filter-search').on('focus', function() {
                var $container = $(this).closest('.filter-container');
                if ($(this).val() === '') {
                    $container.find('.checkbox-item').show();
                    $container.find('.no-results').hide();
                }
            });






  $('.govuk-checkboxes__children').hide();

    $('.govuk-checkboxes__parent .govuk-checkboxes__input').on('change', function() {
        var $childrenDiv = $(this).closest('.govuk-checkboxes__nested').find('.govuk-checkboxes__children');
        if ($(this).is(':checked')) {
            $childrenDiv.show();
        } else {
            $childrenDiv.hide();
        }
    });
    
    // Hide filter tag groups that don't have tags yet
    $('.moj-filter-tags--group').each(function() {
        var $group = $(this);
        if ($group.find('.moj-filter-tags li').length === 0) {
            $group.hide();
        }
    });

    // Add a container for the "no filters" message if it doesn't exist
    if ($('#no-filters-message').length === 0) {
        $('.moj-filter__selected').append(
            '<div id="no-filters-message" class="govuk-body">' +
            'No filters selected' +
            '</div>'
        );
    }

    function filterTable(tableId, noResultsId, prisonerValue, selectedDepartments, selectedTypes) {
        // Store if any results were found
        var hasResults = false;
        
        // If the table doesn't exist, return early
        if ($(tableId).length === 0) return;
        
        // Get the lowercase prisoner value for case-insensitive comparison
        var prisonerLower = prisonerValue ? prisonerValue.toLowerCase() : '';
        
        $(tableId + ' tbody tr').each(function() {
            var tags = $(this).data('tags').toLowerCase();
            
            // Check if the row matches all selected filters
            var matchesPrisoner = prisonerLower === '' || tags.indexOf(prisonerLower) > -1;
            var matchesDepartment = selectedDepartments.length === 0 || 
                                   selectedDepartments.some(dept => tags.indexOf(dept.toLowerCase()) > -1);
            var matchesType = selectedTypes.length === 0 || 
                             selectedTypes.some(type => tags.indexOf(type.toLowerCase()) > -1);
            
            var showRow = matchesPrisoner && matchesDepartment && matchesType;
            
            // Show or hide the row
            $(this).toggle(showRow);
            
            if (showRow) {
                hasResults = true;
            }
        });
        
        // Show/hide the no results message
        if ($(noResultsId).length > 0) {
            if (hasResults) {
                $(tableId).show();
                $(noResultsId).hide();
            } else {
                $(tableId).hide();
                $(noResultsId).show();
            }
        }
    }

    function updateFilterTags(prisonerValue, selectedDepartments, selectedTypes) {
        // Clear existing tags
        $('#prisoner-tags').empty();
        $('#dept-tags').empty();
        $('#type-tags').empty();

        // Check if any filters are selected
        var anyFiltersSelected = prisonerValue || selectedDepartments.length > 0 || selectedTypes.length > 0;
        
        // Show/hide the "no filters" message
        if (anyFiltersSelected) {
            $('#no-filters-message').hide();
        } else {
            $('#no-filters-message').show();
        }

        // Add prisoner tag if selected
        if (prisonerValue) {
            $('#prisoner-tags').append('<li><a href="#" class="moj-filter__tag prisoner-tag">' + prisonerValue + '<span class="govuk-visually-hidden">Remove this filter</span></a></li>');
            $('#moj-filter-tags--prisoner').show();
        } else {
            $('#moj-filter-tags--prisoner').hide();
        }

        // Add department tags
        if (selectedDepartments.length > 0) {
            selectedDepartments.forEach(function(dept) {
                $('#dept-tags').append('<li><a href="#" class="moj-filter__tag dept-tag" data-value="' + dept + '">' + dept + '<span class="govuk-visually-hidden">Remove this filter</span></a></li>');
            });
            $('#moj-filter-tags--dept').show();
        } else {
            $('#moj-filter-tags--dept').hide();
        }

        // Add type tags
        if (selectedTypes.length > 0) {
            selectedTypes.forEach(function(type) {
                $('#type-tags').append('<li><a href="#" class="moj-filter__tag type-tag" data-value="' + type + '">' + type + '<span class="govuk-visually-hidden">Remove this filter</span></a></li>');
            });
            $('#moj-filter-tags--type').show();
        } else {
            $('#moj-filter-tags--type').hide();
        }

        // Add event listeners to the filter tags
        $('.prisoner-tag').on('click', function(e) {
            e.preventDefault();
            $('.autocomplete__input').val('');
            $('#prisoner-autocomplete').val('');
            applyFilters();
        });

        $('.dept-tag').on('click', function(e) {
            e.preventDefault();
            var value = $(this).data('value');
            $('input[name="departmentFilter"][value="' + value + '"]').prop('checked', false);
            applyFilters();
        });

        $('.type-tag').on('click', function(e) {
            e.preventDefault();
            var value = $(this).data('value');
            $('input[name="typeFilter"][value="' + value + '"]').prop('checked', false);
            applyFilters();
        });
    }

    function applyFilters() {
        // Get current filter values
        var prisonerValue = $('.autocomplete__input').val() || '';
        var selectedDepartments = $('input[name="departmentFilter"]:checked').map(function() { return $(this).val(); }).get();
        var selectedTypes = $('input[name="typeFilter"]:checked').map(function() { return $(this).val(); }).get();
        
        // Update the filter tags
        updateFilterTags(prisonerValue, selectedDepartments, selectedTypes);
        
        // Apply filters to tables
        filterTable('#dataTable', '#noResults', prisonerValue, selectedDepartments, selectedTypes);
        
        // Only apply to second table if it exists
        if ($('#dataTable2').length > 0 && $('#noResults2').length > 0) {
            filterTable('#dataTable2', '#noResults2', prisonerValue, selectedDepartments, selectedTypes);
        }
    }

    function clearFilters() {
        // Clear all inputs
        $('.autocomplete__input').val('');
        $('#prisoner-autocomplete').val('');
        $('input[name="departmentFilter"]').prop('checked', false);
        $('input[name="typeFilter"]').prop('checked', false);
        
        // Apply the empty filters
        applyFilters();
        
        return false;
    }

    // Add event listeners
    $('#applyFiltersButton').on('click', function(e) {
        e.preventDefault();
        applyFilters();
    });
    
    $('#clearFiltersButton').on('click', function(e) {
        e.preventDefault();
        clearFilters();
    });

    // Apply initial filters (if any are pre-selected)
    applyFilters();
});