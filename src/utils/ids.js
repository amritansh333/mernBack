export const toIdString = (value) =>
  value?._id?.toString?.() || value?.toString?.() || null;
