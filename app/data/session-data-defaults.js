/*

Provide default values for user session data. These are automatically added
via the `autoStoreData` middleware. Values will only be added to the
session if a value doesn't already exist. This may be useful for testing
journeys where users are returning or logging in to an existing application.
============================================================================
Example usage:
"full-name": "Sarah Philips",

"options-chosen": [ "foo", "bar" ]

============================================================================
*/

let requests                 = require('./pip/requests.json')
let menus                    = require('./pip/requests-menu.json')

let oldapps                  = require('./dps/older_app_types.json')
let apps                     = require('./dps/app_types.json')
let wings                    = require('./dps/wings.json')
let bhApps                   = require('./dps/business_hub_apps.json')
let pinApps                  = require('./dps/pin_apps.json')

let bhPendingApps            = require('./dps/bh_pending_apps.json')
let bhClosedApps             = require('./dps/bh_closed_apps.json')
let omuPendingApps           = require('./dps/omu_pending_apps.json')
let omuClosedApps            = require('./dps/omu_closed_apps.json')

let addresses                = require('./dps/addresses.json')
let prisonStaff              = require('./dps/staff_members.json')
let countries                = require('./dps/countries.json')


module.exports = {
  requests,
  menus,
  oldapps,
  apps,
  wings,
  bhApps,
  pinApps,
  bhPendingApps,
  bhClosedApps,
  omuPendingApps,
  omuClosedApps,
  addresses,
  prisonStaff,
  countries
}
