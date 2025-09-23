module.exports = function (router, content) {


  router.post('/application-tool/latest/applications/log/select-dept', function (req, res) {
    // Make a variable and give it the value from 'how-many-balls'
    var appType = req.session.data['appType']

    if (appType == "app_1003") {
      res.redirect('/application-tool/latest/applications/log/new-social-pin-contact/application-details')
    }
    else if (appType == "app_1002") {
      res.redirect('/application-tool/latest/applications/log/new-official-pin-contact/application-details')
    }
    else if (appType == "app_1001") {
      res.redirect('/application-tool/latest/applications/log/emergency-pin-credit/application-details')
    }
    else if (appType == "app_1004") {
      res.redirect('/application-tool/latest/applications/log/remove-pin-phone-contact/application-details')
    }
    else{
      res.redirect('/application-tool/latest/applications/log/application-details')
    }

  })
  

  router.get('/application-tool/latest/applications/log/clear-and-go-to-prisoner-details', function(req, res) {
      req.session.destroy();
      res.redirect('/application-tool/latest/applications/log/prisoner-details')
  })

}
