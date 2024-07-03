import React from 'react';

interface RoomAmenityItemProps {
   label: string;
   value: string;
   checked: boolean;
   onChange: (value: string) => void;
   imageSrc: string;
}

const RoomAmenityItem: React.FC<RoomAmenityItemProps> = ({
   label,
   value,
   checked,
   onChange,
   imageSrc,
}) => {
   return (
      <div
         className={`flex flex-col items-start justify-center p-5 border rounded-lg cursor-pointer w-[250px] h-[130px] font-main ${
            checked ? 'border-black' : 'border-gray-300'
         }`}
         onClick={() => onChange(value)}
      >
         <img src={imageSrc} alt={label} className="mb-2 h-[30px] w-[30px]" />
         <div className="text-lg">{label}</div>
      </div>
   );
};

export default RoomAmenityItem;
