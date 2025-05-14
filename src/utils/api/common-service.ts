import api from "@/api/common/api";

const API = "https://vietnam-administrative-division-json-server-swart.vercel.app";

const apiGetProvinces = async () => {
	const response = await api.get(`${API}/province`);
	return response;
};

const apiGetDistrict = async (idProvince: string) => {
	const response = await api.get(`${API}/district/?idProvince=${idProvince}`);
	return response;
};

const apiGetCommune = async (idDistrict: string) => {
	const response = await api.get(`${API}/commune/?idDistrict=${idDistrict}`);
	return response;
};

export const provinceService = {
	apiGetProvinces,
	apiGetDistrict,
	apiGetCommune,
};
