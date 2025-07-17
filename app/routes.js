//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

require('./routes/managing-apps-1.js')(router);
require('./routes/managing-apps-1-5.js')(router);
require('./routes/managing-apps-1-6.js')(router);
require('./routes/managing-apps-1-7.js')(router);
require('./routes/managing-apps-mvp.js')(router);
require('./routes/managing-apps-mvp-phase-2.js')(router);
require('./routes/general-apps-categories.js')(router);
require('./routes/general-apps-depts.js')(router);
require('./routes/single-general-app.js')(router);
require('./routes/single-general-app-v1-2.js')(router);
require('./routes/app-type-lookup-latest.js')(router);
require('./routes/dept-led-latest.js')(router);
require('./routes/admin-latest.js')(router);
require('./routes/sandbox.js')(router);


//require('./views/'+version+'/routes/mainrouter.js')(router);
module.exports = router;
