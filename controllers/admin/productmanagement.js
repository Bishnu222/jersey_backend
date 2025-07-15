// const Product = require("../../models/Product")

// exports.createProduct = async (req, res) => {
//     const { name, price, categoryId, userId } = req.body
//     // validataion
//     if (!name || !price || !categoryId || !userId) {
//         return res.status(403).json(
//             { success: false, message: "Missing field" }
//         )
//     }
//     try {
//         const product = new Product(
//             {
//                 name,
//                 price,
//                 categoryId,
//                 sellerId: userId
            
//             }
//         )
//         await product.save()
//         return res.status(200).json(
//             {
//                 success: true,
//                 data: product,
//                 message: 'New Product saved'
//             }
//         )
//     } catch (err) {
//         return res.status(500).json(
//             {
//                 success: false,
//                 message: 'Server error'
//             }
//         )
//     }
// }

// exports.getProducts = async (req, res) => {
//     try {
//         const { page = 1, limit = 10, search = "" } = 
//             req.query

//         let filter = {}
//         if (search) {
//             filter.$or = [
//                 { name: 
//                     { 
//                         $regex: search, 
//                         $options: 'i' 
//                     } 
//                 }
//             ]
//         }
//         const skips = (page - 1) * limit

//         const products = await Product.find(filter)
//             .populate("categoryId", "name")
//             .populate("sellerId","firstName email")
//             .skip(skips)
//             .limit(Number(limit))
//         const total = await Product.countDocuments(filter)
//         return res.status(200).json(
//             {
//                 success: true,
//                 message: "Product fetched",
//                 data: products,
//                 pagination: {
//                     total,
//                     page: Number(page),
//                     limit: Number(limit),
//                     totalPages: Math.ceil(
//                         total / limit
//                     ) // ceil rounds number
//                 }
//             }
//         )
//     } catch (err) {
//         console.log('getProducts', {
//             message: err.message,
//             stack: err.stack,
//           });
//         return res.status(500).json(
//             { success: false, message: "Server error" }
//         )
//     }
// }
const Product = require("../../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const { team, type, size, price, categoryId } = req.body;
    const file = req.file;

    // Validate required fields
    if (!team || !type || !size || !price || !categoryId || !file) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate price is a positive number
    if (isNaN(price) || Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number",
      });
    }

    // Optional: get sellerId from auth middleware or req.body
    const sellerId = req.user?.id || req.body.sellerId || null;

    const product = new Product({
      team,
      type,
      size,
      price: Number(price),
      categoryId,
      sellerId,
      productImage: file.filename, // store just filename; you can save full path if needed
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Jersey product saved successfully",
      data: product,
    });
  } catch (err) {
    console.error("createProduct error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { team: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
        { size: { $regex: search, $options: "i" } },
      ];
    }

    const skips = (page - 1) * limit;

    const products = await Product.find(filter)
      .populate("categoryId", "name")
      .skip(skips)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Products fetched",
      data: products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("getProducts error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
