export class DatabaseError extends Error {
	constructor(message: string) {
		super(message)
		this.name = "DatabaseError"
	}
}

export class DatabaseUserNotAuthorizedError extends DatabaseError {
	constructor(message: string) {
		super(message)
		this.name = "DatabaseUserNotAuthorizedError"
	}
}
