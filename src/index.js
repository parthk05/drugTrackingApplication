const express=require("express")
const app=express()
const path=require("path")
const hbs=require("hbs")
const templatePath=path.join(__dirname,'../views')
// const collection=require("./mongodb")
const mongoose =require ("mongoose");
mongoose.connect("mongodb+srv://vaibi16102000:veUPwyZvoY9rQGCc@cluster0.6mup4pt.mongodb.net/medicinedata",
{ useNewUrlParser: true,
    useUnifiedTopology: true }
);

app.use(express.json())
app.set("view engine","ejs")
app.set("views",templatePath)
app.use(express.urlencoded({extended:false}))
app.use(express.static('../public'))
// app.use(express.static(path.join(__dirname, 'public')));

//avd cache
app.use((req, res, next) => {
 
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

app.get("/",(req,res)=>{
    res.render("home");
})

app.get("/login_M.hbs",(req,res)=>{
    res.render("login_M")
})

app.get("/login_D.hbs",(req,res)=>{
    res.render("login_D")
})

app.get("/login_RB.hbs",(req,res)=>{
    res.render("login_RB")
})

app.get("/signup",(req,res)=>{
    res.render("signup")
})

// app.post("/signup",async (req,res)=>{
//     const data={
//         username:req.body.username,
//         password:req.body.password,
//         category:'M'
//     }

//     await collection.insertMany([data])

//     res.render("form_M")
// })

app.post("/login_M",async (req,res)=>{
  
    res.render("form_M");
   

    
    // try{
    //     const check=await collection.findOne({username:req.body.username})
    //     if(check.category==="M"){
    //         if(check.password===req.body.password){
    //             res.render("form_M")
    //         }
    //         else{
    //             res.send("Wrong Password")
    //         }
    //     }
    //     else{
    //         res.send("No such Manufacturer account")
    //     }
    // }
    // catch{
    //     res.send("Wrong username or password")
    // }

})

 app.post("/login_D",async (req,res)=>{

      res.render("form_D");
//     try{
//         const check=await collection.findOne({username:req.body.username})
//         if(check.category==="D"){
//             if(check.password===req.body.password){
//                 res.render("form_D")
//             }
//             else{
//                 res.send("Wrong Password")
//             }
//         }
//         else{
//             res.send("No such Distributor account")
//         }
//     }
//     catch{
//         res.send("Wrong username or password")
//     }

})



// app.post("/login_RB",async (req,res)=>{
    
//     try{
//         const check=await collection.findOne({username:req.body.username})
//         if(check.category==="RB"){
//             if(check.password===req.body.password){
//                 res.render("form_RB")
//             }
//             else{
//                 res.send("Wrong Password")
//             }
//         }
//         else{
//             res.send("No such Regulatory Body account")
//         }
//     }
//     catch{
//         res.send("Wrong username or password")
//     }

// })

app.listen(3000,()=>{
    console.log("port connected")
})



const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
var arduinoPort = "";
var arduinoPort_path="";
var arduinorfid="";



SerialPort.list().then((ports) => {
  arduinoPort = ports.find((port) => {
    return port.manufacturer && port.manufacturer.includes("Arduino");
  });

  if (arduinoPort) {
    arduinoPort_path=arduinoPort.path;
    // console.log(`Arduino port found: ${arduinoPort.path}`);

    // const port = new SerialPort(
    //    {
    //     path:arduinoPort_path,
    //   baudRate: 9600,
    // });

    // // port.on("data", function (data) {
    // //   console.log("Data:", data);
    // // });

    // const parser = new ReadlineParser();
    // port.pipe(parser);

    // parser.on("data", function (data) {
    //   arduinorfid=data;
    //   // console.log(data);
    // });
  } else {
    console.log("No Arduino port found");
  }
});

const CheckpointidSchema=new mongoose.Schema({
  checkpointid:String,


},{timestamps:true});
// const TimestampSchema={
//   timestamp:String,


// };
const CheckpointNameSchema=new mongoose.Schema({
  checkpointname:String,
  

},{timestamps:true});



const checkpointidmdl=mongoose.model("Checkpointid",CheckpointidSchema);
const checkpointnamemdl=mongoose.model("Checkpointname",CheckpointNameSchema);
// const timestampmdl=mongoose.model("Timestamp",TimestampSchema);

const item1 =new checkpointnamemdl({
  checkpointname: "deafult"
});
const defaultitems=[item1];

const medicineSchema=new mongoose.Schema({
  rfid:String,
    medicine_name:{
      type:String,
      required:true
    },
    Batch_num:{
      type:Number,
      required:true},


    manufacture_date:{
      type:String,
      required:true
    },
    expiry_date:{
      type:String,
      required:true
    },
    manufacture_name:{
      type:String,
      required:true
    },
    manufacture_id:{
      type:String,
      required:true
    },
    lastcheckingpoint_name:[CheckpointNameSchema],
    lastcheckingpoint_id:[CheckpointidSchema],
    // timestamp:[TimestampSchema]
  

});

const Medicine=mongoose.model("Medicine",medicineSchema);





let port;
//for manufacture

app.post("/startReading", (req, res) => {
  console.log("i am in startreading");
  startScanningManufac(req, res); 
});

function startScanningManufac(req, res) {
  rfidExtractManufac(req, res);
}

function rfidExtractManufac(req, res) {
  console.log("Scanning for RFID...");
   port = new SerialPort({
    path: arduinoPort_path,
    baudRate: 9600,
  });

  const parser = new ReadlineParser();
  port.pipe(parser);

  parser.on("data", function (data) {
     arduinorfid = data.trim();
    console.log(`RFID detected: ${arduinorfid}`);
    const list = new Medicine({
      rfid: arduinorfid.replace(/\0/g, ''),
      medicine_name: "default",
      Batch_num:0,
      manufacture_date:"default",
      expiry_date:"default",
      manufacture_name: "default",
      manufacture_id: "default",
      lastcheckingpoint_name:defaultitems,
      lastcheckingpoint_id:defaultitems,
      // timestamp:defaultitems
    });
    list.save();
    closePortmanufac(req, res, port);
  });
}

function closePortmanufac(req, res, port) {
  if (port && !port.closed) {
    port.close(function (err) {
      if (err) {
        console.error("Error closing port:", err);
      } else {
        console.log("Port closed successfully");
        return res.json({status:'ok' , redirect:"/medicineInterface_M"});
      }
    });
  }
}

app.post('/api/closePort', function(req, res) {
  closePortforother(function() {
    console.log("yes i am in closeport");
    res.send('Port closed successfully');
  });
});


function closePortforother() {
  if (port && !port.closed) {
    port.close(function (err) {
      if (err) {
        console.error("Error closing port:", err);
      } else {
        console.log("Port closed successfully");
        
      }
    });
  }
}


//for distributor

app.post("/startReadingDtbr", (req, res) => {
  startScanningDtbr(req, res); 
});

function startScanningDtbr(req, res) {
  rfidExtractDtbr(req, res);
}

function rfidExtractDtbr(req, res) {
  console.log("Scanning for RFID...");
   port = new SerialPort({
    path: arduinoPort_path,
    baudRate: 9600,
  });

  const parser = new ReadlineParser();
  port.pipe(parser);

  parser.on("data", function (data) {
     arduinorfid = data.trim();
    console.log(`RFID detected: ${arduinorfid}`);
    closePortDtbr(req, res, port);
  });
}

function closePortDtbr(req, res, port) {
  if (port && !port.closed) {
    port.close(function (err) {
      if (err) {
        console.error("Error closing port:", err);
      } else {
        console.log("Port closed successfully");
        return res.json({status:'ok' , redirect:"/medicineInterface_D"});
      }
    });
  }
}







// const med=new Medicine({
//   rfid:arduinorfid.replace(/\0/g, ''),
//   medicine_name:"februx",
//   Batch_num:12314,
//   manufacture_date:"12/23/34",
//   expiry_date:"12/23/34",
//   manufacture_name:"code",
//   manufacture_id:"its13134",
//   lastcheckingpoint_name:"pune",
//   lastcheckingpoint_id:"123124pune",
//   timestamp:"123124"
// });
// med.save();


// const med=new Medicine({
//   rfid:"123132 vvv",
//   medicine_name:"februx",
//   Batch_num:12314,
//   manufacture_date:"12/23/34",
//   expiry_date:"12/23/34",
//   manufacture_name:"code",
//   manufacture_id:"its13134",
//   lastcheckingpoint_name:"cmr",
//   lastcheckingpoint_id:"123124cmr",
//   timestamp:"123124"
// });
// med.save();



// app.get("/medicineInterface",(req,res)=>{
//   console.log(arduinorfid);
//   Medicine.find({rfid:arduinorfid}).then(function(lists){
//     console.log(lists);
//     res.render("medicineInterface");
//   });

  
// })


app.get("/medicineInterface_M", async (req, res) => {
 
  if (!arduinorfid) {
    // If the arduinorfid is not set, render an error page or redirect to the previous page
    console.log("errorPage");
    return;
  }

  try {
    const lists = await Medicine.find({ rfid: arduinorfid.replace(/\0/g, '') });
    console.log(lists);
    console.log(lists[0].rfid);
    res.render("medicineInterface_M",{packagingid:lists[0].rfid});
    // res.render("medicineInterface_M",{medicinename:lists[0].medicine_name,batchnum:lists[0].Batch_num,manufacdate:lists[0].manufacture_date,expirydate:lists[0].expiry_date,manufacname:lists[0].manufacture_name,manufacid:lists[0].manufacture_id});
  } catch (err) {
    console.error(err);
    console.log("errorPage");
  }
});

app.get("/medicineInterface_D", async (req, res) => {
 
  if (!arduinorfid) {
    // If the arduinorfid is not set, render an error page or redirect to the previous page
    console.log("errorPage");
    return;
  }

  try {
    const lists = await Medicine.find({ rfid: arduinorfid.replace(/\0/g, '') });
    console.log(lists);
    // console.log(lists[0].rfid);
    res.render("medicineInterface_D",{packagingid:lists[0].rfid,medicinename:lists[0].medicine_name,batchnumber:lists[0].Batch_num,manufacturingdate:lists[0].manufacture_date,expdate:lists[0].expiry_date,mfgname:lists[0].manufacture_name,manufacid:lists[0].manufacture_id});
    // res.render("medicineInterface_M",{medicinename:lists[0].medicine_name,batchnum:lists[0].Batch_num,manufacdate:lists[0].manufacture_date,expirydate:lists[0].expiry_date,manufacname:lists[0].manufacture_name,manufacid:lists[0].manufacture_id});
  } catch (err) {
    console.error(err);
    console.log("errorPage");
  }
});

// app.get("/medicineInterface_M", async (req, res) => {
 
//   if (!arduinorfid) {
//     // If the arduinorfid is not set, render an error page or redirect to the previous page
//     console.log("errorPage");
//     return;
//   }

//   try {
//     const lists = await Medicine.find({ rfid: arduinorfid.replace(/\0/g, '') });
//     console.log(lists);
//     console.log(lists[0].medicine_name);
//     res.render("medicineInterface_M",{packagingid:lists[0].rfid});
//     // res.render("medicineInterface_M",{medicinename:lists[0].medicine_name,batchnum:lists[0].Batch_num,manufacdate:lists[0].manufacture_date,expirydate:lists[0].expiry_date,manufacname:lists[0].manufacture_name,manufacid:lists[0].manufacture_id});
//   } catch (err) {
//     console.error(err);
//     console.log("errorPage");
//   }
// });
app.post('/manufacturesubmit', (req, res) => {
  const { medName, batchNo, mfgDate, expDate, mfgName, mfgId, nextCheckName, nextCheckId } = req.body;

  // Perform any necessary validations or data processing
  // You can access the individual properties from the request body

  console.log('Medicine Name:', medName);
  console.log('Batch Number:', batchNo);
  console.log('Manufacture Date:', mfgDate);
  console.log('Expiry Date:', expDate);
  console.log('Manufacturer Name:', mfgName);
  console.log('Manufacturer ID:', mfgId);
  console.log('Next Checkpoint Name:', nextCheckName);
  console.log('Next Checkpoint ID:', nextCheckId);
  // console.log('Timestamp:', nextCheckTime);

  // Save the data to a database or perform other actions
  Medicine.findOne({ rfid: arduinorfid.replace(/\0/g, '') }).then(function(foundList){
    console.log(foundList);
    const chkpntname = new checkpointnamemdl({
      checkpointname:nextCheckName
    })
    
    const chkpntid=new checkpointidmdl({
checkpointid:nextCheckId
    })
  
    foundList.medicine_name=medName;
    foundList.Batch_num=batchNo;
    foundList.manufacture_date=mfgDate;
    foundList.expiry_date=expDate;
    foundList.manufacture_name=mfgName;
    foundList.manufacture_id=mfgId;
    foundList.lastcheckingpoint_name.push(chkpntname);
    foundList.lastcheckingpoint_id.push(chkpntid);
    // foundList.timestamp.push(tmstm);

    
    foundList.save().then(() => {
      console.log('Document updated successfully');
    }).catch(error => {
      console.error('Error saving document:', error);
    });
    arduinorfid="";
    
  });
  // Send a response back to the client
  res.json({ message: 'Data received successfully' });
});


app.post('/manufacturesubmit_D', (req, res) => {
  const {  nextCheckName, nextCheckId } = req.body;

  // Perform any necessary validations or data processing
  // You can access the individual properties from the request body

  console.log('Next Checkpoint Name:', nextCheckName);
  console.log('Next Checkpoint ID:', nextCheckId);
  // console.log('Timestamp:', nextCheckTime);

  // Save the data to a database or perform other actions
  Medicine.findOne({ rfid: arduinorfid.replace(/\0/g, '') }).then(function(foundList){
    console.log(foundList);
    const chkpntname = new checkpointnamemdl({
      checkpointname:nextCheckName
    })
    
    const chkpntid=new checkpointidmdl({
checkpointid:nextCheckId
    })
  
    
    foundList.lastcheckingpoint_name.push(chkpntname);
    foundList.lastcheckingpoint_id.push(chkpntid);
    // foundList.timestamp.push(tmstm);

    
    foundList.save().then(() => {
      console.log('Document updated successfully');
    }).catch(error => {
      console.error('Error saving document:', error);
    });
    arduinorfid="";
    
  });
  // Send a response back to the client
  res.json({ message: 'Data received successfully' });
});











// // mongodb connection string pasword
// mongodb+srv://vaibi16102000:veUPwyZvoY9rQGCc@cluster0.6mup4pt.mongodb.net/?retryWrites=true&w=majority
// // veUPwyZvoY9rQGCc

