
import Industry from "../models/Industry.js";
import Product from "../models/Product.js";

const formatIndustry = (industry, products = []) => {
  const details = products.map((product) => {
    const materials = (product.materials || []).filter(
      (item) => item && item._id,
    );

    const material =
      materials.length > 0
        ? materials[Math.floor(Math.random() * materials.length)]
        : null;

    return {
      product: {
        _id: product._id,
        name: product.name,
        use: Array.isArray(product.applications)
          ? product.applications.slice(0, 2)
          : product.applications || "",
        href: product.path || product.href || "",
      },

      material: material
        ? {
            _id: material._id,
            name: material.name,
            slug: material.slug,
            href: `/materials/${material.slug}`,
          }
        : null,
    };
  });

  return {
    _id: industry._id,
    name: industry.name,
    title: industry.title || industry.name,
    slug: industry.slug,
    subtitle: industry.subtitle,
    image: industry.image,
    intro: industry.intro,
    capabilities: industry.capabilities || [],
    details,
    standards: industry.standards || [],
    order: industry.order,
    path: industry.path || `/industries/${industry.slug}`,
    seo: industry.seo,
  };
};

// Get all industries with 3 random products per industry
export const getAllIndustries = async (req, res) => {
  try {
    // Fetch all industries in one query
    const industries = await Industry.find()
      .sort({ order: 1, name: 1 })
      .lean();

    if (!industries.length) {
      return res.status(200).json([]);
    }

    const industryIds = industries.map((industry) => industry._id);

    // Fetch random products for all industries in ONE aggregation
    const productGroups = await Product.aggregate([
      {
        $match: {
          industries: { $in: industryIds },
          isVisible: { $ne: false },
        },
      },
      {
        $unwind: "$industries",
      },
      {
        $match: {
          industries: { $in: industryIds },
        },
      },
      {
        $addFields: {
          _industryId: "$industries",
          _randomSort: { $rand: {} },
        },
      },
      {
        $sort: {
          _industryId: 1,
          _randomSort: 1,
        },
      },
      {
        $unset: "_randomSort",
      },
      {
        $group: {
          _id: "$_industryId",
          products: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          products: { $slice: ["$products", 3] },
        },
      },
    ]);

    // Flatten products from all industry groups
    const allProducts = productGroups.flatMap(
      (group) => group.products || [],
    );

    // Populate materials in ONE operation
    const populatedProducts = await Product.populate(allProducts, {
      path: "materials",
      select: "name slug",
    });

    // Group populated products by industry
    const productsByIndustry = new Map();

    for (const product of populatedProducts) {
      const industryId = product._industryId?.toString();

      if (!industryId) continue;

      if (!productsByIndustry.has(industryId)) {
        productsByIndustry.set(industryId, []);
      }

      productsByIndustry.get(industryId).push(product);
    }

    // Format the final response
    const result = industries.map((industry) =>
      formatIndustry(
        industry,
        productsByIndustry.get(industry._id.toString()) || [],
      ),
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching industries:", error);

    return res.status(500).json({
      message: "Failed to fetch industries",
      error: error.message,
    });
  }
};

// Get individual industry by slug with 3 random products
export const getIndustryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const industry = await Industry.findOne({ slug }).lean();

    if (!industry) {
      return res.status(404).json({
        message: "Industry not found",
      });
    }

    const products = await Product.aggregate([
      {
        $match: {
          industries: industry._id,
          isVisible: { $ne: false },
        },
      },
      {
        $sample: { size: 3 },
      },
    ]);

    const populatedProducts = await Product.populate(products, {
      path: "materials",
      select: "name slug",
    });

    return res.status(200).json(
      formatIndustry(industry, populatedProducts),
    );
  } catch (error) {
    console.error("Error fetching industry:", error);

    return res.status(500).json({
      message: "Failed to fetch industry",
      error: error.message,
    });
  }
};
