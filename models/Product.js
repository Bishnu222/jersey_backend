// const mongoose = require("mongoose")

// const productSchema = new mongoose.Schema(
//     {
//         name:{
//             type:String,
//             required:true
//         },
//         filepath:{type:String},
//         price:{
//             type:Number,
//             required:true
//         },
//         categoryId:{
//             type:  mongoose.Schema.ObjectId, // foreign key/referencing
//             ref:'Category',
//             required:true
//         },
//         sellerId:{
//             type:mongoose.Schema.ObjectId, // foreign key/referencing
//             ref:'User',
//             required:true
//         }, 

//         productImage:{type: String}

       
//     }
// )

// module.exports = mongoose.model(
//     'Product',productSchema
// )

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  team: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Home", "Away", "Third", "GK"],
    required: true,
  },
  size: {
    type: String,
    enum: ["S", "M", "L", "XL"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  productImage: {
    type: String, // image filename or URL
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: false, // optional unless strictly required
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
