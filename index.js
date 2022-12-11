const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion , ObjectId} = require('mongodb');

app.use(express.json());
app.use(cors());

// mongodb user 'redux-assignment'
// mongodb user password redux-first-assignment


const uri = "mongodb+srv://redux-assignment:redux-first-assignment@cluster0.admnino.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run () {
    try{
         await client.connect();
         const contentsCollection = client.db('Contents').collection('Content');

        // ------- get all contents --------------------------------
        app.get('/contents', async (req, res) => {
            const query = {}
            const contents = await contentsCollection.find(query).toArray();
            res.send(contents)
        })

        //  ------------ post content   --------------------------------
        app.post('/content', async (req, res) => {
            const content = req.body
            const result = await contentsCollection.insertOne(content)
            res.send(result)
        })

        //  ---------------- update content --------------------------------
        app.put('/content/:id', async (req, res) => {
            const contentId = req.params.id
            const filter = {_id:ObjectId(contentId)}
            const content = req.body
            const options = {upsert:true}
            const updateDoc = {
                $set:{...content}
            }
            const result = await contentsCollection.updateOne(filter , updateDoc , options)
            res.send(result)
        })

        // ------------ delete api --------------------
        app.delete('/content/:id', async(req, res) => {
            const contentId = req.params.id
            const filter = {_id:ObjectId(contentId)}
            const result = await contentsCollection.deleteOne(filter) 
            res.send(result)
        })
    }
    finally{}
}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('welcome to redux first assignment server');
})

app.listen(port, (req, res) => {
    console.log('listening on port ' + port);
})