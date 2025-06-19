"use client";

import { Product } from "@/types";
import Currency from "@/components/ui/currency";
import Button from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import useCart from "@/hooks/use-cart";

interface InfoProps {
    data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
    const cart = useCart();

    const onAddToCart = () => {
        cart.addItem(data);
    };

    return (
        <div>
            {/* Product Name */}
            <h1 className="text-lg font-bold text-[#994C00]">{data.name}</h1>

            {/* Price */}
            <div className="flex items-end justify-between mt-3">
                <p className="text-md text-gray-900">
                    <Currency value={data?.price} />
                </p>
            </div>

            {/* Divider */}
            <hr className="my-4" />

            {/* Details */}
            <div className="flex flex-col gap-y-6">
                {/* Passengers */}
                <div className="flex items-center gap-x-4">
                    <h3 className="font-semibold text-black">Quantity</h3>
                    <div>{data?.size?.value || "N/A"}</div>
                </div>

                {/* Vehicle */}
                <div className="flex items-center gap-x-4">
                    <h3 className="font-semibold text-black">Flavor:</h3>
                    <div>{data?.color?.name}</div>
                </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex items-center mt-10 gap-x-4">
                <Button
                    onClick={onAddToCart}
                    className="flex bg-[#556B2F] items-center text-white gap-x-2"
                >
                   Buy this
                    <ShoppingCart />
                </Button>
            </div>
        </div>
    );
};

export default Info;
