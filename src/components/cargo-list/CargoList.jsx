import { useState } from "react";
import { Alert, Form, Spinner, Table } from "react-bootstrap";
import { useCargos } from "../../state/hooks/queries/useCargos";
import { useEditCargoStatus } from "../../state/hooks/mutations/editCargoStatus";

const CargoList = () => {
	const [alertMessage, setAlertMessage] = useState("");
	const [showAlert, setShowAlert] = useState(false);

	const { data } = useCargos();

	const mutateEditStatus = useEditCargoStatus({
		onSuccess: (data) => {
			console.log(data);
		},
		onError: (error) => {
			setAlertMessage(
				error.response?.data?.message || "Something went wrong"
			);
			setShowAlert(true);
		},
	});

	const handleChangeStatus = (id, departure_date, status) => {
		setShowAlert(false);

		const today = new Date();
		const departureDate = new Date(departure_date);

		if (status === "Доставлен" && departureDate > today) {
			setAlertMessage(
				"Статус нельзя изменить на 'Доставлен', т.к. дата отправления в будущем"
			);
			setShowAlert(true);
			return;
		}

		mutateEditStatus.mutate({ id, status });
	};

	const statuses = ["Ожидает отправки", "В пути", "Доставлен"];

	const statusColor = (status) => {
		switch (status) {
			case "Ожидает отправки":
				return "bg-warning";
			case "В пути":
				return "bg-primary";
			case "Доставлен":
				return "bg-success";
		}
	};

	return (
		<>
			{data ? (
				<Table
					className="w-75 mb-0"
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
						{data.map((cargo) => (
							<tr key={cargo.id}>
								<td>{cargo.cargo_id}</td>
								<td>{cargo.name}</td>
								<td>
									<Form.Select
										value={cargo.status}
										onChange={(e) =>
											handleChangeStatus(
												cargo.id,
												cargo.departure_date,
												e.target.value
											)
										}
										className={`text-white arrow-white shadow-none border ${statusColor(
											cargo.status
										)}`}>
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
								<td>{cargo.departure_date}</td>
								<td>actions</td>
							</tr>
						))}
					</tbody>
				</Table>
			) : (
				<div
					className="d-flex align-items-center"
					style={{ height: "150px" }}>
					<Spinner />
				</div>
			)}

			<Alert
				className="position-absolute top-0 end-0 m-3"
				closeVariant=""
				show={showAlert}
				variant="danger">
				{alertMessage}
				<span
					role="button"
					className="ms-3"
					onClick={() => setShowAlert(false)}>
					&#x2715;
				</span>
			</Alert>
		</>
	);
};

export default CargoList;
