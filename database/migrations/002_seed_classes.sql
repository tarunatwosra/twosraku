-- =============================================
-- Migration: Seed classes data
-- =============================================
-- Date: 2026-07-05
-- Academic Year UUID: 9af9d9da-3ab2-44cc-a5d6-10e67f22a1b4

-- =============================================
-- Seed data classes (selalu include academic_year_id)
-- =============================================

-- TKJ
INSERT INTO classes (name, major_id, academic_year_id, room_number, status)
SELECT 'TKJ 1', '4fca5d33-be32-4727-8d75-e47db5beb374', '9af9d9da-3ab2-44cc-a5d6-10e67f22a1b4', 'R-101', 'active'
WHERE NOT EXISTS (SELECT 1 FROM classes WHERE name = 'TKJ 1' AND major_id = '4fca5d33-be32-4727-8d75-e47db5beb374');

INSERT INTO classes (name, major_id, academic_year_id, room_number, status)
SELECT 'TKJ 2', '4fca5d33-be32-4727-8d75-e47db5beb374', '9af9d9da-3ab2-44cc-a5d6-10e67f22a1b4', 'R-102', 'active'
WHERE NOT EXISTS (SELECT 1 FROM classes WHERE name = 'TKJ 2' AND major_id = '4fca5d33-be32-4727-8d75-e47db5beb374');

INSERT INTO classes (name, major_id, academic_year_id, room_number, status)
SELECT 'TKJ 3', '4fca5d33-be32-4727-8d75-e47db5beb374', '9af9d9da-3ab2-44cc-a5d6-10e67f22a1b4', 'R-103', 'active'
WHERE NOT EXISTS (SELECT 1 FROM classes WHERE name = 'TKJ 3' AND major_id = '4fca5d33-be32-4727-8d75-e47db5beb374');

-- RPL
INSERT INTO classes (name, major_id, academic_year_id, room_number, status)
SELECT 'RPL 1', '93405df9-934b-42f3-a9fd-61f7c67defb0', '9af9d9da-3ab2-44cc-a5d6-10e67f22a1b4', 'R-201', 'active'
WHERE NOT EXISTS (SELECT 1 FROM classes WHERE name = 'RPL 1' AND major_id = '93405df9-934b-42f3-a9fd-61f7c67defb0');

INSERT INTO classes (name, major_id, academic_year_id, room_number, status)
SELECT 'RPL 2', '93405df9-934b-42f3-a9fd-61f7c67defb0', '9af9d9da-3ab2-44cc-a5d6-10e67f22a1b4', 'R-202', 'active'
WHERE NOT EXISTS (SELECT 1 FROM classes WHERE name = 'RPL 2' AND major_id = '93405df9-934b-42f3-a9fd-61f7c67defb0');

INSERT INTO classes (name, major_id, academic_year_id, room_number, status)
SELECT 'RPL 3', '93405df9-934b-42f3-a9fd-61f7c67defb0', '9af9d9da-3ab2-44cc-a5d6-10e67f22a1b4', 'R-203', 'active'
WHERE NOT EXISTS (SELECT 1 FROM classes WHERE name = 'RPL 3' AND major_id = '93405df9-934b-42f3-a9fd-61f7c67defb0');

-- AK
INSERT INTO classes (name, major_id, academic_year_id, room_number, status)
SELECT 'AK 1', '8c97dbd3-5d30-43ce-bd68-a07be044a5d6', '9af9d9da-3ab2-44cc-a5d6-10e67f22a1b4', 'R-301', 'active'
WHERE NOT EXISTS (SELECT 1 FROM classes WHERE name = 'AK 1' AND major_id = '8c97dbd3-5d30-43ce-bd68-a07be044a5d6');

INSERT INTO classes (name, major_id, academic_year_id, room_number, status)
SELECT 'AK 2', '8c97dbd3-5d30-43ce-bd68-a07be044a5d6', '9af9d9da-3ab2-44cc-a5d6-10e67f22a1b4', 'R-302', 'active'
WHERE NOT EXISTS (SELECT 1 FROM classes WHERE name = 'AK 2' AND major_id = '8c97dbd3-5d30-43ce-bd68-a07be044a5d6');

-- OTKP
INSERT INTO classes (name, major_id, academic_year_id, room_number, status)
SELECT 'OTKP 1', '0a916e0a-c3f3-412c-b3f8-4f329461a150', '9af9d9da-3ab2-44cc-a5d6-10e67f22a1b4', 'R-401', 'active'
WHERE NOT EXISTS (SELECT 1 FROM classes WHERE name = 'OTKP 1' AND major_id = '0a916e0a-c3f3-412c-b3f8-4f329461a150');

INSERT INTO classes (name, major_id, academic_year_id, room_number, status)
SELECT 'OTKP 2', '0a916e0a-c3f3-412c-b3f8-4f329461a150', '9af9d9da-3ab2-44cc-a5d6-10e67f22a1b4', 'R-402', 'active'
WHERE NOT EXISTS (SELECT 1 FROM classes WHERE name = 'OTKP 2' AND major_id = '0a916e0a-c3f3-412c-b3f8-4f329461a150');

-- MM
INSERT INTO classes (name, major_id, academic_year_id, room_number, status)
SELECT 'MM 1', '59ff2fec-ce19-45f6-8c1a-50e5d991244c', '9af9d9da-3ab2-44cc-a5d6-10e67f22a1b4', 'R-501', 'active'
WHERE NOT EXISTS (SELECT 1 FROM classes WHERE name = 'MM 1' AND major_id = '59ff2fec-ce19-45f6-8c1a-50e5d991244c');

INSERT INTO classes (name, major_id, academic_year_id, room_number, status)
SELECT 'MM 2', '59ff2fec-ce19-45f6-8c1a-50e5d991244c', '9af9d9da-3ab2-44cc-a5d6-10e67f22a1b4', 'R-502', 'active'
WHERE NOT EXISTS (SELECT 1 FROM classes WHERE name = 'MM 2' AND major_id = '59ff2fec-ce19-45f6-8c1a-50e5d991244c');

-- =============================================
-- VERIFICATION
-- =============================================

SELECT
  c.name AS kelas,
  m.code AS jurusan,
  c.room_number AS ruang
FROM classes c
JOIN majors m ON m.id = c.major_id
ORDER BY m.code, c.name;

SELECT m.code, COUNT(c.id) AS jumlah
FROM majors m
LEFT JOIN classes c ON c.major_id = m.id
GROUP BY m.id, m.code
ORDER BY m.code;
