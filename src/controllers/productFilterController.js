import Product from "../models/Product.js";

export const filterProducts = async (req, res) => {
  try {
    const {
      category,
      material,
      industry,
      search,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // 1️⃣ Category
    if (category && category !== "undefined") {
      query.category = category;
    }

    // 2️⃣ Material (array field)
    if (material && material !== "undefined") {
      query.materials = { $in: [material] };
    }

    // 3️⃣ Industry (array field)
    if (industry && industry !== "undefined") {
      query.industries = { $in: [industry] };
    }

    // 4️⃣ Search
if (search && search.trim() !== "") {
  query.$or = [
    { name: { $regex: search, $options: "i" } },

    // ✅ ADD THIS LINE
    { slug: { $regex: search, $options: "i" } },

    { description: { $elemMatch: { $regex: search, $options: "i" } } },
    { keyFeatures: { $elemMatch: { $regex: search, $options: "i" } } },
    { applications: { $elemMatch: { $regex: search, $options: "i" } } },
  ];
}



    const pageNumber = Number(page);
    const pageLimit = Number(limit);
    const skip = (pageNumber - 1) * pageLimit;

    // same query for find & count
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageLimit),
      Product.countDocuments(query)
    ]);

    res.json({
      filtersApplied: {
        category: category || null,
        material: material || null,
        industry: industry || null,
        search: search || null
      },
      products
    });

  } catch (error) {
    res.status(500).json({
      message: "Filter failed",
      error: error.message
    });
  }
};
