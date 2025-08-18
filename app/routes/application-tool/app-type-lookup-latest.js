module.exports = function (router, content) {

  router.post('/staff/app-type-lookup-latest/applications/log/select-app-type/', function (req, res) {
    // Make a variable and give it the value from 'how-many-balls'
    var appType = req.session.data['app_type']

    if (appType == "Add a social PIN phone contact") {
      res.redirect('/staff/app-type-lookup-latest/applications/log/new-social-pin-contact/prisoner-details.html')
    }  else if (appType == "Add a legal PIN phone contact") {
      res.redirect('/staff/app-type-lookup-latest/applications/log/new-legal-pin-contact/prisoner-details.html')
    } else if (appType == "Add emergency phone credit") {
      res.redirect('/staff/app-type-lookup-latest/applications/log/emergency-pin-credit/prisoner-details.html')
    } else if (appType == "Remove a PIN phone contact") {
      res.redirect('/staff/app-type-lookup-latest/applications/log/remove-pin-phone-contact/prisoner-details.html')
    } else {
      res.redirect('/staff/app-type-lookup-latest/applications/log/prisoner-details.html')
    }
  })

  router.post('/staff/app-type-lookup-latest/applications/business-hub/apps/swap-vos-pin-credit/forward', function (req, res) {

    var appDept = req.session.data['appDept']

    if (appDept == "Activities") {
      res.redirect('/staff/app-type-lookup-latest/applications/business-hub/apps/swap-vos-pin-credit/forward-error.html')
    }
  })


  router.post('/staff/app-type-lookup-latest/applications/omu/apps/app-19/action', function (req, res) {
      res.redirect('/staff/app-type-lookup-latest/applications/omu/apps/app-19/action-decision')
  })

  router.post('/staff/app-type-lookup-latest/applications/business-hub/apps/app-16/action', function (req, res) {
      res.redirect('/staff/app-type-lookup-latest/applications/business-hub/apps/app-16/action-decision')
  })

  router.post('/staff/app-type-lookup-latest/applications/business-hub/apps/app-1/action', function (req, res) {
      res.redirect('/staff/app-type-lookup-latest/applications/business-hub/apps/app-1/action-decision')
  })

  router.post('/staff/app-type-lookup-latest/applications/omu/apps/app-1/action', function (req, res) {
      res.redirect('/staff/app-type-lookup-latest/applications/omu/apps/app-1/action-decision')
  })

}
