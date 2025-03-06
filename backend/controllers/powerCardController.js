import PowerCard from "../models/PowerCard.js";

export const getPowerCards = async (req, res) => {
  try {
    const powerCards = await PowerCard.find();
    res.json(powerCards);
  } catch (error) {
    console.error("Error fetching power cards:", error); // Logs the error
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createPowerCard = async (req, res) => {
  try {
    const powerCard = new PowerCard(req.body);
    const createdPowerCard = await powerCard.save();
    res.status(201).json(createdPowerCard);
  } catch (error) {
    console.error("Error creating power card:", error);
    res
      .status(400)
      .json({ message: "Invalid power card data", error: error.message });
  }
};

export const updatePowerCard = async (req, res) => {
  try {
    const powerCard = await PowerCard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (powerCard) {
      res.json(powerCard);
    } else {
      res.status(404).json({ message: "Power card not found" });
    }
  } catch (error) {
    console.error("Error updating power card:", error);
    res
      .status(400)
      .json({ message: "Invalid power card data", error: error.message });
  }
};

export const deletePowerCard = async (req, res) => {
  try {
    const powerCard = await PowerCard.findByIdAndDelete(req.params.id);
    if (powerCard) {
      res.json({ message: "Power card removed" });
    } else {
      res.status(404).json({ message: "Power card not found" });
    }
  } catch (error) {
    console.error("Error deleting power card:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
