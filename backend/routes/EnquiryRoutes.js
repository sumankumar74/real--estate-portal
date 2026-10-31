const express = require("express");
const router = express.Router();

const {
  createEnquiry,
  getAllEnquiries,
  updateEnquiryStatus,
} = require("../controllers/enquiryController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

console.log("Enquiry route handlers:", {
  createEnquiry: typeof createEnquiry,
  getAllEnquiries: typeof getAllEnquiries,
  updateEnquiryStatus: typeof updateEnquiryStatus,
  protect: typeof protect,
  adminOnly: typeof adminOnly,
});
router.post("/", createEnquiry);

router.get("/admin/all", protect, adminOnly, getAllEnquiries);

router.patch(
  "/admin/:id/status",
  protect,
  adminOnly,
  updateEnquiryStatus
);

module.exports = router;