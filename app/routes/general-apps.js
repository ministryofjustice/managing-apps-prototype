module.exports = function (router, content) {

  router.post('/staff/general-apps/applications/log/select-app-type', function (req, res) {
    // Make a variable and give it the value from 'how-many-balls'
    var appType = req.session.data['appType']

    if (appType == 'cat_00') {
      res.redirect('/staff/general-apps/applications/log/prisoner-details?appName=app_51&appType=cat_00' )
    } 
    else {
      res.redirect('/staff/general-apps/applications/log/select-app-name')
    }
  })

  router.post('/staff/general-apps/applications/log/select-app-name', function (req, res) {
    // Make a variable and give it the value from 'how-many-balls'
    var appName = req.session.data['appName']

    if (appName == "app_27") {
      res.redirect('/staff/general-apps/applications/log/new-social-pin-contact/prisoner-details')
    }
    else if (appName == "app_28") {
      res.redirect('/staff/general-apps/applications/log/new-legal-pin-contact/prisoner-details')
    }
    else if (appName == "app_29") {
      res.redirect('/staff/general-apps/applications/log/emergency-pin-credit/prisoner-details')
    }
    else if (appName == "app_32") {
      res.redirect('/staff/general-apps/applications/log/remove-pin-contact/prisoner-details')
    }
    else if (appName == "app_30") {
      res.redirect('/staff/general-apps/applications/log/swap-vos-pin-credit/prisoner-details')
    }
   else if (appName == "app_31") {
      res.redirect('/staff/general-apps/applications/log/supply-pin-contacts/prisoner-details')
    }
    else {
      res.redirect('/staff/general-apps/applications/log/prisoner-details')
    }
  })


}
