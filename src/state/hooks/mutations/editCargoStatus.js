import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editCargoStatus } from "../../api/cargo";

export const useEditCargoStatus = (options) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (variables) => {
			return editCargoStatus(variables);
		},
		onSettled: () => {
			queryClient.invalidateQueries(["cargo"]);
		},
		...options,
	});
};
