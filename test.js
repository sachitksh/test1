const express = require('express'); // Import Express
const app = express(); // Initialize the Express app
const cors=require('cors')
const dotenv = require("dotenv");
dotenv.config();
const db=require('./db');

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}));



// Define a basic route
app.get('/getall', (req, res) => {
  const Db=db.getDbInstance();
  const result=Db.getAllData();
  result
  .then(data=>res.json({data:data}))
  .catch(err=>console.log(err));

});

app.post('/create',(req,res)=>{
    const {name}=req.body;
    const Db=db.getDbInstance();
    const result=Db.addName(name)

    result
    .then(data=>res.json({data:data}))
    .catch(err=>console.log(err));

})

app.delete('/delete/:id',(req,res)=>{
    const {id}=req.params;
    const Db=db.getDbInstance()
    const result=Db.deleteById(id)
    result
    .then(data=>res.json({success:data}))
    .catch(err=>console.log(err))

})

app.patch('/update',(req,res)=>{
    const {id,name}=req.body;
    const Db=db.getDbInstance()
    const result=Db.updateById(id)
    result
    .then(data=>res.json({sucess:data}))
    .catch(err=>console.log(err));
})

app.get('/search/name',(req,res)=>{
    const {name}=req.query
    const Db=db.getDbInstance()
    const result=Db. searchByName(name)
    result
    .then(data=>res.json({data:data}))
    .catch(err=>console.log(err))
})

// Start the server and handle potential errors
app.listen(process.env.PORT, () => {
    console.log(`Server is running`);
}).on('error', (err) => {
    console.error('Error starting the server:', err.message);
});
