INSERT INTO department (id, name)
VALUES (1, "Pumpkin Carving"),
       (2, "Apple Picking"),
       (3, "Pie Making"),
       (4, "Costume");

INSERT INTO role (id, title, salary, department_id)
VALUES (01, "Sr. Jack o' Lanterner", 85000, 1),
       (02, "Seed Scooper", 55000, 1),
       (03, "Executive Apple Selector", 125000, 2),
       (04, "Bushell Mule", 75000, 2),
       (05, "Head Cheffy Type", 90000, 3),
       (06, "Crust Roller", 60000, 3),
       (07, "Sultan of Sewing", 95000, 4),
       (08, "Ghost Costumer", 40000, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1001, "Jack", "O'Leary", 01, NULL),
       (1002, "Stanley", "Scoops", 02, 1001),
       (1003, "Sally", "SnowSweet", 03, NULL),
       (1004, "Tim", "Carries", 04, 1003),
       (1005, "Margot", "Pierre", 05, NULL),
       (1006, "Johnny", "Coldbutter", 06, 1005),
       (1007, "Slim", "Bobbins", 07, NULL),
       (1008, "Eric", "Olson", 08, 1007);