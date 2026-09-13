import { getBySlug, list } from "./service.js";
import { validateSlugParam, validateListQuery } from "./validator.js";

export const getNewsEvent = async (req, res, next) => {
  try {
    const slug = validateSlugParam(req.params.slug);
    const result = await getBySlug(slug);
    return res.status(200).json({ success: true, message: "Item fetched", data: result });
  } catch (err) {
    return next(err);
  }
};

export const listNewsEvents = async (req, res, next) => {
  try {
    const baseFilters = validateListQuery(req.query);

    // If mounted at /api/news or /api/events a middleware may set req.query.type; prefer that
    const type = req.query.type || baseFilters.type;

    const filters = { ...baseFilters, type };

    const result = await list(filters);

    return res.status(200).json({ success: true, message: "List fetched", data: result });
  } catch (err) {
    return next(err);
  }
};
