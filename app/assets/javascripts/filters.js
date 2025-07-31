$(document).ready(function() {
    // Accordion functionality for filters
    $(".filters-accordion__button").click(function(){
        if ($(this).attr('aria-expanded') === "false") {
            $(this).attr('aria-expanded', 'true');
            $(this).closest(".filters-accordion").toggleClass("js-closed");
        } else {
            // alert ("it's closed");
            $(this).attr('aria-expanded', 'false');
            $(this).closest(".filters-accordion").toggleClass("js-closed");
        }
    });
    
    // Only run if filterable elements exist on the page
    if ($('.filter-container').length === 0 || $('#applications-table').length === 0) {
        console.log('Filterable elements not found, skipping filter initialization');
        return;
    }
    
    var applicationsData = [];
    var departmentsData = [];
    var applicationTypesData = [];
    
    // Load all data files from API routes
    Promise.all([
        $.getJSON('/api/applications'),
        $.getJSON('/api/departments'),
        $.getJSON('/api/application-types')
    ]).then(function(results) {
        console.log('Data loaded successfully:');
        console.log('Applications:', results[0]);
        console.log('Departments:', results[1]);
        console.log('Application Types:', results[2]);
        
        applicationsData = results[0];
        departmentsData = results[1];
        applicationTypesData = results[2];
        
        console.log('Applications data length:', applicationsData.length);
        console.log('Departments data length:', departmentsData.length);
        console.log('Application types data length:', applicationTypesData.length);
        
        // Initialize the interface with loaded data
        initializeInterface();
    }).catch(function(error) {
        console.error('Failed to load data from JSON files:', error);
        console.error('Error details:', error.responseJSON);
    });
    
    function convertDateReceived(dateReceived) {
        // Convert relative dates like "-1", "-2" to actual dates
        var today = new Date();
        var daysAgo = Math.abs(parseInt(dateReceived));
        var targetDate = new Date(today);
        targetDate.setDate(today.getDate() - daysAgo);
        
        // Format as "DD Month YYYY"
        var options = { day: 'numeric', month: 'long', year: 'numeric' };
        return targetDate.toLocaleDateString('en-GB', options);
    }
    
    function isFirstNightLocation(priority) {
        // Check if priority indicates first night centre
        return priority === "fnc";
    }
    
    function displayResults(results) {
        // Target the specific table elements
        var $resultsCount = $('#applications-table .count');
        var $resultsTable = $('#applications-table #results-tbody');
        var $noResults = $('#applications-table').closest('.applications-table').find('#no-results');
        var $table = $('#applications-table');
        
        $resultsCount.text(results.length);
        
        if (results.length === 0) {
            $table.hide();
            $noResults.show();
            return;
        }
        
        $table.show();
        $noResults.hide();
        
        var html = '';
        results.forEach(function(item) {
            html += '<tr class="govuk-table__row">';
            html += '<td class="govuk-table__cell nowrap">' + convertDateReceived(item.date_received) + '</td>';
            html += '<td class="govuk-table__cell">';
            html += '<div class="application-type">' + item.app_type + '</div>';
            html += '<div class="application-category">' + item.app_group + '</div>';
            html += '</td>';
            html += '<td class="govuk-table__cell">';
            html += '<div class="prisoner-info">';
            html += '<div class="prisoner-name">' + item.prisoner_name + '</div>';
            html += '<div class="prisoner-id">(' + item.prisoner_number + ')</div>';
            // Removed the first night centre display - no longer shown in table
            // if (isFirstNightLocation(item.prisoner_location)) {
            //     html += '<div class="prisoner-location">First night centre</div>';
            // }
            html += '</div>';
            html += '</td>';
            html += '<td class="govuk-table__cell">' + item.current_dept + '</td>';
            html += '<td class="govuk-table__cell"><a href="#" class="view-link">View</a></td>';
            html += '</tr>';
        });
        
        $resultsTable.html(html);
    }
    
    function initializeInterface() {
        console.log('=== INSIDE initializeInterface ===');
        console.log('Raw applications data:', applicationsData);
        console.log('Applications data length:', applicationsData.length);
        
        if (applicationsData.length > 0) {
            console.log('First application:', applicationsData[0]);
            console.log('First application priority:', applicationsData[0].priority);
        }
        
        // Show all applications since there's no decision property anymore
        console.log('Showing all applications (no filtering by decision)');
        console.log('Total applications to display:', applicationsData.length);
        
        console.log('About to populate departments...');
        try {
            populateDepartments();
            console.log('Departments populated successfully');
        } catch (error) {
            console.error('Error populating departments:', error);
        }
        
        console.log('About to populate application types...');
        try {
            populateApplicationTypes();
            console.log('Application types populated successfully');
        } catch (error) {
            console.error('Error populating application types:', error);
        }
        
        console.log('About to initialize filters...');
        try {
            initializeFilters();
            console.log('Filters initialized successfully');
        } catch (error) {
            console.error('Error initializing filters:', error);
        }
        
        console.log('About to display results...');
        try {
            displayResults(applicationsData); // Show all applications
            console.log('Results displayed successfully');
        } catch (error) {
            console.error('Error displaying results:', error);
        }
    }
    
    function populateDepartments() {
        var $departmentList = $('.filter-container .department-list');
        $departmentList.empty();
        
        // Count applications per department
        var departmentCounts = {};
        applicationsData.forEach(function(app) {
            var dept = app.current_dept;
            departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
        });
        
        departmentsData.forEach(function(dept, index) {
            var deptName = dept.department_name;
            var deptCount = departmentCounts[deptName] || 0;
            var deptId = dept.department_id;
            
            var html = '<div class="govuk-checkboxes__item department-item">';
            html += '<input class="govuk-checkboxes__input" id="' + deptId + '" name="department" type="checkbox" value="' + deptName + '">';
            html += '<label class="govuk-label govuk-checkboxes__label" for="' + deptId + '">';
            html += deptName + ' (' + deptCount + ')';
            html += '</label>';
            html += '</div>';
            
            $departmentList.append(html);
        });
    }
    
    function populateApplicationTypes() {
        var $applicationTypeList = $('.filter-container .application-type-list');
        $applicationTypeList.empty();
        
        // Count applications per type (from actual data)
        var typeCounts = {};
        applicationsData.forEach(function(app) {
            var appType = app.app_type;
            typeCounts[appType] = (typeCounts[appType] || 0) + 1;
        });
        
        // Create a set of unique application types from the actual data
        var uniqueTypes = [...new Set(applicationsData.map(app => app.app_type))];
        
        uniqueTypes.forEach(function(appType, index) {
            var appTypeCount = typeCounts[appType] || 0;
            var appTypeId = 'app-type-' + index;
            
            // Show all types (even with 0 count for consistency)
            var html = '<div class="govuk-checkboxes__item application-type-item">';
            html += '<input class="govuk-checkboxes__input" id="' + appTypeId + '" name="application-type" type="checkbox" value="' + appType + '">';
            html += '<label class="govuk-label govuk-checkboxes__label" for="' + appTypeId + '">';
            html += appType + ' (' + appTypeCount + ')';
            html += '</label>';
            html += '</div>';
            
            $applicationTypeList.append(html);
        });
    }
    
    function initializeFilters() {
        var $container = $('.filter-container');
        var $prisonerSearch = $container.find('.prisoner-search');
        var $departmentSearch = $container.find('.department-search');
        var $applicationTypeSearch = $container.find('.application-type-search');
        var $selectedFilters = $container.find('.selected-filters');
        var $selectedTags = $container.find('.selected-tags');
        var $applyButton = $container.find('.apply-filters');
        var $clearButton = $container.find('.clear-filters');
        
        // Department search functionality
        $departmentSearch.on('keyup', function() {
            var searchTerm = $(this).val().toLowerCase();
            var hasVisibleItems = false;
            
            $container.find('.department-item').each(function() {
                var labelText = $(this).find('label').text().toLowerCase();
                
                if (labelText.includes(searchTerm)) {
                    $(this).show();
                    hasVisibleItems = true;
                } else {
                    $(this).hide();
                }
            });
            
            if (hasVisibleItems || searchTerm === '') {
                $container.find('.no-department-results').hide();
            } else {
                $container.find('.no-department-results').show();
            }
        });
        
        // Application type search functionality
        $applicationTypeSearch.on('keyup', function() {
            var searchTerm = $(this).val().toLowerCase();
            var hasVisibleItems = false;
            
            $container.find('.application-type-item').each(function() {
                var labelText = $(this).find('label').text().toLowerCase();
                
                if (labelText.includes(searchTerm)) {
                    $(this).show();
                    hasVisibleItems = true;
                } else {
                    $(this).hide();
                }
            });
            
            if (hasVisibleItems || searchTerm === '') {
                $container.find('.no-application-type-results').hide();
            } else {
                $container.find('.no-application-type-results').show();
            }
        });
        
        // Checkbox change handling
        $container.on('change', 'input[type="checkbox"]', function() {
            // Only visual feedback, no filter display updates
        });
        
        // Apply filters button
        $applyButton.on('click', function() {
            updateSelectedFilters();
            applyFilters();
        });
        
        // Clear filters
        $clearButton.on('click', function(e) {
            e.preventDefault();
            $container.find('input[type="checkbox"]').prop('checked', false);
            $prisonerSearch.val('');
            $departmentSearch.val('');
            $applicationTypeSearch.val('');
            
            // Reset checkbox visibility
            $container.find('.department-item, .application-type-item').show();
            $container.find('.no-department-results, .no-application-type-results').hide();
            
            updateSelectedFilters();
            applyFilters();
        });
        
        // Remove individual filter tags
        $selectedTags.on('click', '.moj-filter__tag', function(e) {
            e.preventDefault();
            var value = $(this).data('value');
            var type = $(this).data('type');
            
            if (type === 'prisoner') {
                $prisonerSearch.val('');
            } else {
                $container.find('input[value="' + value + '"]').prop('checked', false);
            }
            
            updateSelectedFilters();
            applyFilters();
        });
        
        function applyFilters() {
            var prisonerSearchTerm = $prisonerSearch.val().toLowerCase().trim();
            var selectedDepartments = [];
            var selectedApplicationTypes = [];
            var firstNightOnly = $container.find('input[name="priority"]:checked').length > 0;
            
            $container.find('input[name="department"]:checked').each(function() {
                selectedDepartments.push($(this).val());
            });
            
            $container.find('input[name="application-type"]:checked').each(function() {
                selectedApplicationTypes.push($(this).val());
            });
            
            var filteredData = applicationsData.filter(function(item) {
                // Prisoner name/number search
                if (prisonerSearchTerm) {
                    var nameMatch = item.prisoner_name.toLowerCase().includes(prisonerSearchTerm);
                    var idMatch = item.prisoner_number.toLowerCase().includes(prisonerSearchTerm);
                    if (!nameMatch && !idMatch) {
                        return false;
                    }
                }
                
                // First night filter
                if (firstNightOnly && !isFirstNightLocation(item.priority)) {
                    return false;
                }
                
                // Department filter
                if (selectedDepartments.length > 0 && !selectedDepartments.includes(item.current_dept)) {
                    return false;
                }
                
                // Application type filter
                if (selectedApplicationTypes.length > 0 && !selectedApplicationTypes.includes(item.app_type)) {
                    return false;
                }
                
                return true;
            });
            
            displayResults(filteredData);
        }
        
        function updateSelectedFilters() {
            var selectedFilters = [];
            
            // Add prisoner search if present
            var prisonerSearchValue = $prisonerSearch.val().trim();
            if (prisonerSearchValue) {
                selectedFilters.push({
                    label: 'Prisoner: ' + prisonerSearchValue,
                    value: prisonerSearchValue,
                    type: 'prisoner'
                });
            }
            
            // Add selected checkboxes
            $container.find('input[type="checkbox"]:checked').each(function() {
                var label = $(this).next('label').text().trim();
                var value = $(this).val();
                
                // Get the fieldset name from the accordion button text
                var $accordion = $(this).closest('.filters-accordion');
                var fieldsetName = $accordion.find('.filters-accordion__button').text().trim();
                
                selectedFilters.push({
                    label: label,
                    value: value,
                    fieldset: fieldsetName,
                    type: 'checkbox'
                });
            });
            
            if (selectedFilters.length > 0) {
                var tagsHtml = '';
                var groupedFilters = {};
                
                // Group filters by fieldset
                selectedFilters.forEach(function(filter) {
                    if (filter.type === 'prisoner') {
                        if (!groupedFilters['Search']) {
                            groupedFilters['Search'] = [];
                        }
                        groupedFilters['Search'].push(filter);
                    } else {
                        var fieldset = filter.fieldset;
                        if (!groupedFilters[fieldset]) {
                            groupedFilters[fieldset] = [];
                        }
                        groupedFilters[fieldset].push(filter);
                    }
                });
                
                // Build HTML for each group
                Object.keys(groupedFilters).forEach(function(fieldset) {
                    tagsHtml += '<h3 class="govuk-heading-s govuk-!-margin-bottom-0">' + fieldset + '</h3>';
                    tagsHtml += '<ul class="moj-filter-tags">';
                    
                    groupedFilters[fieldset].forEach(function(filter) {
                        tagsHtml += '<li><a class="moj-filter__tag" href="#" data-value="' + filter.value + '" data-type="' + filter.type + '">';
                        tagsHtml += '<span class="govuk-visually-hidden">Remove this filter</span> ';
                        if (filter.type === 'prisoner') {
                            tagsHtml += filter.label;
                        } else {
                            tagsHtml += filter.label.split('(')[0].trim();
                        }
                        tagsHtml += '</a></li>';
                    });
                    
                    tagsHtml += '</ul>';
                });
                
                $selectedTags.html(tagsHtml);
                $selectedFilters.show();
            } else {
                $selectedFilters.hide();
            }
        }
    }
});