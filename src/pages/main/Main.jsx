import CargoList from "../../components/cargo-list/CargoList";
import Footer from "../../components/footer/Footer";

const Main = () => {
	return (
		<div className="d-flex flex-column align-items-center justify-content-between vh-100">
			<div className="d-flex flex-column align-items-center w-100 p-4">
				<h1 className="mb-4">Cargo List</h1>
				<CargoList />
			</div>
			<Footer />
		</div>
	);
};

export default Main;
