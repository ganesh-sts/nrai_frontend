import axios from "axios";

const API_BASE = "http://localhost:5000"; // replace with your Flask server URL

// Utility: convert snake_case keys to camelCase
const snakeToCamel = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => snakeToCamel(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      acc[camelKey] = snakeToCamel(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
};
const camelToSnake = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => camelToSnake(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
      acc[snakeKey] = camelToSnake(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
};


// Get shooter data by ID (auto converts to camelCase)
export const getShooterData = async (shooterId: string) => {
  try {
    const res = await axios.get(`${API_BASE}/get_shooter/${shooterId}`);
    if (res.data) {
      return snakeToCamel(res.data);
    }
    return null;
  } catch (error) {
    console.error("Error fetching shooter data:", error);
    return null;
  }
};

// Register or save coach data
export const registerCoach = async (data: any) => {
  try {
    // Transform certificate data to send only file names
    const transformedData = {
      ...data,
      certificates: data.certificate.map((cert: any) => ({
        coach_course_certificate_name: cert.name,
        coach_course_certificate_file: cert.file?.name || ""  // take only file name
      })),
    };
        delete transformedData.certificate;
       const snakeTransformedData=camelToSnake(transformedData)
 console.log("submited data",transformedData)
    const res = await axios.post(`${API_BASE}/register`, snakeTransformedData, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    console.error("Error registering coach:", error);
    throw error;
  }
};