import { Form, Table } from "react-bootstrap";

const CargoList = () => {
	// TODO: get data from BE
	const cargoList = [
		{
			id: "CARGO001",
			name: "Строительные материалы",
			status: "В пути",
			origin: "Москва",
			destination: "Казань",
			departureDate: "2024-11-24",
		},
		{
			id: "CARGO002",
			name: "Хрупкий груз",
			status: "Ожидает отправки",
			origin: "Санкт-Петербург",
			destination: "Екатеринбург",
			departureDate: "2024-11-26",
		},
	];

	const statuses = ["Ожидает отправки", "В пути", "Доставлен"];

	const handleChangeStatus = (id, value) => {
		console.log(id, value);
		// TODO: request to BE
	};

	return (
		<Table
			className="w-75 mb-0 text-center"
			hover>
			<thead>
				<tr>
					<th>#</th>
					<th>Name</th>
					<th>Status</th>
					<th>Origin</th>
					<th>Destination</th>
					<th>Departure Date</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{cargoList.map((cargo) => (
					<tr>
						<td>{cargo.id}</td>
						<td>{cargo.name}</td>
						<td>
							<Form.Select
								value={cargo.status}
								onChange={(e) =>
									handleChangeStatus(cargo.id, e.target.value)
								}>
								{statuses.map((status) => (
									<option
										key={status}
										value={status}>
										{status}
									</option>
								))}
							</Form.Select>
						</td>
						<td>{cargo.origin}</td>
						<td>{cargo.destination}</td>
						<td>{cargo.departureDate}</td>
						<td>actions</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
};

export default CargoList;
