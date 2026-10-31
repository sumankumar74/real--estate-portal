const express = require("express");
const router = express.Router();

const {
  getProperties,
  getPropertyById,
  createProperty,
  deleteProperty,
  getAllAdminProperties,
  updatePropertyStatus,
} = require("../controllers/propertyControllers");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getProperties);

router.get("/admin/all", protect, adminOnly, getAllAdminProperties);
router.post("/", protect, adminOnly, createProperty);
router.patch("/:id/status", protect, adminOnly, updatePropertyStatus);
router.delete("/:id", protect, adminOnly, deleteProperty);

router.get("/:id", getPropertyById);

module.exports = router;