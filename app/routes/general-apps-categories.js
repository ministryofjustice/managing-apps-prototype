module.exports = function (router, content) {

  router.post('/staff/general-apps-categories/applications/log/select-app-group', function (req, res) {
    // Make a variable and give it the value from 'how-many-balls'
    var appType = req.session.data['appType']

    if (appType == 'cat_00') {
      res.redirect('/staff/general-apps-categories/applications/log/prisoner-details?appType=app_51&appType=cat_00' )
    } 
    else {
      res.redirect('/staff/general-apps-categories/applications/log/select-app-type')
    }
  })

  router.post('/staff/general-apps-categories/applications/log/select-app-type', function (req, res) {
    // Make a variable and give it the value from 'how-many-balls'
    var appType = req.session.data['appType']

    if (appType == "app_30") {
      res.redirect('/staff/general-apps-categories/applications/log/new-social-pin-contact/prisoner-details')
    }
    else if (appType == "app_31") {
      res.redirect('/staff/general-apps-categories/applications/log/new-legal-pin-contact/prisoner-details')
    }
    else if (appType == "app_32") {
      res.redirect('/staff/general-apps-categories/applications/log/emergency-pin-credit/prisoner-details')
    }
    else if (appType == "app_33") {
      res.redirect('/staff/general-apps-categories/applications/log/swap-vos-pin-credit/prisoner-details')
    }
   else if (appType == "app_34") {
      res.redirect('/staff/general-apps-categories/applications/log/supply-pin-contacts/prisoner-details')
    }
    else if (appType == "app_35") {
      res.redirect('/staff/general-apps-categories/applications/log/remove-pin-contact/prisoner-details')
    }
    else {
      res.redirect('/staff/general-apps-categories/applications/log/prisoner-details')
    }
  })


}
