-- ============================================================
-- Woodlands at Echo Farms — Neighborhood Directory Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

create table addresses (
  id uuid default gen_random_uuid() primary key,
  street text not null default '',
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

create table residents (
  id uuid default gen_random_uuid() primary key,
  address_id uuid references addresses(id) on delete cascade not null,
  name text not null default '',
  phone text not null default '',
  email text not null default '',
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table addresses enable row level security;
alter table residents enable row level security;

-- Anyone can READ (public directory)
create policy "Public can read addresses" on addresses for select using (true);
create policy "Public can read residents" on residents for select using (true);

-- Anyone can WRITE (password enforced on the frontend)
create policy "Anyone can insert addresses" on addresses for insert with check (true);
create policy "Anyone can update addresses" on addresses for update using (true);
create policy "Anyone can delete addresses" on addresses for delete using (true);

create policy "Anyone can insert residents" on residents for insert with check (true);
create policy "Anyone can update residents" on residents for update using (true);
create policy "Anyone can delete residents" on residents for delete using (true);
