import axios from "axios";

const url = process.env.REACT_APP_API_URL;

export const getCargos = async () => {
	try {
		const { data } = await axios.get(`${url}/cargo`);
		console.log("Cargo data:", data);

		return data;
	} catch (error) {
		console.error("Error fetching cargos: ", error);
		throw error;
	}
};

export const editCargoStatus = async (payload) => {
	const { id, status } = payload;

	try {
		const { data } = await axios.put(`${url}/cargo/${id}`, { status });
		console.log("Edited cargo data: ", data);

		return data;
	} catch (error) {
		throw error;
	}
};

export const createCargo = async (payload) => {
	try {
		const { data } = await axios.post(`${url}/cargo`, payload);
		console.log("Cargo data: ", data);

		return data;
	} catch (error) {
		throw error;
	}
};
