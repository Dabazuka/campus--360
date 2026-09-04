import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "./src/prisma/db.ts";

const studentPassword = await bcrypt.hash("1111", 10);
const teacherPassword = await bcrypt.hash("2222", 10);

let studentUser = await db.orm.public.User.first({
    loginId: "1111"
});

if (!studentUser) {
    studentUser = await db.orm.public.User.create({
        loginId: "1111",
        passwordHash: studentPassword,
        role: "STUDENT"
    });
}

let student = await db.orm.public.Student.first({
    userId: studentUser.id
});

if (!student) {
    student = await db.orm.public.Student.create({
        userId: studentUser.id,
        studentId: "STU-101",
        name: "John",
        section: "Sec-A",
        classMarks: 72,
        yearlyCgpa: 8.4,
        assignmentSubmitted: true
    });
}

const mechanical = await db.orm.public.Subject.upsert({
    where: { name: "Mechanical" },
    update: {},
    create: { name: "Mechanical" }
});

const electronics = await db.orm.public.Subject.upsert({
    where: { name: "Electronics" },
    update: {},
    create: { name: "Electronics" }
});

const chemistry = await db.orm.public.Subject.upsert({
    where: { name: "Chemistry" },
    update: {},
    create: { name: "Chemistry" }
});

const mathematics = await db.orm.public.Subject.upsert({
    where: { name: "Mathematics" },
    update: {},
    create: { name: "Mathematics" }
});

let teacherUser = await db.orm.public.User.first({
    loginId: "2222"
});

if (!teacherUser) {
    teacherUser = await db.orm.public.User.create({
        loginId: "2222",
        passwordHash: teacherPassword,
        role: "TEACHER"
    });
}

await db.orm.public.StudentSubject.upsert({
    where: {
        studentId_subjectId: {
            studentId: student.id,
            subjectId: mechanical.id
        }
    },
    update: {
        classesAttended: 26,
        classesTotal: 30,
        grade: "A+"
    },
    create: {
        studentId: student.id,
        subjectId: mechanical.id,
        classesAttended: 26,
        classesTotal: 30,
        grade: "A+"
    }
});

await db.orm.public.StudentSubject.upsert({
    where: {
        studentId_subjectId: {
            studentId: student.id,
            subjectId: electronics.id
        }
    },
    update: {
        classesAttended: 22,
        classesTotal: 28,
        grade: "A"
    },
    create: {
        studentId: student.id,
        subjectId: electronics.id,
        classesAttended: 22,
        classesTotal: 28,
        grade: "A"
    }
});

await db.orm.public.StudentSubject.upsert({
    where: {
        studentId_subjectId: {
            studentId: student.id,
            subjectId: chemistry.id
        }
    },
    update: {
        classesAttended: 25,
        classesTotal: 30,
        grade: "B+"
    },
    create: {
        studentId: student.id,
        subjectId: chemistry.id,
        classesAttended: 25,
        classesTotal: 30,
        grade: "B+"
    }
});

await db.orm.public.StudentSubject.upsert({
    where: {
        studentId_subjectId: {
            studentId: student.id,
            subjectId: mathematics.id
        }
    },
    update: {
        classesAttended: 28,
        classesTotal: 32,
        grade: "A"
    },
    create: {
        studentId: student.id,
        subjectId: mathematics.id,
        classesAttended: 28,
        classesTotal: 32,
        grade: "A"
    }
});

console.log("Seed completed successfully.");