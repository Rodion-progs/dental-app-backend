const { check } = require('express-validator');


const validation = {
  create: [
    check('toothNumber').isInt({ min: 1, max: 48 }),
    check('diagnosis').isLength({ min: 3 }),
    check('price').isInt({ min: 1 }),
    check('date').isLength({min: 3, max: 50 }),
    check('time').isLength({min: 3, max: 50 }),
    check('patient').isLength({ min: 1, max: 48 }),
  ],
  update: [
    check('toothNumber').isInt({ min: 1, max: 48 }),
    check('diagnosis').isLength({ min: 3 }),
    check('price').isInt({ min: 1 }),
    check('date').isLength({min: 3, max: 50 }),
    check('time').isLength({min: 3, max: 50 }),
  ]
};


module.exports = validation;
