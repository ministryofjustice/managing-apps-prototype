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
let mvpapptypes              = require('./dps/mvp_app_types.json')
let mvp2apptypes             = require('./dps/mvp2_app_types.json')
let wings                    = require('./dps/wings.json')
let bhApps                   = require('./dps/business_hub_apps.json')
let pinApps                  = require('./dps/pin_apps.json')
let allMVPApps               = require('./dps/mvp/all-apps-data.json')
let allMVP2Apps              = require('./dps/mvp/all-mvp2-apps-data.json')
let pin05data                = require('./dps/mvp/pin_05_data.json')
let prisoners                = require('./dps/mvp/prisoners.json')
let unstructured             = require('./dps/general-apps/general_apps.json')
let deptApps                 = require('./dps/general-apps/department_apps.json')
let departments              = require('./dps/general-apps/departments.json')
let socialRelationships      = require('./dps/social_relationships.json')
let legalRelationships       = require('./dps/legal_relationships.json')


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
  mvpapptypes,
  mvp2apptypes,
  wings,
  bhApps,
  pinApps,
  allMVPApps,
  allMVP2Apps,
  prisoners,
  unstructured,
  deptApps,
  departments,
  socialRelationships,
  legalRelationships,
  bhPendingApps,
  bhClosedApps,
  omuPendingApps,
  omuClosedApps,
  addresses,
  prisonStaff,
  countries,
  pin05data
}
