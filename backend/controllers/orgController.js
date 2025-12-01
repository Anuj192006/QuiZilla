const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createOrg(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Organisation name required" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const newOrg = await prisma.organisation.create({
      data: {
        name,
        ownerId: req.user.id,
      },
    });

    return res.json({
      message: "Organisation created successfully",
      organisation: newOrg,
    });

  } catch (err) {
    console.error("Create Org Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { createOrg };
