"use client";

import { Billboard as BillboardType } from "@/types";

interface BillboardProps {
  data: BillboardType;
}

const Billboard: React.FC<BillboardProps> = ({ data }) => {
  return (
    <div className="p-4 overflow-hidden sm:p-6 lg:p-8 rounded-xl">
      <div className="relative rounded-xl aspect-square md:aspect-[2.4/1] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover"
          style={{ backgroundImage: `url(${data?.imageUrl})` }}
        />
        {/* Overlay */}
        <div className='absolute inset-0 bg-black/50' />
        <div className="relative flex flex-col justify-center items-center h-full text-center text-white gap-y-8">
          <div className="max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold">
              {data?.label}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billboard;

