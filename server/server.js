const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const multer=require('multer');
const path=require('path');
const fs=require('fs');
const tasksController=require('./controller');

const app=express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname,'./public')));

const storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'public/uploads');
  },
  filename:function(req,file,cb){
    cb(null,Date.now()+path.extname(file.originalname));
  }
});
const upload=multer({storage:storage});

const {getTasks,createTask,deleteTask,updateTask,seed,signup,login,search}=tasksController;

const port=4000;
const baseURL='/api/tasks';

app.get(baseURL,getTasks);
app.get(`${baseURL}/search`,search);
app.post(baseURL,createTask);
app.delete(`${baseURL}/:taskId`,deleteTask);
app.put(`${baseURL}/:taskId`,updateTask);
app.post(`${baseURL}/seed`,seed);

app.post('/signup',signup);
app.post('/login',login);

app.post('/upload',upload.single('image'),(req,res)=>{
  if(!req.file){
    return res.status(400).json({error:'No file uploaded'});
  }
  const imageUrl=`/uploads/${req.file.filename}`;
  res.status(200).json({imageUrl:imageUrl});
});

app.listen(port,()=>console.log(`The express server is running on port ${port}`));
