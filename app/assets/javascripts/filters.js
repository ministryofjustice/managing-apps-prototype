window.GOVUKPrototypeKit.documentReady(() => {
  function filterTable() {
    var nameOrNumber = $('#prisoner-autocomplete').val().toLowerCase();
    
    var selectedDepartments = $('input[name="departmentFilter"]:checked').map(function() {
        return $(this).val().toLowerCase();
    }).get();
    
    var selectedTypes = $('input[name="typeFilter"]:checked').map(function() {
        return $(this).val().toLowerCase();
    }).get();

    $('#dataTable tbody tr').each(function() {
        var tags = $(this).data('tags').toLowerCase();

        var showRow = (tags.indexOf(nameOrNumber) > -1 || nameOrNumber === '') &&
                      (selectedDepartments.length === 0 || selectedDepartments.some(dept => tags.indexOf(dept) > -1)) &&
                      (selectedTypes.length === 0 || selectedTypes.some(type => tags.indexOf(type) > -1));

        $(this).toggle(showRow);
    });
}

function clearFilters() {
    $('#nameOrNumberFilter').val('');
    $('.departmentFilter').prop('checked', false);
    $('.typeFilter').prop('checked', false);
    filterTable();
}

$('#applyFiltersButton').on('click', filterTable);
$('#clearFiltersButton').on('click', clearFilters);

});
