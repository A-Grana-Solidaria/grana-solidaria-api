/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-tabs */
/* eslint-disable indent */
const database = require('./database');

// alterar o campo picture para not null quando já estiver integrado com o front
const schema = {
	1: `CREATE TABLE IF NOT EXISTS users
    (
     id                     serial NOT NULL,
	 usersince				timestamp DEFAULT NOW(),
	 term					boolean DEFAULT true,
     name                   text NOT NULL,
	 birthdate              date NOT NULL,
	 picture				text NULL,
     cep                    text NOT NULL,
     cpf                    text NOT NULL,
     email                  text NOT NULL,
     phoneNumber            text NOT NULL,
     password               text NOT NULL,
     type                   integer NOT NULL,
     hasInvestingExperience boolean NULL,
     investingType          integer NULL,
	 investingBudget        integer NULL,
	 deleted_at				timestamp NULL,
     PRIMARY KEY ( "id" )
    );`,
	2: `CREATE TABLE IF NOT EXISTS dreams
    (
     id                serial  NOT NULL,
     status            integer NOT NULL,
     quotasQuantity    integer NULL,
     description       text NOT NULL,
     estimatedCashGoal integer NOT NULL,
	 cashGoal          integer NULL,
	 risk 			   integer NULL,
	 expiration_date	timestamp NULL,
     userId            integer NOT NULL,
     PRIMARY KEY ( "id" ),
     FOREIGN KEY ( userId ) REFERENCES "users" ( "id" )
    );

    CREATE INDEX IF NOT EXISTS dreams_userId_idx ON dreams
    (
     userId
    );`,
	3: ` CREATE TABLE IF NOT EXISTS user_support_dream (
		id     				serial NOT NULL,
		support_date		timestamp default now(),
		userId  			integer NOT NULL,
		dreamId 			integer NOT NULL,
		PRIMARY KEY ( "id" ),
		FOREIGN KEY ( userId ) REFERENCES users ( "id" ),
		FOREIGN KEY ( dreamId ) REFERENCES dreams ( "id" )
		);
    
    CREATE INDEX IF NOT EXISTS user_support_dream_userId_idx ON user_support_dream
    (
     userId
    );
    
    CREATE INDEX IF NOT EXISTS user_support_dream_dreamId_idx ON user_support_dream
    (
     dreamId
    );`,
	4: `CREATE TABLE IF NOT EXISTS emailConfirmation (
		id 					serial NOT NULL,
		verified			boolean DEFAULT false,
		emailToken 			text NOT NULL,
		id_User 			integer NOT NULL
		);`,
	5: `CREATE TABLE IF NOT EXISTS dream_questions (
		id					serial  NOT NULL,
		dream_id			integer NOT NULL,
		question1_status	integer NOT NULL,
		question2_status	integer NOT NULL,
		question3_status	integer NOT NULL,
		question4_status	integer NOT NULL,
		question5_status	integer NOT NULL,
		question6_status	integer NOT NULL,
		total_score			integer NOT NULL,
		PRIMARY KEY ( "id" ),
			 FOREIGN KEY ( dream_id ) REFERENCES "dreams" ( "id" )
		)`,
	6: `
		ALTER TABLE dreams drop CONSTRAINT IF EXISTS dreams_userid_fkey;

		ALTER TABLE dreams
		ADD CONSTRAINT dreams_userid_fkey
    FOREIGN KEY ( userId ) REFERENCES "users" ( "id" )
    ON DELETE CASCADE ON UPDATE NO ACTION;
	`,
	7: `
		ALTER TABLE user_support_dream drop CONSTRAINT IF EXISTS user_support_dream_userid_fkey;
		
		ALTER TABLE user_support_dream
		ADD CONSTRAINT user_support_dream_userid_fkey
    FOREIGN KEY ( userid ) REFERENCES users ( "id" )
    ON DELETE CASCADE ON UPDATE NO ACTION;
	`,
	8: `
		ALTER TABLE emailConfirmation drop CONSTRAINT IF EXISTS emailConfirmation_id_user_fkey;

		ALTER TABLE emailConfirmation
		ADD CONSTRAINT emailConfirmation_id_user_fkey
    FOREIGN KEY ( id_user ) REFERENCES users ( "id" )
    ON DELETE CASCADE ON UPDATE NO ACTION;
	`,

	9: `
		ALTER TABLE dream_questions drop CONSTRAINT IF EXISTS dream_questions_dream_id_fkey;

		ALTER TABLE dream_questions
		ADD CONSTRAINT dream_questions_dream_id_fkey
    FOREIGN KEY ( dream_id ) REFERENCES "dreams" ( "id" )
    ON DELETE CASCADE ON UPDATE NO ACTION;
	`,
};

const drop = async (tableName) => {
	if (tableName) {
		await database.query(`DROP TABLE ${tableName}`);
	}
};

const up = async (number = null) => {
	if (!number) {
		for (const value in schema) {
			await database.query({ text: schema[value] });
		}
	} else {
		await database.query({ text: schema[number] });
	}
};

switch (process.argv[2]) {
	case 'up':
		up()
			.catch((error) => {
			})
			.finally(() => database.end());
		break;

	case 'drop':
		if (!process.argv[3]) break;
		drop(process.argv[3])
			.catch((error) => {
			})
			.finally(() => database.end());
		break;

	default:
		database.end();
		break;
}
