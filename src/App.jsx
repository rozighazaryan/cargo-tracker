import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Main from "./pages/main/Main";
import "bootstrap/dist/css/bootstrap.min.css";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<div>
				<Main />
			</div>
		</QueryClientProvider>
	);
}

export default App;
