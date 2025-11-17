// server/controllers/Domo.js
const models = require('../models');

const { Domo } = models;

const makerPage = async (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.height || !req.body.level) {
    return res.status(400).json({ error: 'name, age, height & level are all required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    height: req.body.height,
    level: req.body.level,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({
      name: newDomo.name,
      age: newDomo.age,
      height: newDomo.height,
      level: newDomo.level,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'domo already exists' });
    }
    return res.status(500).json({ error: 'error occured making domo' });
  }
};

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query)
      .select('name age height level')
      .lean()
      .exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'error retrieving domos' });
  }
};

const deleteDomo = async (req, res) => {
  try {
    const domoId = req.body.id;

    if (!domoId) {
      return res.status(400).json({ error: 'Domo id is required' });
    }

    const deleteResult = await Domo.deleteOne({
      _id: domoId,
      owner: req.session.account._id,
    }).exec();

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ error: 'Domo not found' });
    }

    return res.json({ message: 'Domo deleted successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error deleting domo' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomo,
};
