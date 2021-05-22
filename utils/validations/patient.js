const { check } = require('express-validator');


const validation = {
  create: [
    check('fullName').isLength({ min: 2 }),
    check('phone').isLength({ min: 11 })
  ],
  update: [
    check('fullName').isLength({ min: 5 }),
    check('phone').isLength({ min: 11 })
  ]
};





module.exports = validation;
