-- Run this SQL in your Supabase migration file (e.g., supabase/migrations/20240620_init_schema.sql)

create extension if not exists "uuid-ossp";

-- Store Table
create table public.store (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  userId text not null,
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now()
);

-- Billboard Table
create table public.billboard (
  id uuid primary key default uuid_generate_v4(),
  storeId uuid not null references public.store(id),
  label text not null,
  imageUrl text not null,
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now()
);
create index on public.billboard(storeId);

-- Category Table
create table public.category (
  id uuid primary key default uuid_generate_v4(),
  storeId uuid not null references public.store(id),
  billboardId uuid not null references public.billboard(id),
  name text not null,
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now()
);
create index on public.category(storeId);
create index on public.category(billboardId);

-- Size Table
create table public.size (
  id uuid primary key default uuid_generate_v4(),
  storeId uuid not null references public.store(id),
  name text not null,
  value text not null,
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now()
);
create index on public.size(storeId);

-- Color Table
create table public.color (
  id uuid primary key default uuid_generate_v4(),
  storeId uuid not null references public.store(id),
  name text not null,
  value text not null,
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now()
);
create index on public.color(storeId);

-- Product Table
create table public.product (
  id uuid primary key default uuid_generate_v4(),
  storeId uuid not null references public.store(id),
  categoryId uuid not null references public.category(id),
  sizeId uuid not null references public.size(id),
  colorId uuid not null references public.color(id),
  name text not null,
  price numeric not null,
  isFeatured boolean not null default false,
  isArchived boolean not null default false,
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now()
);
create index on public.product(storeId);
create index on public.product(categoryId);
create index on public.product(sizeId);
create index on public.product(colorId);

-- Image Table
create table public.image (
  id uuid primary key default uuid_generate_v4(),
  productId uuid not null references public.product(id) on delete cascade,
  url text not null,
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now()
);
create index on public.image(productId);

-- Order Table
create table public.order (
  id uuid primary key default uuid_generate_v4(),
  storeId uuid not null references public.store(id),
  isPaid boolean not null default false,
  phone text not null default '',
  address text not null default '',
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now()
);
create index on public.order(storeId);

-- OrderItem Table
create table public.order_item (
  id uuid primary key default uuid_generate_v4(),
  orderId uuid not null references public.order(id),
  productId uuid not null references public.product(id)
);
create index on public.order_item(orderId);
create index on public.order_item(productId);
