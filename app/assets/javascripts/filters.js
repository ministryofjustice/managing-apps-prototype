$(document).ready(function() {
    // Only run if filterable elements exist on the page
    if ($('.filter-container').length === 0 || $('#applications-table').length === 0) {
        console.log('Filterable elements not found, skipping filter initialization');
        return;
    }
    
    var allApplicationsData = [];
    var departmentsData = [];
    var applicationTypesData = [];
    var sessionApplications = [];
    
    // Get session applications from template (if passed from server)
    if (typeof window.sessionApplications !== 'undefined') {
        sessionApplications = window.sessionApplications;
        console.log('Session applications loaded:', sessionApplications.length);
    }
    
    // Load all data files from API routes
    Promise.all([
        $.getJSON('/api/applications').catch(function(error) {
            console.error('Failed to load applications:', error);
            return [];
        }),
        $.getJSON('/api/departments').catch(function(error) {
            console.error('Failed to load departments:', error);
            return [];
        }),
        $.getJSON('/api/application-types').catch(function(error) {
            console.error('Failed to load application types:', error);
            return [];
        })
    ]).then(function(results) {
        console.log('Data loaded successfully');
        
        // Handle both array and object structures for applications
        if (Array.isArray(results[0])) {
            allApplicationsData = results[0];
        } else if (results[0] && results[0].applications) {
            allApplicationsData = results[0].applications;
        } else if (results[0] && typeof results[0] === 'object') {
            var possibleArrays = Object.values(results[0]).filter(Array.isArray);
            if (possibleArrays.length > 0) {
                allApplicationsData = possibleArrays[0];
            } else {
                console.error('Could not find applications array in:', results[0]);
                allApplicationsData = [];
            }
        } else {
            allApplicationsData = [];
        }
        
        departmentsData = Array.isArray(results[1]) ? results[1] : [];
        applicationTypesData = Array.isArray(results[2]) ? results[2] : [];
        
        // Combine API data with session data
        if (sessionApplications.length > 0) {
            allApplicationsData = [...sessionApplications, ...allApplicationsData];
        }
        
        console.log('Total applications:', allApplicationsData.length);
        console.log('Departments:', departmentsData.length);
        console.log('Application types:', applicationTypesData.length);
        
        // Initialize the interface
        initializeInterface();
        
    }).catch(function(error) {
        console.error('Failed to load data:', error);
        // If API fails, try to use session data
        if (sessionApplications.length > 0) {
            allApplicationsData = sessionApplications;
            initializeInterface();
        }
    });
    
    function convertDateReceived(dateReceived) {
        if (dateReceived === 0 || dateReceived === '0') {
            return new Date().toLocaleDateString('en-GB', { 
                day: 'numeric', month: 'long', year: 'numeric' 
            });
        }
        
        var today = new Date();
        var daysAgo = Math.abs(parseInt(dateReceived));
        var targetDate = new Date(today);
        targetDate.setDate(today.getDate() - daysAgo);
        
        var options = { day: 'numeric', month: 'long', year: 'numeric' };
        return targetDate.toLocaleDateString('en-GB', options);
    }
    
    function isFirstNightLocation(priority) {
        return priority === "fnc";
    }
    
    function getCurrentApplications() {
        var selectedStatus = $('input[name="status"]:checked').val();
        var includeApproved = $('#status-approved').is(':checked');
        var includeDeclined = $('#status-declined').is(':checked');
        
        return allApplicationsData.filter(function(app) {
            var status = app.status ? app.status.toLowerCase() : 'pending';
            var decision = app.decision ? app.decision.toLowerCase() : '';
            
            if (selectedStatus === 'pending') {
                return status === 'pending' || !app.status;
            } else if (selectedStatus === 'closed') {
                // First check if the application is closed
                var isClosed = status === 'closed';
                
                if (!isClosed) {
                    return false;
                }
                
                // If no specific decision filters are selected, show all closed applications
                if (!includeApproved && !includeDeclined) {
                    return true;
                }
                
                // If both are selected, show all closed applications
                if (includeApproved && includeDeclined) {
                    return true;
                }
                
                // If only approved is selected, show only approved decisions
                if (includeApproved && !includeDeclined) {
                    return decision === 'approved';
                }
                
                // If only declined is selected, show only declined decisions
                if (includeDeclined && !includeApproved) {
                    return decision === 'declined';
                }
            }
            return false;
        });
    }
    
    function displayResults(results) {
        // Update both possible table structures
        var $resultsCount = $('#applications-table .count, #applications-table-closed .count');
        var $resultsTable = $('#applications-table tbody, #applications-table-closed tbody, #results-tbody, #results-tbody-closed');
        var $noResults = $('.applications-table .no-results');
        var $table = $('#applications-table, #applications-table-closed');
        var $caption = $('#applications-table caption, #applications-table-closed caption');
        
        // Update count in caption
        if ($caption.length) {
            $caption.text('Showing ' + results.length + ' applications');
        }
        if ($resultsCount.length) {
            $resultsCount.text(results.length);
        }
        
        if (results.length === 0) {
            $table.hide();
            $noResults.show();
            return;
        }
        
        $table.show();
        $noResults.hide();
        
        var html = '';
        results.forEach(function(item) {
            var viewUrl = item.app_url || (window.homeurl + 'applications/view/app/application?url_id=' + item.app_id);
            
            html += '<tr class="govuk-table__row">';
            html += '<td class="govuk-table__cell nowrap">' + convertDateReceived(item.date_received) + '</td>';
            html += '<td class="govuk-table__cell">';
            html += '<div class="application-type">' + item.app_type + '</div>';
            html += '</td>';
            html += '<td class="govuk-table__cell">';
            html += '<div class="prisoner-info">';
            html += '<div class="prisoner-name">' + item.prisoner_name + '</div>';
            html += '<div class="prisoner-id govuk-table__subtext govuk-body-s">(' + item.prisoner_number + ')</div>';
            html += '</div>';
            html += '</td>';
            html += '<td class="govuk-table__cell">' + (item.current_dept || 'Unassigned') + '</td>';
            html += '<td class="govuk-table__cell">';
            if (item.status && item.status.toLowerCase() === 'closed' && item.decision) {
                html += '<div>' + (item.status || 'Pending') + '</div>';
                html += '<div class="govuk-table__subtext govuk-body-s">(' + item.decision + ')</div>';
            } else {
                html += (item.status || 'Pending');
            }
            html += '</td>';
            html += '<td class="govuk-table__cell"><a href="' + viewUrl + '" class="govuk-link">View</a></td>';
            html += '</tr>';
        });
        
        $resultsTable.html(html);
    }
    
    function initializeInterface() {
        // Ensure pending is selected by default
        if (!$('input[name="status"]:checked').length) {
            $('#status-pending').prop('checked', true);
        }
        
        // Initialize filters and display
        populateDepartments();
        populateApplicationTypes();
        initializeFilters();
        
        // Initial load with current applications
        var currentApplications = getCurrentApplications();
        displayResults(currentApplications);
        
        // Don't show selected filters until apply button is pressed
        // updateSelectedFilters(); - removed this line
    }
    
function populateDepartments() {
    console.log('=== populateDepartments() called ===');
    var $departmentList = $('.filter-container .department-list');
    if (!$departmentList.length) return;
    
    // Save currently selected departments before clearing
    var currentlySelected = [];
    $('.filter-container input[name="department"]:checked').each(function() {
        currentlySelected.push($(this).val());
    });
    console.log('Departments currently selected:', currentlySelected);
    
    $departmentList.empty();
    
    // Get current filter state (excluding departments to avoid circular filtering)
    var prisonerSearchTerm = $('.filter-container .prisoner-search').val().toLowerCase().trim();
    var selectedApplicationTypes = [];
    var firstNightOnly = $('.filter-container #first-night').is(':checked');
    
    $('.filter-container input[name="application-type"]:checked').each(function() {
        selectedApplicationTypes.push($(this).val());
    });
    
    var currentApplications = getCurrentApplications();
    
    // Apply all filters except department filter
    var filteredApplications = currentApplications.filter(function(item) {
        // Prisoner name/number search
        if (prisonerSearchTerm) {
            var nameMatch = item.prisoner_name && item.prisoner_name.toLowerCase().includes(prisonerSearchTerm);
            var idMatch = item.prisoner_number && item.prisoner_number.toLowerCase().includes(prisonerSearchTerm);
            if (!nameMatch && !idMatch) {
                return false;
            }
        }
        
        // First night filter
        if (firstNightOnly && !isFirstNightLocation(item.priority)) {
            return false;
        }
        
        // Application type filter
        if (selectedApplicationTypes.length > 0 && !selectedApplicationTypes.includes(item.app_type)) {
            return false;
        }
        
        return true;
    });
    
    // Count applications per department
    var departmentCounts = {};
    filteredApplications.forEach(function(app) {
        var dept = app.current_dept || 'Unassigned';
        departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });
    
    // Only show departments that have applications
    var availableDepartments = Object.keys(departmentCounts);
    availableDepartments.sort();
    
    availableDepartments.forEach(function(deptName) {
        var deptCount = departmentCounts[deptName];
        var deptId = deptName.toLowerCase().replace(/\s+/g, '-');
        
        var html = '<div class="govuk-checkboxes__item department-item">';
        html += '<input class="govuk-checkboxes__input" id="dept-' + deptId + '" name="department" type="checkbox" value="' + deptName + '"';
        
        // Only restore selection if this department is still available
        if (currentlySelected.includes(deptName)) {
            html += ' checked';
        }
        
        html += '>';
        html += '<label class="govuk-label govuk-checkboxes__label" for="dept-' + deptId + '">';
        html += deptName + ' (' + deptCount + ')';
        html += '</label>';
        html += '</div>';
        
        $departmentList.append(html);
    });
    
    console.log('Populated departments:', availableDepartments.length, 'available');
}


function populateApplicationTypes() {
    console.log('=== populateApplicationTypes() called ===');
    var $applicationTypeList = $('.filter-container .application-type-list');
    if (!$applicationTypeList.length) return;
    
    // Save currently selected application types before clearing
    var currentlySelected = [];
    $('.filter-container input[name="application-type"]:checked').each(function() {
        currentlySelected.push($(this).val());
    });
    console.log('App types currently selected:', currentlySelected);
    
    $applicationTypeList.empty();
    
    // Get current filter state (excluding application types to avoid circular filtering)
    var prisonerSearchTerm = $('.filter-container .prisoner-search').val().toLowerCase().trim();
    var selectedDepartments = [];
    var firstNightOnly = $('.filter-container #first-night').is(':checked');
    
    $('.filter-container input[name="department"]:checked').each(function() {
        selectedDepartments.push($(this).val());
    });
    
    console.log('Selected departments for filtering app types:', selectedDepartments);
    
    var currentApplications = getCurrentApplications();
    console.log('Current applications before department filter:', currentApplications.length);
    
    // Apply all filters except application type filter
    var filteredApplications = currentApplications.filter(function(item) {
        // Prisoner name/number search
        if (prisonerSearchTerm) {
            var nameMatch = item.prisoner_name && item.prisoner_name.toLowerCase().includes(prisonerSearchTerm);
            var idMatch = item.prisoner_number && item.prisoner_number.toLowerCase().includes(prisonerSearchTerm);
            if (!nameMatch && !idMatch) {
                return false;
            }
        }
        
        // First night filter
        if (firstNightOnly && !isFirstNightLocation(item.priority)) {
            return false;
        }
        
        // Department filter
        if (selectedDepartments.length > 0) {
            var itemDept = item.current_dept || 'Unassigned';
            console.log('Checking app:', item.app_type, 'in dept:', itemDept, 'against selected:', selectedDepartments);
            if (!selectedDepartments.includes(itemDept)) {
                return false;
            }
        }
        
        return true;
    });
    
    console.log('Filtered applications after department filter:', filteredApplications.length);
    
    // Count applications per type
    var typeCounts = {};
    filteredApplications.forEach(function(app) {
        var appType = app.app_type;
        if (appType) {
            typeCounts[appType] = (typeCounts[appType] || 0) + 1;
        }
    });
    
    console.log('Application type counts:', typeCounts);

    // Only show application types that have applications
    var availableTypes = Object.keys(typeCounts);
    availableTypes.sort();
    
    availableTypes.forEach(function(appType, index) {
        var appTypeCount = typeCounts[appType];
        var appTypeId = 'app-type-' + index;
        
        var html = '<div class="govuk-checkboxes__item application-type-item">';
        html += '<input class="govuk-checkboxes__input" id="' + appTypeId + '" name="application-type" type="checkbox" value="' + appType + '"';
        
        // Only restore selection if this application type is still available
        if (currentlySelected.includes(appType)) {
            html += ' checked';
        }
        
        html += '>';
        html += '<label class="govuk-label govuk-checkboxes__label" for="' + appTypeId + '">';
        html += appType + ' (' + appTypeCount + ')';
        html += '</label>';
        html += '</div>';
        
        $applicationTypeList.append(html);
    });
    
    console.log('Populated application types:', availableTypes.length, 'available');
}
    
    function getFilteredApplicationsForCounting() {
        var prisonerSearchTerm = $('.filter-container .prisoner-search').val().toLowerCase().trim();
        var selectedDepartments = [];
        var selectedApplicationTypes = [];
        var firstNightOnly = $('.filter-container #first-night').is(':checked');
        
        $('.filter-container input[name="department"]:checked').each(function() {
            selectedDepartments.push($(this).val());
        });
        
        $('.filter-container input[name="application-type"]:checked').each(function() {
            selectedApplicationTypes.push($(this).val());
        });
        
        var currentApplications = getCurrentApplications();
        
        return currentApplications.filter(function(item) {
            // Prisoner name/number search
            if (prisonerSearchTerm) {
                var nameMatch = item.prisoner_name && item.prisoner_name.toLowerCase().includes(prisonerSearchTerm);
                var idMatch = item.prisoner_number && item.prisoner_number.toLowerCase().includes(prisonerSearchTerm);
                if (!nameMatch && !idMatch) {
                    return false;
                }
            }
            
            // First night filter
            if (firstNightOnly && !isFirstNightLocation(item.priority)) {
                return false;
            }
            
            return true;
        });
    }
    
    function getFilteredApplicationsForDepartments() {
        var prisonerSearchTerm = $('.filter-container .prisoner-search').val().toLowerCase().trim();
        var selectedApplicationTypes = [];
        var firstNightOnly = $('.filter-container #first-night').is(':checked');
        
        $('.filter-container input[name="application-type"]:checked').each(function() {
            selectedApplicationTypes.push($(this).val());
        });
        
        var currentApplications = getCurrentApplications();
        
        return currentApplications.filter(function(item) {
            // Prisoner name/number search
            if (prisonerSearchTerm) {
                var nameMatch = item.prisoner_name && item.prisoner_name.toLowerCase().includes(prisonerSearchTerm);
                var idMatch = item.prisoner_number && item.prisoner_number.toLowerCase().includes(prisonerSearchTerm);
                if (!nameMatch && !idMatch) {
                    return false;
                }
            }
            
            // First night filter
            if (firstNightOnly && !isFirstNightLocation(item.priority)) {
                return false;
            }
            
            // Application type filter (when populating departments)
            if (selectedApplicationTypes.length > 0 && !selectedApplicationTypes.includes(item.app_type)) {
                return false;
            }
            
            return true;
        });
    }
    
    function getFilteredApplicationsForApplicationTypes() {
        var prisonerSearchTerm = $('.filter-container .prisoner-search').val().toLowerCase().trim();
        var selectedDepartments = [];
        var firstNightOnly = $('.filter-container #first-night').is(':checked');
        
        $('.filter-container input[name="department"]:checked').each(function() {
            selectedDepartments.push($(this).val());
        });
        
        var currentApplications = getCurrentApplications();
        
        return currentApplications.filter(function(item) {
            // Prisoner name/number search
            if (prisonerSearchTerm) {
                var nameMatch = item.prisoner_name && item.prisoner_name.toLowerCase().includes(prisonerSearchTerm);
                var idMatch = item.prisoner_number && item.prisoner_number.toLowerCase().includes(prisonerSearchTerm);
                if (!nameMatch && !idMatch) {
                    return false;
                }
            }
            
            // First night filter
            if (firstNightOnly && !isFirstNightLocation(item.priority)) {
                return false;
            }
            
            // Department filter (when populating application types)
            if (selectedDepartments.length > 0) {
                var itemDept = item.current_dept || 'Unassigned';
                if (!selectedDepartments.includes(itemDept)) {
                    return false;
                }
            }
            
            return true;
        });
    }
    
    function restoreSelectedValues(filterType) {
        // This function has been removed - selections are now handled inline
        // to avoid restoring selections that shouldn't exist after cross-filtering
    }
    
    function saveSelectedValues() {
        // This function has been removed - selections are now handled inline
        // to avoid conflicts with cross-filtering behavior
    }
    
    function initializeFilters() {
        var $container = $('.filter-container');
        var $prisonerSearch = $container.find('.prisoner-search');
        var $departmentSearch = $container.find('.department-search');
        var $applicationTypeSearch = $container.find('.application-type-search');
        var $selectedFilters = $container.find('.selected-filters');
        var $selectedTags = $container.find('.selected-tags');
        var $applyButtons = $container.find('.apply-filters');
        var $clearButton = $container.find('.clear-filters');
        
      
        // Closed sub-status checkboxes
        $container.on('change', '#status-approved, #status-declined', function() {
            // Don't refresh department and application type filters automatically
            // They will be refreshed when apply button is clicked
        });
        
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
            
            var $noResults = $container.find('.no-department-results');
            if (hasVisibleItems || searchTerm === '') {
                $noResults.hide();
            } else {
                $noResults.show();
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
            
            var $noResults = $container.find('.no-application-type-results');
            if (hasVisibleItems || searchTerm === '') {
                $noResults.hide();
            } else {
                $noResults.show();
            }
        });
        
        // Filter checkboxes change handler - removed updateSelectedFilters() call
        $container.on('change', 'input[name="department"], input[name="application-type"], #first-night', function() {
            // Only update filters when apply button is pressed
        });
                
        // Apply filters buttons
        $applyButtons.on('click', function() {
            // First, update the cross-filtering of available options
            populateDepartments();
            populateApplicationTypes();
            
            // Then update the filter tags and apply to table
            updateSelectedFilters();
            applyFilters();
        });
        
        // Clear filters
        $clearButton.on('click', function(e) {
            e.preventDefault();
            
            // Reset to defaults
            $container.find('input[type="checkbox"]').prop('checked', false);
            $('#status-pending').prop('checked', true);
            $('#conditional-closed').addClass('govuk-radios__conditional--hidden');
            $('#conditional-closed').attr('aria-hidden', 'true');
            $prisonerSearch.val('');
            $departmentSearch.val('');
            $applicationTypeSearch.val('');
            
            // Reset checkbox visibility
            $container.find('.department-item, .application-type-item').show();
            $container.find('.no-department-results, .no-application-type-results').hide();
            
            // Refresh filters and apply
            populateDepartments();
            populateApplicationTypes();
            updateSelectedFilters();
            applyFilters();
        });
        
        // Remove individual filter tags (MoJ pattern)
        $selectedTags.on('click', '.moj-filter__tag', function(e) {
            e.preventDefault();
            var value = $(this).data('value');
            var type = $(this).data('type');
            
            if (type === 'prisoner') {
                $prisonerSearch.val('');
            } else if (type === 'status') {
                // Reset to pending when removing status filter
                $('#status-pending').prop('checked', true);
                $('#conditional-closed').addClass('govuk-radios__conditional--hidden');
                $('#conditional-closed').attr('aria-hidden', 'true');
                $('#status-approved, #status-declined').prop('checked', false);
            } else if (type === 'checkbox') {
                $container.find('input[value="' + value + '"]').prop('checked', false);
            }
            
            populateDepartments();
            populateApplicationTypes();
            updateSelectedFilters();
            applyFilters();
        });
        
        function applyFilters() {
            var prisonerSearchTerm = $prisonerSearch.val().toLowerCase().trim();
            var selectedDepartments = [];
            var selectedApplicationTypes = [];
            var firstNightOnly = $container.find('#first-night').is(':checked');
            
            $container.find('input[name="department"]:checked').each(function() {
                selectedDepartments.push($(this).val());
            });
            
            $container.find('input[name="application-type"]:checked').each(function() {
                selectedApplicationTypes.push($(this).val());
            });
            
            var currentApplications = getCurrentApplications();
            
            var filteredData = currentApplications.filter(function(item) {
                // Prisoner name/number search
                if (prisonerSearchTerm) {
                    var nameMatch = item.prisoner_name && item.prisoner_name.toLowerCase().includes(prisonerSearchTerm);
                    var idMatch = item.prisoner_number && item.prisoner_number.toLowerCase().includes(prisonerSearchTerm);
                    if (!nameMatch && !idMatch) {
                        return false;
                    }
                }
                
                // First night filter
                if (firstNightOnly && !isFirstNightLocation(item.priority)) {
                    return false;
                }
                
                // Department filter
                if (selectedDepartments.length > 0) {
                    var itemDept = item.current_dept || 'Unassigned';
                    if (!selectedDepartments.includes(itemDept)) {
                        return false;
                    }
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
            
            // Add status filter (always show current selection)
            var selectedStatus = $('input[name="status"]:checked').val() || 'pending';
            var statusLabel = selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1);
            
            // Add sub-status for closed
            if (selectedStatus === 'closed') {
                var subStatuses = [];
                if ($('#status-approved').is(':checked')) subStatuses.push('Approved');
                if ($('#status-declined').is(':checked')) subStatuses.push('Declined');
                
                if (subStatuses.length > 0) {
                    statusLabel += ' (' + subStatuses.join(', ') + ')';
                }
            }
            
            selectedFilters.push({
                label: statusLabel,
                value: selectedStatus,
                fieldset: 'Status',
                type: 'status'
            });
            
            // Add first night if selected
            if ($('#first-night').is(':checked')) {
                selectedFilters.push({
                    label: 'First night centre or early days centre',
                    value: 'first-night',
                    fieldset: 'Priority',
                    type: 'checkbox'
                });
            }
            
            // Add selected checkboxes
            $container.find('input[name="department"]:checked, input[name="application-type"]:checked').each(function() {
                var label = $(this).next('label').text().trim();
                var value = $(this).val();
                var fieldset = $(this).attr('name') === 'department' ? 'Department' : 'Application type';
                
                selectedFilters.push({
                    label: label,
                    value: value,
                    fieldset: fieldset,
                    type: 'checkbox'
                });
            });
            
            // Update the selected filters display using MoJ pattern
            if (selectedFilters.length > 0) {
                var tagsHtml = '';
                var groupedFilters = {};
                
                // Group filters by fieldset
                selectedFilters.forEach(function(filter) {
                    var fieldset = filter.fieldset || (filter.type === 'prisoner' ? 'Search' : 'Other');
                    if (!groupedFilters[fieldset]) {
                        groupedFilters[fieldset] = [];
                    }
                    groupedFilters[fieldset].push(filter);
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
                        } else if (filter.type === 'checkbox') {
                            // Remove count from label for display
                            tagsHtml += filter.label.split('(')[0].trim();
                        } else {
                            tagsHtml += filter.label;
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