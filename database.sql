-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.addresses (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  label text,
  line1 text NOT NULL,
  line2 text,
  city text NOT NULL,
  pincode text NOT NULL,
  lat numeric,
  lng numeric,
  is_default boolean NOT NULL DEFAULT false,
  CONSTRAINT addresses_pkey PRIMARY KEY (id),
  CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.admin_settings (
  id integer NOT NULL DEFAULT nextval('admin_settings_id_seq'::regclass),
  admin_email character varying NOT NULL DEFAULT 'admin@babitaskitchen.com'::character varying,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT admin_settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.admins (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'admin'::text CHECK (role = ANY (ARRAY['super_admin'::text, 'admin'::text, 'manager'::text])),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  last_login timestamp with time zone,
  login_attempts integer DEFAULT 0,
  locked_until timestamp with time zone,
  CONSTRAINT admins_pkey PRIMARY KEY (id)
);
CREATE TABLE public.business_settings (
  id integer NOT NULL DEFAULT nextval('business_settings_id_seq'::regclass),
  restaurant_name character varying NOT NULL DEFAULT 'Babita''s Kitchen'::character varying,
  phone_number character varying DEFAULT '+91 98765 43210'::character varying,
  email character varying DEFAULT 'contact@babitaskitchen.com'::character varying,
  address text DEFAULT '123 Main Street, Bangalore, Karnataka 560001'::text,
  gst_number character varying DEFAULT '29ABCDE1234C1ZV'::character varying,
  logo_url character varying,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT business_settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.coupons (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  code text NOT NULL UNIQUE,
  description text,
  discount_type text NOT NULL DEFAULT 'percent'::text CHECK (discount_type = ANY (ARRAY['percent'::text, 'flat'::text])),
  discount_value integer NOT NULL CHECK (discount_value >= 0),
  min_order_value integer DEFAULT 0 CHECK (min_order_value >= 0),
  max_discount integer CHECK (max_discount >= 0),
  usage_limit integer CHECK (usage_limit > 0),
  used_count integer DEFAULT 0 CHECK (used_count >= 0),
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  category text DEFAULT 'general'::text,
  buy_x_get_y_config jsonb,
  CONSTRAINT coupons_pkey PRIMARY KEY (id)
);
CREATE TABLE public.delivery_agents (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE,
  vehicle_type text NOT NULL CHECK (vehicle_type = ANY (ARRAY['bike'::text, 'cycle'::text, 'foot'::text])),
  is_available boolean NOT NULL DEFAULT false,
  rating_avg numeric,
  CONSTRAINT delivery_agents_pkey PRIMARY KEY (id),
  CONSTRAINT delivery_agents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.delivery_assignments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  order_id uuid NOT NULL,
  agent_id uuid NOT NULL,
  assigned_at timestamp with time zone NOT NULL DEFAULT now(),
  picked_at timestamp with time zone,
  delivered_at timestamp with time zone,
  CONSTRAINT delivery_assignments_pkey PRIMARY KEY (id),
  CONSTRAINT delivery_assignments_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.delivery_agents(id)
);
CREATE TABLE public.item_addons (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  item_id uuid NOT NULL,
  name text NOT NULL,
  extra_price numeric NOT NULL DEFAULT 0,
  is_available boolean NOT NULL DEFAULT true,
  CONSTRAINT item_addons_pkey PRIMARY KEY (id),
  CONSTRAINT item_addons_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.menu_items(id)
);
CREATE TABLE public.loyalty_txns (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  order_id uuid,
  points integer NOT NULL,
  description text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT loyalty_txns_pkey PRIMARY KEY (id),
  CONSTRAINT loyalty_txns_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.menu_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  category_id uuid NOT NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  price numeric NOT NULL,
  image_url text,
  is_veg boolean NOT NULL,
  spice_level text CHECK (spice_level = ANY (ARRAY['mild'::text, 'medium'::text, 'hot'::text])),
  is_available boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  is_deleted boolean NOT NULL DEFAULT false,
  search_vector tsvector,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT menu_items_pkey PRIMARY KEY (id),
  CONSTRAINT menu_items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['order_update'::text, 'promotion'::text, 'system'::text])),
  title text NOT NULL,
  body text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  menu_item_id uuid NOT NULL,
  name_snapshot text NOT NULL,
  price_snapshot integer NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  addons text DEFAULT '[]'::json,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
CREATE TABLE public.order_settings (
  id integer NOT NULL DEFAULT nextval('order_settings_id_seq'::regclass),
  preparation_time integer DEFAULT 20,
  delivery_time integer DEFAULT 30,
  auto_accept_orders boolean DEFAULT true,
  allow_order_cancellation boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT order_settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  address_snapshot text NOT NULL,
  status text NOT NULL DEFAULT 'pending'::text,
  subtotal integer NOT NULL DEFAULT 0,
  delivery_fee integer NOT NULL DEFAULT 0,
  gst_amount integer NOT NULL DEFAULT 0,
  discount_amount integer NOT NULL DEFAULT 0,
  total integer NOT NULL,
  coupon_id uuid,
  payment_method text NOT NULL DEFAULT 'cod'::text,
  payment_status text NOT NULL DEFAULT 'pending'::text,
  special_note text,
  scheduled_for timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  status_updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.payment_settings (
  id integer NOT NULL DEFAULT nextval('payment_settings_id_seq'::regclass),
  enable_cash_on_delivery boolean DEFAULT true,
  enable_upi boolean DEFAULT true,
  enable_card_payments boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT payment_settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  order_id uuid NOT NULL UNIQUE,
  razorpay_order_id text,
  razorpay_pay_id text,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'captured'::text, 'failed'::text])),
  paid_at timestamp with time zone,
  CONSTRAINT payments_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  full_name text,
  email text UNIQUE,
  phone text UNIQUE,
  password_hash text,
  avatar_url text,
  role text NOT NULL DEFAULT 'customer'::text CHECK (role = ANY (ARRAY['customer'::text, 'admin'::text, 'delivery_agent'::text])),
  loyalty_points integer NOT NULL DEFAULT 0,
  is_blocked boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.refunds (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL UNIQUE,
  amount numeric NOT NULL,
  reason text,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'processed'::text])),
  created_at timestamp with time zone DEFAULT now(),
  processed_at timestamp with time zone,
  CONSTRAINT refunds_pkey PRIMARY KEY (id),
  CONSTRAINT refunds_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  order_id uuid NOT NULL,
  menu_item_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.tax_charges_settings (
  id integer NOT NULL DEFAULT nextval('tax_charges_settings_id_seq'::regclass),
  gst_percentage numeric DEFAULT 5.00,
  delivery_fee integer DEFAULT 40,
  packaging_fee integer DEFAULT 20,
  minimum_order_amount integer DEFAULT 200,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT tax_charges_settings_pkey PRIMARY KEY (id)
);