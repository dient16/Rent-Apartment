import { Image, Button } from 'antd';
import { MdImage } from 'react-icons/md';

interface ImageGalleryProps {
   images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
   return (
      <div className="grid overflow-hidden relative grid-cols-4 grid-rows-4 gap-3 mt-10 w-full max-h-[400px] lg:min-h-[300px]">
         <div className="col-span-2 row-span-4">
            <div className="overflow-hidden w-full h-full rounded-2xl">
               <Image src={images[0]} width="100%" height="100%" />
            </div>
         </div>
         <div className="flex col-span-2 row-span-2 gap-3">
            <div className="overflow-hidden w-1/2 h-full rounded-2xl">
               <Image src={images[1]} width="100%" height="100%" />
            </div>
            <div className="overflow-hidden w-1/2 h-full rounded-2xl">
               <Image src={images[2]} width="100%" height="100%" />
            </div>
         </div>
         <div className="flex col-span-2 row-span-2 gap-3">
            <div className="overflow-hidden w-1/2 h-full rounded-2xl">
               <Image src={images[3]} width="100%" height="100%" />
            </div>
            <div className="overflow-hidden w-1/2 h-full rounded-2xl">
               <Image src={images[4]} width="100%" height="100%" />
            </div>
         </div>
         <Button
            className="flex absolute right-3 bottom-3 gap-2 items-center bg-white border border-black"
            size="middle"
         >
            <MdImage size={18} />
            <span>Show all images</span>
         </Button>
      </div>
   );
};

export default ImageGallery;
