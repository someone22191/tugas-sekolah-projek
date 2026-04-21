export type UserRole = 'admin' | 'guru' | 'staff';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export interface Student {
  id?: string;
  nis: string;
  name: string;
  class: string;
  created_at?: string;
}

export type AttendanceStatus = 'present' | 'sick' | 'absent' | 'late';

export interface EmployeeAttendance {
  id: string;
  user_id: string;
  user_name: string;
  date: string;
  time: string;
  status: 'present' | 'sick' | 'absent';
}

export interface StudentAttendance {
  id: string;
  student_id: string;
  date: string;
  status: AttendanceStatus;
  teacher_id: string;
  class: string;
}
