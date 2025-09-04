import axios from 'axios';

const API_BASE = 'http://localhost:5000';

// Utility: convert snake_case keys to camelCase
const snakeToCamel = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => snakeToCamel(v));
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
    return obj.map((v) => camelToSnake(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
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
      console.log("shooter data",res.data)
      return snakeToCamel(res.data);
    }
    return null;
  } catch (error) {
    console.error('Error fetching shooter data:', error);
    return null;
  }
};

// Register or save coach data
// Register or save coach data
export const registerCoach = async (formData: any) => {
  try {
    const data = new FormData();

    // Add main coach fields (except event_type, certificates)
    Object.entries({
      shooter_id: formData.shooterId,
      nrai_id: formData.nraiId,
      first_name: formData.firstName,
      last_name: formData.lastName,
      aadhaar: formData.aadhaar,
      email: formData.email,
      contact: formData.contact,
      date_of_birth: formData.dateOfBirth,
      gender: formData.gender,
      state: formData.state,
      address: formData.address,
      nrai_licence: formData.nraiLicence,
      nrai_valid_upto: formData.nraiValidUpto,
      issf_licence: formData.issfLicence,
      issf_valid_upto: formData.issfValidUpto,
      coaching_experience_year: formData.coachingExperienceYear,
      coaching_experience_month: formData.coachingExperienceMonth,
    }).forEach(([key, value]) => {
      if (value) data.append(key, value as string);
    });

    // ✅ Send event_type as JSON list (matches Marshmallow)
    data.append("event_type", JSON.stringify(formData.eventType));

    // Add profile photo file
    if (formData.profilePhoto instanceof File) {
      data.append("profile_photo", formData.profilePhoto);
    }

        const certificates: any[] = [];


    // Also upload certificate files (so backend can save them)
formData.certificate.forEach((cert: any, index: number) => {
  if (cert.file) {
    data.append(`certificate_file_${index}`, cert.file); // <-- file
  }
  if (cert.name) {
    certificates.push({
      coach_course_certificate_name: cert.name,
      coach_course_certificate_file: "" // backend will fill after saving
    });
  }
});
    logFormData(data);
    console.log("Profile Photo File:", formData.profilePhoto);


    const res = await axios.post(`${API_BASE}/register`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Error registering coach:", error);
    throw error;
  }
};


const logFormData = (formData: FormData) => {
  console.log("---- FormData Contents ----");
  Array.from(formData.entries()).forEach(([key, value]) => {
    if (value instanceof File) {
      console.log(`${key}: File { name: ${value.name}, size: ${value.size}, type: ${value.type} }`);
    } else {
      console.log(`${key}: ${value}`);
    }
  });
  console.log("---------------------------");
};

export const getShooterProfilePhoto = async (shooterId: string): Promise<string | null> => {
  try {
    const res = await axios.get(`${API_BASE}/get_shooter_profile/${shooterId}`);
    console.log("profile",res.data)
    return res.data.profile_photo || null;
  } catch (error) {
    console.error("Error fetching profile photo:", error);
    return null;
  }
};
