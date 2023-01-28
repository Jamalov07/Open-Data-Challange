import axios from 'axios';

export const getFullName = async (lat: number, lon: number) => {
  let data = await axios.get(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
  );
  return data.data;
};
