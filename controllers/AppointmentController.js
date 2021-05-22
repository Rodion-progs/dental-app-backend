const { Appointment, Patient } = require('../models');
const { validationResult } = require('express-validator');
const dayjs = require('dayjs');
const ruLocale = require('dayjs/locale/ru');
const { sendSMS } = require('../utils');
const { groupBy, reduce } = require('lodash');


function AppointmentController() {

}

const create = async function (req, res) {
  const errors = validationResult(req);
  let currentPatient;
  const data = {
    toothNumber: req.body.toothNumber,
    patient: req.body.patient,
    diagnosis: req.body.diagnosis,
    price: req.body.price,
    date: req.body.date,
    time: req.body.time
  };
  console.log(req.params)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: errors.array()
    });
  }
  try {
    currentPatient = await Patient.findOne({ _id: data.patient });
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

  Appointment.create(data, function (err, doc) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err
      });
    }
    // const dalayedTime = dayjs(`${data.date}T${data.time}`).subtract(1, 'minute').unix();
    // sendSMS({
    //   number: currentPatient.phone,
    //   time: dalayedTime,
    //   text: `Добрый ${currentPatient.fullName}.  Сегодня в ${data.time} у Вас приём в стоматологию`
    // }).then(data => console.log(data)).catch(err => console.log(err))


    res.status(201).json({
      success: true,
      data: doc
    })
  })
};
const update = async function (req, res) {
  const appointmentId = req.params.id;
  const errors = validationResult(req);
  const data = {
    toothNumber: req.body.toothNumber,
    diagnosis: req.body.diagnosis,
    price: req.body.price,
    date: req.body.date,
    time: req.body.time
  };
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: errors.array()
    });
  }
  try {
    const currentAppointment = await Appointment.findOne({ _id: appointmentId });
    if (!currentAppointment) {
      return res.status(404).json({
        success: false,
        message: 'APPOINTMENT_NOT_FOUND'
      });
    }
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: 'APPOINTMENT_NOT_FOUND'
    })
  }

  Appointment.updateOne({ _id: appointmentId }, { $set: data }, function (err, doc) {
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'APPOINTMENT_NOT_FOUND'
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
    await Appointment.findOne({ _id: id });
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: 'APPOINTMENT_NOT_FOUND'
    })
  }

  Appointment.deleteOne({ _id: id }, (err) => {
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
const all = function (req, res) {
  Appointment
    .find({})
    .populate('patient')
    // .aggregate([
    //   {$group: { _id: "$date", patient: { $first: "$patient" } }},
    // ])
    .exec(function (err, docs) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err
      });
    }

    const group = reduce(groupBy(docs, 'date'), (result, value, key) => {
      result = [...result,  { title: dayjs(key).locale(ruLocale).format('D MMMM'), data: value }];
      return result;
    }, []);

    res.json({
      success: true,
      data: group
    });
  });


};

AppointmentController.prototype = {
  create,
  all,
  del,
  update,
}

module.exports = AppointmentController;
