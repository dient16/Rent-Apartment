import { Image, Button, Drawer, Carousel } from 'antd';
import { MdImage } from 'react-icons/md';
import { useState } from 'react';

interface ImageGalleryProps {
   images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
   const [drawerVisible, setDrawerVisible] = useState(false);

   const showDrawer = () => {
      setDrawerVisible(true);
   };

   const onClose = () => {
      setDrawerVisible(false);
   };

   return (
      <>
         <div className="hidden lg:grid overflow-hidden relative grid-cols-4 grid-rows-4 gap-3 mt-10 w-full max-h-[400px] lg:min-h-[300px]">
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
               onClick={showDrawer}
            >
               <MdImage size={18} />
               <span>Show all images</span>
            </Button>
         </div>
         <div className="lg:hidden mt-10">
            <Carousel arrows={true} swipeToSlide draggable>
               {images.map((image, index) => (
                  <div key={index} className="w-full h-[250px] md:h-[400px]">
                     <Image
                        src={image}
                        width="100%"
                        height="100%"
                        preview={false}
                        className="rounded-2xl"
                     />
                  </div>
               ))}
            </Carousel>
         </div>
         <Drawer
            title="All Images"
            placement="bottom"
            onClose={onClose}
            open={drawerVisible}
            height="100%"
            width="100%"
         >
            <div className="grid grid-cols-3 gap-3">
               {images.map((image, index) => (
                  <div key={index} className="overflow-hidden rounded-2xl">
                     <Image src={image} width="100%" />
                  </div>
               ))}
            </div>
         </Drawer>
      </>
   );
};

export default ImageGallery;
