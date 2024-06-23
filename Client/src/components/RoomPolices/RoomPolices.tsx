import React from 'react';

const infoSections = [
   {
      title: 'House Rules',
      items: [
         'Check-in after 2:00 PM',
         'Check-out before 12:00 PM',
         'Maximum 3 guests',
      ],
      moreText: 'Show more',
   },
   {
      title: 'Safety & Property',
      items: ['No carbon monoxide detector', 'Smoke detector'],
      moreText: 'Show more',
   },
   {
      title: 'Cancellation Policy',
      items: [
         'Free cancellation before June 30',
         'Read the full cancellation policy of the host/organization, applicable even if you cancel due to illness or disruption caused by COVID-19.',
      ],
      moreText: 'Show more',
   },
];

const RoomPolices: React.FC = () => {
   return (
      <div className="mt-5">
         <h2 className="mb-4 text-2xl font-normal">Things to know</h2>
         <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {infoSections.map((section, index) => (
               <div key={index} className="space-y-2">
                  <h3 className="text-xl font-semibold">{section.title}</h3>
                  <ul className="space-y-1">
                     {section.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                     ))}
                  </ul>
                  <a href="#" className="text-blue-600">
                     {section.moreText}
                  </a>
               </div>
            ))}
         </div>
      </div>
   );
};

export default RoomPolices;
