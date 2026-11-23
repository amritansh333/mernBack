import Material from "../models/Material.js";
import Product from "../models/Product.js";

const formatMaterial = (material, products) => {
  const relatedProducts = products.filter((product) =>
    product.materials.some(
      (materialId) => materialId.toString() === material._id.toString(),
    ),
  );

  // Get unique industries with names and slugs
  const industries = [
    ...new Map(
      relatedProducts.flatMap((product) =>
        (product.industries || [])
          .filter((industry) => industry?.name && industry?.slug)
          .map((industry) => [
            industry.slug,
            {
              name: industry.name,
              slug: industry.slug,
            },
          ]),
      ),
    ).values(),
  ];

  return {
    _id: material._id,
    brand: material.brand,
    name: material.name,
    title: material.title || material.name,
    base: material.name,
    slug: material.slug,
    colour: material.colour,
    tagline: material.tagline,

    desc: Array.isArray(material.desc)
      ? material.desc.join(" ")
      : material.desc || "",

    grades: relatedProducts.map((product) => product.name),
    industries,
    keyProps: material.keyProperties || [],
    maxTemp: material.maxTemp,
    minTemp: material.minTemp,

    // Ordering
    order: material.order ?? 0,

    // Page information
    path: material.path || `/materials/${material.slug}`,
    description: material.description || "",

    // SEO metadata
    seo: {
      metaTitle: material.seo?.metaTitle || "",
      metaDescription: material.seo?.metaDescription || "",
      keywords: material.seo?.keywords || [],
      canonicalPath:
        material.seo?.canonicalPath ||
        material.path ||
        `/materials/${material.slug}`,
      ogTitle: material.seo?.ogTitle || "",
      ogDescription: material.seo?.ogDescription || "",
      ogImage: material.seo?.ogImage || "",
      ogType: material.seo?.ogType || "website",
      twitterCard: material.seo?.twitterCard || "summary_large_image",
      twitterTitle: material.seo?.twitterTitle || "",
      twitterDescription: material.seo?.twitterDescription || "",
      twitterImage: material.seo?.twitterImage || "",
    },
  };
};

export const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find().sort({ order: 1, name: 1 }).lean();

    const materialIds = materials.map((material) => material._id);

    const products = await Product.find({
      materials: { $in: materialIds },
      isVisible: { $ne: false },
    })
      .select("name materials industries -_id")
      .populate({
        path: "industries",
        select: "name slug",
      })
      .sort({ order: 1 })
      .lean();

    const result = materials.map((material) =>
      formatMaterial(material, products),
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching materials:", error);

    return res.status(500).json({
      message: "Failed to fetch materials",
    });
  }
};

export const getMaterialBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const material = await Material.findOne({ slug }).lean();

    if (!material) {
      return res.status(404).json({
        message: "Material not found",
      });
    }

    const products = await Product.find({
      materials: material._id,
      isVisible: { $ne: false },
    })
      .select("name materials industries -_id")
      .populate({
        path: "industries",
        select: "name slug",
      })
      .sort({ order: 1 })
      .lean();

    return res.status(200).json(formatMaterial(material, products));
  } catch (error) {
    console.error("Error fetching material:", error);

    return res.status(500).json({
      message: "Failed to fetch material",
    });
  }
};
