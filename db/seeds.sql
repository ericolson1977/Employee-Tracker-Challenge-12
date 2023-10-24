INSERT INTO department (id, name)
VALUES (1, "Pumpkin Carving"),
       (2, "Apple Picking"),
       (3, "Pie Making"),
       (4, "Costume");

INSERT INTO role (id, title, salary, department_id)
VALUES (101, "Sr. Jack o' Lanterner", 85000, 1),
       (102, "Seed Scooper", 55000, 1),
       (103, "Executive Apple Selector", 125000, 2),
       (104, "Bushell Mule", 75000, 2),
       (105, "Head Cheffy Type", 90000, 3),
       (106, "Crust Roller", 60000, 3),
       (107, "Sultan of Sewing", 95000, 4),
       (108, "Ghost Costumer", 40000, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1001, "Jack", "O'Leary", 101, NULL),
       (1002, "Stanley", "Scoops", 102, 1001),
       (1003, "Sally", "SnowSweet", 103, NULL),
       (1004, "Tim", "Carries", 104, 1003),
       (1005, "Margot", "Pierre", 105, NULL),
       (1006, "Johnny", "Coldbutter", 106, 1005),
       (1007, "Slim", "Bobbins", 107, NULL),
       (1008, "Eric", "Olson", 108, 1007);