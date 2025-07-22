<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<title>Tasks Manager</title>
	<link href="assets/css/bootstrap.min.css" rel="stylesheet">
	<link href="assets/css/style.css" rel="stylesheet">
</head>

<body>
	<section class="vh-100">
		<div class="container py-5">
			<div class="row d-flex justify-content-center align-items-center">
                <h1 class="mb-5 text-center">Task Manager</h1>
				<div class="col col-xl-10">
					<div class="card">
						<div class="card-body p-5">
							<h6 class="mb-3">Tasks List</h6>
							<form id="taskForm" class="d-flex justify-content-center align-items-center mb-4">
								<div data-mdb-input-init class="form-outline flex-fill">
									<input type="text" id="title" class="form-control form-control-lg" placeholder="What do you need to do today?"/>
								</div>
								<button type="submit" class="btn btn-primary btn-lg ms-2">Add</button>
							</form>
							<ul id="taskList" class="list-group mb-0">
								<!-- Tasks will be loaded here -->
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
	<script src="assets/js/Sortable.min.js"></script>
	<script src="assets/js/bootstrap.bundle.min.js"></script>
	<script src="assets/js/main.js"></script>
</body>

</html>