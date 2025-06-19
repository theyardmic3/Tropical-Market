"use client";

import Currency from '@/components/ui/currency';
import IconButton from '@/components/ui/icon-button';
import useCart from '@/hooks/use-cart';
import { X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { Product } from '@/types';

interface CartItemProps {
    data: Product;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
    const cart = useCart();

    const onRemove = () => {
        try {
            cart.removeItem(data.id);
            toast.success('Item removed from cart');
        } catch (error) {
            toast.error('Failed to remove item from cart');
        }
    };

    return (
        <li className="flex py-6 border-b">
            {/* Product Image */}
            <div className="relative w-24 h-24 overflow-hidden rounded-md sm:h-48 sm:w-48">
                {data.images && data.images[0] ? (
                    <Image
                        fill
                        src={data.images[0].url}
                        alt={data.name || 'Product Image'}
                        className="object-cover object-center"
                    />
                ) : (
                    <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                        <p className="text-gray-500">No Image</p>
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="relative flex flex-col justify-between flex-1 ml-4 sm:ml-6">
                {/* Remove Button */}
                <div className="absolute top-0 right-0 z-10">
                    <IconButton onClick={onRemove} icon={<X size={15} />} />
                </div>

                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    {/* Product Name */}
                    <div className="flex justify-between">
                        <p className="text-lg font-semibold text-[#994C00]">
                            {data.name || 'Unnamed Product'}
                        </p>
                    </div>

                    {/* Product Attributes */}
                    <div className="flex mt-1 text-sm">
                        <p className="text-[#556B2F]">{data.color?.name || 'No Flavor Selected'}</p>
                        <p className="pl-4 ml-4 text-gray-500 border-l border-gray-200">
                            {data.size?.name || 'No Quantity Selected'}
                        </p>
                    </div>

                    {/* Product Price */}
                    <Currency value={data.price || 0} />
                </div>
            </div>
        </li>
    );
};

export default CartItem;
