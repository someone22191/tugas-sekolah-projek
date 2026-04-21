import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  GraduationCap, 
  Check, 
  Loader2, 
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '../lib/utils';
import { Student, AttendanceStatus } from '../types';

const AbsensiSiswa = () => {
  const { user, isAdmin, isGuru } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingSiswa, setLoadingSiswa] = useState(false);
  const [selectedClass, setSelectedClass] = useState('TKJ');
  const [attendanceToday, setAttendanceToday] = useState<Record<string, AttendanceStatus | null>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoadingSiswa(true);
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .eq('class', selectedClass)
        .order('name');
        
      if (studentsError) throw studentsError;
      setStudents(studentsData as Student[]);
      
      // Fetch today's records
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data: attendData, error: attendError } = await supabase
        .from('attendance_students')
        .select('student_id, status')
        .eq('class', selectedClass)
        .eq('date', today);
        
      if (attendError) throw attendError;
      
      const recordMap: Record<string, AttendanceStatus | null> = {};
      attendData.forEach((record: any) => {
        recordMap[record.student_id] = record.status;
      });
      setAttendanceToday(recordMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSiswa(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedClass]);

  const handleStatusChange = async (studentId: string, status: AttendanceStatus) => {
    if (!user) return;
    setSaving(studentId);
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Upsert record (delete then insert for simplicity if primary key isn't composite)
      // Since student_id + date isn't a primary key in our schema (we use ID), we delete then insert.
      await supabase
        .from('attendance_students')
        .delete()
        .eq('student_id', studentId)
        .eq('date', today);

      const { error } = await supabase.from('attendance_students').insert({
        student_id: studentId,
        date: today,
        status,
        teacher_id: user.id,
        class: selectedClass
      });

      if (error) throw error;
      setAttendanceToday(prev => ({ ...prev, [studentId]: status }));
    } catch (err: any) {
      console.error(err);
      alert("Gagal mencatat absensi: " + err.message);
    } finally {
      setSaving(null);
    }
  };

  const classes = ['TKJ', 'DKV', 'AK', 'BC', 'MPLB', 'BD'];

  return (
    <div className="space-y-8 animate-in slide-in-from-top duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Presensi Siswa</h1>
          <p className="text-slate-500 font-medium tracking-wide">Monitoring kehadiran kelas harian.</p>
        </div>
        <div className="flex bg-white p-2 rounded-[2rem] border border-slate-200 w-full md:w-auto overflow-x-auto shadow-sm">
          {classes.map(c => (
            <button
              key={c}
              onClick={() => setSelectedClass(c)}
              className={cn(
                "px-8 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shrink-0",
                selectedClass === c 
                  ? "bg-red-600 text-white shadow-xl shadow-red-500/30" 
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm relative">
        <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-5">
             <div className="w-16 h-16 bg-white border border-slate-200 rounded-[1.5rem] flex items-center justify-center text-red-600 shadow-sm relative overflow-hidden group">
                <GraduationCap className="w-8 h-8 relative z-10 group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </div>
             <div>
               <h3 className="text-xl font-black text-slate-800 tracking-tight">Peserta Didik Kelas {selectedClass}</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id })}</p>
             </div>
           </div>
           
           <div className="flex bg-amber-50 px-6 py-3 rounded-2xl border border-amber-200/50 text-amber-700 text-xs font-bold items-center gap-3 animate-pulse">
             <AlertTriangle className="w-4 h-4 shrink-0" />
             Pastikan koneksi stabil saat menyimpan data.
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white text-slate-300 text-[10px] font-black uppercase tracking-[0.4em] border-b border-slate-100">
                <th className="px-10 py-6">IDENTITAS SISWA</th>
                <th className="px-6 py-6 text-center">HADIR</th>
                <th className="px-6 py-6 text-center">TELAT</th>
                <th className="px-6 py-6 text-center">SAKIT/IZIN</th>
                <th className="px-6 py-6 text-center">ALPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loadingSiswa ? (
                <tr>
                  <td colSpan={5} className="p-32 text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto" />
                    <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sinkronisasi Database...</p>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-32 text-center">
                    <GraduationCap className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold italic">Belum ada siswa terdaftar di program {selectedClass}.</p>
                  </td>
                </tr>
              ) : students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-300 font-extrabold text-lg shadow-sm group-hover:border-red-100 group-hover:text-red-600 transition-all">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 tracking-tight text-lg leading-tight">{student.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">NIS: {student.nis}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-8 text-center">{renderStatusCell(student.id!, 'present', 'green')}</td>
                  <td className="px-4 py-8 text-center">{renderStatusCell(student.id!, 'late', 'amber')}</td>
                  <td className="px-4 py-8 text-center">{renderStatusCell(student.id!, 'sick', 'blue')}</td>
                  <td className="px-4 py-8 text-center">{renderStatusCell(student.id!, 'absent', 'red')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  function renderStatusCell(studentId: string, status: AttendanceStatus, color: string) {
    const isActive = attendanceToday[studentId] === status;
    const isSaving = saving === studentId;

    const baseClasses = "w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all mx-auto shrink-0 animate-in fade-in zoom-in-90";
    const colors: any = {
      green: isActive ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-200" : "bg-white border-slate-100 text-slate-200 hover:border-green-300 hover:text-green-500",
      amber: isActive ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-200" : "bg-white border-slate-100 text-slate-200 hover:border-amber-300 hover:text-amber-500",
      blue: isActive ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white border-slate-100 text-slate-200 hover:border-blue-300 hover:text-blue-500",
      red: isActive ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-200" : "bg-white border-slate-100 text-slate-200 hover:border-red-300 hover:text-red-500",
    };

    return (
      <button
        disabled={isSaving}
        onClick={() => handleStatusChange(studentId, status)}
        className={cn(baseClasses, colors[color], isSaving && "opacity-50 cursor-not-allowed")}
      >
        {isSaving && saving === studentId ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isActive ? (
          <Check className="w-6 h-6 stroke-[4]" />
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-20 group-hover:scale-150 transition-transform"></div>
        )}
      </button>
    );
  }
};

export default AbsensiSiswa;
