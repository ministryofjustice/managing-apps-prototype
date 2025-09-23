module.exports = function (router, content) {

  router.post('/pin-phones/latest/applications/log/select-app-type', function (req, res) {
    // Make a variable and give it the value from 'how-many-balls'
    var appType = req.session.data['appType']

    if (appType == "bh_01") {
      res.redirect('/pin-phones/latest/applications/log/new-social-pin-contact/select-department.html')
    }
    if (appType == "bh_02") {
      res.redirect('/pin-phones/latest/applications/log/new-official-pin-contact/select-department.html')
    }
    if (appType == "bh_03") {
      res.redirect('/pin-phones/latest/applications/log/emergency-pin-credit/select-department.html')
    }
    if (appType == "bh_04") {
      res.redirect('/pin-phones/latest/applications/log/remove-pin-phone-contact/select-department.html')
    }
    if (appType == "bh_05") {
      res.redirect('/pin-phones/latest/applications/log/swap-vos-pin-credit/select-department.html')
    }
    if (appType == "bh_06") {
      res.redirect('/pin-phones/latest/applications/log/supply-pin-contacts/select-department.html')
    }
  })


router.get('/pin-phones/latest/applications/log/clear-and-go-to-prisoner-details', function(req, res) {
    req.session.destroy();
    res.redirect('/pin-phones/latest/applications/log/prisoner-details')
})

}
