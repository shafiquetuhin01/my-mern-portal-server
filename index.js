const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const res = require('express/lib/response');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.MERN_USER}:${process.env.MERN_PASS}@cluster0.fr5whbt.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const serviceCollection = client.db("my_mern_portal").collection("services");
        const bookingCollection = client.db("my_mern_portal").collection("bookings");
        app.get('/service', async (req, res)=>{
            const query = {};
        const cursor = serviceCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
        });


        app.get('/booking', async (req, res)=>{
          const patient = req.query.patient;
          const query = {patient: patient};
          const bookings = await bookingCollection.find(query).toArray();
          res.send(bookings);
        })
        
        app.post('/booking', async (req, res)=>{
          const booking = req.body;
          const query = {treatment: booking.treatment, patient:booking.patient, slot:booking.slot, date:booking.date};
          const exists = await bookingCollection.findOne(query);
          if(exists){
            return res.send({success:false, exists})
          }
          const result = await bookingCollection.insertOne(booking);
          res.send({success:true, result});
        });

        app.get('/available', async (req, res)=>{
          const date = req.query.date;
          // step 1
          const services = await serviceCollection.find().toArray();
          // step 2 
          const query = {date:date};
          const bookings = await bookingCollection.find(query).toArray();
          // step 3
          services.forEach(service=>{
            const serviceBookings = bookings.filter(booking=>booking.treatment===service.name);
            const bookedSlots = serviceBookings.map(book=>book.slot);
            const available = service.slots.filter(slot=>!bookedSlots.includes(slot));
            service.slots = available;
          })
          res.send(services);
        })
    }
    finally{

    }
};
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello my MERN Portal!')
})

app.listen(port, () => {
  console.log(`My MERN Portal listening on port ${port}`)
})