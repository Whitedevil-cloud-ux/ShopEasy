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

    const existingVariants = await Variant.find({ product: productId });

    const newVariationKey = generateVariationKey(attributes);

    const duplicateVariant = existingVariants.some(existingVariant => {
        const existingVariationKey = generateVariationKey(existingVariant.attributes);

        return existingVariationKey === newVariationKey;
    })

    if(duplicateVariant) {
        const error = new Error("Variant combination already exists");
        error.statusCode = 409;
        error.code = "DUPLICATE_VARIATION";

        throw error;
    }

    const variant = await Variant.create({
        product: productId,
        sku,
        attributes,
        price,
        stock
    });

    return {
        id: variant._id,
        product: variant.product,
        sku: variant.sku,
        attributes: variant.attributes,
        price: variant.price,
        stock: variant.stock
    };
};

module.exports = { createVariant };