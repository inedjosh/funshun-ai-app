exports.createOneFactory = async (model, fields) => {
  const doc = await model.create({ ...fields });
  return doc;
};

exports.findOneFactory = async (model, query) => {
  const doc = await model.findOne({ ...query });
  return doc;
};

exports.findManyFactory = async (model, query, limit = 30) => {
  const docs = await model
    .find({ ...query })
    .limit(limit)
    .sort({ createdAt: -1 });
  return docs;
};

exports.findByIdFactory = async (model, id) => {
  const doc = await model.findById(id);
  return doc;
};

exports.findAllFactory = async (model) => {
  const docs = await model.find({}).sort({ createdAt: -1 });
  return docs;
};

exports.deleteOneFactory = async (model, query) => {
  const result = await model.deleteOne({ ...query });
  return result;
};
