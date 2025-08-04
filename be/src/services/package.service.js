"use strict";

const packageModel = require("../models/package.model");
const { getInfoData, getSelectData } = require("../utils");
const { BadRequestError, NotFoundError } = require("../configs/error.response");

class PackageService {
  createPackage = async (req) => {
    const { 
      icon, 
      name, 
      description, 
      price, 
      duration, 
      target_type = 'user'
    } = req.body;
    
    const createdPackage = await packageModel.create({ 
      icon, 
      name, 
      description, 
      price, 
      duration,
      target_type
    });
    
    return {
      package: getInfoData({
        fields: ["_id", "icon", "name", "description", "price", "duration", "target_type", "createdAt", "updatedAt"],
        object: createdPackage,
      }),
    };
  };

  getPackages = async (req) => {
    const { target_type } = req.query;
    
    // Build filter query
    const filter = {};
    if (target_type) {
      filter.target_type = target_type;
    }
    
    const packages = await packageModel.find(filter).select(
      getSelectData(["_id", "icon", "name", "description", "price", "duration", "target_type", "createdAt", "updatedAt"])
    );
    
    return {
      packages: packages.map(pkg => getInfoData({
        fields: ["_id", "icon", "name", "description", "price", "duration", "target_type", "createdAt", "updatedAt"],
        object: pkg,
      })),
    };
  };

  getPackageById = async (req) => {
    const { packageId } = req.params;
    const foundPackage = await packageModel.findById(packageId).select(
      getSelectData(["_id", "icon", "name", "description", "price", "duration", "target_type", "createdAt", "updatedAt"])
    );
    if (!foundPackage) {
      throw new NotFoundError("Package not found");
    }
    return {
      package: getInfoData({
        fields: ["_id", "icon", "name", "description", "price", "duration", "target_type", "createdAt", "updatedAt"],
        object: foundPackage,
      }),
    };
  };

  updatePackage = async (req) => {
    const { packageId } = req.params;
    const { 
      name, 
      description, 
      price, 
      duration, 
      target_type
    } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (duration !== undefined) updateData.duration = duration;
    if (target_type !== undefined) updateData.target_type = target_type;
    
    const updatedPackage = await packageModel.findByIdAndUpdate(
      packageId,
      updateData,
      { new: true, runValidators: true }
    ).select(
      getSelectData(["_id", "icon", "name", "description", "price", "duration", "target_type", "createdAt", "updatedAt"])
    );
    if (!updatedPackage) {
      throw new NotFoundError("Package not found");
    }
    return {
      package: getInfoData({
        fields: ["_id", "icon", "name", "description", "price", "duration", "target_type", "createdAt", "updatedAt"],
        object: updatedPackage,
      }),
    };
  };

  deletePackage = async (req) => {
    const { packageId } = req.params;
    const deletedPackage = await packageModel.findByIdAndDelete(packageId);
    if (!deletedPackage) {
      throw new NotFoundError("Package not found");
    }
    return { message: "Package deleted successfully" };
  };
}

module.exports = new PackageService();
