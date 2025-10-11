import paymentModeModel from '../../models/paymentMode.model.js';
import { formatCountryName } from '../../utils.js';

export const getPaymentMethod = async (req, res) => {
  try {
    const { type } = req.params;
    if (!type) {
      return res.status(409).json({ msg: 'Destination type required', success: false });
    }
    const destinationPaymentModeData = await paymentModeModel.findOne({
      destination_type: formatCountryName(type),
    });
    if (!destinationPaymentModeData) {
      return res
        .status(401)
        .json({ msg: 'Data for the following type wont exists', success: false });
    }
    return res.status(200).json({ msg: 'Payment Mode successfully fetched', success: true, destinationPaymentModeData });
  } catch (error) {
    console.log(`get payment Error ${error}`);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};

export const paymentMethod = async (req, res) => {
  try {
    const { type, paymentMode } = req.body;
    if (!type) {
      return res.status(400).json({ msg: 'Destination type needed', success: false });
    }
    const paymentData = await paymentModeModel.findOne({
      destination_type: formatCountryName(type),
    });
    if (!paymentData) {
      const newPaymentMode = new paymentModeModel({
        destination_type: formatCountryName(type),
        payment_mode: paymentMode,
      });
      await newPaymentMode.save();
      return res.status(200).json({ msg: 'Payment mode saved', success: true });
    }

    paymentData.payment_mode = paymentMode;
    await paymentData.save();
    return res.status(200).json({ msg: 'Payment mode saved', success: true });
  } catch (error) {
    console.log(`Post payment method Error ${error}`);
    return res.status(500).json({ msg: 'Server Error', success: false });
  }
};
