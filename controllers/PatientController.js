const {Patient} = require('../models');
const { validationResult } = require('express-validator');

function PatientController() {

}

const create = function (req, res) {
  const data = {
    fullName: req.body.fullName,
    phone: req.body.phone,
  };
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: errors.array()
    });
  }
  Patient.create(data, function (err, doc) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err
      });
    }


    res.status(201).json({
      success: true,
      data: doc
    })
  })
};

const update = async function (req, res) {
  const patientId = req.params.id;
  const errors = validationResult(req);
  const data = {
    fullName: req.body.fullName,
    phone: req.body.phone,
  };
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: errors.array()
    });
  }
  try {
    const currentPatient = await Patient.findOne({ _id: patientId });
    if (!currentPatient) {
      return res.status(404).json({
        success: false,
        message: 'PATIENT_NOT_FOUND'
      });
    }
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: 'PATIENT_NOT_FOUND'
    })
  }

  Patient.updateOne({ _id: patientId }, { $set: data }, function (err, doc) {
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'PATIENT_NOT_FOUND'
      })
    }
    if (err) {
      return res.status(500).json({
        success: false,
        message: err
      });
    }


    res.status(204).json({
      success: true,
    })
  })
};

const del = async function(req, res) {
  const id = req.params.id;
  try {
    await Patient.findOne({ _id: id });
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: 'PATIENT_NOT_FOUND'
    })
  }

  Patient.deleteOne({ _id: id }, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err
      })
    }
    res.status(204).json({
      success: true
    })
  });
};

const show = async function(req, res) {
  const id = req.params.id;
  try {
    const patient = await Patient.findById(id).populate('appointments').exec();
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'PATIENT_NOT_FOUND'
      })
    }
    res.json({
      success: true,
      data: { ...patient._doc, appointments: patient.appointments }
    })
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: 'PATIENT_NOT_FOUND'
    })
  }
}

const all = function (req, res) {
  Patient.find({}, function (err, docs) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err
      });
    }
    res.json({
      success: true,
      data: docs
    });
  });


};

PatientController.prototype = {
  create,
  all,
  update,
  del,
  show
}

module.exports = PatientController;
