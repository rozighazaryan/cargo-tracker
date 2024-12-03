import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCargo } from "../../api/cargo";

export const useCreateCargo = (options) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (variables) => {
			return createCargo(variables);
		},
		onSettled: () => {
			queryClient.invalidateQueries(["cargo"]);
		},
		...options,
	});
};
