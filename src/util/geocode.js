import axios from "axios";
import configDotenv from "dotenv";

const addressToGeocode = async (address) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json`;
    const response = await axios.get(url, {
      params: {
        address: address,
        key: process.env.MAP_API_KEY,
      },
    });

    const data = response.data;

    if (data.status !== "OK") {
      throw new Error("좌표 역변환 실패 ", data.status);
    }
    const { lat, lng } = data.results[0].geometry.location;
    const latitude = lat;
    const longitude = lng;

    return { latitude, longitude };
  } catch (err) {
    console.log(`Google Map API 에러: ${err}`);
    return `Google Map API 에러: ${err}`;
  }
};

export default addressToGeocode;
