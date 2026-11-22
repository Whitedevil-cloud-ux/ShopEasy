const mongoose = require("mongoose");
const Product = require("../models/Product");
const Variant = require("../models/Variants");

// Deduct stock function
const deductStock = async({ productId, variantId, quantity, session }) => {
    if(!Number.isInteger(quantity) || quantity < 1) {
        const error = new Error("Quantity must be a positive integer");
        error.statusCode = 400;
        error.code = "INVALID_QUANTITY";

        throw error;
    }

    if(!mongoose.Types.ObjectId.isValid(productId)){
        const error = new Error("Invalid format of product ID");
        error.statusCode = 400;
        error.code = "INVALID_FORMAT_OF_ID";

        throw error;
    }

    const product = await Product.findById(productId).session(session);

    if(!product) {
        const error = new Error("Product id is not found");
        error.statusCode = 404;
        error.code = "PRODUCT_ID_NOT_AVAILABLE";

        throw error;
    }

    if(product.type === "simple"){
        if(variantId !== undefined){
            const error = new Error("Simple products do not have variants");
            error.statusCode = 400;
            error.code = "VARIANT_NOT_ALLOWED_FOR_SIMPLE_PRODUCT";

            throw error;
        }

        const updatedStock = await Product.findOneAndUpdate(
            { _id: productId, stock: { $gte: quantity } },
            { $inc: { stock: -quantity } },
            { new: true, session }
        );

        if(!updatedStock) {
            const error = new Error("There are insufficient funds in the stock");
            error.statusCode = 409;
            error.code = "INSUFFICIENT_STOCK";

            throw error;
        }

        return updatedStock;
    }

    if(product.type === "variable") {
        if(!mongoose.Types.ObjectId.isValid(variantId)){
            const error = new Error("Invalid format Id");
            error.statusCode = 400;
            error.code = "INVALID_FORMAT_ID";

            throw error;
        }

        const variant = await Variant.findById(variantId).session(session);

        if(!variant) {
            const error = new Error("Variant Id is not found");
            error.statusCode = 404;
            error.code = "VARIANT_ID_NOT_FOUND";

            throw error;
        }

        if(variant.product.toString() !== productId.toString()) {
            const error = new Error("Variant does not belong to the specified product");
            error.statusCode = 400;
            error.code = "VARIANT_PRODUCT_MISMATCH";

            throw error;
        }

        const updatedStock = await Variant.findOneAndUpdate(
            { _id: variantId, stock: { $gte: quantity } },
            { $inc: { stock: -quantity } },
            { new: true, session }
        );

        if(!updatedStock) {
            const error = new Error("There are insufficient funds in the stock");
            error.statusCode = 409;
            error.code = "INSUFFICIENT_STOCK_AVAILABLE";

            throw error;
        }

        return updatedStock;
    }
}

const restoreStock = async({ productId, variantId, quantity, session }) => {
    if(!Number.isInteger(quantity) || quantity < 1) {
        const error = new Error("Quantity must be a positive integer");
        error.statusCode = 400;
        error.code = "INVALID_QUANTITY";

        throw error;
    }

    if(!mongoose.Types.ObjectId.isValid(productId)) {
        const error = new Error("Invalid format of product ID");
        error.statusCode = 400;
        error.code = "INVALID_FORMAT_PRODUCT_ID";

        throw error;
    }

    const product = await Product.findById(productId).session(session);

    if(!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        error.code = "PRODUCT_NOT_FOUND";

        throw error;
    }

    if(product.type === "simple"){
        if(variantId !== undefined){
            const error = new Error("Simple products do not have variants");
            error.statusCode = 400;
            error.code = "VARIANT_NOT_ALLOWED_FOR_SIMPLE_PRODUCT";

            throw error;
        }

        const updatedStock = await Product.findByIdAndUpdate(
            productId,
            { $inc: { stock: quantity } },
            { new: true, session}
        );

        return updatedStock;
    }

    if(product.type === "variable") {
        if(!mongoose.Types.ObjectId.isValid(variantId)) {
            const error = new Error("Invalid format of Variant ID");
            error.statusCode = 400;
            error.code = "INVALID_FORMAT_VARIANT_ID";

            throw error;
        }

        const variant = await Variant.findById(variantId).session(session);

        if(!variant) {
            const error = new Error("Variant does not exist");
            error.statusCode = 404;
            error.code = "VARIANT_NOT_FOUND";

            throw error;
        }

        if(variant.product.toString() !== productId.toString()) {
            const error = new Error("Variant does not belong to the specified product");
            error.statusCode = 400;
            error.code = "VARIANT_PRODUCT_MISMATCH";

            throw error;
        }

        const updatedStock = await Variant.findByIdAndUpdate(
            variantId,
            { $inc: { stock: quantity }},
            { new: true, session}
        );

        return updatedStock;
    }
}

const adjustStock = async({ productId, variantId, quantityChange }) => {
    if(!Number.isInteger(quantityChange) || quantityChange === 0) {
        const error = new Error("Quantity change must be a non-zero integer");
        error.statusCode = 400;
        error.code = "INVALID_QUANTITY_CHANGE";

        throw error;
    }

    if(!mongoose.Types.ObjectId.isValid(productId)) {
        const error = new Error("Invalid format of product ID");
        error.statusCode = 400;
        error.code = "INVALID_FORMAT_PRODUCT_ID";

        throw error;
    }

    const product = await Product.findById(productId);

    if(!product) {
        const error = new Error("Product does not exist");
        error.statusCode = 404;
        error.code = "PRODUCT_NOT_FOUND";

        throw error;
    }

    const minRequiredStock = quantityChange < 0 ? Math.abs(quantityChange) : 0;

    if(product.type === "simple") {
        if(variantId !== undefined) {
            const error = new Error("Simple products do not have variant ID");
            error.statusCode = 400;
            error.code = "VARIANT_ID_NOT_ALLOWED_FOR_SIMPLE_PRODUCT";

            throw error;
        }

        const updatedStock = await Product.findOneAndUpdate(
            { _id: productId, stock: { $gte: minRequiredStock } },
            { $inc: { stock: quantityChange } },
            { new: true }
        );

        if(!updatedStock) {
            const error = new Error("Insufficient stock for adjustment");
            error.statusCode = 409;
            error.code = "INSUFFICIENT_STOCK";

            throw error;
        }

        return updatedStock;
    }

    if(product.type === "variable") {
        if(!mongoose.Types.ObjectId.isValid(variantId)) {
            const error = new Error("Invalid format of Variant ID");
            error.statusCode = 400;
            error.code = "INVALID_FORMAT_VARIANT_ID";

            throw error;
        }

        const variant = await Variant.findById(variantId);

        if(!variant) {
            const error = new Error("Variant does not exist");
            error.statusCode = 404;
            error.code = "VARIANT_NOT_FOUND";

            throw error;
        }

        if(variant.product.toString() !== productId.toString()) {
            const error = new Error("Variant does not belong to the specified product");
            error.statusCode = 400;
            error.code = "VARIANT_PRODUCT_MISMATCH";

            throw error;
        }

        const updatedVariant = await Variant.findOneAndUpdate(
            { _id: variantId, stock: { $gte: minRequiredStock } },
            { $inc: { stock: quantityChange } },
            { new: true } 
        );

        if(!updatedVariant) {
            const error = new Error("Insufficient stock for adjustment");
            error.statusCode = 409;
            error.code = "INSUFFICIENT_STOCK";

            throw error;
        }

        return updatedVariant;
    }
}

const checkAvailability = async({ productId, variantId, quantity }) => {
    if(!Number.isInteger(quantity) || quantity < 1) {
        const error = new Error("Quantity must be a positive integer");
        error.statusCode = 400;
        error.code = "INVALID_QUANTITY";

        throw error;
    }

    if(!mongoose.Types.ObjectId.isValid(productId)){
        const error = new Error("Invalid format of product ID");
        error.statusCode = 400;
        error.code = "INVALID_FORMAT_OF_ID";

        throw error;
    }

    const product = await Product.findById(productId);

    if(!product) {
        const error = new Error("Product id is not found");
        error.statusCode = 404;
        error.code = "PRODUCT_ID_NOT_AVAILABLE";

        throw error;
    }

    let availableStock;

    if(product.type === "simple") {
        if(variantId !== undefined) {
            const error = new Error("Simple products do not have variant ID");
            error.statusCode = 400;
            error.code = "VARIANT_ID_NOT_ALLOWED_FOR_SIMPLE_PRODUCT";

            throw error;
        }
        availableStock = product.stock;
    }

    if(product.type === "variable") {
        if(!mongoose.Types.ObjectId.isValid(variantId)) {
            const error = new Error("Invalid format of Variant ID");
            error.statusCode = 400;
            error.code = "INVALID_FORMAT_VARIANT_ID";

            throw error;
        }

        const variant = await Variant.findById(variantId);

        if(!variant) {
            const error = new Error("Variant does not exist");
            error.statusCode = 404;
            error.code = "VARIANT_NOT_FOUND";

            throw error;
        }

        if(variant.product.toString() !== productId.toString()) {
            const error = new Error("Variant does not belong to the specified product");
            error.statusCode = 400;
            error.code = "VARIANT_PRODUCT_MISMATCH";

            throw error;
        }
        availableStock = variant.stock;
    }

    return {
        available: availableStock >= quantity,
        availableStock,
        requestedQuantity: quantity
    };
}

module.exports = { deductStock, restoreStock, adjustStock, checkAvailability };