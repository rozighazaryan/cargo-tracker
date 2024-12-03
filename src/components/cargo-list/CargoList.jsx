import { useState } from "react";
import { Alert, Button, Form, Modal, Spinner, Table } from "react-bootstrap";
import { useCargos } from "../../state/hooks/queries/useCargos";
import { useEditCargoStatus } from "../../state/hooks/mutations/editCargoStatus";
import { useCreateCargo } from "../../state/hooks/mutations/createCargo";

const CargoList = () => {
	const initialFormData = {
		name: "",
		origin: "Москва",
		destination: "Санкт-Петербург",
		departure_date: "",
		status: "Ожидает отправки",
	};

	const [alertMessage, setAlertMessage] = useState("");
	const [showAlert, setShowAlert] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [btnDisabled, setBtnDisabled] = useState(false);
	const [formData, setFormData] = useState(initialFormData);
	const [filterStatus, setFilterStatus] = useState("");

	const { data } = useCargos();

	const mutateCreateCargo = useCreateCargo({
		onSuccess: () => {
			setBtnDisabled(false);
			setShowModal(false);
			setFormData(initialFormData);
		},
		onError: (error) => {
			setBtnDisabled(false);
			setAlertMessage(
				error.response?.data?.message || "Something went wrong"
			);
			setShowAlert(true);
		},
	});

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

	const cities = [
		"Москва",
		"Санкт-Петербург",
		"Армавир",
		"Новосибирск",
		"Екатеринбург",
		"Краснодар",
	];

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

	const changeModalVisibility = () => setShowModal(!showModal);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = () => {
		setBtnDisabled(true);
		mutateCreateCargo.mutate(formData);
	};

	const filteredData = filterStatus
		? data.filter((cargo) => cargo.status === filterStatus)
		: data;

	return (
		<>
			{data ? (
				<>
					<div className="d-flex align-items-center mb-3">
						<h5 className="text-nowrap">фильтр по статусу</h5>
						<Form.Select
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}
							className="ms-2 shadow-none border">
							<option value="">Все</option>
							{statuses.map((status) => (
								<option
									key={status}
									value={status}>
									{status}
								</option>
							))}
						</Form.Select>
					</div>
					<div className="container">
						<div className="row">
							<div
								style={{
									maxHeight: "400px",
									overflowY: "auto",
								}}>
								<Table
									className="mb-0 h-100 position-relative"
									responsive
									hover>
									<thead
										style={{
											position: "sticky",
											top: "0",
										}}>
										<tr>
											<th className="text-nowrap">
												Номер
											</th>
											<th className="text-nowrap">
												Название
											</th>
											<th className="text-nowrap">
												Статус
											</th>
											<th className="text-nowrap">
												Пункт отправления
											</th>
											<th className="text-nowrap">
												Пункт назначения
											</th>
											<th className="text-nowrap">
												Дата отправления
											</th>
										</tr>
									</thead>
									<tbody>
										{filteredData.map((cargo) => (
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
														style={{
															minWidth: "192px",
														}}
														className={`text-white arrow-white shadow-none border ${statusColor(
															cargo.status
														)}`}>
														{statuses.map(
															(status) => (
																<option
																	key={status}
																	value={
																		status
																	}>
																	{status}
																</option>
															)
														)}
													</Form.Select>
												</td>
												<td>{cargo.origin}</td>
												<td>{cargo.destination}</td>
												<td>{cargo.departure_date}</td>
											</tr>
										))}
									</tbody>
								</Table>
							</div>
							<Button
								className="mt-4"
								onClick={changeModalVisibility}>
								Добавить +
							</Button>
							<Modal
								show={showModal}
								onHide={changeModalVisibility}>
								<Modal.Header closeButton>
									<Modal.Title>
										Добавить новый груз
									</Modal.Title>
								</Modal.Header>
								<Modal.Body>
									<Form>
										<Form.Group className="mb-3">
											<Form.Label>Название</Form.Label>
											<Form.Control
												type="text"
												name="name"
												placeholder="Введите название груза"
												value={formData.name}
												onChange={handleChange}
												className="shadow-none border"
												required
											/>
										</Form.Group>
										<Form.Group className="mb-3">
											<Form.Label>
												Пункт отправления
											</Form.Label>
											<Form.Select
												name="origin"
												value={formData.origin}
												onChange={handleChange}
												className="shadow-none border"
												required>
												{cities.map((city) => (
													<option
														key={city}
														value={city}>
														{city}
													</option>
												))}
											</Form.Select>
										</Form.Group>
										<Form.Group className="mb-3">
											<Form.Label>
												Пункт назначения
											</Form.Label>
											<Form.Select
												name="destination"
												value={formData.destination}
												onChange={handleChange}
												className="shadow-none border"
												required>
												{cities.map((city) => (
													<option
														key={city}
														value={city}>
														{city}
													</option>
												))}
											</Form.Select>
										</Form.Group>
										<Form.Group className="mb-3">
											<Form.Label>
												Дата отправления
											</Form.Label>
											<Form.Control
												type="date"
												name="departure_date"
												value={formData.departure_date}
												onChange={handleChange}
												className="shadow-none border"
												required
											/>
										</Form.Group>
										<Form.Group className="mb-3">
											<Form.Label>Статус</Form.Label>
											<Form.Select
												name="status"
												value={formData.status}
												onChange={handleChange}
												className="shadow-none border"
												required>
												{statuses.map((status) => (
													<option
														key={status}
														value={status}>
														{status}
													</option>
												))}
											</Form.Select>
										</Form.Group>
									</Form>
								</Modal.Body>
								<Modal.Footer>
									<Button
										variant="secondary"
										onClick={changeModalVisibility}>
										Отмена
									</Button>
									<Button
										type="submit"
										variant="primary"
										onClick={handleSubmit}
										disabled={btnDisabled}>
										Добавить
									</Button>
								</Modal.Footer>
							</Modal>
						</div>
					</div>
				</>
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
