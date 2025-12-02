import https from "https";
import { Request, Response } from "express";

export const initializePayment = async (req: Request, res: Response) => {
  const { email, amount } = req.body;

  if (!email || !amount) {
    return res.status(400).json({ error: "Email and amount are required" });
  }

  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) {
    return res.status(400).json({ error: "Amount must be a number" });
  }

  const params = JSON.stringify({
    email,
    amount: numericAmount * 100,
    currency: "ZAR" 
  });
console.log('Process Env Paystack Key:', process.env.PAYSTACK_SECRET_KEY);
  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };

  const paystackReq = https.request(options, (paystackRes) => {
    let data = "";

    paystackRes.on("data", (chunk) => (data += chunk));
    paystackRes.on("end", () => {
      try {
        const parsed = JSON.parse(data);

        if (!parsed.status) {
          return res.status(400).json({
            error: "Failed to initialize payment",
            details: parsed,
          });
        }

        return res.status(200).json({
          message: "Payment initialized",
          authorization_url: parsed.data.authorization_url,
          access_code: parsed.data.access_code,
          reference: parsed.data.reference,
        });
      } catch (err) {
        console.error("JSON Parse Error:", err);
        return res.status(500).json({ error: "Invalid Paystack response" });
      }
    });
  });

  paystackReq.on("error", (error) => {
    console.error("Paystack Init Error:", error);
    return res.status(500).json({ error: "Payment initialization failed" });
  });

  paystackReq.write(params);
  paystackReq.end();
};
