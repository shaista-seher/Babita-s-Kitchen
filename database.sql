-- ============================================================
--  Babita's Kitchen — COMPLETE DATABASE SCHEMA
--  Includes all original tables + OTP / Session / Location additions
--
--  HOW TO USE:
--  1. Go to Supabase Dashboard → SQL Editor → New Query
--  2. Paste this entire file and click Run
--  3. Check the verification queries at the bottom
--
--  NOTE: All original tables are recreated exactly as-is.
--        New additions are clearly marked with [NEW] or [MODIFIED].
-- ============================================================


-- ────────────────────────────────────────────────────────────
--  EXTENSIONS (required by uuid functions)
-- ────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================
--  ORIGINAL TABLES (unchanged — kept exactly as your schema)
-- ============================================================


-- ────────────────────────────────────────────────────────────
--  profiles  [MODIFIED — 2 new columns added at bottom]
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
  id              uuid    NOT NULL DEFAULT uuid_generate_v4(),
  full_name       text,
  email           text    UNIQUE,
  phone           text    UNIQUE,
  password_hash   text,
  avatar_url      text,
  role            text    NOT NULL DEFAULT 'customer'
                    CHECK (role = ANY (ARRAY['customer','admin','delivery_agent'])),
  loyalty_points  integer NOT NULL DEFAULT 0,
  is_blocked      boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),

  -- [NEW] OTP auth additions
  phone_verified          boolean NOT NULL DEFAULT false,
  name_required_at_login  boolean NOT NULL DEFAULT false,

  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

-- If table already exists, safely add the new columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone_verified         boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS name_required_at_login boolean NOT NULL DEFAULT false;

-- Mark all pre-existing users as verified
UPDATE public.profiles
SET phone_verified = true
WHERE phone IS NOT NULL AND phone_verified = false;


-- ────────────────────────────────────────────────────────────
--  addresses  [MODIFIED — 2 new columns added at bottom]
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.addresses (
  id          uuid    NOT NULL DEFAULT uuid_generate_v4(),
  user_id     uuid    NOT NULL,
  label       text,
  line1       text    NOT NULL,
  line2       text,
  city        text    NOT NULL,
  pincode     text    NOT NULL,
  lat         numeric,
  lng         numeric,
  is_default  boolean NOT NULL DEFAULT false,

  -- [NEW] Location confirmation additions
  confirmed_at  timestamptz,
  source        text CHECK (source IN ('gps', 'search', 'pincode', 'manual')),

  CONSTRAINT addresses_pkey PRIMARY KEY (id),
  CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

ALTER TABLE public.addresses
  ADD COLUMN IF NOT EXISTS confirmed_at timestamptz,
  ADD COLUMN IF NOT EXISTS source       text CHECK (source IN ('gps', 'search', 'pincode', 'manual'));


-- ────────────────────────────────────────────────────────────
--  admin_settings
-- ────────────────────────────────────────────────────────────

CREATE SEQUENCE IF NOT EXISTS admin_settings_id_seq;

CREATE TABLE IF NOT EXISTS public.admin_settings (
  id           integer      NOT NULL DEFAULT nextval('admin_settings_id_seq'),
  admin_email  varchar      NOT NULL DEFAULT 'admin@babitaskitchen.com',
  created_at   timestamp    DEFAULT now(),
  updated_at   timestamp    DEFAULT now(),
  CONSTRAINT admin_settings_pkey PRIMARY KEY (id)
);


-- ────────────────────────────────────────────────────────────
--  admins
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.admins (
  id              uuid    NOT NULL DEFAULT gen_random_uuid(),
  email           text    NOT NULL UNIQUE,
  password_hash   text    NOT NULL,
  name            text    NOT NULL,
  role            text    NOT NULL DEFAULT 'admin'
                    CHECK (role = ANY (ARRAY['super_admin','admin','manager'])),
  is_active       boolean DEFAULT true,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),
  last_login      timestamptz,
  login_attempts  integer DEFAULT 0,
  locked_until    timestamptz,
  CONSTRAINT admins_pkey PRIMARY KEY (id)
);


-- ────────────────────────────────────────────────────────────
--  business_settings
-- ────────────────────────────────────────────────────────────

CREATE SEQUENCE IF NOT EXISTS business_settings_id_seq;

CREATE TABLE IF NOT EXISTS public.business_settings (
  id               integer  NOT NULL DEFAULT nextval('business_settings_id_seq'),
  restaurant_name  varchar  NOT NULL DEFAULT 'Babita''s Kitchen',
  phone_number     varchar  DEFAULT '+91 98765 43210',
  email            varchar  DEFAULT 'contact@babitaskitchen.com',
  address          text     DEFAULT '123 Main Street, Bangalore, Karnataka 560001',
  gst_number       varchar  DEFAULT '29ABCDE1234C1ZV',
  logo_url         varchar,
  created_at       timestamp DEFAULT now(),
  updated_at       timestamp DEFAULT now(),
  CONSTRAINT business_settings_pkey PRIMARY KEY (id)
);


-- ────────────────────────────────────────────────────────────
--  categories
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.categories (
  id          uuid    NOT NULL DEFAULT uuid_generate_v4(),
  name        text    NOT NULL,
  slug        text    NOT NULL UNIQUE,
  image_url   text,
  sort_order  integer NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);


-- ────────────────────────────────────────────────────────────
--  coupons
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.coupons (
  id                  uuid    NOT NULL DEFAULT gen_random_uuid(),
  title               text    NOT NULL,
  code                text    NOT NULL UNIQUE,
  description         text,
  discount_type       text    NOT NULL DEFAULT 'percent'
                        CHECK (discount_type = ANY (ARRAY['percent','flat'])),
  discount_value      integer NOT NULL CHECK (discount_value >= 0),
  min_order_value     integer DEFAULT 0 CHECK (min_order_value >= 0),
  max_discount        integer CHECK (max_discount >= 0),
  usage_limit         integer CHECK (usage_limit > 0),
  used_count          integer DEFAULT 0 CHECK (used_count >= 0),
  start_date          timestamptz NOT NULL,
  end_date            timestamptz NOT NULL,
  is_active           boolean DEFAULT true,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now(),
  category            text    DEFAULT 'general',
  buy_x_get_y_config  jsonb,
  CONSTRAINT coupons_pkey PRIMARY KEY (id)
);


-- ────────────────────────────────────────────────────────────
--  menu_items
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.menu_items (
  id             uuid    NOT NULL DEFAULT uuid_generate_v4(),
  category_id    uuid    NOT NULL,
  name           text    NOT NULL,
  slug           text    NOT NULL UNIQUE,
  description    text,
  price          numeric NOT NULL,
  image_url      text,
  is_veg         boolean NOT NULL,
  spice_level    text    CHECK (spice_level = ANY (ARRAY['mild','medium','hot'])),
  is_available   boolean NOT NULL DEFAULT true,
  is_featured    boolean NOT NULL DEFAULT false,
  is_deleted     boolean NOT NULL DEFAULT false,
  search_vector  tsvector,
  created_at     timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT menu_items_pkey PRIMARY KEY (id),
  CONSTRAINT menu_items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);


-- ────────────────────────────────────────────────────────────
--  item_addons
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.item_addons (
  id            uuid    NOT NULL DEFAULT uuid_generate_v4(),
  item_id       uuid    NOT NULL,
  name          text    NOT NULL,
  extra_price   numeric NOT NULL DEFAULT 0,
  is_available  boolean NOT NULL DEFAULT true,
  CONSTRAINT item_addons_pkey PRIMARY KEY (id),
  CONSTRAINT item_addons_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.menu_items(id)
);


-- ────────────────────────────────────────────────────────────
--  delivery_agents
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.delivery_agents (
  id            uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id       uuid NOT NULL UNIQUE,
  vehicle_type  text NOT NULL CHECK (vehicle_type = ANY (ARRAY['bike','cycle','foot'])),
  is_available  boolean NOT NULL DEFAULT false,
  rating_avg    numeric,
  CONSTRAINT delivery_agents_pkey PRIMARY KEY (id),
  CONSTRAINT delivery_agents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);


-- ────────────────────────────────────────────────────────────
--  delivery_assignments
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.delivery_assignments (
  id            uuid        NOT NULL DEFAULT uuid_generate_v4(),
  order_id      uuid        NOT NULL,
  agent_id      uuid        NOT NULL,
  assigned_at   timestamptz NOT NULL DEFAULT now(),
  picked_at     timestamptz,
  delivered_at  timestamptz,
  CONSTRAINT delivery_assignments_pkey PRIMARY KEY (id),
  CONSTRAINT delivery_assignments_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.delivery_agents(id)
);


-- ────────────────────────────────────────────────────────────
--  orders
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.orders (
  id                uuid    NOT NULL DEFAULT gen_random_uuid(),
  user_id           uuid,
  address_snapshot  text    NOT NULL,
  status            text    NOT NULL DEFAULT 'pending',
  subtotal          integer NOT NULL DEFAULT 0,
  delivery_fee      integer NOT NULL DEFAULT 0,
  gst_amount        integer NOT NULL DEFAULT 0,
  discount_amount   integer NOT NULL DEFAULT 0,
  total             integer NOT NULL,
  coupon_id         uuid,
  payment_method    text    NOT NULL DEFAULT 'cod',
  payment_status    text    NOT NULL DEFAULT 'pending',
  special_note      text,
  scheduled_for     timestamptz,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now(),
  status_updated_at timestamptz DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);


-- ────────────────────────────────────────────────────────────
--  order_items
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.order_items (
  id              uuid    NOT NULL DEFAULT gen_random_uuid(),
  order_id        uuid    NOT NULL,
  menu_item_id    uuid    NOT NULL,
  name_snapshot   text    NOT NULL,
  price_snapshot  integer NOT NULL,
  quantity        integer NOT NULL CHECK (quantity > 0),
  addons          text    DEFAULT '[]'::json,
  created_at      timestamptz DEFAULT now(),
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);


-- ────────────────────────────────────────────────────────────
--  order_settings
-- ────────────────────────────────────────────────────────────

CREATE SEQUENCE IF NOT EXISTS order_settings_id_seq;

CREATE TABLE IF NOT EXISTS public.order_settings (
  id                      integer  NOT NULL DEFAULT nextval('order_settings_id_seq'),
  preparation_time        integer  DEFAULT 20,
  delivery_time           integer  DEFAULT 30,
  auto_accept_orders      boolean  DEFAULT true,
  allow_order_cancellation boolean DEFAULT true,
  created_at              timestamp DEFAULT now(),
  updated_at              timestamp DEFAULT now(),
  CONSTRAINT order_settings_pkey PRIMARY KEY (id)
);


-- ────────────────────────────────────────────────────────────
--  payment_settings
-- ────────────────────────────────────────────────────────────

CREATE SEQUENCE IF NOT EXISTS payment_settings_id_seq;

CREATE TABLE IF NOT EXISTS public.payment_settings (
  id                    integer  NOT NULL DEFAULT nextval('payment_settings_id_seq'),
  enable_cash_on_delivery boolean DEFAULT true,
  enable_upi            boolean  DEFAULT true,
  enable_card_payments  boolean  DEFAULT true,
  created_at            timestamp DEFAULT now(),
  updated_at            timestamp DEFAULT now(),
  CONSTRAINT payment_settings_pkey PRIMARY KEY (id)
);


-- ────────────────────────────────────────────────────────────
--  payments
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.payments (
  id                uuid    NOT NULL DEFAULT uuid_generate_v4(),
  order_id          uuid    NOT NULL UNIQUE,
  razorpay_order_id text,
  razorpay_pay_id   text,
  amount            numeric NOT NULL,
  status            text    NOT NULL DEFAULT 'pending'
                      CHECK (status = ANY (ARRAY['pending','captured','failed'])),
  paid_at           timestamptz,
  CONSTRAINT payments_pkey PRIMARY KEY (id)
);


-- ────────────────────────────────────────────────────────────
--  notifications
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.notifications (
  id          uuid    NOT NULL DEFAULT uuid_generate_v4(),
  user_id     uuid    NOT NULL,
  type        text    NOT NULL
                CHECK (type = ANY (ARRAY['order_update','promotion','system'])),
  title       text    NOT NULL,
  body        text    NOT NULL,
  is_read     boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);


-- ────────────────────────────────────────────────────────────
--  loyalty_txns
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.loyalty_txns (
  id          uuid    NOT NULL DEFAULT uuid_generate_v4(),
  user_id     uuid    NOT NULL,
  order_id    uuid,
  points      integer NOT NULL,
  description text    NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT loyalty_txns_pkey PRIMARY KEY (id),
  CONSTRAINT loyalty_txns_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);


-- ────────────────────────────────────────────────────────────
--  reviews
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.reviews (
  id            uuid    NOT NULL DEFAULT uuid_generate_v4(),
  user_id       uuid    NOT NULL,
  order_id      uuid    NOT NULL,
  menu_item_id  uuid    NOT NULL,
  rating        integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment       text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);


-- ────────────────────────────────────────────────────────────
--  refunds
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.refunds (
  id            uuid    NOT NULL DEFAULT gen_random_uuid(),
  order_id      uuid    NOT NULL UNIQUE,
  amount        numeric NOT NULL,
  reason        text,
  status        text    DEFAULT 'pending'
                  CHECK (status = ANY (ARRAY['pending','approved','rejected','processed'])),
  created_at    timestamptz DEFAULT now(),
  processed_at  timestamptz,
  CONSTRAINT refunds_pkey PRIMARY KEY (id),
  CONSTRAINT refunds_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);


-- ────────────────────────────────────────────────────────────
--  tax_charges_settings
-- ────────────────────────────────────────────────────────────

CREATE SEQUENCE IF NOT EXISTS tax_charges_settings_id_seq;

CREATE TABLE IF NOT EXISTS public.tax_charges_settings (
  id                    integer  NOT NULL DEFAULT nextval('tax_charges_settings_id_seq'),
  gst_percentage        numeric  DEFAULT 5.00,
  delivery_fee          integer  DEFAULT 40,
  packaging_fee         integer  DEFAULT 20,
  minimum_order_amount  integer  DEFAULT 200,
  created_at            timestamp DEFAULT now(),
  updated_at            timestamp DEFAULT now(),
  CONSTRAINT tax_charges_settings_pkey PRIMARY KEY (id)
);


-- ============================================================
--  [NEW] TABLES — OTP Authentication & Session Management
-- ============================================================


-- ────────────────────────────────────────────────────────────
--  [NEW] otp_verifications
--  One row per OTP send. Supports SMS and WhatsApp channels.
--  OTP stored as bcrypt hash — plain code is NEVER saved.
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id           uuid        NOT NULL DEFAULT gen_random_uuid(),
  phone        text        NOT NULL,
  otp_hash     text        NOT NULL,
  -- channel: sms = standard SMS, whatsapp = WhatsApp Business API
  channel      text        NOT NULL CHECK (channel IN ('sms', 'whatsapp')),
  purpose      text        NOT NULL DEFAULT 'login' CHECK (purpose IN ('login', 'verify')),
  expires_at   timestamptz NOT NULL DEFAULT (now() + interval '5 minutes'),
  attempts     integer     NOT NULL DEFAULT 0 CHECK (attempts >= 0 AND attempts <= 5),
  -- verified_at: set on success OR when invalidated by a resend (non-null = inactive)
  verified_at  timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT otp_verifications_pkey PRIMARY KEY (id)
);

-- Fast lookup: most recent OTP for a given phone number
CREATE INDEX IF NOT EXISTS idx_otp_phone_created
  ON public.otp_verifications (phone, created_at DESC);

-- Partial index: only rows still awaiting verification
CREATE INDEX IF NOT EXISTS idx_otp_phone_active
  ON public.otp_verifications (phone)
  WHERE verified_at IS NULL;
  -- Note: expiry filtering (expires_at > now()) is handled at query time, not in the index

COMMENT ON TABLE  public.otp_verifications             IS 'One row per OTP send event. Codes are bcrypt-hashed. Never stores plain text OTPs.';
COMMENT ON COLUMN public.otp_verifications.channel     IS 'sms = standard SMS via provider (MSG91/Fast2SMS). whatsapp = WhatsApp Business API (Interakt/WATI/Gupshup).';
COMMENT ON COLUMN public.otp_verifications.otp_hash    IS 'bcrypt hash of the 6-digit OTP. Plain code must never be logged or stored.';
COMMENT ON COLUMN public.otp_verifications.attempts    IS 'Incremented on each failed attempt. Locked out at 5.';
COMMENT ON COLUMN public.otp_verifications.verified_at IS 'Stamped immediately on success. Also stamped on resend to invalidate the old row.';


-- ────────────────────────────────────────────────────────────
--  [NEW] sessions
--  Tracks authenticated login sessions per user/device.
--  Used to keep users logged in across browser restarts.
--  Location confirmation is ALWAYS required regardless of session.
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.sessions (
  id              uuid        NOT NULL DEFAULT gen_random_uuid(),
  user_id         uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  device_info     jsonb,
  -- device_info shape: { "browser": "Chrome", "os": "Android", "device_type": "mobile", "user_agent": "..." }
  ip_address      text,
  last_active_at  timestamptz NOT NULL DEFAULT now(),
  expires_at      timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  created_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT sessions_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id
  ON public.sessions (user_id);

-- Index on expires_at for efficient session expiry filtering at query time
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at
  ON public.sessions (expires_at);

COMMENT ON TABLE  public.sessions                IS 'One row per authenticated session. Deleted on logout or expiry. Location confirmation required on every login regardless.';
COMMENT ON COLUMN public.sessions.device_info    IS 'JSON object: { browser, os, device_type, user_agent }';
COMMENT ON COLUMN public.sessions.last_active_at IS 'Updated on every authenticated API request (keep-alive ping).';
COMMENT ON COLUMN public.sessions.expires_at     IS 'Sessions expire after 30 days of no activity.';


-- ============================================================
--  ROW LEVEL SECURITY (RLS)
-- ============================================================

-- otp_verifications: backend service role only — never expose to frontend
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "otp_service_only" ON public.otp_verifications;
CREATE POLICY "otp_service_only"
  ON public.otp_verifications FOR ALL
  TO service_role USING (true);

-- sessions: users can read/delete their own; backend can do everything
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sessions_own_read"   ON public.sessions;
DROP POLICY IF EXISTS "sessions_own_delete" ON public.sessions;
DROP POLICY IF EXISTS "sessions_service_all" ON public.sessions;

CREATE POLICY "sessions_own_read"
  ON public.sessions FOR SELECT
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "sessions_own_delete"
  ON public.sessions FOR DELETE
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "sessions_service_all"
  ON public.sessions FOR ALL
  TO service_role USING (true);


-- ============================================================
--  HELPER FUNCTIONS
-- ============================================================

-- Returns the latest valid (unverified, unexpired, not locked) OTP for a phone
CREATE OR REPLACE FUNCTION public.get_active_otp(p_phone text)
RETURNS public.otp_verifications
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT * FROM public.otp_verifications
  WHERE  phone       = p_phone
    AND  verified_at IS NULL
    AND  expires_at  > now()
    AND  attempts    < 5
  ORDER  BY created_at DESC
  LIMIT  1;
$$;

-- Invalidates all pending OTPs for a phone before issuing a new one
CREATE OR REPLACE FUNCTION public.invalidate_otps(p_phone text)
RETURNS void
LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE public.otp_verifications
  SET    verified_at = now()
  WHERE  phone       = p_phone
    AND  verified_at IS NULL;
$$;

-- Confirms a delivery address (called after user taps "Confirm" on location screen)
-- source must be one of: 'gps', 'search', 'pincode', 'manual'
CREATE OR REPLACE FUNCTION public.confirm_address(
  p_address_id  uuid,
  p_user_id     uuid,
  p_source      text
)
RETURNS void
LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE public.addresses
  SET    confirmed_at = now(),
         source       = p_source
  WHERE  id      = p_address_id
    AND  user_id = p_user_id;
$$;

-- Housekeeping: removes expired sessions and OTP rows older than 24h
-- Schedule this daily via Supabase cron (pg_cron) or an Edge Function
CREATE OR REPLACE FUNCTION public.cleanup_expired_data()
RETURNS void
LANGUAGE sql SECURITY DEFINER AS $$
  DELETE FROM public.sessions
  WHERE expires_at < now();

  DELETE FROM public.otp_verifications
  WHERE created_at < now() - interval '24 hours';
$$;

COMMENT ON FUNCTION public.get_active_otp    IS 'Returns the latest usable OTP row for a phone. Returns NULL if expired, locked, or none exists.';
COMMENT ON FUNCTION public.invalidate_otps   IS 'Stamps verified_at = now() on all pending OTPs for a phone. Call before issuing a new OTP (resend).';
COMMENT ON FUNCTION public.confirm_address   IS 'Stamps confirmed_at and records source on an address row after user confirms location.';
COMMENT ON FUNCTION public.cleanup_expired_data IS 'Deletes expired sessions and old OTP rows. Schedule to run daily at low-traffic hours.';


-- ============================================================
--  OPTIONAL: pg_cron auto-cleanup (Supabase Pro / pg_cron only)
--  Uncomment if pg_cron is enabled on your project.
-- ============================================================

-- SELECT cron.schedule(
--   'cleanup-expired-data',
--   '0 3 * * *',
--   'SELECT public.cleanup_expired_data()'
-- );


-- ============================================================
--  VERIFICATION QUERIES
--  Run these after migration to confirm everything is in place.
--  All 4 queries should return rows.
-- ============================================================

-- 1. Confirm new columns on profiles
SELECT column_name, data_type, column_default
FROM   information_schema.columns
WHERE  table_schema = 'public' AND table_name = 'profiles'
  AND  column_name IN ('phone_verified', 'name_required_at_login');

-- 2. Confirm new columns on addresses
SELECT column_name, data_type
FROM   information_schema.columns
WHERE  table_schema = 'public' AND table_name = 'addresses'
  AND  column_name IN ('confirmed_at', 'source');

-- 3. Confirm new tables exist
SELECT table_name
FROM   information_schema.tables
WHERE  table_schema = 'public'
  AND  table_name IN ('otp_verifications', 'sessions');

-- 4. Confirm RLS is enabled on new tables
SELECT tablename, rowsecurity
FROM   pg_tables
WHERE  schemaname = 'public'
  AND  tablename IN ('otp_verifications', 'sessions');

-- 5. Confirm all original tables still exist
SELECT table_name
FROM   information_schema.tables
WHERE  table_schema = 'public'
ORDER  BY table_name;

-- ============================================================
--  Schema complete ✓
--  Total tables: 22 (20 original + 2 new)
--  Modified tables: profiles, addresses
--  New tables: otp_verifications, sessions
--  New functions: get_active_otp, invalidate_otps,
--                 confirm_address, cleanup_expired_data
-- ============================================================