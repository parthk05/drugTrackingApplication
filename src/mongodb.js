const mongoose=require("mongoose")
const username = "namirkalra";
const password = "admin3344111acceSS";
const cluster = "cluster0.afwyty9";
const dbname = "Drug_login_db";

mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`, 
  {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(()=>console.log('Connected Successfully'))
.catch((err)=>{console.error(err);});


const LogInSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    category:{
        type:String,
        enum: ['M', 'D', 'RB'], 
        required: true
    }
})

const collection=new mongoose.model("Collection1",LogInSchema)

module.exports=collection