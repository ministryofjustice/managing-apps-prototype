module.exports = function (router, content) {


  router.post('/pin-phones/v1-6/applications/log/select-app-type', function (req, res) {
    // Make a variable and give it the value from 'how-many-balls'
    var appType = req.session.data['appType']
    // Check whether the variable matches a condition
    if (appType == "bh_01") {
      // Send user to ineligible page
      res.redirect('/pin-phones/v1-6/applications/log/new-pin-contact')
    }
    if (appType == "bh_02") {
      // Send user to ineligible page
      res.redirect('/pin-phones/v1-6/applications/log/emergency-pin-credit')
    }
    if (appType == "bh_03") {
      // Send user to ineligible page
      res.redirect('/pin-phones/v1-6/applications/log/topup-pin-credit')
    }
    if (appType == "bh_04") {
      // Send user to ineligible page
      res.redirect('/pin-phones/v1-6/applications/log/remove-pin-contact')
    }
    if (appType == "bh_05") {
      // Send user to ineligible page
      res.redirect('/pin-phones/v1-6/applications/log/swap-vos-pin-credit')
    }
    if (appType == "bh_06") {
      // Send user to ineligible page
      res.redirect('/pin-phones/v1-6/applications/log/supply-pin-contacts')
    }
  })

  router.post('/pin-phones/v1-6/applications/business-hub/apps/app-1/action', function (req, res) {
      res.redirect('/pin-phones/v1-6/applications/business-hub/apps/app-1/action-decision')
  })

  router.post('/pin-phones/v1-6/applications/omu/apps/app-1/action', function (req, res) {
      res.redirect('/pin-phones/v1-6/applications/omu/apps/app-1/action-decision')
  })

}
