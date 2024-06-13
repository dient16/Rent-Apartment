import icons from '@/utils/icons';
import { Button, Flex, Input } from 'antd';

const Footer: React.FC = () => {
   const {
      FaFacebookF,
      AiOutlineTwitter,
      AiOutlineGoogle,
      BsPinterest,
      AiOutlineInstagram,
      MdOutlineKeyboardArrowRight,
   } = icons;
   return (
      <footer className="flex justify-center items-center p-10 w-full min-h-[370px] bg-midnight-blue">
         <div className="flex flex-wrap gap-5 items-start w-full text-white max-w-main min-w-[240px]">
            <div className="flex flex-col flex-1 justify-center gap-[20px]">
               <div className="text-xl font-semibold font-main">About Site</div>
               <div className="text-sm font-light leading-7 font-main text-midnight-blue-500">
                  We’re reimagining how you buy, sell and rent. It’s now easier
                  to get into a place you love. So let’s do this, together
               </div>
            </div>
            <div className="flex flex-col flex-1 justify-center gap-[15px] min-w-[240px] md:ml-[70px]">
               <div className="text-xl font-semibold font-main">
                  Quick Links
               </div>
               <div className="flex flex-col gap-3 justify-center items-start text-sm font-light font-main text-midnight-blue-500">
                  <span className="transition duration-300 ease-in-out cursor-pointer hover:text-white hover:translate-x-5">
                     About Us
                  </span>
                  <span className="transition duration-300 ease-in-out cursor-pointer hover:text-white hover:translate-x-5">
                     Terms & Conditions
                  </span>
                  <span className="transition duration-300 ease-in-out cursor-pointer hover:text-white hover:translate-x-5">
                     User’s Guide
                  </span>
                  <span className="transition duration-300 ease-in-out cursor-pointer hover:text-white hover:translate-x-5">
                     Support Center
                  </span>
                  <span className="transition duration-300 ease-in-out cursor-pointer hover:text-white hover:translate-x-5">
                     Press Info
                  </span>
               </div>
            </div>
            <div className="flex flex-col flex-1 justify-center gap-[15px] min-w-[240px]">
               <div className="text-xl font-semibold font-main">Contact Us</div>
               <div className="flex flex-col gap-3 justify-center items-start text-sm font-light font-main text-midnight-blue-500">
                  <span className="transition duration-300 ease-in-out cursor-pointer hover:text-white hover:translate-x-5">
                     info@findhouse.com
                  </span>
                  <span className="transition duration-300 ease-in-out cursor-pointer hover:text-white hover:translate-x-5">
                     Collins Street West, Victoria
                  </span>
                  <span className="transition duration-300 ease-in-out cursor-pointer hover:text-white hover:translate-x-5">
                     8007, Australia.
                  </span>
                  <span className="transition duration-300 ease-in-out cursor-pointer hover:text-white hover:translate-x-5">
                     +1 246-345-0699
                  </span>
                  <span className="transition duration-300 ease-in-out cursor-pointer hover:text-white hover:translate-x-5">
                     +1 246-345-0695
                  </span>
               </div>
            </div>
            <div className="flex flex-col flex-1 justify-center gap-[15px] min-w-[240px]">
               <div className="text-xl font-semibold font-main">Follow us</div>
               <div className="flex flex-col gap-3 justify-center items-start text-sm font-light font-main text-midnight-blue-500">
                  <Flex gap={20}>
                     <FaFacebookF size={18} />
                     <AiOutlineTwitter size={22} />
                     <AiOutlineInstagram size={22} />
                     <BsPinterest size={18} />
                     <AiOutlineGoogle size={22} />
                  </Flex>
               </div>
               <div className="text-xl font-semibold font-main">Subscribe</div>
               <Flex align="center" gap={10}>
                  <Input
                     placeholder="Your email"
                     className="flex justify-center items-center py-3 px-5 rounded-full w-[200px]"
                  />
                  <Button
                     icon={
                        <MdOutlineKeyboardArrowRight size={20} color="#fff" />
                     }
                     shape="circle"
                     className="flex justify-center items-center"
                     size="large"
                  />
               </Flex>
            </div>
         </div>
      </footer>
   );
};

export default Footer;
