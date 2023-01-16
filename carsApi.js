let express=require("express");
let app=express();
app.use(express.json());
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin","*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  next();
});
var port=process.env.PORT||410;
app.listen(port,()=>console.log(`Listening on port ${port}`));

let {carMasterData,carsData}=require("./carsData.js");
// console.log(carMasterData,carsData);


app.get("/carmaster",function(req,res){
  let arr2=carMasterData;
  res.send(arr2);
});

app.get("/cars",function(req,res){
  let minprice=req.query.minprice;  
  let maxprice=req.query.maxprice;
  let fuel=req.query.fuel;
  let sort=req.query.sort;
  let type=req.query.type;
  let arr2=carMasterData;
  let arr1=carsData;  
  if(fuel){
    arr2=arr2.filter((st)=>st.fuel===fuel)
    arr1=arr1.filter((st)=>arr2.find(st1=>st1.model===st.model));
    console.log(arr1);
  }
  
  if(type){
    arr2=arr2.filter((st)=>st.type===type)
    arr1=arr1.filter((st)=>arr2.find(st1=>st1.model===st.model));
  }
  if(minprice){
    arr1=arr1.filter((st)=>st.price>=minprice);
  }
  if(maxprice)
    arr1=arr1.filter((st)=>st.price<=maxprice);
  if(sort==="kms")
    arr1.sort((s1,s2)=>(s1.kms)-(s2.kms));
  if(sort==="price")
    arr1.sort((s1,s2)=>(s1.price)-(s2.price));
  if(sort==="year")
    arr1.sort((s1,s2)=>(s1.year)-(s2.year));  
  res.send(arr1);
});
app.get("/cars/:id",function(req,res){
  let id=req.params.id;
  let car=carsData.find(pr=>pr.id===id);
  console.log("get=",id,car)
  res.send(car);
});

app.post("/cars",function(req,res){
  let body=req.body;
  console.log(body);
  carsData.push(body);
  res.send(body);
})
app.put("/cars/:id",function(req,res){
  let id=req.params.id;
  let body=req.body;
  console.log(body);
  let index=carsData.findIndex(st=>st.id===id);
  console.log("put=",index,id);
  if(index>=0){
  let updataCar={id:id,...body};
  carsData[index]=updataCar;
  res.send(updataCar);
  }
  else
    res.status(404).send("No student found");
})


app.delete("/cars/:id",function(req,res){
  let id=req.params.id;
  let index=carsData.findIndex(st=>st.id===id);
  if(index>=0){
  let deleteCar=carsData.splice(index,1);
  res.send(deleteCar);
  }
  else
    res.status(404).send("No student found");
})
