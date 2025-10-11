import cancellationModel from '../../models/cancellationPolicy.model.js';

// Get Cancellation Policy
export const getCancellationPolicy = async (req, res) => {
  // console.log(req)
  try {
    const policy = await cancellationModel.findOne();
    // console.log(policy)

    if (!policy) {
      return res.status(404).json({ success: false, msg: 'Cancellation policy not found' });
    }

    res.status(200).json({
      success: true,
      msg: 'Cancellation policy fetched successfully',
      data: policy,
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Server error', error });
  }
};

// Update Cancellation Policy
export const updateCancellationPolicy = async (req, res) => {
  try {
    const { cancellation_policy } = req.body;

    if (!cancellation_policy) {
      return res.status(400).json({ msg: 'Cancellation policy is required', success: false });
    }

    // Save directly without formatting
    const updatedPolicy = await cancellationModel.findOneAndUpdate(
      {},
      { cancellation_policy },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      msg: 'Cancellation policy updated successfully',
      data: updatedPolicy,
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Server error', error });
  }
};
