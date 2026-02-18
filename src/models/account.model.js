const mongoose = require("mongoose");
const ledgerModel = require("../models/ledger.model");

const accountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    index: true
  },

  status: {
    type: String,
    enum: ["ACTIVE", "FROZEN", "CLOSED"],
    default: "ACTIVE"
  },

  currency: {
    type: String,
    default: "INR"
  },

  systemAccount: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

accountSchema.methods.getBalance = async function () {
  const data = await ledgerModel.aggregate([
    { $match: { account: this._id } },
    {
      $group: {
        _id: null,
        totalDebit: {
          $sum: { $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0] }
        },
        totalCredit: {
          $sum: { $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0] }
        }
      }
    },
    {
      $project: {
        _id: 0,
        balance: { $subtract: ["$totalCredit", "$totalDebit"] }
      }
    }
  ]);

  return data.length ? data[0].balance : 0;
};

const accountModel = mongoose.model("account", accountSchema);
module.exports = accountModel;
