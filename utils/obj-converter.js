const userResponse = (user) => {
	return {
		user: user.name,
		email: user.email,
		userId: user.userId,
		userType: user.userType,
		userStatus: user.userStatus,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt
	}
}

const usersResponse = (users) => {
	const data = []

	users.forEach((user) => {
		data.push(userResponse(user))
	})

	return data
}

const ticketResponse = (ticket) => {
	return {
		title: ticket.title,
		description: ticket.description,
		priority: ticket.priority,
		status: ticket.status,
		reporter: ticket.reporter,
		assignee: ticket.assignee,
		id: ticket._id,
		createdAt: ticket.createdAt,
		updatedAt: ticket.updatedAt
	}
}

module.exports = { userResponse, usersResponse, ticketResponse }
