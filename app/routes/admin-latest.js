module.exports = function (router, content) {


  router.post('/admin/groups/add/department', function (req, res) {
    res.redirect('/admin/groups/')
  })

  router.post('/admin/groups/add/governor', function (req, res) {
    res.redirect('/admin/groups/governors')
  })

  router.post('/groups/add/wing', function (req, res) {
    res.redirect('/admin/groups/wings')
  })

}
