package mapper

import "database/sql"

func UserInit(db *sql.DB) {
	db.Exec(
		`CREATE TABLE IF NOT EXISTS Users(
			ID       SERIAL,
			Username VARCHAR(31) UNIQUE,
			Password VARCHAR(63),
			PRIMARY  KEY (ID)
		);`,
	)
}

func UserCreate(db *sql.DB, username string, password string) {
	db.Exec(
		`INSERT INTO Users(Username, Password)
		 VALUES($1, $2);
		`,
		username,
		password,
	)
}

func UserQueryPasswordByUsername(db *sql.DB, username string) *sql.Rows {
	rows, _ := db.Query(
		`SELECT Password
		 FROM Users
		 WHERE Username = $1;
		`,
		username,
	)
	return rows
}
