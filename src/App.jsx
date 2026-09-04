import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Calendar,
  Bell,
  MessageSquare,
  BarChart2,
  CheckCircle,
  PlusCircle,
  Clock,
  Briefcase,
  Code,
  AlertCircle,
  UserCheck,
  Send,
  Trash2,
  BookOpen,
  LogOut,
  Lock,
  User,
  Wrench,
  CheckCircle2,
  TimerReset,
  MapPin,
  ShieldAlert,
  Award,
  Filter,
  Check,
  X,
  TrendingUp,
  Flame,
  Users,
  AlertTriangle,
  UserPlus
} from 'lucide-react';

// Lighthouse-Style Circular Progress Ring Component
function CircularGauge({ score = 0, max = 100, label = '', size = 110, strokeWidth = 9, zoneColor }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    setAnimatedScore(0);
    const timeout = setTimeout(() => {
      setAnimatedScore(score);
    }, 80);
    return () => clearTimeout(timeout);
  }, [score]);

  const currentPercentage = Math.min(Math.max((animatedScore / max) * 100, 0), 100);
  const targetPercentage = Math.min(Math.max((score / max) * 100, 0), 100);

  const strokeDashoffset = currentPercentage >= 99.9 
    ? 0 
    : circumference - (currentPercentage / 100) * circumference;

  const getColor = () => {
    if (zoneColor === 'yellow') return '#eab308';
    if (targetPercentage >= 70) return '#10b981';
    if (targetPercentage >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const ringColor = getColor();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="none"
          />

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={ringColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap={currentPercentage >= 99.5 ? 'butt' : 'round'}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{
              transition: 'stroke-dashoffset 1000ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />

          <text
            x="50%"
            y={max === 10 ? "46%" : "50%"}
            textAnchor="middle"
            dominantBaseline="central"
            fill={ringColor}
            className="font-mono font-black"
            style={{ fontSize: '20px' }}
          >
            {score}
          </text>

          {max === 10 && (
            <text
              x="50%"
              y="68%"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#94a3b8"
              className="font-sans font-bold"
              style={{ fontSize: '10px' }}
            >
              /10
            </text>
          )}
        </svg>
      </div>
      {label && <p className="text-xs font-bold text-slate-700 mt-2 text-center">{label}</p>}
    </div>
  );
}

export default function StudentPortal() {
  // --- AUTHENTICATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [loginError, setLoginError] = useState('');
  const [role, setRole] = useState('');
  const isTeacher = role === 'teacher';
  const [currentStudentId, setCurrentStudentId] = useState('');
  const [studentProfile, setStudentProfile] = useState(null);
  const [password, setPassword] = useState('');

  // --- APP NAVIGATION STATE ---
  const [activeTab, setActiveTab] = useState('dropout-tracker');

  // --- ATTENDANCE & ACADEMIC DATA ---
  const [subjects, setSubjects] = useState([]);
  const [teacherStudents, setTeacherStudents] = useState([]);

  // --- CALENDAR / EXAM SCHEDULE STATE ---
  const [events, setEvents] = useState([
    { id: 1, title: 'Chemistry Mid-Term', date: '2026-09-15', time: '09:30 AM', type: 'Theory Exam' },
    { id: 2, title: 'Mechanical Practical File Submission', date: '2026-09-18', time: '11:00 AM', type: 'Practical' },
    { id: 3, title: 'Electronics Mock Viva', date: '2026-09-22', time: '03:00 PM', type: 'Viva' },
    { id: 4, title: 'Maths Exam', date: '2026-09-30', time: '02:00 PM', type: 'Theory Exam' },
    { id: 5, title: 'Electronics Assignment submission', date: '2026-09-15', time: '10:00 AM', type: 'Assignment' },
    { id: 6, title: 'Chemistry practical file submission', date: '2026-09-16', time: '9:00 PM', type: 'Practical' },
  ]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    type: 'THEORY_EXAM'
  });

  // --- TEACHER NOTICES STATE ---
  const [notices, setNotices] = useState([
    {
      id: 1,
      author: 'Prof. Sharma (HOD)',
      category: 'Hackathon',
      title: 'Smart India AI & Tech Hackathon 2026',
      description: 'Registrations are open for all batches. Prize pool of $5,000. Submit project abstracts by next Friday.',
      date: '2 hours ago',
      urgent: true
    },
    {
      id: 2,
      author: 'Career & Placement Cell',
      category: 'Internship',
      title: 'Summer Corporate Internship Opportunity at FinCorp',
      description: 'Stipend: $600/month. Roles in Data Analysis and Audit. Minimum 75% attendance required to apply.',
      date: '1 day ago',
      urgent: false
    },
    {
      id: 3,
      author: 'Exam Cell',
      category: 'General',
      title: 'Revised Practical Dates for Term 2',
      description: 'Please verify the updated room allocations on the main floor notice board before Monday.',
      date: '2 days ago',
      urgent: false
    }
  ]);
  const [newNotice, setNewNotice] = useState({ title: '', category: 'Hackathon', description: '', urgent: false });

  // --- DOUBTS & DISCUSSION STATE ---
  const [doubts, setDoubts] = useState([]);
  const [newDoubt, setNewDoubt] = useState({ subject: 'Mechanical', question: '' });
  const [replyInput, setReplyInput] = useState({});

  // --- CAMPUS COMPLAINTS / GRIEVANCES STATE (WITH TIMERS) ---
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [complaints, setComplaints] = useState([]);

  const [newComplaint, setNewComplaint] = useState({
    student: '',
    section: '',
    category: 'AC / Ventilation',
    title: '',
    description: ''
  });

  const formatDuration = (startTime, endTime) => {
    const start = new Date(startTime).getTime();
    const end = endTime ? new Date(endTime).getTime() : currentTime;

    const totalMs = Math.max(0, end - start);
    const totalSeconds = Math.floor(totalMs / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
  // --- SECTION A TO O DROPOUT TRACKER STATE ---
  const sectionList = ['Sec-A', 'Sec-B', 'Sec-C', 'Sec-D', 'Sec-E', 'Sec-F', 'Sec-G', 'Sec-H', 'Sec-I', 'Sec-J', 'Sec-K', 'Sec-L', 'Sec-M', 'Sec-N', 'Sec-O'];
  const [selectedSectionFilter, setSelectedSectionFilter] = useState('Sec-A');

  const [studentRecords, setStudentRecords] = useState([]);

  const [newStudent, setNewStudent] = useState({
    name: '',
    studentId: '',
    loginId: '',
    password: '',
    classMarks: '',
    assignmentSubmitted: false,
    yearlyCgpa: ''
  });

  const calculateRiskZone = (marks, assignment, cgpa) => {
    if (cgpa >= 9.0) {
      return {
        zone: 'Yellow',
        badge: 'Yellow Zone (Top Tier >9 CGPA)',
        bg: 'bg-amber-50 border-amber-300 text-amber-900',
        ringColor: '#eab308',
        textColor: 'text-amber-700',
        barColor: 'bg-amber-400',
        description: 'Exceptional academic standing. Maintained >9.0 CGPA.'
      };
    }
    if (cgpa >= 7.0 && marks >= 60 && assignment) {
      return {
        zone: 'Green',
        badge: 'Green Zone (Safe / On Track)',
        bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
        ringColor: '#10b981',
        textColor: 'text-emerald-700',
        barColor: 'bg-emerald-500',
        description: 'Safe zone. Consistent submissions and good grade trajectory.'
      };
    }
    if (cgpa < 5.0 || (marks < 40 && !assignment)) {
      return {
        zone: 'Red',
        badge: 'Red Zone (High Dropout Risk)',
        bg: 'bg-rose-50 border-rose-300 text-rose-900',
        ringColor: '#ef4444',
        textColor: 'text-rose-700',
        barColor: 'bg-rose-500',
        description: 'Severe dropout danger. Urgent intervention required.'
      };
    }
    return {
      zone: 'Amber',
      badge: 'Amber Zone (Needs Attention)',
      bg: 'bg-orange-50 border-orange-300 text-orange-900',
      ringColor: '#f97316',
      textColor: 'text-orange-700',
      barColor: 'bg-orange-400',
      description: 'Borderline risk. Marks or assignment backlog requires immediate attention.'
    };
  };

  const totalAttended = subjects.reduce((acc, s) => acc + s.attended, 0);
  const totalClasses = subjects.reduce((acc, s) => acc + s.total, 0);

  const overallAttendance = totalClasses > 0
    ? Math.round((totalAttended / totalClasses) * 100)
    : 0;  
  const pendingComplaintsCount = complaints.filter(c => c.status !== 'Resolved').length;

  const loggedInStudent = studentProfile || {
  id: '',
  name: 'Student',
  section: 'Sec-A',
  classMarks: 0,
  assignmentSubmitted: false,
  yearlyCgpa: 0
  };

  const loggedInZone = calculateRiskZone(
    loggedInStudent.classMarks,
    loggedInStudent.assignmentSubmitted,
    loggedInStudent.yearlyCgpa
  );

  const currentSectionStudents = studentRecords.filter(s => s.section === selectedSectionFilter);
  const sectionZoneCounts = currentSectionStudents.reduce((acc, stu) => {
    const z = calculateRiskZone(stu.classMarks, stu.assignmentSubmitted, stu.yearlyCgpa).zone;
    acc[z] = (acc[z] || 0) + 1;
    return acc;
  }, {});

  // --- LOGIN & LOGOUT HANDLERS ---
  const handleLogin = async (e) => {
  e.preventDefault();
  setLoginError('');

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        loginId: loginId.trim(),
        password: password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setLoginError(data.message || 'Login failed');
      return;
    }

    localStorage.setItem('token', data.token);

    setRole(data.user.role.toLowerCase());

    if (data.user.role === 'STUDENT') {
      fetchEvents();
      fetchNotices();
      fetchDoubts();
      fetchComplaints();
    }

    setIsAuthenticated(true);

    setRole(data.user.role.toLowerCase());

    if (data.user.role === 'STUDENT') {
      await fetchStudentSubjects();
      await fetchStudentProfile();
    }

    if (data.user.role === 'TEACHER') {
      await fetchTeacherStudents();
      fetchEvents();
      fetchNotices();
      fetchDoubts();
      fetchComplaints();
    }

    setActiveTab('dropout-tracker');

  } catch (error) {
    console.error(error);
    setLoginError('Unable to connect to server');
  }
};

const fetchStudentProfile = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/student/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message || 'Failed to fetch student profile');
      return;
    }
    
    console.log('Student profile from database:', data.student);
    setStudentProfile(data.student);

  } catch (error) {
    console.error('Failed to fetch student profile:', error);
  }
};

const fetchStudentSubjects = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/student/subjects', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message || 'Failed to fetch subjects');
      return;
    }

    console.log('Subjects from database:', data.subjects);
    setSubjects(data.subjects);

  } catch (error) {
    console.error('Failed to fetch subjects:', error);
  }
};

const fetchEvents = async () => {
  const token = localStorage.getItem('token');

  if (!token) return;

  try {
    const response = await fetch(
      'http://localhost:5000/api/events',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message || 'Failed to fetch events');
      return;
    }

    console.log('Events from database:', data.events);
    setEvents(data.events);
  } catch (error) {
    console.error('Failed to fetch events:', error);
  }
};

const fetchDoubts = async () => {
  const token = localStorage.getItem('token');

  if (!token) return;

  try {
    const response = await fetch(
      'http://localhost:5000/api/doubts',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message || 'Failed to fetch doubts');
      return;
    }

    console.log('Doubts from database:', data.doubts);
    setDoubts(data.doubts);

  } catch (error) {
    console.error('Failed to fetch doubts:', error);
  }
};

const fetchComplaints = async () => {
  const token = localStorage.getItem('token');

  if (!token) return;

  try {
    const response = await fetch(
      'http://localhost:5000/api/complaints',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message || 'Failed to fetch complaints');
      return;
    }

    console.log('Complaints from database:', data.complaints);
    setComplaints(data.complaints);

    } catch (error) {
      console.error('Failed to fetch complaints:', error);
    }
  };

const fetchNotices = async () => {
  const token = localStorage.getItem('token');

  if (!token) return;

  try {
    const response = await fetch(
      'http://localhost:5000/api/notices',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message || 'Failed to fetch notices');
      return;
    }

    console.log('Notices from database:', data.notices);
    setNotices(data.notices);
  } catch (error) {
    console.error('Failed to fetch notices:', error);
  }
};

const fetchTeacherStudents = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/teacher/students', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message || 'Failed to fetch students');
      return;
    }

    console.log('Students from database:', data.students);

    const formattedStudents = data.students.map((student) => ({
      id: student.id,
      name: student.name,
      section: student.section || 'Sec-A',
      classMarks: student.classMarks ?? 0,
      assignmentSubmitted: student.assignmentSubmitted ?? false,
      yearlyCgpa: student.yearlyCgpa ?? 0
    }));

setTeacherStudents(formattedStudents);
setStudentRecords(formattedStudents);

  } catch (error) {
    console.error('Failed to fetch students:', error);
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setLoginId('');
    setRole('');
    setLoginError('');
  };

  // --- ACADEMIC HANDLERS ---
  const handleAddEvent = async (e) => {
  e.preventDefault();

  if (!newEvent.title || !newEvent.date) return;

  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No authentication token found');
    return;
  }

  try {
    const formattedTime = newEvent.time
      ? new Date(`1970-01-01T${newEvent.time}`).toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit'
        })
      : '';

    const response = await fetch(
      'http://localhost:5000/api/events',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newEvent,
          time: formattedTime
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message || 'Failed to create event');
      return;
    }

    console.log('Event created in database:', data.event);

    setEvents([...events, data.event]);

    setNewEvent({
      title: '',
      date: '',
      time: '',
      type: 'THEORY_EXAM'
    });
  } catch (error) {
    console.error('Failed to create event:', error);
  }
};

  const handleDeleteEvent = async (id) => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No authentication token found');
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/events/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message || 'Failed to delete event');
      return;
    }

    console.log('Event deleted from database');

    setEvents(events.filter(e => e.id !== id));
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const handleAddNotice = async (e) => {
  console.log("HANDLE ADD NOTICE RAN");

  e.preventDefault();

  if (!newNotice.title || !newNotice.description) return;

  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No authentication token found');
    return;
  }

  try {
    const response = await fetch(
      'http://localhost:5000/api/notices',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newNotice)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message || 'Failed to create notice');
      return;
    }

    console.log('Notice created in database:', data.notice);

    setNotices([data.notice, ...notices]);

    setNewNotice({
      title: '',
      category: 'Hackathon',
      description: '',
      urgent: false
    });
  } catch (error) {
    console.error('Failed to create notice:', error);
  }
};

  const handleAddDoubt = async (e) => {
  e.preventDefault();

  if (!newDoubt.question.trim()) return;

  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No authentication token found');
    return;
  }

  try {
    console.log("Subjects:", subjects);
    console.log("Selected subject:", newDoubt.subject);

    const selectedSubject = subjects.find(
      (subject) =>
        subject.name === newDoubt.subject ||
        subject.subjectName === newDoubt.subject
    );

    if (!selectedSubject) {
      console.error('Selected subject not found');
      return;
    }

    const response = await fetch(
      'http://localhost:5000/api/doubts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          subjectId: selectedSubject.id,
          question: newDoubt.question.trim()
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message || 'Failed to create doubt');
      return;
    }

    console.log('Doubt created in database:', data.doubt);

    await fetchDoubts();

    setNewDoubt({
      subject: 'Mechanical',
      question: ''
    });

    } catch (error) {
      console.error('Failed to create doubt:', error);
    }
  };

  const handleAddReply = async (doubtId) => {
  const text = replyInput[doubtId];

  if (!text || !text.trim()) return;

  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No authentication token found');
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/doubts/${doubtId}/replies`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          message: text.trim()
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message || 'Failed to add reply');
      return;
    }

    setDoubts(
      doubts.map((d) =>
        d.id === doubtId
          ? {
              ...d,
              replies: [...(d.replies || []), data.reply]
            }
          : d
      )
    );

    setReplyInput({
      ...replyInput,
      [doubtId]: ''
    });

    } catch (error) {
      console.error('Failed to add reply:', error);
    }
  };

  const handleDeleteDoubt = async (doubtId) => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No authentication token found');
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/doubts/${doubtId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message || 'Failed to delete doubt');
      return;
    }

    setDoubts(doubts.filter((doubt) => doubt.id !== doubtId));

    } catch (error) {
      console.error('Failed to delete doubt:', error);
    }
  };

  // --- COMPLAINT HANDLERS ---
  const handleAddComplaint = async (e) => {
  e.preventDefault();

  if (!newComplaint.title || !newComplaint.section || !newComplaint.description) {
    return;
  }

  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No authentication token found');
    return;
  }

  try {
    const response = await fetch(
      'http://localhost:5000/api/complaints',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          section: newComplaint.section,
          category: newComplaint.category,
          title: newComplaint.title.trim(),
          description: newComplaint.description.trim()
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message || 'Failed to create complaint');
      return;
    }

    console.log('Complaint created in database:', data.complaint);

    await fetchComplaints();

    setNewComplaint({
      student: '',
      section: '',
      category: 'AC / Ventilation',
      title: '',
      description: ''
    });

    } catch (error) {
      console.error('Failed to create complaint:', error);
    }
  };

  const handleUpdateComplaintStatus = async (complaintId, updatedStatus) => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No authentication token found');
    return;
  }

  const statusMap = {
    'Pending': 'PENDING',
    'In Progress': 'IN_PROGRESS',
    'Resolved': 'RESOLVED'
  };

  try {
    const response = await fetch(
      `http://localhost:5000/api/complaints/${complaintId}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: statusMap[updatedStatus]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message || 'Failed to update complaint status');
      return;
    }

    console.log('Complaint status updated:', data.complaint);

    await fetchComplaints();

    } catch (error) {
      console.error('Failed to update complaint status:', error);
    }
  };

  const handleDeleteComplaint = async (id) => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No authentication token found');
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/complaints/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message || 'Failed to delete complaint');
      return;
    }

    console.log('Complaint deleted:', data.message);

    await fetchComplaints();

    } catch (error) {
      console.error('Failed to delete complaint:', error);
    }
  };

  const handleUpdateStudentMetric = async (studentId, field, value) => {
  const updatedValue =
    field === 'assignmentSubmitted' ? value : Number(value);

  setStudentRecords(studentRecords.map(stu => {
    if (stu.id === studentId) {
      return {
        ...stu,
        [field]: updatedValue
      };
    }

    return stu;
  }));

  const student = studentRecords.find(stu => stu.id === studentId);

  if (!student) {
    return;
  }

  const updatedStudent = {
    ...student,
    [field]: updatedValue
  };

  const token = localStorage.getItem('token');

  try {
    const response = await fetch(
      `http://localhost:5000/api/teacher/students/${studentId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          classMarks: updatedStudent.classMarks,
          yearlyCgpa: updatedStudent.yearlyCgpa,
          assignmentSubmitted: updatedStudent.assignmentSubmitted
        })
      }
    );

    const data = await response.json();

      if (!response.ok) {
        console.error(data.message || 'Failed to update student');
        return;
      }

      console.log('Student updated in database:', data.student);

    }   catch (error) {
      console.error('Failed to update student:', error);
    }
  };  

  const handleCreateStudent = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No authentication token found');
    return;
  }

  try {
    const response = await fetch(
      'http://localhost:5000/api/teacher/students',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          loginId: newStudent.loginId,
          password: newStudent.password,
          studentId: newStudent.studentId,
          name: newStudent.name.trim(),
          section: selectedSectionFilter,
          classMarks: Number(newStudent.classMarks),
          yearlyCgpa: Number(newStudent.yearlyCgpa),
          assignmentSubmitted: Boolean(newStudent.assignmentSubmitted)
        })
      }
    );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message || 'Failed to create student');
        return;
      }

      console.log('Student created in database:', data.student);

      await fetchTeacherStudents();

      setNewStudent({
        name: '',
        studentId: '',
        loginId: '',
        password: '',
        classMarks: '',
        assignmentSubmitted: false,
        yearlyCgpa: ''
      });

    } catch (error) {
      console.error('Failed to create student:', error);
    }
  };

  // VIEW 1: LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-md border border-slate-200 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-600/30">
              <GraduationCap size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Campus-360</h2>
            <p className="text-sm text-slate-500">Sign in to access your portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                Enter Login ID
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter your ID"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                  autoFocus
                />
                
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition shadow-sm"
            >
              Sign In
            </button>
          </form>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-600">
            <p className="font-semibold text-slate-800">Demo Access Keys:</p>
            <div className="flex justify-between">
              <span>Student Login ID:</span>
              <span className="font-mono font-bold text-indigo-600">1111</span>
            </div>
            <div className="flex justify-between">
              <span>Teacher Login ID:</span>
              <span className="font-mono font-bold text-indigo-600">2222</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VIEW 2: AUTHENTICATED PORTAL
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/20">
              <GraduationCap size={22} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900 leading-tight">Campus-360</h1>
              <p className="text-xs text-slate-500 font-medium">Academic, Dropout Engine & Grievance Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <User size={16} className="text-indigo-600" />
              <span className="text-xs font-semibold capitalize text-slate-700">
                Logged in: <span className="text-indigo-600 font-bold">{role === 'teacher' ? 'Faculty Admin' : studentProfile?.name}</span>
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition border border-rose-200"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 space-y-2">
          <button
            onClick={() => setActiveTab('dropout-tracker')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
              activeTab === 'dropout-tracker' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert size={18} />
            <span>Dropout Risk & Zones</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <BarChart2 size={18} />
            <span>Academic Performance</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
              activeTab === 'calendar' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Calendar size={18} />
            <span>Exams & Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
              activeTab === 'notices' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bell size={18} />
            <span>Teacher Circulars</span>
          </button>

          <button
            onClick={() => setActiveTab('doubts')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
              activeTab === 'doubts' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <MessageSquare size={18} />
            <span>Doubt Discussion</span>
          </button>

          <button
            onClick={() => setActiveTab('complaints')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition ${
              activeTab === 'complaints' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Wrench size={18} />
              <span>Campus Complaints</span>
            </div>
            {pendingComplaintsCount > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'complaints' ? 'bg-white text-indigo-600' : 'bg-rose-100 text-rose-600'
              }`}>
                {pendingComplaintsCount}
              </span>
            )}
          </button>

          <div className="bg-white p-4 rounded-xl border border-slate-200 mt-6 shadow-sm">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Zone Guidelines</h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block"></span>
                <span className="font-semibold text-slate-700">Yellow:</span> CGPA ≥ 9.0
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span className="font-semibold text-slate-700">Green:</span> CGPA ≥ 7.0 & Marks ≥ 60
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-400 inline-block"></span>
                <span className="font-semibold text-slate-700">Amber:</span> Borderline warning
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block"></span>
                <span className="font-semibold text-slate-700">Red:</span> CGPA &lt; 5.0 (High Risk)
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 space-y-6">

          {/* TAB: DROPOUT & ZONE PREDICTOR */}
          {activeTab === 'dropout-tracker' && (
            <div className="space-y-6">
              {role === 'teacher' ? (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold mb-2">
                          <ShieldAlert size={14} />
                          Live Evaluation Engine
                        </div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                          Faculty Gradebook & Student Monitoring
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Monitor active student performance and assess dropout risk in real-time.
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 bg-slate-50 p-2 px-3 rounded-2xl border border-slate-200 shadow-sm">
                        <Filter size={18} className="text-indigo-600" />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Section:</span>
                        <select
                          value={selectedSectionFilter}
                          onChange={(e) => setSelectedSectionFilter(e.target.value)}
                          className="text-sm font-extrabold bg-white border border-slate-300 rounded-xl px-3 py-1 text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                          {sectionList.map((sec) => (
                            <option key={sec} value={sec}>{sec}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-3 border-t border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Section Switch:</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {sectionList.map((sec) => (
                          <button
                            key={sec}
                            onClick={() => setSelectedSectionFilter(sec)}
                            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all duration-200 ${
                              selectedSectionFilter === sec
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {sec}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Users size={22} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase">Enrolled</p>
                        <p className="text-xl font-black text-slate-900">{currentSectionStudents.length}</p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm flex items-center gap-3 bg-emerald-50/30">
                      <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                        <CheckCircle2 size={22} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-emerald-700 uppercase">Safe / Green</p>
                        <p className="text-xl font-black text-emerald-800">{(sectionZoneCounts['Green'] || 0) + (sectionZoneCounts['Yellow'] || 0)}</p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-orange-200 shadow-sm flex items-center gap-3 bg-orange-50/30">
                      <div className="p-3 bg-orange-100 text-orange-700 rounded-xl">
                        <AlertTriangle size={22} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-orange-700 uppercase">Warning / Amber</p>
                        <p className="text-xl font-black text-orange-800">{sectionZoneCounts['Amber'] || 0}</p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-sm flex items-center gap-3 bg-rose-50/30">
                      <div className="p-3 bg-rose-100 text-rose-700 rounded-xl">
                        <Flame size={22} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-rose-700 uppercase">Critical Risk</p>
                        <p className="text-xl font-black text-rose-800">{sectionZoneCounts['Red'] || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <UserPlus size={18} className="text-indigo-600" />
                      Add Student to <span className="text-indigo-600">{selectedSectionFilter}</span>
                    </h3>
                    <form onSubmit={handleCreateStudent} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <input
                        type="text"
                        placeholder="Student Full Name"
                        required
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                        className="p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                      />
                        <input
                          type="text"
                          placeholder="Student ID"
                          required
                          value={newStudent.studentId}
                          onChange={(e) => setNewStudent({ ...newStudent, studentId: e.target.value })}
                          className="p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                        />

                        <input
                          type="text"
                          placeholder="Login ID"
                          required
                          value={newStudent.loginId}
                          onChange={(e) => setNewStudent({ ...newStudent, loginId: e.target.value })}
                          className="p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                        />

                      <input
                        type="password"
                        placeholder="Password"
                        required
                        value={newStudent.password}
                        onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                        className="p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                      />

                      <input
                        type="number"
                        placeholder="Marks (/100)"
                        min="0"
                        max="100"
                        required
                        value={newStudent.classMarks}
                        onChange={(e) => setNewStudent({ ...newStudent, classMarks: e.target.value })}
                        className="p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                      />
                      <input
                        type="number"
                        step="0.1"
                        placeholder="CGPA (/10)"
                        min="0"
                        max="10"
                        required
                        value={newStudent.yearlyCgpa}
                        onChange={(e) => setNewStudent({ ...newStudent, yearlyCgpa: e.target.value })}
                        className="p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                      />
                      <select
                        value={newStudent.assignmentSubmitted ? 'yes' : 'no'}
                        onChange={(e) => setNewStudent({ ...newStudent, assignmentSubmitted: e.target.value === 'yes' })}
                        className="p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                      >
                        <option value="yes">Assignment: Submitted</option>
                        <option value="no">Assignment: Pending</option>
                      </select>
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-sm"
                      >
                        Add Student
                      </button>
                    </form>
                  </div>

                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base">
                          Class Roster: <span className="text-indigo-600">{selectedSectionFilter}</span>
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">Directly edit values to see real-time risk zone updates</p>
                      </div>
                      <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                        {currentSectionStudents.length} Registered
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-3.5">Student Details</th>
                            <th className="px-4 py-3.5">Internal Marks</th>
                            <th className="px-4 py-3.5">Assignment</th>
                            <th className="px-4 py-3.5">Cumulative CGPA</th>
                            <th className="px-6 py-3.5">Calculated Risk Zone</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentSectionStudents.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-6 py-12 text-center">
                                <div className="max-w-sm mx-auto space-y-2">
                                  <div className="h-12 w-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                                    <Users size={22} />
                                  </div>
                                  <p className="font-bold text-slate-700 text-sm">No students in {selectedSectionFilter}</p>
                                  <p className="text-xs text-slate-400">Use the form above to add a student or switch to another section.</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            currentSectionStudents.map((stu) => {
                              const zoneInfo = calculateRiskZone(stu.classMarks, stu.assignmentSubmitted, stu.yearlyCgpa);
                              return (
                                <tr key={stu.id} className="hover:bg-slate-50/80 transition">
                                  <td className="px-6 py-4">
                                    <p className="font-bold text-slate-900 text-sm">{stu.name}</p>
                                    <p className="text-slate-400 font-mono text-[11px] mt-0.5">{stu.id} • {stu.section}</p>
                                  </td>

                                  <td className="px-4 py-4">
                                    <div className="inline-flex items-center gap-1.5 bg-slate-50 p-1 px-2 rounded-xl border border-slate-200">
                                      <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={stu.classMarks}
                                        onChange={(e) => handleUpdateStudentMetric(stu.id, 'classMarks', e.target.value)}
                                        className="w-12 bg-white text-center font-bold text-xs p-1 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                      />
                                      <span className="text-slate-400 font-semibold">/100</span>
                                    </div>
                                  </td>

                                  <td className="px-4 py-4">
                                    <button
                                      onClick={() => handleUpdateStudentMetric(stu.id, 'assignmentSubmitted', !stu.assignmentSubmitted)}
                                      className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition shadow-sm ${
                                        stu.assignmentSubmitted
                                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200'
                                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-200'
                                      }`}
                                    >
                                      {stu.assignmentSubmitted ? <Check size={13} /> : <X size={13} />}
                                      {stu.assignmentSubmitted ? 'Submitted' : 'Pending'}
                                    </button>
                                  </td>

                                  <td className="px-4 py-4">
                                    <div className="inline-flex items-center gap-1.5 bg-slate-50 p-1 px-2 rounded-xl border border-slate-200">
                                      <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="10"
                                        value={stu.yearlyCgpa}
                                        onChange={(e) => handleUpdateStudentMetric(stu.id, 'yearlyCgpa', e.target.value)}
                                        className="w-12 bg-white text-center font-bold text-xs p-1 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                      />
                                      <span className="text-slate-400 font-semibold">CGPA</span>
                                    </div>
                                  </td>

                                  <td className="px-6 py-4">
                                    <span className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border inline-flex items-center gap-1.5 shadow-sm ${zoneInfo.bg}`}>
                                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: zoneInfo.ringColor }}></span>
                                      {zoneInfo.badge}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm ${loggedInZone.bg} flex flex-col md:flex-row items-center justify-between gap-6`}>
                    <div className="space-y-2 text-center md:text-left">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-xs font-bold">
                        <Flame size={14} className="text-amber-500" />
                        Live Status Report • Section {loggedInStudent.section}
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{loggedInZone.badge}</h2>
                      <p className="text-sm font-medium max-w-xl leading-relaxed">{loggedInZone.description}</p>
                    </div>

                    <div className="flex flex-col items-center bg-white/90 p-4 rounded-2xl shadow-sm border border-slate-200 min-w-[140px]">
                      <div
                        className="h-16 w-16 rounded-full flex items-center justify-center font-black text-white text-xl shadow-md"
                        style={{ backgroundColor: loggedInZone.ringColor }}
                      >
                        {loggedInZone.zone[0]}
                      </div>
                      <span className="text-xs font-bold uppercase mt-2 text-slate-800">{loggedInZone.zone} Zone</span>
                    </div>
                  </div>

                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          <TrendingUp size={20} className="text-indigo-600" />
                          Academic Scorecard
                        </h3>
                        <p className="text-xs text-slate-500">Live graphical evaluation comparing your targets</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold">
                        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Safe Goal: 60%+</span>
                        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span> Yellow Goal: 9.0+ CGPA</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
                      <CircularGauge
                        score={studentProfile?.classMarks ?? 0}
                        max={100}
                        label="Class Marks"
                      />
                      <CircularGauge
                        score={studentProfile?.yearlyCgpa ?? 0}
                        max={10}
                        label="Yearly CGPA"
                        zoneColor={studentProfile?.yearlyCgpa >= 9.0 ? 'yellow' : undefined}
                      />
                      <CircularGauge
                        score={studentProfile?.assignmentSubmitted ? 100 : 0}
                        max={100}
                        label="Assignment Status"
                      />
                      <CircularGauge
                        score={overallAttendance}
                        max={100}
                        label="Class Attendance"
                      />
                    </div>
                  </div>

                  <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                      <Award size={26} className="text-indigo-600" />
                      Personalized Target Roadmap
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 sm:p-7 rounded-2xl border border-emerald-200 bg-emerald-50/70 space-y-3.5 shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="h-4 w-4 rounded-full bg-emerald-500 shrink-0"></span>
                          <h4 className="font-extrabold text-emerald-950 text-base sm:text-lg">
                            Targets for Green Zone (Safe Zone)
                          </h4>
                        </div>
                        <ul className="text-sm sm:text-[15px] space-y-3 text-emerald-900 font-medium leading-relaxed pl-1">
                          <li>• <strong>Marks Target:</strong> Minimum 60/100 {loggedInStudent.classMarks >= 60 ? ' (Achieved 🎉)' : `(You need +${60 - loggedInStudent.classMarks} marks)`}</li>
                          <li>• <strong>Assignments:</strong> Must be marked "Done" {loggedInStudent.assignmentSubmitted ? ' (Achieved 🎉)' : '(Submit pending files)'}</li>
                          <li>• <strong>CGPA Minimum:</strong> 7.0+ {loggedInStudent.yearlyCgpa >= 7.0 ? ' (Achieved 🎉)' : `(You need +${(7.0 - loggedInStudent.yearlyCgpa).toFixed(1)} CGPA)`}</li>
                        </ul>
                      </div>

                      <div className="p-6 sm:p-7 rounded-2xl border border-amber-200 bg-amber-50/70 space-y-3.5 shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="h-4 w-4 rounded-full bg-amber-500 shrink-0"></span>
                          <h4 className="font-extrabold text-amber-950 text-base sm:text-lg">
                            Targets for Yellow Zone (Top 9+ CGPA Tier)
                          </h4>
                        </div>
                        <ul className="text-sm sm:text-[15px] space-y-3 text-amber-950 font-medium leading-relaxed pl-1">
                          <li>• <strong>CGPA Required:</strong> &gt; 9.0 Yearly CGPA</li>
                          <li>• <strong>Your Current Gap:</strong> {loggedInStudent.yearlyCgpa >= 9.0 ? 'You are in the Yellow Zone! 🌟' : `+${(9.0 - loggedInStudent.yearlyCgpa).toFixed(1)} CGPA required in upcoming exams.`}</li>
                          <li>• <strong>Suggested Action:</strong> Aim for higher internal scores and maintain consistent assignment submissions.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 1: ACADEMIC & ATTENDANCE PERFORMANCE */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <UserCheck size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Overall Attendance</p>
                    <p className="text-2xl font-bold text-slate-900">{overallAttendance}%</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Active Subjects</p>
                    <p className="text-2xl font-bold text-slate-900">{subjects.length}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Upcoming Exams</p>
                    <p className="text-2xl font-bold text-slate-900">{events.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Subject Attendance & Performance Record</h3>
                <div className="space-y-4">
                  {subjects.map((sub) => {
                    const percentage = Math.round((sub.attended / sub.total) * 100);
                    return (
                      <div key={sub.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="font-semibold text-slate-800">{sub.name}</span>
                            <span className="ml-3 text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">Grade: {sub.grade}</span>
                          </div>
                          <div className="text-sm font-bold text-slate-700">
                            {sub.attended}/{sub.total} classes ({percentage}%)
                          </div>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald-500 transition-all duration-700 ease-out"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXAM & PRACTICAL CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <PlusCircle size={18} className="text-indigo-600" />
                  Add or Customize Exam / Practical Schedule
                </h3>
                <form onSubmit={handleAddEvent} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    placeholder="Subject / Test Name"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                  <input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) =>
                      setNewEvent({ ...newEvent, time: e.target.value })
                    }
                  />
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                    className="p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  >
                    <option value="THEORY_EXAM">Theory Exam</option>
                    <option value="PRACTICAL">Practical</option>
                    <option value="VIVA">Viva</option>
                    <option value="ASSIGNMENT">Assignment</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white font-medium text-sm py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-sm"
                  >
                    Save Schedule
                  </button>
                </form>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Upcoming Academic Milestones</h3>
                <div className="space-y-3">
                  {events.map((evt) => (
                    <div key={evt.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/40">
                      <div className="flex items-center gap-4">
                        <div className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-center font-bold text-xs">
                          {evt.date}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{evt.title}</p>

                          <p className="text-sm text-slate-500 mt-1">
                            {evt.time}
                          </p>

                          <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${
                            evt.type === 'Practical' ? 'bg-amber-100 text-amber-800' :
                            evt.type === 'Theory Exam' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {evt.type}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteEvent(evt.id)}
                        className="text-slate-400 hover:text-rose-500 p-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEACHER UPDATES & NOTICES */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              {role === 'teacher' ? (
                <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-base font-bold text-indigo-900 mb-3 flex items-center gap-2">
                    <PlusCircle size={18} />
                    Post New Circular (Broadcast to All Students)
                  </h3>
                  <form onSubmit={handleAddNotice} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Notice Title (e.g. AI Hackathon / Internship Alert)"
                        value={newNotice.title}
                        onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                        className="p-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                      />
                      <select
                        value={newNotice.category}
                        onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                        className="p-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Hackathon">Hackathon</option>
                        <option value="Internship">Internship Opportunity</option>
                        <option value="General">General Notice</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Write the full announcement description..."
                      rows={3}
                      value={newNotice.description}
                      onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
                      className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                    <div className="flex justify-between items-center">
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newNotice.urgent}
                          onChange={(e) => setNewNotice({ ...newNotice, urgent: e.target.checked })}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        Mark as High Priority / Urgent
                      </label>
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white font-medium text-sm px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
                      >
                        Publish Circular
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-xl text-xs text-indigo-900 font-medium">
                  📢 Note: You are viewing notices in Student Mode. Teachers can post circulars from their account.
                </div>
              )}

              <div className="space-y-4">
                {notices.map((notice) => (
                  <div key={notice.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {notice.category === 'Hackathon' && <Code size={18} className="text-purple-600" />}
                        {notice.category === 'Internship' && <Briefcase size={18} className="text-blue-600" />}
                        {notice.category === 'General' && <AlertCircle size={18} className="text-amber-600" />}
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {notice.category}
                        </span>
                        {notice.urgent && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                            Urgent
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{notice.date}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base mb-1">{notice.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-3">{notice.description}</p>
                    <p className="text-xs text-slate-400 font-medium">Shared by: <span className="text-slate-600">{notice.author}</span></p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DOUBTS & DISCUSSION BOX */}
          {activeTab === 'doubts' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-3">Ask a Doubt / Academic Query</h3>
                <form onSubmit={handleAddDoubt} className="space-y-3">
                  <div className="flex gap-3">
                    <select
                      value={newDoubt.subject}
                      onChange={(e) => setNewDoubt({ ...newDoubt, subject: e.target.value })}
                      className="p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Mechanical">Basic Mechanical</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Electronics">Basic Electronics</option>
                      <option value="Mathematics">Mathematics</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Type your question or conceptual doubt here..."
                      value={newDoubt.question}
                      onChange={(e) => setNewDoubt({ ...newDoubt, question: e.target.value })}
                      className="flex-1 p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white font-medium text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition flex items-center gap-1.5"
                    >
                      <Send size={15} />
                      Post
                    </button>
                  </div>
                </form>
              </div>

              <div className="space-y-4">
                {doubts.map((doubt) => (
                  <div key={doubt.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                          {doubt.subject}
                        </span>
                        <p className="font-semibold text-slate-900 mt-2">{doubt.question}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Asked by {doubt.student}</p>
                      </div>
                      {doubt.solved && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                          <CheckCircle size={14} /> Solved
                        </span>
                      )}
                      {isTeacher && (
                          <button
                            onClick={() => handleDeleteDoubt(doubt.id)}
                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                          >
                          Delete
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      {doubt.replies.map((reply, index) => (
                        <div key={index} className="bg-slate-50 p-2.5 rounded-lg text-xs text-slate-700">
                          💬 {typeof reply === 'string' ? reply : reply.message}
                        </div>
                      ))}

                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="Write a reply or answer..."
                          value={replyInput[doubt.id] || ''}
                          onChange={(e) => setReplyInput({ ...replyInput, [doubt.id]: e.target.value })}
                          className="flex-1 text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          onClick={() => handleAddReply(doubt.id)}
                          className="bg-slate-800 text-white text-xs px-3 py-2 rounded-lg hover:bg-slate-900 transition"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CAMPUS GRIEVANCES & INFRASTRUCTURE COMPLAINTS (MODERN, CLEAN CARD UI) */}
          {activeTab === 'complaints' && (
            <div className="space-y-6">
              {/* Complaint Registration Form */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Wrench size={20} className="text-indigo-600" />
                    Register Campus Grievance / Maintenance Request
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Report equipment breakdowns, broken desks, or AC faults. Tracking timer automatically logs response intervals.
                  </p>
                </div>

                <form onSubmit={handleAddComplaint} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Reported By</label>
                      <input
                        type="text"
                        placeholder="Your Name (Optional)"
                        value={newComplaint.student}
                        onChange={(e) => setNewComplaint({ ...newComplaint, student: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Target Section *</label>
                      <select
                        required
                        value={newComplaint.section}
                        onChange={(e) => setNewComplaint({ ...newComplaint, section: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-800"
                      >
                        <option value="">Select Section</option>
                        {sectionList.map(sec => (
                          <option key={sec} value={sec}>{sec}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Issue Category *</label>
                      <select
                        value={newComplaint.category}
                        onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-800"
                      >
                        <option value="AC / Ventilation">AC / Ventilation Issue</option>
                        <option value="Benches & Desks">Broken Benches / Furniture</option>
                        <option value="Fans / Lights / Electrical">Fans / Lights / Electricity</option>
                        <option value="Projector / Smart Board">Projector / Smart Board</option>
                        <option value="Water & Washrooms">Water Cooler & Washroom</option>
                        <option value="Computer Lab & Systems">Computer Lab & Internet</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Subject / Headline *</label>
                    <input
                      type="text"
                      placeholder="e.g. Back row AC unit not cooling and making loud noise in Room 304"
                      required
                      value={newComplaint.title}
                      onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Detailed Description *</label>
                    <textarea
                      placeholder="Describe the exact location, symptoms, or risks involved..."
                      required
                      rows={3}
                      value={newComplaint.description}
                      onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-md shadow-indigo-600/20 flex items-center gap-2"
                    >
                      <Send size={14} />
                      Submit Ticket
                    </button>
                  </div>
                </form>
              </div>

              {/* Feed Header */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Active Campus Tickets & SLA Monitor</h3>
                    <p className="text-xs text-slate-500 font-medium">Real-time stopwatch records exact downtime till ticket closure</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
                      Total: {complaints.length}
                    </span>
                    <span className="text-xs font-extrabold bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-200">
                      Active: {complaints.filter(c => c.status !== 'Resolved').length}
                    </span>
                  </div>
                </div>

                {/* Complaint Cards List */}
                <div className="space-y-4">
                  {complaints.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      No complaints registered yet. Campus infrastructure is fully operational!
                    </div>
                  ) : (
                    complaints.map((item) => {
                      const isResolved = item.status === 'Resolved';
                      return (
                        <div
                          key={item.id}
                          className={`rounded-2xl border transition-all duration-200 p-5 sm:p-6 space-y-4 shadow-sm ${
                            isResolved
                              ? 'bg-slate-50/60 border-slate-200'
                              : 'bg-white border-slate-200 hover:border-indigo-200'
                          }`}
                        >
                          {/* Top Meta Bar */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[11px] font-black px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 tracking-wide uppercase">
                                {item.category}
                              </span>
                              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 flex items-center gap-1">
                                <MapPin size={11} className="text-indigo-600" /> {item.section}
                              </span>
                              <span className="text-xs text-slate-400 font-medium">
                                By {item.student} • {item.date}
                              </span>
                            </div>

                            {/* Status & Realtime Elapsed Clock */}
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Duration Tracker Pill */}
                              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-black border shadow-xs ${
                                isResolved
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                              }`}>
                                <Clock size={13} className={isResolved ? 'text-emerald-600' : 'text-amber-600'} />
                                <span>
                                  {isResolved ? 'Solved in:' : 'Elapsed:'} {formatDuration(item.createdAt, item.resolvedAt)}
                                </span>
                              </div>

                              {/* Status Tag */}
                              {item.status === 'Resolved' && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <CheckCircle2 size={13} /> Fixed
                                </span>
                              )}
                              {item.status === 'In Progress' && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-xl bg-blue-100 text-blue-800 border border-blue-200">
                                  <TimerReset size={13} /> In Progress
                                </span>
                              )}
                              {item.status === 'Pending' && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
                                  <AlertCircle size={13} /> Pending Review
                                </span>
                              )}

                              {(role === 'teacher' || role === 'student') && (
                                <button
                                  onClick={() => handleDeleteComplaint(item.id)}
                                  className="text-slate-300 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                                  title="Delete Ticket"
                                >
                                  <Trash2 size={15} />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-base">{item.title}</h4>
                            <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">{item.description}</p>
                          </div>

                          {/* Maintenance Update Note */}
                          {item.adminNote && (
                            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl text-xs flex items-start gap-2">
                              <span className="font-bold text-indigo-600 shrink-0">🛠️ Tech Note:</span>
                              <span className="text-slate-700 leading-normal">{item.adminNote}</span>
                            </div>
                          )}

                          {/* Teacher Actions Bar */}
                          {role === 'teacher' && (
                            <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                              <span className="text-xs font-bold text-slate-500">Update Resolution Stage:</span>
                              <div className="flex gap-2 flex-wrap">
                                <button
                                  onClick={() => handleUpdateComplaintStatus(item.id, 'Pending')}
                                  className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${
                                    item.status === 'Pending'
                                      ? 'bg-amber-600 text-white shadow-xs'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  Pending
                                </button>
                                <button
                                  onClick={() => handleUpdateComplaintStatus(item.id, 'In Progress')}
                                  className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${
                                    item.status === 'In Progress'
                                      ? 'bg-blue-600 text-white shadow-xs'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  In Progress
                                </button>
                                <button
                                  onClick={() => handleUpdateComplaintStatus(item.id, 'Resolved')}
                                  className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${
                                    item.status === 'Resolved'
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : 'bg-slate-100 text-emerald-700 hover:bg-emerald-50'
                                  }`}
                                >
                                  Mark Solved (Stop Timer)
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}