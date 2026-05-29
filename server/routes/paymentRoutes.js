
import express from "express";

import Razorpay from "razorpay";

const router = express.Router();

const razorpay = new Razorpay({
  key_id:
    process.env.RAZORPAY_KEY_ID,

  key_secret:
    process.env
      .RAZORPAY_KEY_SECRET,
});

// CREATE ORDER
router.post(
  "/create-order",

  async (req, res) => {

    try {

      console.log(
        "BODY:",
        req.body
      );

      const amount =
        Number(req.body.amount);

      console.log(
        "AMOUNT:",
        amount
      );

      if (!amount || amount <= 0) {

        return res.status(400).json({
          message:
            "Invalid amount",
        });
      }

      const options = {

        amount:
          amount * 100,

        currency: "INR",

        receipt:
          "receipt_" +
          Date.now(),
      };

      console.log(
        "OPTIONS:",
        options
      );

      const order =
        await razorpay.orders.create(
          options
        );

      console.log(
        "ORDER:",
        order
      );

      res.status(200).json(order);

    } catch (error) {

      console.log(
        "RAZORPAY ERROR:"
      );

      console.log(error);

      res.status(500).json({
        message:
          "Razorpay order failed",
      });
    }
  }
);

export default router;

