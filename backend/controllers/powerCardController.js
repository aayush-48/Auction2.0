import PowerCard from "../models/PowerCard.js";
import User from "../models/User.js";

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

export const assignPowerCard = async (req, res) => {
  const { selectedTeam, selectedSlot, finalPrice } = req.body;
  const cardId = req.params.id;
  // console.log(cardId , selectedTeam , selectedSlot , finalPrice);
  const user = await User.findOne({
    slot_num: selectedSlot,
    ipl_team_id: selectedTeam,
  });
  if (!user) {
    return res.status(404).json({ msg: "User not found..." });
  }
  const powercard = await PowerCard.findOne({ _id: cardId });
  if (!powercard) {
    return res.status(404).json({ msg: "Powercard not found..." });
  }

  if (powercard.name === "RTM") {
    return res.status(400).json({
      msg: "Cannot assign RTM more than once to any team. Every team shall have RTM powercard only once and that is provided by default...",
    });
  }

  const userAlreadyContainsSameCard = powercard.assignedTo.reduce(
    (accumulator, curr) => {
      return (
        (curr.slot == selectedSlot && curr.user.equals(user._id)) || accumulator
      );
    },
    false
  );
  const slotAlreadyContainsSameCard = powercard.assignedTo.reduce(
    (accumulator, curr) => {
      return curr.slot == selectedSlot || accumulator;
    },
    false
  );
  // console.log(userAlreadyContainsSameCard);

  if (userAlreadyContainsSameCard) {
    return res.status(400).json({ msg: "User already contains the card" });
  }

  if (slotAlreadyContainsSameCard) {
    return res
      .status(400)
      .json({ msg: "Slot already contains the card in another team" });
  }

  if (user.Purse < finalPrice) {
    return res.status(400).json({ msg: "Insufficient balance in wallet" });
  }

  powercard.assignedTo.push({
    slot: selectedSlot,
    user: user._id,
    cost: finalPrice,
    used: false,
  });
  powercard.save();

  user.Purse -= finalPrice;
  user.power_card_id.push(cardId);
  user.save();

  return res.status(200).json({ msg: "route is working" });
};

export const usedPowerCard = async (req, res) => {
  const { selectedTeam, selectedSlot } = req.body;
  const cardId = req.params.id;

  // console.log(selectedSlot  , selectedTeam , cardId);

  const user = await User.findOne({
    slot_num: selectedSlot,
    ipl_team_id: selectedTeam,
  });
  if (!user) {
    return res.status(404).json({ msg: "User not found." });
  }

  const powercard = await PowerCard.findOne({ _id: cardId });
  if (!powercard) {
    return res.status(404).json({ msg: "Powercard not found." });
  }

  const ifTeamContainsPowercard = powercard.assignedTo.reduce(
    (accumulator, curr) => {
      return accumulator || curr.user.equals(user._id);
    },
    false
  );

  if (!ifTeamContainsPowercard) {
    return res
      .status(400)
      .json({ msg: "Team does not contain the powercard." });
  }

  const ifAlreadyUsed = powercard.assignedTo.reduce((accumulator, curr) => {
    return (
      accumulator ||
      (selectedSlot == curr.slot &&
        curr.user.equals(user._id) &&
        curr.used === true)
    );
  }, false);

  if (ifAlreadyUsed) {
    user.Score -= 100;
    user.save();
    return res
      .status(400)
      .json({ msg: "This powercard has already been used by this player." });
  }

  powercard.assignedTo.forEach((curr) => {
    if (selectedSlot == curr.slot && curr.user.equals(user._id)) {
      curr.used = true;
    }
  });
  powercard.save();

  return res.status(200).json("route is working");
};

export const getPowerCardsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({
      _id: userId,
    });
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }
    const pcs_ids = user.power_card_id;
    let powerCards = await PowerCard.find({ _id: { $in: pcs_ids } });
    console.log(pcs_ids);
    res.status(200).json(powerCards);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ msg: "Error in powercard fetching for a user." });
  }
};
