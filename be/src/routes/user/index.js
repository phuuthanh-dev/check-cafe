"use strict";

const express = require("express");
const { checkAuth, checkRole } = require("../../auth/checkAuth");
const router = express.Router();
const userController = require("../../controllers/user.controller");
const uploadCloud = require("../../configs/cloudinary.config");
const { updateAvatar } = require("../../services/user.service");


router.post("/receive-hook", userController.receiveHook);

// Test endpoint (no auth required)
router.get("/test", (req, res) => {
  res.json({ 
    message: "User endpoint is working", 
    timestamp: new Date().toISOString(),
    ip: req.ip,
    url: req.originalUrl 
  });
});

router.use(checkAuth);


// Get profile
router.get("/profile", userController.getProfile);

// Update profile
router.patch("/profile", userController.updateProfile);

// Change password
router.patch("/profile/password", userController.changePassword);

// Update avatar
// router.patch("/profile/avatar", userController.updateAvatar);

router.patch(
  "/profile/avatar",
  uploadCloud.single("avatar"),
  async (req, res) => {
    try {
      const result = await updateAvatar(req);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Save FCM token
router.post("/save-expo-token", userController.saveExpoToken); 

// add favorite shop and product
router.post("/favorite-shop", userController.addFavoriteShop);
router.post("/favorite-product", userController.addFavoriteProduct);

// get favorite shop and product
router.get("/favorite-shop", userController.getFavoriteShop);
router.get("/favorite-product", userController.getFavoriteProduct);

// remove favorite shop and product
router.delete("/favorite-shop", userController.removeFavoriteShop);
router.delete("/favorite-product", userController.removeFavoriteProduct);

//buy vip package
router.post("/buy-vip-package", userController.buyVipPackage);

module.exports = router;
