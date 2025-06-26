-- Run this SQL in your Supabase migration file (e.g., supabase/migrations/20240620_init_schema.sql)

create extension if not exists "uuid-ossp";

-- Store Table
create table public.store (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  user_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Billboard Table
create table public.billboard (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid not null references public.store(id),
  label text not null,
  image_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.billboard(store_id);

-- Category Table
create table public.category (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid not null references public.store(id),
  billboard_id uuid not null references public.billboard(id),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.category(store_id);
create index on public.category(billboard_id);

-- Size Table
create table public.size (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid not null references public.store(id),
  name text not null,
  value text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.size(store_id);

-- Color Table
create table public.color (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid not null references public.store(id),
  name text not null,
  value text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.color(store_id);

-- Product Table
create table public.product (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid not null references public.store(id),
  category_id uuid not null references public.category(id),
  size_id uuid not null references public.size(id),
  color_id uuid not null references public.color(id),
  name text not null,
  price numeric not null,
  is_featured boolean not null default false,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.product(store_id);
create index on public.product(category_id);
create index on public.product(size_id);
create index on public.product(color_id);

-- Image Table
create table public.image (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.product(id) on delete cascade,
  url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.image(product_id);

-- Order Table
create table public.order (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid not null references public.store(id),
  is_paid boolean not null default false,
  phone text not null default '',
  address text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.order(store_id);

-- OrderItem Table
create table public.order_item (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.order(id),
  product_id uuid not null references public.product(id)
);
create index on public.order_item(order_id);
create index on public.order_item(product_id);
