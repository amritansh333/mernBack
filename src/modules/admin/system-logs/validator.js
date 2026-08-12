export const validatePagination = (query = {}) => {
  const page = Math.max(1, parseInt(query.page || query.p || 1, 10) || 1);
  const limit = Math.max(
    1,
    parseInt(query.limit || query.pageSize || 10, 10) || 10,
  );
  return { page, limit };
};

export default { validatePagination };
