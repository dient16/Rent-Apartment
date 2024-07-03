import React from 'react';
import RoomAmenityItem from './RoomAmenityItem';

interface RoomAmenitiesSelectorProps {
   options: { label: string; value: string; imageSrc: string }[];
   selectedValues: string[];
   onChange: (selectedValues: string[]) => void;
}

const RoomAmenitiesSelector: React.FC<RoomAmenitiesSelectorProps> = ({
   options,
   selectedValues,
   onChange,
}) => {
   const handleItemChange = (value: string) => {
      if (selectedValues.includes(value)) {
         onChange(selectedValues.filter((item) => item !== value));
      } else {
         onChange([...selectedValues, value]);
      }
   };

   return (
      <div className="grid grid-cols-5 gap-4">
         {options.map((option) => (
            <RoomAmenityItem
               key={option.value}
               label={option.label}
               value={option.value}
               checked={selectedValues.includes(option.value)}
               onChange={handleItemChange}
               imageSrc={option.imageSrc}
            />
         ))}
      </div>
   );
};

export default RoomAmenitiesSelector;
