const express = require('express');
const cors = require("cors");
require('./db/config');
const User = require('./db/User')
const Products = require('./db/Products')
const app = express();

app.use(express.json());
app.use(cors());

app.post("/register", async(req,res)=>{
  const user = new User(req.body);
    let result = await user.save();
    result=result.toObject();
    delete result.password
  res.send(result);
})

app.post("/login", async (req, res)=>{
  if(req.body.password && req.body.email){
let user = await User.findOne(req.body).select("-password");  
if(user) {
    res.send(user)
  } else {
  res.send({result : "No User Found"})
}
} else {
  res.send({result : "No User Found"})

}
}
)


app.post("/add-product", async (req,res)=>{
  let product = new Products(req.body);
  let result = await product.save();
  res.send(result);
})


app.get("/products",async(req, res)=>{
  const products = await Products.find();
  if(products.length > 0)
    {
      res.send(products)
    }
    else{
      res.send({result:"No Result Found"})
    }
})


app.delete("/product/:id",async(req, res)=>{
  let result =await Products.deleteOne({_id:req.params.id})
  res.send(result)
})


app.get("/product/:id", async (req, res)=>{
let result = await Products.findOne({_id:req.params.id})
if(result)
{
  res.send(result)
}
else
{
  res.send({result : "No Record Found."})
}

})



app.put("/product/:id", async(req,res)=>{
  let result =await Products.updateOne(
    {
      _id:req.params.id
    },
    {
      $set:req.body
    }
  )
    res.send(result);
})




app.get("/search/:key", async(req,res)=>{
  let result = await Products.find({
    "$or":[
      {
      name : {$regex: req.params.key}
      },

      {
        company: {$regex: req.params.key}

      },

      {
        category: {$regex: req.params.key}

      }

    ]
  })
  res.send(result);
})
app.listen(3000);