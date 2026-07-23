import PromoCodeModel from "../models/promocode.model.js";

// Create a new Promo Code (Admin Only)
export async function createPromoCodeController(request, response) {
    try {
        const { code, type, value, minOrder, maxDiscount, description } = request.body;

        if (!code || !value || !description) {
            return response.status(400).json({
                message: "Code, value, and description are required fields",
                error: true,
                success: false
            });
        }

        const existingCode = await PromoCodeModel.findOne({ code: code.toUpperCase().trim() });
        if (existingCode) {
            return response.status(400).json({
                message: "Promo code with this name already exists",
                error: true,
                success: false
            });
        }

        const newPromoCode = new PromoCodeModel({
            code: code.toUpperCase().trim(),
            type: type || "percentage",
            value: Number(value),
            minOrder: Number(minOrder) || 0,
            maxDiscount: Number(maxDiscount) || 0,
            description: description.trim(),
            status: true
        });

        const savedPromo = await newPromoCode.save();

        return response.json({
            message: "Promo code created successfully",
            data: savedPromo,
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Get Active Promo Codes (Public for Checkout / Frontend)
export async function getPublicPromoCodesController(request, response) {
    try {
        const activePromoCodes = await PromoCodeModel.find({ status: true }).sort({ createdAt: -1 });

        return response.json({
            message: "Active promo codes",
            data: activePromoCodes,
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Get All Promo Codes (Admin Only)
export async function getAdminPromoCodesController(request, response) {
    try {
        const allPromoCodes = await PromoCodeModel.find({}).sort({ createdAt: -1 });

        return response.json({
            message: "All promo codes list",
            data: allPromoCodes,
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Update / Toggle Status Promo Code (Admin Only)
export async function updatePromoCodeController(request, response) {
    try {
        const { _id, status, type, value, minOrder, maxDiscount, description } = request.body;

        if (!_id) {
            return response.status(400).json({
                message: "Promo Code ID is required",
                error: true,
                success: false
            });
        }

        const updateData = {};
        if (typeof status === "boolean") updateData.status = status;
        if (type) updateData.type = type;
        if (value !== undefined) updateData.value = Number(value);
        if (minOrder !== undefined) updateData.minOrder = Number(minOrder);
        if (maxDiscount !== undefined) updateData.maxDiscount = Number(maxDiscount);
        if (description) updateData.description = description;

        const updatedPromo = await PromoCodeModel.findByIdAndUpdate(_id, updateData, { new: true });

        if (!updatedPromo) {
            return response.status(404).json({
                message: "Promo code not found",
                error: true,
                success: false
            });
        }

        return response.json({
            message: "Promo code updated successfully",
            data: updatedPromo,
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Delete Promo Code (Admin Only)
export async function deletePromoCodeController(request, response) {
    try {
        const { _id } = request.body;

        if (!_id) {
            return response.status(400).json({
                message: "Promo Code ID is required",
                error: true,
                success: false
            });
        }

        const deletedPromo = await PromoCodeModel.findByIdAndDelete(_id);

        if (!deletedPromo) {
            return response.status(404).json({
                message: "Promo code not found",
                error: true,
                success: false
            });
        }

        return response.json({
            message: "Promo code deleted successfully",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
