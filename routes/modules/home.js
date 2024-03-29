const express = require('express')
const restaurant = require('../../models/restaurant')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  const userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .sort({ _id: 'asc' }) // desc
    .then(restaurants => res.render('index', { restaurants, login: true }))
    .catch(error => console.error(error))
})

router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const userId = req.user._id
  const sort = req.query.sort || { name: 'asc' }
  const sortMethod = {
    AtoZ: { name: 'asc' },
    ZtoA: { name: 'desc' },
    category: { category: 'asc' },
    location: { location: 'asc' }
  }
  const sortSelecting = { [sort]: true }
  Restaurant.find({
    $or: [
      { name: new RegExp(keyword, 'i') },
      { name_en: new RegExp(keyword, 'i') },
      { category: new RegExp(keyword, 'i') }
    ],
    $and: [{userId: userId}]
  }).sort(sortMethod[sort]).lean().then(restaurants => {
    res.render('index', { restaurants, keyword, sortSelecting, login: true })
  }).catch(error => console.log(error))
})

module.exports = router
