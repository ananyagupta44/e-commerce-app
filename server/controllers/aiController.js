import openai from "../config/openai.js";

export const adminAssistant = async (req, res) => {
  try {
    const { message } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",

      messages: [
        {
          role: "system",

          content:
            "You are an ecommerce admin assistant helping manage products, sales, orders, analytics, and customers.",
        },

        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "AI request failed",
    });
  }
};
