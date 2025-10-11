import termsAndConditionModel from '../../models/terms&Condition.model.js';
import DestinationInternationAndDomesticModel from '../../models/destinationInternationAndDomestic.model.js';

// Controller function to get terms and conditions
export const getTNC = async (req, res) => {
  const { id } = req.params;
  // console.log(id);

  try {
    const tnc = await termsAndConditionModel
      .findOne({ destination_name: id })
      .populate('destination_name');
    // console.log(tnc);

    if (!tnc) {
      return res.status(404).json({ msg: 'Destination not found', success: false });
    }
    // console.log(tnc);

    return res.status(200).json({
      msg: 'Fetched terms and conditions',
      success: true,
      tnc,
    });
  } catch (error) {
    console.error(`get_terms_and_condition -> ${error}`);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};

// Post Terms and Condition (Correct Method)
export const TNC = async (req, res) => {
  const { id, terms_and_conditions } = req.body;

  if (!id || !terms_and_conditions) {
    return res.status(400).json({
      msg: 'Destination ID and Terms & Conditions are required.',
      success: false,
    });
  }

  try {
    // Step 1: Check if destination exists
    const destinationData = await DestinationInternationAndDomesticModel.findById(id);

    if (!destinationData) {
      return res.status(400).json({
        msg: 'Destination not found.',
        success: false,
      });
    }

    // Step 2: Check if T&C already exists for this destination
    let tncData = await termsAndConditionModel.findOne({ destination_name: id });

    if (tncData) {
      // Update existing Terms & Conditions
      tncData.terms_And_condition = terms_and_conditions;
      await tncData.save();

      return res.status(200).json({
        msg: 'Terms and Conditions updated successfully.',
        success: true,
        data: tncData,
      });
    }

    // Step 3: Create new Terms & Conditions if none exist
    const newTNC = await termsAndConditionModel.create({
      destination_name: id,
      terms_And_condition: terms_and_conditions,
    });

    return res.status(201).json({
      msg: 'Terms and Conditions created successfully.',
      success: true,
      data: newTNC,
    });
  } catch (error) {
    console.error(`Error saving T&C: ${error}`);
    return res.status(500).json({
      msg: 'Server Error',
      success: false,
    });
  }
};
