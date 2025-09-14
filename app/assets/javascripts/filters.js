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
            
            if (selectedStatus === 'pending') {
                return status === 'pending' || !app.status;
            } else if (selectedStatus === 'closed') {
                if (includeApproved && includeDeclined) {
                    return status === 'closed' || status === 'approved' || status === 'declined';
                } else if (includeApproved) {
                    return status === 'approved';
                } else if (includeDeclined) {
                    return status === 'declined';
                } else {
                    return status === 'closed';
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
            $caption.text(results.length + ' applications');
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
            html += '<td class="govuk-table__cell">' + (item.status || 'Pending') + '</td>';
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
        
        // Initialize selected filters display with default pending selection
        updateSelectedFilters();
    }
    
    function populateDepartments() {
        var $departmentList = $('.filter-container .department-list');
        if (!$departmentList.length) return;
        
        $departmentList.empty();
        
        var currentApplications = getCurrentApplications();
        
        // Count applications per department for current filter
        var departmentCounts = {};
        currentApplications.forEach(function(app) {
            var dept = app.current_dept || 'Unassigned';
            departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
        });
        
        // Create list of available departments based on data
        var availableDepartments = [];
        
        // If we have departments data from API, use it
        if (departmentsData.length > 0) {
            availableDepartments = departmentsData.filter(function(dept) {
                return departmentCounts[dept.department_name] > 0;
            });
        } else {
            // Otherwise, create from application data
            Object.keys(departmentCounts).forEach(function(deptName) {
                availableDepartments.push({
                    department_id: deptName.toLowerCase().replace(/\s+/g, '-'),
                    department_name: deptName
                });
            });
        }
        
        // Sort alphabetically
        availableDepartments.sort(function(a, b) {
            return a.department_name.localeCompare(b.department_name);
        });
        
        // Hide department filter if no departments available
        var $departmentFilter = $('.filter-container fieldset:has(.department-list)');
        if (availableDepartments.length === 0) {
            $departmentFilter.hide();
            return;
        } else {
            $departmentFilter.show();
        }
        
        availableDepartments.forEach(function(dept) {
            var deptName = dept.department_name;
            var deptCount = departmentCounts[deptName] || 0;
            var deptId = dept.department_id || deptName.toLowerCase().replace(/\s+/g, '-');
            
            var html = '<div class="govuk-checkboxes__item department-item">';
            html += '<input class="govuk-checkboxes__input" id="dept-' + deptId + '" name="department" type="checkbox" value="' + deptName + '">';
            html += '<label class="govuk-label govuk-checkboxes__label" for="dept-' + deptId + '">';
            html += deptName + ' (' + deptCount + ')';
            html += '</label>';
            html += '</div>';
            
            $departmentList.append(html);
        });
    }
    
    function populateApplicationTypes() {
        var $applicationTypeList = $('.filter-container .application-type-list');
        if (!$applicationTypeList.length) return;
        
        $applicationTypeList.empty();
        
        var currentApplications = getCurrentApplications();
        
        // Count applications per type for current filter
        var typeCounts = {};
        currentApplications.forEach(function(app) {
            var appType = app.app_type;
            if (appType) {
                typeCounts[appType] = (typeCounts[appType] || 0) + 1;
            }
        });
        
        // Create a set of unique application types that have applications
        var availableTypes = Object.keys(typeCounts).sort();
        
        // Hide application type filter if no types available
        var $applicationTypeFilter = $('.filter-container fieldset:has(.application-type-list)');
        if (availableTypes.length === 0) {
            $applicationTypeFilter.hide();
            return;
        } else {
            $applicationTypeFilter.show();
        }
        
        availableTypes.forEach(function(appType, index) {
            var appTypeCount = typeCounts[appType] || 0;
            var appTypeId = 'app-type-' + index;
            
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
        var $applyButtons = $container.find('.apply-filters');
        var $clearButton = $container.find('.clear-filters');
        
        // Status radio button change handler with GOV.UK conditional reveal
        $container.on('change', 'input[name="status"]', function() {
            var selectedValue = $(this).val();
            var $conditionalReveal = $('#conditional-closed');
            
            // Show/hide conditional reveal for closed status
            if (selectedValue === 'closed') {
                $conditionalReveal.removeClass('govuk-radios__conditional--hidden');
                $conditionalReveal.attr('aria-hidden', 'false');
            } else {
                $conditionalReveal.addClass('govuk-radios__conditional--hidden');
                $conditionalReveal.attr('aria-hidden', 'true');
                // Uncheck closed sub-options when switching away from closed
                $('#status-approved, #status-declined').prop('checked', false);
            }
            
            // Refresh department and application type filters
            populateDepartments();
            populateApplicationTypes();
            updateSelectedFilters();
        });
        
        // Closed sub-status checkboxes
        $container.on('change', '#status-approved, #status-declined', function() {
            populateDepartments();
            populateApplicationTypes();
            updateSelectedFilters();
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
        
        // Filter checkboxes change handler
        $container.on('change', 'input[name="department"], input[name="application-type"], #first-night', function() {
            updateSelectedFilters();
        });
        
        // Prisoner search change handler
        $prisonerSearch.on('input', function() {
            updateSelectedFilters();
        });
        
        // Apply filters buttons
        $applyButtons.on('click', function() {
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