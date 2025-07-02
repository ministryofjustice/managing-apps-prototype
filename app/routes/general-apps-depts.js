module.exports = function (router, content) {


  router.post('/staff/general-apps-depts/applications/log/select-app-name', function (req, res) {
    // Make a variable and give it the value from 'how-many-balls'
    var appName = req.session.data['appName']

    if (appName == "app_27"  ||  appName == "app_52")  {
      res.redirect('/staff/general-apps-depts/applications/log/new-social-pin-contact/prisoner-details')
    }
    else if (appName == "app_28") {
      res.redirect('/staff/general-apps-depts/applications/log/new-legal-pin-contact/prisoner-details')
    }
    else if (appName == "app_29") {
      res.redirect('/staff/general-apps-depts/applications/log/emergency-pin-credit/prisoner-details')
    }
    else if (appName == "app_30") {
      res.redirect('/staff/general-apps-depts/applications/log/swap-vos-pin-credit/prisoner-details')
    }
   else if (appName == "app_31") {
      res.redirect('/staff/general-apps-depts/applications/log/supply-pin-contacts/prisoner-details')
    }
    else if (appName == "app_32") {
      res.redirect('/staff/general-apps-depts/applications/log/remove-pin-contact/prisoner-details')
    } else {
      res.redirect('/staff/general-apps-depts/applications/log/prisoner-details')
    }

  })


}
