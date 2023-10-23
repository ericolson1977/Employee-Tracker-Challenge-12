INSERT INTO department (id, name)
VALUES (001, "Pumpkin Carving"),
       (002, "Apple Picking"),
       (003, "Pie Making"),
       (004, "Costume");

INSERT INTO role (id, title, salary, department_id)
VALUES (001, "Sr. Jack o' Lanterner", 85000, 001),
       (002, "Seed Scooper", 55000, 001),
       (003, "Executive Apple Selector", 125000, 002),
       (004, "Bushell Mule", 75000, 002),
       (005, "Head Cheffy Type", 90000, 003),
       (006, "Crust Roller", 60000, 003),
       (007, "Sultan of Sewing", 95000, 004),
       (008, "Ghost Costumer", 40000, 004);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (001, "Jack", "O'Leary", 001, NULL),
       (002, "Stanley", "Scoops", 002, 001),
       (003, "Sally", "SnowSweet", 003, NULL),
       (004, "Tim", "Carries", 004, 003),
       (005, "Margot", "Pierre", 005, NULL),
       (006, "Johnny", "Coldbutter", 006, 005),
       (007, "Slim", "Bobbins", 007, NULL),
       (008, "Eric", "Olson", 008, 007);