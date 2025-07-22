<?php
header( 'Content-Type: application/json' );
require 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ( $method ) {
	case 'GET':
		$stmt = $pdo->query( 'SELECT * FROM tasks ORDER BY sort_order ASC' );
		echo json_encode( $stmt->fetchAll() );
		break;

	case 'POST':
		$data = json_decode( file_get_contents( 'php://input' ), true );
		$stmt = $pdo->prepare( 'INSERT INTO tasks (title, sort_order) VALUES (?, ?)' );
		$stmt->execute( [ $data['title'], $data['sort_order'] ] );
		echo json_encode( [ 'id' => $pdo->lastInsertId() ] );
		break;

	case 'PATCH':
		$data = json_decode( file_get_contents( 'php://input' ), true );
		if ( isset( $data['order'] ) ) {
			// Update sort order
			foreach ( $data['order'] as $sort => $id ) {
				$stmt = $pdo->prepare( 'UPDATE tasks SET sort_order = ? WHERE id = ?' );
				$stmt->execute( [ $sort, $id ] );
			}
			echo json_encode( [ 'success' => true ] );
		} else {
			// Update task
			$stmt = $pdo->prepare( 'UPDATE tasks SET title=?, status=? WHERE id=?' );
			$stmt->execute( [ $data['title'], $data['status'], $data['id'] ] );
			echo json_encode( [ 'success' => true ] );
		}
		break;

	case 'DELETE':
		parse_str( file_get_contents( 'php://input' ), $data );
		$stmt = $pdo->prepare( 'DELETE FROM tasks WHERE id=?' );
		$stmt->execute( [ $data['id'] ] );
		echo json_encode( [ 'success' => true ] );
		break;
}
