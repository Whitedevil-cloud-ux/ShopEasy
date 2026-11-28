const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Variant = require("../models/Variants");
const inventoryService = require("./inventory.service");

const formatCartResponse = (cart) => {
    if(!cart) {
        return {
            _id: null,
            items: [],
            totalItems: 0,
            subtotal: 0,
        };
    }

    let totalItems = 0;
    let subtotal = 0;
    const formattedItems = [];

    for(const item of cart.items) {
        if(!item.product || item.product.isActive === false) continue;
        if(item.product.type === "variable" && (!item.variant || item.variant.isActive === false)) {
            continue;
        }

        const unitPrice =
            item.product.type === "variable" ? item.variant.price : item.product.price;
        const itemTotal = unitPrice * item.quantity;

        totalItems += item.quantity;
        subtotal += itemTotal;

        formattedItems.push({
            _id: item._id,
            product: item.product,
            variant: item.variant || null,
            quantity: item.quantity,
            unitPrice,
            itemTotal,
        });
    }

    return {
        _id: cart._id,
        user: cart.user,
        items: formattedItems,
        totalItems,
        subtotal,
    };
};

const getCart = async({ userId }) => {
    if(!mongoose.Types.ObjectId.isValid(userId)) {
        const error = new Error("Invalid format ID");
        error.statusCode = 400;
        error.code = "INVALID_FORMAT";

        throw error;
    }

    const cart = await Cart.findOne({ user: userId })
        .populate("items.product", "name price type images isActive")
        .populate("items.variant", "sku attributes price stock isActive");

    return formatCartResponse(cart);
};

const addItemToCart = async({ userId, productId, variantId, quantity = 1 }) => {
    if(!mongoose.Types.ObjectId(userId)) {
        const error = new Error("Invalid format of User Id");
        error.statusCode = 400;
        error.code = "INVALID_FORMAT_ID";

        throw error;
    }

    if(!Number.isInteger(quantity) && quantity < 1) {
        const error = new Error("It must be a positive integer");
        error.statusCode = 400;
        error.code = "QUANTITY_MUST_BE_A_POSITIVE_INTEGER";

        throw error;
    }

    if(!mongoose.Types.ObjectId(productId)) {
        const error = new Error("Invalid format of product id");
        error.statusCode = 400;
        error.code = "INVALID_FORMAT_OF_PRODUCT_ID";

        throw error;
    }

    const product = await Product.findById(productId);

    if(!product || product.isActive === false) {
        const error = new Error("Product does not exist");
        error.statusCode = 404;
        error.code = "PRODUCT_NOT_FOUND";

        throw error;
    }

    if(product.type === "simple") {
        if(variantId !== undefined && variantId !== null) {
            const error = new Error("Variant does not exists for simple products");
            error.statusCode = 400;
            error.code = "VARIANT_NOT_ALLOWED_FOR_SIMPLE_PRODUCTS";

            throw error;
        }
    }

    if(product.type === "variable") {
        if(!mongoose.Types.ObjectId(variantId)) {
            const error = new Error("Invalid format of variant Id");
            error.statusCode = 400;
            error.code = "INVALID_FORMAT_OF_VARIANT_ID";

            throw error;
        }

        const variant = await Variant.findById(variantId);

        if(!variant || variant.isActive === false) {
            const error = new Error("Variant does not exists");
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
    }

    let cart = await Cart.findOne({ user: userId });

    if(!cart) {
        cart = new Cart({ user: userId, items: [] });
    }

    const normalizedVariantId = variantId ? variantId.toString() : null;

    const existingItem = cart.items.find(
        (item) => 
            item.product.toString() === productId.toString() &&
            (item.variant ? item.variant.toString() : null) === normalizedVariantId
    );

    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    const stockCheck = await inventoryService.checkAvailability({
        productId,
        variantId: product.type === "variable" ? variantId : undefined,
        quantity: newQuantity,
    });

    if(!stockCheck.available) {
        const error = new Error(
            `Only ${stockCheck.availableStock} item(s) available in stock`
        );
        error.statusCode = 409;
        error.code = "INSUFFICIENT_STOCK";

        throw error;
    }

    if(existingItem) {
        existingItem.quantity = newQuantity;
    }else {
        cart.items.push({
            product: productId,
            variant: normalizedVariantId,
            quantity,
        });
    }

    await cart.save();

    await cart.populate("items.product", "name price type images isActive");
    await cart.populate("items.variant", "sku attributes price stock isActive");

    return formatCartResponse(cart);
}

const updateCartItemQuantity = async({ userId, itemId, quantity }) => {
    if(!mongoose.Types.ObjectId.isValid(userId)) {
        const error = new Error("Invalid format of user id");
        error.statusCode = 400;
        error.code = "INVALID_FORMAT_OF_USER_ID";

        throw error;
    }

    if(!mongoose.Types.ObjectId.isValid(itemId)) {
        const error = new Error("Invalid format of Cart Item Id");
        error.statusCode = 400;
        error.code = "INVALID_FORMAT_ITEM_ID";

        throw error;
    }

    if(!Number.isInteger(quantity) || quantity < 1) {
        const error = new Error("Cart not found");
        error.statusCode = 404;
        error.code = "CART_NOT_FOUND";

        throw error;
    }

    const cart = await Cart.findOne({ user: userId });
    
    if(!cart) {
        const error = new Error("Cart not found");
        error.statusCode = 404;
        error.code = "CART_NOT_FOUND";

        throw error;
    }

    const item = cart.items.id(itemId);

    if(!item) {
        const error = new Error("Cart item not found");
        error.statusCode = 404;
        error.code = "CART_ITEM_NOT_FOUND";

        throw error;
    }

    const stockCheck = await inventoryService.checkAvailability({
        productId: item.product,
        variantId: item.variant || undefined,
        quantity,
    });

    if(!stockCheck.available) {
        const error = new Error(
            `Only ${stockCheck.availableStock} item(s) available in stock`
        );
        error.statusCode = 409;
        error.code = "INSUFFICIENT_STOCK";

        throw error;
    }

    item.quantity = quantity;
    await cart.save();

    await cart.populate("items.product", "name price type images isActive");
    await cart.populate("items.variant", "sku attributes price stock isActive");

    return formatCartResponse(cart);
};

const removeCartItem = async({ userId, itemId }) => {
    if(!mongoose.Types.ObjectId.isValid(userId)) {
        const error = new Error("Invalid format of User Id");
        error.statusCode = 400;
        error.code = "INVALID_FORMAT_USER_ID";

        throw error;
    }

    if(!mongoose.Types.ObjectId.isValid(itemId)) {
        const error = new Error("Invalid format of Cart Item Id");
        error.statusCode = 400;
        error.code = "INVALID_FORMAT_ITEM_ID";

        throw error;
    }

    const cart = await Cart.findOne({ user: userId });

    if(!cart) {
        const error = new Error("Cart not found");
        error.statusCode = 404;
        error.code = "CART_NOT_FOUND";

        throw error;
    }

    const item = cart.items.id(itemId);

    if(!item) {
        const error = new Error("Cart item not found");
        error.statusCode = 404;
        error.code = "CART_ITEM_NOT_FOUND";

        throw error;
    }

    item.deleteOne();
    await cart.save();

    await cart.populate("items.product", "name price type images isActive");
    await cart.populate("items.variant", "sku attributes price stock isActive");

    return formatCartResponse(cart);
};

const clearCart = async({ userId }) => {
    if(!mongoose.Types.ObjectId.isValid(userId)) {
        const error = new Error("Invalid format of User Id");
        error.statusCode = 400;
        error.code = "INVALID_FORMAT_OF_USER_ID";

        throw error;
    }

    const cart = await Cart.findOne({ user: userId });

    if(!cart) {
        return formatCartResponse(null);
    }

    cart.items = [];
    await cart.save();

    return formatCartResponse(cart);
};

module.exports = { getCart, addItemToCart, updateCartItemQuantity, removeCartItem, clearCart };