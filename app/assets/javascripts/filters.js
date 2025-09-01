$(document).ready(function () {
    // Accordion functionality for filters
    $(".filters-accordion__button").click(function () {
        if ($(this).attr('aria-expanded') === "false") {
            $(this).attr('aria-expanded', 'true');
            $(this).closest(".filters-accordion").toggleClass("js-closed");
        } else {
            $(this).attr('aria-expanded', 'false');
            $(this).closest(".filters-accordion").toggleClass("js-closed");
        }
    });

    // Only run if filterable elements exist on the page
    if ($('.filter-container').length === 0 || $('.applications-table').length === 0) {
        console.log('Filterable elements not found, skipping filter initialization');
        return;
    }

    var allApplicationsData = [];
    var departmentsData = [];
    var applicationTypesData = [];
    var sessionApplications = [];
    var currentTab = 'pending'; // Track current active tab

    // Get session applications from template (if passed from server)
    if (typeof window.sessionApplications !== 'undefined') {
        sessionApplications = window.sessionApplications;
    }

    // Load all data files from API routes
    Promise.all([
        $.getJSON('/api/applications'),
        $.getJSON('/api/departments'),
        $.getJSON('/api/application-types')
    ]).then(function (results) {
        console.log('Promise resolved with:', results);

        // Handle both array and object structures for applications
        if (Array.isArray(results[0])) {
            allApplicationsData = results[0];
            console.log('Used array path, assigned:', allApplicationsData.length, 'applications');
        } else {
            allApplicationsData = [];
            console.log('Fell through to empty array');
        }

        console.log('allApplicationsData length:', allApplicationsData.length);
        console.log('First app:', allApplicationsData[0]);

        // Handle both array and object structures for applications
        if (Array.isArray(results[0])) {
            allApplicationsData = results[0];
        } else if (results[0] && results[0].applications) {
            allApplicationsData = results[0].applications;
        } else {
            allApplicationsData = [];
        }

        departmentsData = results[1];
        applicationTypesData = results[2];

        // Combine API data with session data
        if (sessionApplications.length > 0) {
            allApplicationsData = [...sessionApplications, ...allApplicationsData];
        }

        console.log('Total applications:', allApplicationsData.length);

        // Initialize the interface
        initializeInterface();

        // Initialize tabs
        initializeTabs();

    }).catch(function (error) {
        console.error('Failed to load data:', error);
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
        console.log('getCurrentApplications called, currentTab:', currentTab);
        console.log('allApplicationsData length:', allApplicationsData.length);

        var filtered = allApplicationsData.filter(function (app) {
            var status = app.status ? app.status.toLowerCase() : '';
            console.log('App status:', app.status, '-> lowercase:', status);

            if (currentTab === 'pending') {
                var matches = status === 'pending' || !app.status;
                console.log('Pending filter result:', matches);
                return matches;
            } else if (currentTab === 'closed') {
                return status === 'closed' || status === 'approved' || status === 'declined';
            }
            return false;
        });

        console.log('Filtered applications count:', filtered.length);
        return filtered;
    }

    function displayResults(results, targetTableId) {
        targetTableId = targetTableId || 'applications-table-' + currentTab;

        var $resultsCount = $('#' + targetTableId + ' .count');
        var $resultsTable = $('#' + targetTableId + ' #results-tbody-' + currentTab);
        var $noResults = $('#' + targetTableId).closest('.applications-table').find('.no-results');
        var $table = $('#' + targetTableId);

        $resultsCount.text(results.length);

        if (results.length === 0) {
            $table.hide();
            $noResults.show();
            return;
        }

        $table.show();
        $noResults.hide();

        var html = '';
        results.forEach(function (item) {
            html += '<tr class="govuk-table__row">';
            html += '<td class="govuk-table__cell nowrap">' + convertDateReceived(item.date_received) + '</td>';
            html += '<td class="govuk-table__cell">';
            html += '<div class="application-type">' + item.app_type + '</div>';
            // Removed application category line
            html += '</td>';
            html += '<td class="govuk-table__cell">';
            html += '<div class="prisoner-info">';
            html += '<div class="prisoner-name">' + item.prisoner_name + '</div>';
            html += '<div class="prisoner-id govuk-table__subtext govuk-body-s">(' + item.prisoner_number + ')</div>';
            html += '</div>';
            html += '</td>';
            html += '<td class="govuk-table__cell">' + item.current_dept + '</td>';

            // Add status column for closed tab
            if (currentTab === 'closed') {
                var statusClass = item.status === 'approved' ? 'approved' : (item.status === 'declined' ? 'declined' : 'closed');
                html += '<td class="govuk-table__cell status-' + statusClass + '">' +
                    (item.status || 'Closed').charAt(0).toUpperCase() +
                    (item.status || 'Closed').slice(1) + '</td>';
            }

            // Create the view URL using homeurl and app_id
            var viewUrl = item.app_url || (window.homeurl + 'applications/view/app/application?url_id=' + item.app_id);
            html += '<td class="govuk-table__cell"><a href="' + viewUrl + '" class="view-link">View</a></td>';
            html += '</tr>';
        });

        $resultsTable.html(html);
    }

    function initializeInterface() {
        populateDepartments();
        populateApplicationTypes();
        initializeFilters();

        // Show initial results for current tab
        var currentApplications = getCurrentApplications();
        displayResults(currentApplications);
    }

    function initializeTabs() {
        // Tab switching functionality
        $('.govuk-tabs__tab').on('click', function (e) {
            e.preventDefault();

            var targetTab = $(this).attr('href').substring(1); // Remove #

            if (targetTab !== currentTab) {
                // Update active tab
                $('.govuk-tabs__list-item').removeClass('govuk-tabs__list-item--selected');
                $(this).parent().addClass('govuk-tabs__list-item--selected');

                // Show/hide tab panels
                $('.govuk-tabs__panel').addClass('govuk-tabs__panel--hidden');
                $('#' + targetTab).removeClass('govuk-tabs__panel--hidden');

                // Update current tab
                currentTab = targetTab;

                // Refresh data for new tab
                var currentApplications = getCurrentApplications();
                displayResults(currentApplications);

                // Reset filters when switching tabs
                resetFilters();
            }
        });
    }

    function resetFilters() {
        var $container = $('.filter-container');
        $container.find('input[type="checkbox"]').prop('checked', false);
        $container.find('.prisoner-search').val('');
        $container.find('.department-search').val('');
        $container.find('.application-type-search').val('');

        // Reset checkbox visibility
        $container.find('.department-item, .application-type-item').show();
        $container.find('.no-department-results, .no-application-type-results').hide();

        // Clear selected filters display
        $container.find('.selected-filters').hide();
    }

    function populateDepartments() {
        var $departmentList = $('.filter-container .department-list');
        $departmentList.empty();

        var currentApplications = getCurrentApplications();

        // Count applications per department for current tab
        var departmentCounts = {};
        currentApplications.forEach(function (app) {
            var dept = app.current_dept;
            departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
        });

        // Sort departments alphabetically
        var sortedDepartments = departmentsData.slice().sort(function (a, b) {
            return a.department_name.localeCompare(b.department_name);
        });

        sortedDepartments.forEach(function (dept, index) {
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

        var currentApplications = getCurrentApplications();

        // Count applications per type for current tab
        var typeCounts = {};
        currentApplications.forEach(function (app) {
            var appType = app.app_type;
            typeCounts[appType] = (typeCounts[appType] || 0) + 1;
        });

        // Create a set of unique application types from current applications and sort alphabetically
        var uniqueTypes = [...new Set(currentApplications.map(app => app.app_type))];
        uniqueTypes.sort(function (a, b) {
            return a.localeCompare(b);
        });

        uniqueTypes.forEach(function (appType, index) {
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
        var $applyButton = $container.find('.apply-filters');
        var $clearButton = $container.find('.clear-filters');

        // Department search functionality
        $departmentSearch.on('keyup', function () {
            var searchTerm = $(this).val().toLowerCase();
            var hasVisibleItems = false;

            $container.find('.department-item').each(function () {
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
        $applicationTypeSearch.on('keyup', function () {
            var searchTerm = $(this).val().toLowerCase();
            var hasVisibleItems = false;

            $container.find('.application-type-item').each(function () {
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

        // Apply filters button
        $applyButton.on('click', function () {
            updateSelectedFilters();
            applyFilters();
        });

        // Clear filters
        $clearButton.on('click', function (e) {
            e.preventDefault();
            resetFilters();
            applyFilters();
        });

        // Remove individual filter tags
        $selectedTags.on('click', '.moj-filter__tag', function (e) {
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

            $container.find('input[name="department"]:checked').each(function () {
                selectedDepartments.push($(this).val());
            });

            $container.find('input[name="application-type"]:checked').each(function () {
                selectedApplicationTypes.push($(this).val());
            });

            var currentApplications = getCurrentApplications();

            var filteredData = currentApplications.filter(function (item) {
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
            $container.find('input[type="checkbox"]:checked').each(function () {
                var label = $(this).next('label').text().trim();
                var value = $(this).val();

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

                selectedFilters.forEach(function (filter) {
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

                Object.keys(groupedFilters).forEach(function (fieldset) {
                    tagsHtml += '<h3 class="govuk-heading-s govuk-!-margin-bottom-0">' + fieldset + '</h3>';
                    tagsHtml += '<ul class="moj-filter-tags">';

                    groupedFilters[fieldset].forEach(function (filter) {
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