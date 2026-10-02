import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Class from '../models/Class.js';
import Subject from '../models/Subject.js';
import Attendance from '../models/Attendance.js';
import Assignment from '../models/Assignment.js';
import Exam from '../models/Exam.js';
import ExamResult from '../models/ExamResult.js';
import Fee from '../models/Fee.js';
import Notification from '../models/Notification.js';
import Timetable from '../models/Timetable.js';

dotenv.config();

const seedData = async () => {
  if (process.env.SEED_DEMO_DATA !== 'true') {
    console.log('Demo data seeding is disabled. Set SEED_DEMO_DATA=true to run the destructive demo seed.');
    process.exit(0);
  }
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/school_management');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      Teacher.deleteMany({}),
      Class.deleteMany({}),
      Subject.deleteMany({}),
      Attendance.deleteMany({}),
      Assignment.deleteMany({}),
      Exam.deleteMany({}),
      ExamResult.deleteMany({}),
      Fee.deleteMany({}),
      Notification.deleteMany({}),
      Timetable.deleteMany({}),
    ]);
    console.log('Cleared existing collections.');

    const defaultPassword = 'Password@123';

    // 1. Create Admin
    const adminUser = await User.create({
      name: 'Dr. Sarah Jenkins',
      email: 'admin@school.com',
      password: defaultPassword,
      role: 'admin',
      phone: '+1 (555) 019-2834',
      address: '100 School Lane, Metropolis',
    });

    // 2. Create Teachers
    const teacherUsers = await User.create([
      {
        name: 'Prof. Marcus Vance',
        email: 'marcus.vance@school.com',
        password: defaultPassword,
        role: 'teacher',
        phone: '+1 (555) 102-3948',
        address: '22 Elm Street, Metropolis',
      },
      {
        name: 'Ms. Elena Rodriguez',
        email: 'elena.rodriguez@school.com',
        password: defaultPassword,
        role: 'teacher',
        phone: '+1 (555) 203-4958',
        address: '45 Oak Ave, Metropolis',
      },
      {
        name: 'Mr. David Chen',
        email: 'david.chen@school.com',
        password: defaultPassword,
        role: 'teacher',
        phone: '+1 (555) 304-5867',
        address: '78 Pine Road, Metropolis',
      },
    ]);

    const teacherDocs = await Teacher.create([
      {
        user: teacherUsers[0]._id,
        employeeId: 'EMP-001',
        qualification: 'Ph.D. in Pure Mathematics',
        experience: 12,
        salary: 75000,
        joinDate: new Date('2018-08-15'),
      },
      {
        user: teacherUsers[1]._id,
        employeeId: 'EMP-002',
        qualification: 'M.Sc. in Physics',
        experience: 8,
        salary: 68000,
        joinDate: new Date('2020-09-01'),
      },
      {
        user: teacherUsers[2]._id,
        employeeId: 'EMP-003',
        qualification: 'M.A. in English Literature',
        experience: 6,
        salary: 62000,
        joinDate: new Date('2021-08-20'),
      },
    ]);

    // 3. Create Classes
    const classDocs = await Class.create([
      { name: 'Grade 10', section: 'A', classTeacher: teacherDocs[0]._id, academicYear: '2026-2027' },
      { name: 'Grade 10', section: 'B', classTeacher: teacherDocs[1]._id, academicYear: '2026-2027' },
      { name: 'Grade 11', section: 'A', classTeacher: teacherDocs[2]._id, academicYear: '2026-2027' },
    ]);

    // 4. Create Subjects
    const subjectDocs = await Subject.create([
      { name: 'Advanced Mathematics', code: 'MATH-101', class: classDocs[0]._id, teacher: teacherDocs[0]._id, description: 'Calculus, Trigonometry & Geometry' },
      { name: 'Physics Mechanics', code: 'PHYS-101', class: classDocs[0]._id, teacher: teacherDocs[1]._id, description: 'Classical Mechanics and Thermodynamics' },
      { name: 'English Literature', code: 'ENG-101', class: classDocs[0]._id, teacher: teacherDocs[2]._id, description: 'World Literature and Composition' },
      { name: 'Chemistry', code: 'CHEM-101', class: classDocs[1]._id, teacher: teacherDocs[1]._id, description: 'Organic & Inorganic Chemistry' },
      { name: 'Computer Science', code: 'CS-201', class: classDocs[2]._id, teacher: teacherDocs[0]._id, description: 'Data Structures and Algorithms' },
    ]);

    // Update teacher classes and subjects
    await Teacher.findByIdAndUpdate(teacherDocs[0]._id, { classes: [classDocs[0]._id, classDocs[2]._id], subjects: [subjectDocs[0]._id, subjectDocs[4]._id] });
    await Teacher.findByIdAndUpdate(teacherDocs[1]._id, { classes: [classDocs[0]._id, classDocs[1]._id], subjects: [subjectDocs[1]._id, subjectDocs[3]._id] });
    await Teacher.findByIdAndUpdate(teacherDocs[2]._id, { classes: [classDocs[0]._id], subjects: [subjectDocs[2]._id] });

    // 5. Create Parents
    const parentUsers = await User.create([
      {
        name: 'Robert sterling',
        email: 'parent@school.com',
        password: defaultPassword,
        role: 'parent',
        phone: '+1 (555) 888-0001',
        address: '12 Maple Court, Metropolis',
      },
      {
        name: 'Maria Garcia',
        email: 'maria.garcia@school.com',
        password: defaultPassword,
        role: 'parent',
        phone: '+1 (555) 888-0002',
        address: '34 Cedar Boulevard, Metropolis',
      },
    ]);

    // 6. Create Students
    const studentUserSpecs = [
      { name: 'Alex Sterling', email: 'student@school.com', parent: parentUsers[0]._id, parentName: 'Robert Sterling', parentPhone: '+1 (555) 888-0001', parentEmail: 'parent@school.com', classIdx: 0, rollNo: '10A-01', adm: 'ADM-2026-001' },
      { name: 'Emma Garcia', email: 'emma.garcia@school.com', parent: parentUsers[1]._id, parentName: 'Maria Garcia', parentPhone: '+1 (555) 888-0002', parentEmail: 'maria.garcia@school.com', classIdx: 0, rollNo: '10A-02', adm: 'ADM-2026-002' },
      { name: 'Liam Johnson', email: 'liam.johnson@school.com', parentName: 'Mark Johnson', parentPhone: '+1 (555) 444-0003', classIdx: 0, rollNo: '10A-03', adm: 'ADM-2026-003' },
      { name: 'Sophia Williams', email: 'sophia.williams@school.com', parentName: 'Claire Williams', parentPhone: '+1 (555) 444-0004', classIdx: 0, rollNo: '10A-04', adm: 'ADM-2026-004' },
      { name: 'Noah Brown', email: 'noah.brown@school.com', parentName: 'David Brown', parentPhone: '+1 (555) 444-0005', classIdx: 0, rollNo: '10A-05', adm: 'ADM-2026-005' },
      { name: 'Olivia Martinez', email: 'olivia.martinez@school.com', parentName: 'Carlos Martinez', parentPhone: '+1 (555) 444-0006', classIdx: 1, rollNo: '10B-01', adm: 'ADM-2026-006' },
      { name: 'Lucas Taylor', email: 'lucas.taylor@school.com', parentName: 'James Taylor', parentPhone: '+1 (555) 444-0007', classIdx: 1, rollNo: '10B-02', adm: 'ADM-2026-007' },
      { name: 'Ava Anderson', email: 'ava.anderson@school.com', parentName: 'Patricia Anderson', parentPhone: '+1 (555) 444-0008', classIdx: 1, rollNo: '10B-03', adm: 'ADM-2026-008' },
      { name: 'Ethan Thomas', email: 'ethan.thomas@school.com', parentName: 'George Thomas', parentPhone: '+1 (555) 444-0009', classIdx: 2, rollNo: '11A-01', adm: 'ADM-2026-009' },
      { name: 'Isabella Jackson', email: 'isabella.jackson@school.com', parentName: 'Helen Jackson', parentPhone: '+1 (555) 444-0010', classIdx: 2, rollNo: '11A-02', adm: 'ADM-2026-010' },
    ];

    const studentDocs = [];
    for (const spec of studentUserSpecs) {
      const u = await User.create({
        name: spec.name,
        email: spec.email,
        password: defaultPassword,
        role: 'student',
        phone: '+1 (555) 777-0000',
        address: 'Metropolis City',
      });

      const s = await Student.create({
        user: u._id,
        admissionNo: spec.adm,
        class: classDocs[spec.classIdx]._id,
        rollNo: spec.rollNo,
        dateOfBirth: new Date('2010-05-14'),
        gender: 'other',
        bloodGroup: 'O+',
        parentName: spec.parentName,
        parentPhone: spec.parentPhone,
        parentEmail: spec.parentEmail || '',
        parent: spec.parent || null,
        address: 'Metropolis City',
        joinDate: new Date('2024-09-01'),
      });

      studentDocs.push(s);
    }

    // Update Class student arrays
    await Class.findByIdAndUpdate(classDocs[0]._id, { students: studentDocs.slice(0, 5).map((s) => s._id) });
    await Class.findByIdAndUpdate(classDocs[1]._id, { students: studentDocs.slice(5, 8).map((s) => s._id) });
    await Class.findByIdAndUpdate(classDocs[2]._id, { students: studentDocs.slice(8, 10).map((s) => s._id) });

    // 7. Create Timetables
    const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'];
    const times = [
      { start: '08:30', end: '09:30' },
      { start: '09:45', end: '10:45' },
      { start: '11:00', end: '12:00' },
      { start: '13:00', end: '14:00' },
    ];

    for (let d = 0; d < days.length; d++) {
      await Timetable.create({
        class: classDocs[0]._id,
        subject: subjectDocs[d % subjectDocs.length]._id,
        teacher: teacherDocs[d % teacherDocs.length]._id,
        dayOfWeek: days[d],
        startTime: times[0].start,
        endTime: times[0].end,
        room: `Room ${101 + d}`,
      });
      await Timetable.create({
        class: classDocs[0]._id,
        subject: subjectDocs[(d + 1) % subjectDocs.length]._id,
        teacher: teacherDocs[(d + 1) % teacherDocs.length]._id,
        dayOfWeek: days[d],
        startTime: times[1].start,
        endTime: times[1].end,
        room: `Room ${101 + d}`,
      });
    }

    // 8. Create Attendance for last 7 days
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const attDate = new Date(today);
      attDate.setDate(today.getDate() - i);
      attDate.setHours(8, 0, 0, 0);

      for (const st of studentDocs.slice(0, 5)) {
        const statuses = ['present', 'present', 'present', 'present', 'present', 'late', 'absent'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        await Attendance.create({
          student: st._id,
          class: classDocs[0]._id,
          date: attDate,
          status: randomStatus,
          markedBy: adminUser._id,
        });
      }
    }

    // 9. Create Assignments
    const assignment1 = await Assignment.create({
      title: 'Calculus Problem Set 3: Integrals',
      description: 'Complete exercises 1 through 25 on page 142. Show all work and steps clearly.',
      subject: subjectDocs[0]._id,
      class: classDocs[0]._id,
      teacher: teacherDocs[0]._id,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      maxMarks: 50,
      submissions: [
        {
          student: studentDocs[0]._id,
          submissionText: 'https://school-cloud.storage/submissions/alex_math_ps3.pdf',
          submittedAt: new Date(),
          status: 'submitted',
        },
      ],
    });

    const assignment2 = await Assignment.create({
      title: 'Newtonian Dynamics Lab Report',
      description: 'Write up a 3-page laboratory report on kinetic friction and acceleration experiments.',
      subject: subjectDocs[1]._id,
      class: classDocs[0]._id,
      teacher: teacherDocs[1]._id,
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      maxMarks: 100,
      submissions: [],
    });

    // 10. Create Exams & Results
    const exam1 = await Exam.create({
      name: 'Midterm Examination 2026',
      subject: subjectDocs[0]._id,
      class: classDocs[0]._id,
      examType: 'midterm',
      date: new Date('2026-03-15'),
      startTime: '09:00',
      endTime: '11:00',
      maxMarks: 100,
      passingMarks: 40,
      instructions: 'Calculators are allowed. No mobile devices.',
    });

    const exam2 = await Exam.create({
      name: 'Physics Midterm Assessment',
      subject: subjectDocs[1]._id,
      class: classDocs[0]._id,
      examType: 'midterm',
      date: new Date('2026-03-18'),
      startTime: '09:00',
      endTime: '11:00',
      maxMarks: 100,
      passingMarks: 40,
      instructions: 'Formula sheet will be provided.',
    });

    const marksTable = [92, 88, 74, 85, 63];
    for (let i = 0; i < 5; i++) {
      const marks = marksTable[i];
      let grade = 'A';
      if (marks < 60) grade = 'D';
      else if (marks < 70) grade = 'C';
      else if (marks < 80) grade = 'B';
      else if (marks < 90) grade = 'A';
      else grade = 'A+';

      await ExamResult.create({
        exam: exam1._id,
        student: studentDocs[i]._id,
        marksObtained: marks,
        grade,
        remarks: 'Great effort and analytical clarity.',
        gradedBy: teacherUsers[0]._id,
      });

      await ExamResult.create({
        exam: exam2._id,
        student: studentDocs[i]._id,
        marksObtained: Math.max(45, marks - 5),
        grade,
        remarks: 'Good understanding of core principles.',
        gradedBy: teacherUsers[1]._id,
      });
    }

    // 11. Create Fees
    for (let i = 0; i < 5; i++) {
      await Fee.create({
        student: studentDocs[i]._id,
        feeType: 'tuition',
        amount: 2500,
        dueDate: new Date('2026-04-01'),
        paidDate: i < 3 ? new Date('2026-03-28') : null,
        status: i < 3 ? 'paid' : 'pending',
        academicYear: '2026-2027',
        term: 'Term 1',
        paymentMethod: i < 3 ? 'card' : null,
        transactionId: i < 3 ? `TXN-${99000 + i}` : null,
      });
      await Fee.create({
        student: studentDocs[i]._id,
        feeType: 'transport',
        amount: 350,
        dueDate: new Date('2026-04-01'),
        paidDate: i === 0 ? new Date('2026-03-29') : null,
        status: i === 0 ? 'paid' : 'pending',
        academicYear: '2026-2027',
        term: 'Term 1',
      });
    }

    // 12. Create Notifications
    await Notification.create({
      title: 'Spring Semester Midterm Schedule Released',
      message: 'The comprehensive timetable for Spring 2026 midterm examinations is now published in the portal.',
      type: 'info',
      sender: adminUser._id,
      isGlobal: true,
      recipients: [
        { user: adminUser._id, isRead: true },
        { user: teacherUsers[0]._id, isRead: false },
        { user: studentDocs[0].user, isRead: false },
        { user: parentUsers[0]._id, isRead: false },
      ],
    });

    await Notification.create({
      title: 'Upcoming Science Fair & Exhibition',
      message: 'All students are invited to register for the Annual STEM Science Fair by next Friday.',
      type: 'success',
      sender: teacherUsers[1]._id,
      isGlobal: true,
      recipients: [
        { user: studentDocs[0].user, isRead: false },
        { user: parentUsers[0]._id, isRead: false },
      ],
    });

    console.log('✅ Sample data seeded successfully!');
    console.log('\n--- DEMO ACCOUNTS CREATED ---');
    console.log('👑 Admin:   admin@school.com         / Password@123');
    console.log('👨‍🏫 Teacher: marcus.vance@school.com   / Password@123');
    console.log('🎓 Student: student@school.com        / Password@123');
    console.log('👨‍👩‍👧 Parent:  parent@school.com         / Password@123');
    console.log('----------------------------\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
