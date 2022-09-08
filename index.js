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
        app.get('/service', async (req, res)=>{
            const query = {};
        const cursor = serviceCollection.find(query);
        const services = await cursor.toArray();
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