export const serializeLog = (doc = {}) => ({
  _id: String(doc._id ?? doc.id ?? ''),
  id: String(doc._id ?? doc.id ?? ''),
  name: String(doc.message ?? '').slice(0, 120),
  message: doc.message ?? '',
  level: doc.level ?? 'info',
  timestamp: doc.timestamp ? doc.timestamp.toISOString() : undefined,
  meta: doc.meta ?? {},
  source: doc.source,
});

export const serializeList = (rows = []) => rows.map(serializeLog);