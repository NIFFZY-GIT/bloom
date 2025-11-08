--
-- PostgreSQL database dump
--

\restrict O7VGsOYfZMgNQlA6KmFs9kEVA1ty5ZbJERM3vVhmwIsZbg3fmA3liQzhzqogQho

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-09 00:27:04

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 890 (class 1247 OID 17926)
-- Name: booking_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.booking_status AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED'
);


ALTER TYPE public.booking_status OWNER TO postgres;

--
-- TOC entry 884 (class 1247 OID 17894)
-- Name: tour_difficulty; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tour_difficulty AS ENUM (
    'Easy',
    'Moderate',
    'Challenging',
    'Expert'
);


ALTER TYPE public.tour_difficulty OWNER TO postgres;

--
-- TOC entry 878 (class 1247 OID 17868)
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- TOC entry 244 (class 1255 OID 17967)
-- Name: set_bookings_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_bookings_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_bookings_updated_at() OWNER TO postgres;

--
-- TOC entry 245 (class 1255 OID 18066)
-- Name: set_updated_at_custom_packages(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_updated_at_custom_packages() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_updated_at_custom_packages() OWNER TO postgres;

--
-- TOC entry 243 (class 1255 OID 17923)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 240 (class 1259 OID 18240)
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    image character varying(255) NOT NULL,
    color character varying(255) NOT NULL,
    "bgColor" character varying(255) NOT NULL,
    description text NOT NULL,
    animation character varying(255) NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 18239)
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Category_id_seq" OWNER TO postgres;

--
-- TOC entry 5164 (class 0 OID 0)
-- Dependencies: 239
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- TOC entry 242 (class 1259 OID 18256)
-- Name: Place; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Place" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    image character varying(255) NOT NULL,
    "categoryId" integer NOT NULL
);


ALTER TABLE public."Place" OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 18255)
-- Name: Place_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Place_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Place_id_seq" OWNER TO postgres;

--
-- TOC entry 5165 (class 0 OID 0)
-- Dependencies: 241
-- Name: Place_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Place_id_seq" OWNED BY public."Place".id;


--
-- TOC entry 230 (class 1259 OID 18095)
-- Name: booking_receipts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking_receipts (
    id integer NOT NULL,
    booking_id integer NOT NULL,
    file_url text NOT NULL,
    mime_type text,
    uploaded_at timestamp with time zone DEFAULT now() NOT NULL,
    uploaded_by text
);


ALTER TABLE public.booking_receipts OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 18094)
-- Name: booking_receipts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.booking_receipts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.booking_receipts_id_seq OWNER TO postgres;

--
-- TOC entry 5166 (class 0 OID 0)
-- Dependencies: 229
-- Name: booking_receipts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.booking_receipts_id_seq OWNED BY public.booking_receipts.id;


--
-- TOC entry 224 (class 1259 OID 17934)
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    package_id integer,
    user_id integer,
    customer_name character varying(255) NOT NULL,
    customer_email character varying(255) NOT NULL,
    customer_phone character varying(50),
    preferred_date date NOT NULL,
    number_of_guests integer NOT NULL,
    special_requests text,
    status public.booking_status DEFAULT 'PENDING'::public.booking_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    booking_reference character varying(64),
    payment_status text DEFAULT 'pending'::text NOT NULL,
    receipt_url text,
    receipt_uploaded_at timestamp with time zone,
    dietary_preferences text,
    food_allergies text,
    food_and_special_requests text,
    CONSTRAINT bookings_number_of_guests_check CHECK ((number_of_guests > 0))
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- TOC entry 5167 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN bookings.special_requests; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.bookings.special_requests IS 'Any other special requirements or requests';


--
-- TOC entry 5168 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN bookings.dietary_preferences; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.bookings.dietary_preferences IS 'Dietary preferences (e.g., vegetarian, vegan, halal, kosher)';


--
-- TOC entry 5169 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN bookings.food_allergies; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.bookings.food_allergies IS 'Food allergies and intolerances';


--
-- TOC entry 223 (class 1259 OID 17933)
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_id_seq OWNER TO postgres;

--
-- TOC entry 5170 (class 0 OID 0)
-- Dependencies: 223
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- TOC entry 238 (class 1259 OID 18218)
-- Name: custom_package_places; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.custom_package_places (
    custom_package_id uuid NOT NULL,
    place_id integer NOT NULL,
    display_order integer NOT NULL
);


ALTER TABLE public.custom_package_places OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 18201)
-- Name: custom_packages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.custom_packages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    total_duration_minutes integer,
    total_duration_label character varying(50),
    guests integer DEFAULT 1 NOT NULL,
    contact_email character varying(255) NOT NULL,
    contact_phone character varying(50),
    start_date date,
    end_date date,
    food_and_special_requests text,
    additional_info text,
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    quotation_pdf_path character varying(500)
);


ALTER TABLE public.custom_packages OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 17970)
-- Name: custom_places; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.custom_places (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    description text,
    image_path character varying(255),
    category character varying(40) NOT NULL,
    default_duration_minutes integer,
    base_price numeric(10,2) DEFAULT 0,
    location character varying(255),
    highlights text[],
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT custom_places_base_price_check CHECK ((base_price >= (0)::numeric)),
    CONSTRAINT custom_places_default_duration_minutes_check CHECK ((default_duration_minutes >= 0))
);


ALTER TABLE public.custom_places OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 17969)
-- Name: custom_places_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.custom_places_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.custom_places_id_seq OWNER TO postgres;

--
-- TOC entry 5171 (class 0 OID 0)
-- Dependencies: 225
-- Name: custom_places_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.custom_places_id_seq OWNED BY public.custom_places.id;


--
-- TOC entry 232 (class 1259 OID 18116)
-- Name: gallery_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gallery_items (
    id integer NOT NULL,
    category character varying(255) NOT NULL,
    image_path character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    description text
);


ALTER TABLE public.gallery_items OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 18115)
-- Name: gallery_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gallery_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gallery_items_id_seq OWNER TO postgres;

--
-- TOC entry 5172 (class 0 OID 0)
-- Dependencies: 231
-- Name: gallery_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gallery_items_id_seq OWNED BY public.gallery_items.id;


--
-- TOC entry 236 (class 1259 OID 18187)
-- Name: places; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.places (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    image_path character varying(255),
    category character varying(100),
    duration character varying(50),
    location character varying(255),
    highlights jsonb,
    price numeric(10,2) DEFAULT 0.00 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    gallery_images jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.places OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 18186)
-- Name: places_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.places_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.places_id_seq OWNER TO postgres;

--
-- TOC entry 5173 (class 0 OID 0)
-- Dependencies: 235
-- Name: places_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.places_id_seq OWNED BY public.places.id;


--
-- TOC entry 234 (class 1259 OID 18129)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "position" character varying(255),
    avatar character varying(255),
    rating numeric(2,1),
    text text NOT NULL,
    CONSTRAINT reviews_rating_check CHECK (((rating >= (0)::numeric) AND (rating <= (5)::numeric)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 18128)
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO postgres;

--
-- TOC entry 5174 (class 0 OID 0)
-- Dependencies: 233
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- TOC entry 228 (class 1259 OID 18071)
-- Name: tour_package_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tour_package_images (
    id integer NOT NULL,
    package_id integer NOT NULL,
    image_path character varying(255) NOT NULL,
    alt_text character varying(255),
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.tour_package_images OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 18070)
-- Name: tour_package_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tour_package_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tour_package_images_id_seq OWNER TO postgres;

--
-- TOC entry 5175 (class 0 OID 0)
-- Dependencies: 227
-- Name: tour_package_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tour_package_images_id_seq OWNED BY public.tour_package_images.id;


--
-- TOC entry 222 (class 1259 OID 17904)
-- Name: tour_packages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tour_packages (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    price numeric(10,2) NOT NULL,
    duration integer NOT NULL,
    image_path character varying(255),
    category character varying(100) NOT NULL,
    highlights jsonb,
    includes jsonb,
    difficulty public.tour_difficulty NOT NULL,
    rating numeric(3,2) DEFAULT 0.00,
    reviews integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tour_packages OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 17903)
-- Name: tour_packages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tour_packages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tour_packages_id_seq OWNER TO postgres;

--
-- TOC entry 5176 (class 0 OID 0)
-- Dependencies: 221
-- Name: tour_packages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tour_packages_id_seq OWNED BY public.tour_packages.id;


--
-- TOC entry 220 (class 1259 OID 17874)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role public.user_role DEFAULT 'USER'::public.user_role NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17873)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 5177 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4959 (class 2604 OID 18243)
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- TOC entry 4960 (class 2604 OID 18259)
-- Name: Place id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Place" ALTER COLUMN id SET DEFAULT nextval('public."Place_id_seq"'::regclass);


--
-- TOC entry 4945 (class 2604 OID 18098)
-- Name: booking_receipts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_receipts ALTER COLUMN id SET DEFAULT nextval('public.booking_receipts_id_seq'::regclass);


--
-- TOC entry 4934 (class 2604 OID 17937)
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- TOC entry 4939 (class 2604 OID 17973)
-- Name: custom_places id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_places ALTER COLUMN id SET DEFAULT nextval('public.custom_places_id_seq'::regclass);


--
-- TOC entry 4947 (class 2604 OID 18119)
-- Name: gallery_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery_items ALTER COLUMN id SET DEFAULT nextval('public.gallery_items_id_seq'::regclass);


--
-- TOC entry 4949 (class 2604 OID 18190)
-- Name: places id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.places ALTER COLUMN id SET DEFAULT nextval('public.places_id_seq'::regclass);


--
-- TOC entry 4948 (class 2604 OID 18132)
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- TOC entry 4942 (class 2604 OID 18074)
-- Name: tour_package_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_package_images ALTER COLUMN id SET DEFAULT nextval('public.tour_package_images_id_seq'::regclass);


--
-- TOC entry 4929 (class 2604 OID 17907)
-- Name: tour_packages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_packages ALTER COLUMN id SET DEFAULT nextval('public.tour_packages_id_seq'::regclass);


--
-- TOC entry 4926 (class 2604 OID 17877)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 5000 (class 2606 OID 18254)
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- TOC entry 5002 (class 2606 OID 18268)
-- Name: Place Place_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Place"
    ADD CONSTRAINT "Place_pkey" PRIMARY KEY (id);


--
-- TOC entry 4986 (class 2606 OID 18107)
-- Name: booking_receipts booking_receipts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_receipts
    ADD CONSTRAINT booking_receipts_pkey PRIMARY KEY (id);


--
-- TOC entry 4975 (class 2606 OID 17953)
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- TOC entry 4997 (class 2606 OID 18225)
-- Name: custom_package_places custom_package_places_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_package_places
    ADD CONSTRAINT custom_package_places_pkey PRIMARY KEY (custom_package_id, place_id);


--
-- TOC entry 4994 (class 2606 OID 18217)
-- Name: custom_packages custom_packages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_packages
    ADD CONSTRAINT custom_packages_pkey PRIMARY KEY (id);


--
-- TOC entry 4980 (class 2606 OID 17984)
-- Name: custom_places custom_places_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_places
    ADD CONSTRAINT custom_places_pkey PRIMARY KEY (id);


--
-- TOC entry 4988 (class 2606 OID 18127)
-- Name: gallery_items gallery_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery_items
    ADD CONSTRAINT gallery_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4992 (class 2606 OID 18200)
-- Name: places places_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.places
    ADD CONSTRAINT places_pkey PRIMARY KEY (id);


--
-- TOC entry 4990 (class 2606 OID 18140)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 4983 (class 2606 OID 18084)
-- Name: tour_package_images tour_package_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_package_images
    ADD CONSTRAINT tour_package_images_pkey PRIMARY KEY (id);


--
-- TOC entry 4972 (class 2606 OID 17922)
-- Name: tour_packages tour_packages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_packages
    ADD CONSTRAINT tour_packages_pkey PRIMARY KEY (id);


--
-- TOC entry 4966 (class 2606 OID 17892)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4968 (class 2606 OID 17888)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4970 (class 2606 OID 17890)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4984 (class 1259 OID 18113)
-- Name: booking_receipts_booking_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX booking_receipts_booking_id_idx ON public.booking_receipts USING btree (booking_id);


--
-- TOC entry 4973 (class 1259 OID 18093)
-- Name: bookings_booking_reference_uq; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX bookings_booking_reference_uq ON public.bookings USING btree (booking_reference);


--
-- TOC entry 4995 (class 1259 OID 18236)
-- Name: custom_package_places_custom_package_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX custom_package_places_custom_package_id_idx ON public.custom_package_places USING btree (custom_package_id);


--
-- TOC entry 4998 (class 1259 OID 18237)
-- Name: custom_package_places_place_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX custom_package_places_place_id_idx ON public.custom_package_places USING btree (place_id);


--
-- TOC entry 4976 (class 1259 OID 17964)
-- Name: idx_bookings_package_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_package_id ON public.bookings USING btree (package_id);


--
-- TOC entry 4977 (class 1259 OID 17966)
-- Name: idx_bookings_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_status ON public.bookings USING btree (status);


--
-- TOC entry 4978 (class 1259 OID 17965)
-- Name: idx_bookings_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_user_id ON public.bookings USING btree (user_id);


--
-- TOC entry 4981 (class 1259 OID 18090)
-- Name: idx_tour_package_images_package; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tour_package_images_package ON public.tour_package_images USING btree (package_id, sort_order);


--
-- TOC entry 5011 (class 2620 OID 17968)
-- Name: bookings trg_bookings_set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_bookings_set_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_bookings_updated_at();


--
-- TOC entry 5010 (class 2620 OID 17924)
-- Name: tour_packages update_tour_packages_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_tour_packages_updated_at BEFORE UPDATE ON public.tour_packages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5006 (class 2606 OID 18108)
-- Name: booking_receipts booking_receipts_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_receipts
    ADD CONSTRAINT booking_receipts_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- TOC entry 5003 (class 2606 OID 17954)
-- Name: bookings bookings_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.tour_packages(id) ON DELETE SET NULL;


--
-- TOC entry 5004 (class 2606 OID 17959)
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- TOC entry 5007 (class 2606 OID 18226)
-- Name: custom_package_places custom_package_places_custom_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_package_places
    ADD CONSTRAINT custom_package_places_custom_package_id_fkey FOREIGN KEY (custom_package_id) REFERENCES public.custom_packages(id) ON DELETE CASCADE;


--
-- TOC entry 5008 (class 2606 OID 18231)
-- Name: custom_package_places custom_package_places_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_package_places
    ADD CONSTRAINT custom_package_places_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(id) ON DELETE RESTRICT;


--
-- TOC entry 5009 (class 2606 OID 18269)
-- Name: Place fk_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Place"
    ADD CONSTRAINT fk_category FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON DELETE CASCADE;


--
-- TOC entry 5005 (class 2606 OID 18085)
-- Name: tour_package_images tour_package_images_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_package_images
    ADD CONSTRAINT tour_package_images_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.tour_packages(id) ON DELETE CASCADE;


-- Completed on 2025-11-09 00:27:04

--
-- PostgreSQL database dump complete
--

\unrestrict O7VGsOYfZMgNQlA6KmFs9kEVA1ty5ZbJERM3vVhmwIsZbg3fmA3liQzhzqogQho

