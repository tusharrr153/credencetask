const Datamodel = require("../models/Data");

// Get all data
module.exports.getData = async (req, res) => {
  try {
    const data = await Datamodel.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

// Save new data
module.exports.saveData = async (req, res) => {
  const { name, image, summary } = req.body;

  if (!name || !image || !summary) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const data = await Datamodel.create({ name, image, summary });
    console.log("Data added successfully:", data);
    res.status(201).json(data);
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "Error saving data" });
  }
};

// Update existing data
module.exports.updateData = async (req, res) => {
  const { _id, name, image, summary } = req.body;

  if (!_id) {
    return res.status(400).json({ message: "ID is required for update" });
  }

  try {
    const updatedData = await Datamodel.findByIdAndUpdate(
      _id,
      { name, image, summary },
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).json({ message: "Data not found" });
    }

    console.log("Data updated successfully:", updatedData);
    res.status(200).json(updatedData);
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ message: "Error updating data" });
  }
};

// Delete data
module.exports.deleteData = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    return res.status(400).json({ message: "ID is required for deletion" });
  }

  try {
    const deletedData = await Datamodel.findByIdAndDelete(_id);

    if (!deletedData) {
      return res.status(404).json({ message: "Data not found" });
    }

    console.log("Data deleted successfully:", deletedData);
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ message: "Error deleting data" });
  }
};
