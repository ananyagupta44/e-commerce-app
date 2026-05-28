import openai from "../config/openai.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

export const adminAssistant = async (req, res) => {
  try {
    const products = await Product.find({});
    const orders = await Order.find({});
    const users = await User.find({});
    const categoryCounts = {};
    products.forEach((p) => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });
    const totalRevenue = orders.reduce((acc, item) => acc + item.totalPrice, 0);
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalUsers = users.length;
    const lowStockProducts = products.filter((p) => p.stock <= 5);
    const outOfStockProducts = products.filter((p) => p.stock === 0);
    const overStockedProducts = products.filter((p) => p.stock > 50);
    const inventoryData = products.map((p) => ({
      name: p.name,
      stock: p.stock,
      category: p.category,
      price: p.price,
      rating: p.rating,
    }));
    const topProducts = [...products]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    const { message } = req.body;
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: `
You are NOVA AI, an advanced ecommerce admin assistant.

You help with:
- analytics
- products
- inventory
- sales
- marketing
- SEO
- customer engagement

Store Analytics:

Total Products:
${totalProducts}

Total Orders:
${totalOrders}

Total Users:
${totalUsers}

Total Revenue:
${totalRevenue}

Low Stock Products:
${lowStockProducts.map((p) => p.name).join(", ")}

Top Rated Products:
${topProducts.map((p) => p.name).join(", ")}

Products:
${JSON.stringify(
  products.map((p) => ({
    name: p.name,
    category: p.category,
    price: p.price,
    Stock: p.stock,
    rating: p.rating,
  })),
)}

Orders:
${JSON.stringify(
  orders.map((o) => ({
    totalPrice: o.totalPrice,
    isDelivered: o.isDelivered,
    createdAt: o.createdAt,
  })),
)}


Inventory Analysis:

Low Stock Products:
${lowStockProducts.map((p) => `${p.name} (${p.stock})`).join(", ")}

Out Of Stock Products:
${outOfStockProducts.map((p) => p.name).join(", ")}

Overstocked Products:
${overStockedProducts.map((p) => `${p.name} (${p.stock})`).join(", ")}

Detailed Inventory:
${JSON.stringify(inventoryData)}

Category Distribution:
${JSON.stringify(categoryCounts)}

Your responsibilities:
- analyze sales
- identify inventory issues
- suggest marketing strategies
- improve conversion rates
- generate SEO content
- help optimize ecommerce growth

Always:
- give concise but insightful answers
- use markdown formatting
- use headings and bullet points
- provide actionable suggestions
- sound like a professional ecommerce consultant
Format responses using markdown.
`,
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
    console.log("AI ERROR:");
    console.log(error);
    res.status(500).json({
      message: "AI request failed",
    });
  }
};
