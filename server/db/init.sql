/* Initialization SQL file */

CREATE TABLE IF NOT EXISTS duty (
    id character varying(255) PRIMARY KEY,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
-- uncomment below to create some values
/*
INSERT INTO duty (id, name) VALUES
('66d3d0a5-961e-48d4-a050-c02bea82b101', 'First duty'),
('6c760006-dfb1-4ea4-9e31-acd8347cc001', 'Second duty'),
('5eb985bc-69d1-479f-aa8c-e4c073aeaacf', 'Third duty');
*/
