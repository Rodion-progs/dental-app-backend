const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./core/db')
const { appointment, patient} = require('./utils/validations')
const app = express();
const { PatientCtrl, AppointmentCtrl } = require('./controllers');
app.use(express.json());
dotenv.config();
app.use(cors());

app.get('/patients', PatientCtrl.all);
app.post('/patients', patient.create,  PatientCtrl.create);
app.delete('/patients/:id',  PatientCtrl.del);
app.patch('/patients/:id', patient.update,  PatientCtrl.update);
app.get('/patients/:id',  PatientCtrl.show);

app.get('/appointments', AppointmentCtrl.all);
app.post('/appointments', appointment.create,  AppointmentCtrl.create);
app.delete('/appointments/:id',  AppointmentCtrl.del);
app.patch('/appointments/:id', appointment.update,  AppointmentCtrl.update);

app.listen(6666, function (err) {
  if (err) {
    return console.log(err);
  }
  console.log('Server RUNNDED!');
});
