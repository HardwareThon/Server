//Módulos Necesitados
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");


//Conexion con mongo
mongoose.connect('mongodb+srv://admin:123@clusterhw-udjzc.mongodb.net/estres?retryWrites=true', { useNewUrlParser: true });

//Constantes para los model
const Pulses = require("./db/pulse");
const Voices = require("./db/voice");

const Brains = require("./db/brain");


//Conexión con el Broker de MQTT
const mqtt = require('mqtt'); 
const mqttOptions = {host:'m10.cloudmqtt.com', port:'14077', username:'owqhlrel', password:'LAuKYqnFO9cM'};
let client = mqtt.connect(mqttOptions);


let app = express();
app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

//Ruteo de los archivos estáticos para correr diferentes aplicaciones
app.use(express.static(__dirname + '/apis'));

	
//CORS para permitir solicitudes de cualquier origen
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin');
  next();
});

//Escucha cuando el cliente MQTT se conecte
client.on('connect', () => { // When connected
  console.log('Connected')
  client.subscribe('hwthon/e-stres/sensor/#', () => {

  });

  client.on('message', (topic, message, packet) => {
      console.log(topic);
      if(topic.split('/')[3] === '0'){
          
      let msgJson = JSON.parse(message);
      console.log(topic);
      console.log(msgJson);
      //var d = new Date();
     // var n= d.toDateString();//toTimeString();//toUTCString();
     // console.log(d);

      const pulseM = new Pulses({
      	_id: new mongoose.Types.ObjectId(),
      	date: new Date(),
    	user: msgJson.user,
    	value: parseInt(msgJson.value)});

      pulseM.save().then(result => {console.log(result)})
    .catch(err => {console.log(err)});

    }
    else if (topic.split('/')[3] === '1') {
    	let msgJson = JSON.parse(message);
      	console.log(topic);
      	console.log(msgJson);

     	const brainM = new Brains({
      	_id: new mongoose.Types.ObjectId(),
      	date: new Date(),
    	user: msgJson.user,
    	value: parseInt(msgJson.value)});

    	brainM.save().then(result => {console.log(result)}).
    	catch(err => {console.log(err)});

    }
  });

})

app.get('/getBrain',(req, res) => {
	Brains.find({},(err, people) => {  
    // Note that this error doesn't mean nothing was found,
    // it means the database had an error while searching, hence the 500 status
    if (err) return res.status(500).send(err)
    // send the list of all people
    return res.status(200).send(people);
    });
});

app.get('/getPulse',(req, res) => {
	Pulses.find({},(err, people) => {  
    // Note that this error doesn't mean nothing was found,
    // it means the database had an error while searching, hence the 500 status
    if (err) return res.status(500).send(err)
    // send the list of all people
    return res.status(200).send(people);
    });
});

app.get('/getVoice',(req, res) => {
	Voices.find({},(err, people) => {  
    // Note that this error doesn't mean nothing was found,
    // it means the database had an error while searching, hence the 500 status
    if (err) return res.status(500).send(err)
    // send the list of all people
    return res.status(200).send(people);
    });
});

app.get('*', (req, res) => {
    res.redirect('../#home', 404);
});

//Obtención del puerto a escuchar
const port = Number(process.env.PORT || 3000);
app.listen(port);
console.log('Listening on port ' + port + '...');
