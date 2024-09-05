// import React, { useState } from 'react';
// import { Input, Button, List, Divider } from 'antd';

// const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search?';

// const SearchBox = (props) => {
//    const { selectPosition, setSelectPosition, setFieldValue } = props;
//    const [searchText, setSearchText] = useState('');
//    const [listPlace, setListPlace] = useState([]);

//    const handleSearch = () => {
//       const params = {
//          q: searchText,
//          format: 'json',
//          addressdetails: 1,
//          polygon_geojson: 0,
//       };
//       const queryString = new URLSearchParams(params).toString();
//       const requestOptions = {
//          method: 'GET',
//          redirect: 'follow',
//       };
//       fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
//          .then((response) => response.json())
//          .then((result) => {
//             setListPlace(result);
//          })
//          .catch((err) => console.log('err: ', err));
//    };

//    const handleSelectPlace = (item) => {
//       setSelectPosition(item);
//       setFieldValue('location.lat', item.lat);
//       setFieldValue('location.lon', item.lon);
//       if (item.address) {
//          setFieldValue('location.street', item.address.road || '');
//          setFieldValue('location.district', item.address.suburb || '');
//          setFieldValue('location.ward', item.address.neighbourhood || '');
//          setFieldValue('location.province', item.address.state || '');
//       }
//    };

//    return (
//       <div style={{ display: 'flex', flexDirection: 'column' }}>
//          <div style={{ display: 'flex', marginBottom: '16px' }}>
//             <Input
//                style={{ flex: 1 }}
//                value={searchText}
//                onChange={(event) => setSearchText(event.target.value)}
//                placeholder="Enter address"
//             />
//             <Button
//                type="primary"
//                onClick={handleSearch}
//                style={{ marginLeft: '8px' }}
//             >
//                Search
//             </Button>
//          </div>
//          <List
//             bordered
//             dataSource={listPlace}
//             renderItem={(item) => (
//                <>
//                   <List.Item onClick={() => handleSelectPlace(item)}>
//                      <List.Item.Meta
//                         title={item.display_name}
//                         avatar={
//                            <img
//                               src="./placeholder.png"
//                               alt="Placeholder"
//                               style={{ width: 38, height: 38 }}
//                            />
//                         }
//                      />
//                   </List.Item>
//                   <Divider />
//                </>
//             )}
//          />
//       </div>
//    );
// };

// export default SearchBox;
