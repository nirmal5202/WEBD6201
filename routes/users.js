const express = require('express');
const router = express.Router();
const fs = require("fs");
const Fuse = require('fuse.js');
const axios = require('axios');

// const userData = JSON.parse(fs.readFileSync("data/users.json", "utf-8"));

const filterData = (query, data) => {
  return new Promise((resolve, reject) => {
    const fuse = new Fuse(data, {
      keys: ['id', 'email', 'first_name', 'last_name'],
      threshold: 0.1,
      findAllMatches: true,
    });

    const results = fuse.search(query).map(result => result.item);

    resolve(results);

  });
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  axios('https://reqres.in/api/users')
    .then(response => {
      res.render('users', { data: response.data.data });
    })
    .catch(error => {
      res.render('error', {
        message: 'failed to fetch users',
        error: error
      })
    })
});

router.get('/:filter', function (req, res, next) {
  axios('https://reqres.in/api/users')
    .then(response => filterData(req.params.filter, response.data))
    .then(filteredData => {
      res.render('users', { data: filteredData })
    })
    .catch(error => {
      res.render('error', {
        message: 'failed to fetch users',
        error: error
      })
    })
});

module.exports = router;
