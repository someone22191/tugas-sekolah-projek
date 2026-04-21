-- SETUP_SUPABASE.sql
-- Silahkan copy dan paste script ini ke SQL EDITOR di Dashboard Supabase Anda.

-- 1. Tabel Profil User (Sinkron dengan Auth)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text not null,
  role text check (role in ('admin', 'guru', 'staff')) not null default 'guru',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabel Siswa
create table students (
  id uuid default gen_random_uuid() primary key,
  nis text unique not null,
  name text not null,
  class text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tabel Absensi Karyawan
create table attendance_employees (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  user_name text not null,
  date date not null default current_date,
  time timestamp with time zone default now() not null,
  status text check (status in ('present', 'sick', 'absent')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Tabel Absensi Siswa
create table attendance_students (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references students(id) on delete cascade not null,
  date date not null default current_date,
  status text check (status in ('present', 'sick', 'absent', 'late')) not null,
  teacher_id uuid references auth.users(id) not null,
  class text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- AKTIFKAN RLS (Row Level Security)
alter table profiles enable row level security;
alter table students enable row level security;
alter table attendance_employees enable row level security;
alter table attendance_students enable row level security;

-- POLICY: Profiles
create policy "Users can view their own profile" on profiles for select using (auth.uid() = id);
create policy "Admins can view all profiles" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

-- POLICY: Students
create policy "Anyone authenticated can view students" on students for select using (auth.role() = 'authenticated');
create policy "Admins can manage students" on students for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- POLICY: Attendance Employees
create policy "Users can view their own employee attendance" on attendance_employees for select using (auth.uid() = user_id);
create policy "Admins can view all employee attendance" on attendance_employees for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Users can create their own attendance" on attendance_employees for insert with check (auth.uid() = user_id);

-- POLICY: Attendance Students
create policy "Gurus and Admins can manage student attendance" on attendance_students for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'guru'))
);

-- TRIGGER UNTUK AUTO-CREATE PROFILE SAAT REGISTER
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', 'User'), coalesce(new.raw_user_meta_data->>'role', 'guru'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
