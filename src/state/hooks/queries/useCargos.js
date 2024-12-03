import { useQuery } from "@tanstack/react-query";
import { getCargos } from "../../api/cargo";

export const useCargos = (options) => {
	return useQuery({
		queryKey: ["cargo"],
		queryFn: getCargos,
		retry: 1,
		...options,
	});
};
