const Variant = require("../models/Variants");
const Product = require("../models/Product");

const generateVariationKey = (attributes) => {
    const normalizedAttributes = attributes.map(attribute => {
        let normalizedValue = attribute.value;

        if(typeof normalizedValue === "string") {
            normalizedValue = normalizedValue.trim().toLowerCase();
        }

        return {
            name: attribute.name.trim().toLowerCase(),
            value: normalizedValue
        };
    });

    normalizedAttributes.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    return JSON.stringify(normalizedAttributes);
};

const createVariantDocument = async({
    productId,
    sku,
    attributes,
    price,
    stock,
    session
}) => {
    const existingVariants = await Variant.find({ product: productId }).session(session);

    const newVariationKey = generateVariationKey(attributes);

    const duplicateVariant = existingVariants.some(existingVariant => {
        const existingVariationKey = generateVariationKey(existingVariant.attributes);

        return existingVariationKey === newVariationKey;
    });

    if(duplicateVariant) {
        const error = new Error("Variant combination already exists");
        error.statusCode = 409;
        error.code = "DUPLICATE_VARIATION";

        throw error;
    }

    const [variant] = await Variant.create(
        [{
            product: productId,
            sku,
            attributes,
            price,
            stock,
        }],
        {
            session
        }
    );

    return {
        id: variant._id,
        product: variant.product,
        sku: variant.sku,
        attributes: variant.attributes,
        price: variant.price,
        stock: variant.stock
    };
}



const createVariant = async({
    productId,
    sku,
    attributes,
    price,
    stock
}) => {
    const existingProduct = await Product.findById(productId);

    if(!existingProduct) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        error.code = "PRODUCT_NOT_FOUND";

        throw error;
    }

    if(existingProduct.type === "simple") {
        const error = new Error("Product type is simple");
        error.statusCode = 400;
        error.code = "SIMPLE_PRODUCT";

        throw error;
    }

    return createVariantDocument({
        productId,
        sku,
        attributes,
        price,
        stock
    });
};

const updateVariant = async({
    variantId,
    sku,
    attributes,
    price,
    stock,
}) => {
    const existingVariant = await Variant.findById(variantId);

    if(!existingVariant) {
        const error = new Error("Variant not found");
        error.statusCode = 404;
        error.code = "VARIANT_NOT_FOUND";

        throw error;
    }

    const updateData = {};

    if(sku !== undefined){
        const existingSku = await Variant.findOne({ 
            sku, 
            _id: { $ne: variantId }
        });

        if (existingSku) {
            const error = new Error("SKU already exists");
            error.statusCode = 409;
            error.code = "DUPLICATE_SKU";

            throw error;
        }

        updateData.sku = sku;
    }

    if(attributes !== undefined) {
        const newVariationKey = generateVariationKey(attributes);

        const existingVariants = await Variant.find({
            product: existingVariant.product,
            _id: { $ne: variantId }
        });

        const duplicateVariant = existingVariants.some(existingVariant => {
            const existingVariationKey = generateVariationKey(
                existingVariant.attributes
            );

            return existingVariationKey === newVariationKey;
        });

        if(duplicateVariant) {
            const error = new Error("Variant combination already exists");
            error.statusCode = 409;
            error.code = "DUPLICATE_VARIATION";

            throw error;
        }

        updateData.attributes = attributes;
    }

    if(price !== undefined) {
        updateData.price = price;
    }

    if(stock !== undefined) {
        updateData.stock = stock;
    }

    if(Object.keys(updateData).length === 0){
        const error = new Error("Update at least one field");
        error.statusCode = 400;
        error.code = "NO_FIELD_UPDATED";

        throw error;
    }

    const newDetails = await Variant.findByIdAndUpdate(
        variantId, 
        updateData, 
        { 
            new: true,
            runValidators: true
        }
    );

    return newDetails;
}

module.exports = { createVariant, createVariantDocument, updateVariant };