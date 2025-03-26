window.GOVUKPrototypeKit.documentReady(function() {

    $('.moj-filter-tags--group').hide();

    function filterTable(tableId, noResultsId, prisonerNameNumber, selectedDepartments, selectedTypes) {
        var nameOrNumber = prisonerNameNumber.toLowerCase();
        var prisonNumber = (nameOrNumber.slice(-8, -1));
        
        var hasResults = false;

        $(tableId + ' tbody tr').each(function() {
            var tags = $(this).data('tags').toLowerCase();

            var showRow = (tags.indexOf(prisonNumber) > -1 || prisonNumber === '') &&
                          (selectedDepartments.length === 0 || selectedDepartments.some(dept => tags.indexOf(dept.toLowerCase()) > -1)) &&
                          (selectedTypes.length === 0 || selectedTypes.some(type => tags.indexOf(type.toLowerCase()) > -1));

            $(this).toggle(showRow);

            if (showRow) {
                hasResults = true;
            }
        });

        var visibleRows = $(tableId + ' tbody tr:visible').length;

        if (visibleRows > 0) {
            $(tableId).show();
            $(noResultsId).hide();
        } else {
            $(tableId).hide();
            $(noResultsId).show();
        }
    }

    function updateFilterTags(prisonerNameNumber, selectedDepartments, selectedTypes) {
        $('#dept-tags').empty();
        $('#prisoner-tags').empty();
        $('#type-tags').empty();

        if (prisonerNameNumber) {
            $('#prisoner-tags').append('<li><a href="#" class="moj-filter__tag">' + prisonerNameNumber + '</a></li>');
            $('#moj-filter-tags--prisoner').show();
        } else {
            $('#moj-filter-tags--prisoner').hide();
        }

        if (selectedDepartments.length > 0) {
            selectedDepartments.forEach(function(dept) {
                $('#dept-tags').append('<li><a href="#" class="moj-filter__tag">' + dept + '</a></li>');
            });
            $('#moj-filter-tags--dept').show();
        } else {
            $('#moj-filter-tags--dept').hide();
        }

        if (selectedTypes.length > 0) {
            selectedTypes.forEach(function(type) {
                $('#type-tags').append('<li><a href="#" class="moj-filter__tag">' + type + '</a></li>');
            });
            $('#moj-filter-tags--type').show();
        } else {
            $('#moj-filter-tags--type').hide();
        }
    }

    function clearFilters() {
        $('#prisoner-autocomplete').val('');
        $('input[name="departmentFilter"]').prop('checked', false);
        $('input[name="typeFilter"]').prop('checked', false);
        filterTable('#dataTable', '#noResults', $('#prisoner-autocomplete').val(), $('input[name="departmentFilter"]:checked').map(function() { return $(this).val(); }).get(), $('input[name="typeFilter"]:checked').map(function() { return $(this).val(); }).get());
        filterTable('#dataTable2', '#noResults2', $('#prisoner-autocomplete').val(), $('input[name="departmentFilter"]:checked').map(function() { return $(this).val(); }).get(), $('input[name="typeFilter"]:checked').map(function() { return $(this).val(); }).get());
        return false;
    }

    $('#applyFiltersButton').on('click', function() {
        filterTable('#dataTable', '#noResults', $('#prisoner-autocomplete').val(), $('input[name="departmentFilter"]:checked').map(function() { return $(this).val(); }).get(), $('input[name="typeFilter"]:checked').map(function() { return $(this).val(); }).get());
        filterTable('#dataTable2', '#noResults2', $('#prisoner-autocomplete').val(), $('input[name="departmentFilter"]:checked').map(function() { return $(this).val(); }).get(), $('input[name="typeFilter"]:checked').map(function() { return $(this).val(); }).get());
    });
    $('#clearFiltersButton').on('click', clearFilters);

    // Show all results by default
    $('#results').show();
    $('#noResults').hide();
    $('#results2').show();
    $('#noResults2').hide();

});