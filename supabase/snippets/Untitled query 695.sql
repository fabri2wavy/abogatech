SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict JgwSjX0S6g3NqravKUaUSyvEYzo41v07fwbO0PdScXhkyOKkcHpA2VeNSXVFbvD

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

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
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '1883a51d-a486-4572-958d-f8b2614f7531', '{"action":"user_signedup","actor_id":"b336b9ad-d774-4039-9f70-4b68d0df8b08","actor_username":"admin@iturri.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-03-16 20:13:28.566256+00', ''),
	('00000000-0000-0000-0000-000000000000', '594213e8-0fbd-4098-9714-8212ba6c31c6', '{"action":"login","actor_id":"b336b9ad-d774-4039-9f70-4b68d0df8b08","actor_username":"admin@iturri.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-16 20:13:28.586541+00', ''),
	('00000000-0000-0000-0000-000000000000', '2f77d493-6b48-400a-8b55-0f2e582d8a8e', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"admin@iturri.com","user_id":"b336b9ad-d774-4039-9f70-4b68d0df8b08","user_phone":""}}', '2026-03-16 20:26:52.998083+00', ''),
	('00000000-0000-0000-0000-000000000000', '5b69703d-9003-4606-a0a6-42e5b7b7c02c', '{"action":"user_signedup","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-03-16 20:27:06.595838+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd77be941-10ee-4f3d-b08e-2324c3442a2e', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-16 20:27:06.611284+00', ''),
	('00000000-0000-0000-0000-000000000000', '8434457a-56dd-4ab5-ba17-27705108940d', '{"action":"user_repeated_signup","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2026-03-16 20:36:03.045548+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd5a7752b-2b18-427b-a8a8-85ad4edc2231', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-16 20:36:13.388749+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd5cdb890-35aa-41cb-8816-4a097198f82c', '{"action":"user_signedup","actor_id":"5ba689b3-004a-4b97-addb-5f9db25fa7c7","actor_username":"arielfabriciotarquivillalba08@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-03-16 21:04:40.802771+00', ''),
	('00000000-0000-0000-0000-000000000000', '8b671d39-59cd-4467-b337-9e23ed14b98e', '{"action":"login","actor_id":"5ba689b3-004a-4b97-addb-5f9db25fa7c7","actor_username":"arielfabriciotarquivillalba08@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-16 21:04:40.827144+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ea1c2fe9-b813-43cc-a764-d016aafaf4e5', '{"action":"login","actor_id":"5ba689b3-004a-4b97-addb-5f9db25fa7c7","actor_username":"arielfabriciotarquivillalba08@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-16 21:04:43.081486+00', ''),
	('00000000-0000-0000-0000-000000000000', '51e393ae-746e-4f0c-a1dc-80896d31cebb', '{"action":"token_refreshed","actor_id":"5ba689b3-004a-4b97-addb-5f9db25fa7c7","actor_username":"arielfabriciotarquivillalba08@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-17 18:04:48.838191+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd27f4d48-3a5c-4a47-ad67-433ac70cfd9a', '{"action":"token_revoked","actor_id":"5ba689b3-004a-4b97-addb-5f9db25fa7c7","actor_username":"arielfabriciotarquivillalba08@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-17 18:04:48.848334+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e7823e02-aa1b-4afe-aad5-3046ed214484', '{"action":"user_signedup","actor_id":"a980bef3-bf65-43bc-a144-eeeebb6b3e0d","actor_username":"nuevo.cliente@iturri.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-03-17 18:05:15.959265+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f8e00677-486f-4566-991e-03c570260b65', '{"action":"login","actor_id":"a980bef3-bf65-43bc-a144-eeeebb6b3e0d","actor_username":"nuevo.cliente@iturri.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-17 18:05:15.983735+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd37d96aa-9852-4c0e-872c-d2215beda032', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"arielfabriciotarquivillalba08@gmail.com","user_id":"5ba689b3-004a-4b97-addb-5f9db25fa7c7","user_phone":""}}', '2026-03-17 18:10:46.682321+00', ''),
	('00000000-0000-0000-0000-000000000000', '238eaf1d-5fc1-44f7-8b3f-1c9e3fe203aa', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-17 18:15:25.388902+00', ''),
	('00000000-0000-0000-0000-000000000000', '4eeaece1-def2-4abc-9829-4e38687f53e5', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-17 18:20:51.174018+00', ''),
	('00000000-0000-0000-0000-000000000000', '0578978d-1089-4f87-bee3-9df2f06986c2', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-03-17 18:41:06.279613+00', ''),
	('00000000-0000-0000-0000-000000000000', '38f05907-f903-4efc-a432-33add3685a34', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-17 18:41:35.447421+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dd36296a-d818-4f02-bcaa-8c5656a30c19', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-03-17 18:41:41.690984+00', ''),
	('00000000-0000-0000-0000-000000000000', '1b28570d-b1ab-4dd2-b0ad-fa8e34e8c0c8', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-17 18:45:40.419792+00', ''),
	('00000000-0000-0000-0000-000000000000', '1f46d8b2-b364-4458-a823-64b2253bbd4e', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-03-17 18:47:47.126274+00', ''),
	('00000000-0000-0000-0000-000000000000', '731e7c0b-0d64-46c9-8d91-f412e258ffc7', '{"action":"login","actor_id":"a980bef3-bf65-43bc-a144-eeeebb6b3e0d","actor_username":"nuevo.cliente@iturri.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-17 18:48:54.013943+00', ''),
	('00000000-0000-0000-0000-000000000000', '2d4de1ad-2360-4edb-9a26-0283248218ba', '{"action":"logout","actor_id":"a980bef3-bf65-43bc-a144-eeeebb6b3e0d","actor_username":"nuevo.cliente@iturri.com","actor_via_sso":false,"log_type":"account"}', '2026-03-17 18:58:44.036428+00', ''),
	('00000000-0000-0000-0000-000000000000', '1f27994a-5aea-4e6c-9637-fc93e58e6397', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-17 19:26:13.502853+00', ''),
	('00000000-0000-0000-0000-000000000000', '80d125fb-edce-4f8d-b9d5-e3a2cf45661f', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-03-17 19:26:20.495634+00', ''),
	('00000000-0000-0000-0000-000000000000', 'edaabdc6-348d-4988-b202-aa84e561d1d6', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-17 19:41:37.327343+00', ''),
	('00000000-0000-0000-0000-000000000000', '1247282f-e3df-47c8-a775-17bd8f7d06f7', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-19 15:45:14.110853+00', ''),
	('00000000-0000-0000-0000-000000000000', '84968dd4-5527-4b14-ae32-7ec684197bf8', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-19 15:45:14.116222+00', ''),
	('00000000-0000-0000-0000-000000000000', '41076247-f767-42de-a402-c20f72d07041', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-19 15:45:14.349654+00', ''),
	('00000000-0000-0000-0000-000000000000', '095dfdb9-d8db-4ff4-8233-2a7c45d07bfb', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-03-19 16:02:08.684739+00', ''),
	('00000000-0000-0000-0000-000000000000', '06927985-b5e1-423d-a3c7-90170b006c5d', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-19 16:04:39.359936+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ab3830f7-a0ea-4923-b180-4adcc558d605', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-19 17:09:33.62135+00', ''),
	('00000000-0000-0000-0000-000000000000', '35419935-dfd8-449c-829e-21310876ed03', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-19 17:09:33.628747+00', ''),
	('00000000-0000-0000-0000-000000000000', '6f78b07d-b5f7-4393-b267-4d33ca557d4e', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-19 17:09:33.860101+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bc4d68fe-536e-4b29-b9b8-b56a434642a9', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-19 18:10:19.419242+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e5482718-4325-4066-bc7c-37799557a31d', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-19 18:10:19.428397+00', ''),
	('00000000-0000-0000-0000-000000000000', '1d35a56e-7bf8-4918-ac13-20430653b116', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-19 18:57:32.257266+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b39619fc-6910-4da2-baac-eb99d4c2489f', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-03-19 19:00:05.749074+00', ''),
	('00000000-0000-0000-0000-000000000000', '66380532-234d-4e6b-916c-73cdc6f70b7e', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-19 19:14:36.236318+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c3f27a9a-5e92-4503-abf3-bff5f0ff28ea', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-19 20:12:59.176907+00', ''),
	('00000000-0000-0000-0000-000000000000', '7cf615d6-a5c8-4821-8303-25991ccb9a06', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-19 20:12:59.191809+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a4a7dfa6-75fc-4188-828b-8a7d107d9567', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-19 20:26:29.402574+00', ''),
	('00000000-0000-0000-0000-000000000000', '8f28a74f-cbdd-457b-8e57-6cb4f9b7308d', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-19 20:29:46.878283+00', ''),
	('00000000-0000-0000-0000-000000000000', '6c7ab3e3-1e7e-47d7-a429-3a2e76298abb', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-03-19 20:43:01.748224+00', ''),
	('00000000-0000-0000-0000-000000000000', '93299232-59c9-4456-85ef-1b998af47b34', '{"action":"login","actor_id":"a980bef3-bf65-43bc-a144-eeeebb6b3e0d","actor_username":"nuevo.cliente@iturri.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-19 20:43:42.660793+00', ''),
	('00000000-0000-0000-0000-000000000000', '92c9e660-d424-4493-8f26-d7360749cf36', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-20 18:27:51.490325+00', ''),
	('00000000-0000-0000-0000-000000000000', '1c64ed03-7a6a-43b9-9e15-a25ce096cbe8', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-20 18:40:12.442778+00', ''),
	('00000000-0000-0000-0000-000000000000', '40b7935b-9c48-4d5a-8f35-bf9e3c027f97', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-20 19:06:17.794139+00', ''),
	('00000000-0000-0000-0000-000000000000', '8e48cae8-33c8-486f-9662-b8c365762bdb', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-20 20:07:46.984837+00', ''),
	('00000000-0000-0000-0000-000000000000', '7dc6f06f-2e00-432c-9c4d-4fc4c70e8519', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-20 20:07:46.99441+00', ''),
	('00000000-0000-0000-0000-000000000000', '75dae25f-fdab-4318-aebe-f29873093de0', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-23 18:02:02.448821+00', ''),
	('00000000-0000-0000-0000-000000000000', '0f1a4ac7-79b9-4ef1-932d-95b699288f9b', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-23 18:02:02.457205+00', ''),
	('00000000-0000-0000-0000-000000000000', '24ece279-98f2-4a4f-9069-ee28bd15be92', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-23 18:02:13.874124+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fdf85ce1-4df1-4592-9269-5318cc8c6d2e', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-23 18:16:40.005661+00', ''),
	('00000000-0000-0000-0000-000000000000', '75c3c660-ed4e-42a7-ad29-c711241ba7d1', '{"action":"token_refreshed","actor_id":"a980bef3-bf65-43bc-a144-eeeebb6b3e0d","actor_username":"nuevo.cliente@iturri.com","actor_via_sso":false,"log_type":"token"}', '2026-03-23 18:17:06.527475+00', ''),
	('00000000-0000-0000-0000-000000000000', '412fc7fa-36ee-435b-adde-6bc24a074751', '{"action":"token_revoked","actor_id":"a980bef3-bf65-43bc-a144-eeeebb6b3e0d","actor_username":"nuevo.cliente@iturri.com","actor_via_sso":false,"log_type":"token"}', '2026-03-23 18:17:06.531785+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f98abe58-c190-460d-a626-0fd525a052ae', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-03-23 19:13:58.208764+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dbc18f4a-07c1-4a7c-9817-b67473a8f48b', '{"action":"login","actor_id":"a980bef3-bf65-43bc-a144-eeeebb6b3e0d","actor_username":"nuevo.cliente@iturri.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-23 19:14:08.392291+00', ''),
	('00000000-0000-0000-0000-000000000000', '030eafd5-d261-48c0-8498-94c0130bc7fe', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-23 19:59:09.308402+00', ''),
	('00000000-0000-0000-0000-000000000000', '8ab4f12e-fd80-4d37-bf2c-d4c315b75772', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-03-23 19:59:32.278043+00', ''),
	('00000000-0000-0000-0000-000000000000', '477f832b-32c1-479c-9f04-ee2fe97cff3c', '{"action":"login","actor_id":"a980bef3-bf65-43bc-a144-eeeebb6b3e0d","actor_username":"nuevo.cliente@iturri.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-23 19:59:40.264617+00', ''),
	('00000000-0000-0000-0000-000000000000', '6797006b-661b-4ba7-a020-8e0bde853a59', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"ariel@iturri.com","user_id":"a6be4506-720d-4b53-b427-4c7f1c14a85e","user_phone":""}}', '2026-03-23 20:03:00.93975+00', ''),
	('00000000-0000-0000-0000-000000000000', '039f7988-aee0-4e22-a5bf-d26cd950cae8', '{"action":"login","actor_id":"a6be4506-720d-4b53-b427-4c7f1c14a85e","actor_username":"ariel@iturri.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-23 20:04:47.527095+00', ''),
	('00000000-0000-0000-0000-000000000000', '40d512ae-cce0-495f-bbe9-4369f727b80e', '{"action":"logout","actor_id":"a6be4506-720d-4b53-b427-4c7f1c14a85e","actor_username":"ariel@iturri.com","actor_via_sso":false,"log_type":"account"}', '2026-03-23 20:04:59.046103+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b93595be-8607-48e2-a263-1e9ae6207297', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-23 20:05:14.915024+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a36c2c8e-1e26-4b59-a6cd-7f8aef012e17', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-03-23 20:10:10.529273+00', ''),
	('00000000-0000-0000-0000-000000000000', '1ac9bd1d-041d-4528-a054-152253875410', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-23 20:17:14.770947+00', ''),
	('00000000-0000-0000-0000-000000000000', '2c32ec04-88d7-49c9-b662-d07576535988', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-03-23 20:17:18.570753+00', ''),
	('00000000-0000-0000-0000-000000000000', '916357e5-df8e-4118-8dfc-f241bf0f9a20', '{"action":"login","actor_id":"a6be4506-720d-4b53-b427-4c7f1c14a85e","actor_username":"ariel@iturri.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-23 20:17:30.545707+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a71a1186-dfbc-4b12-8038-7027d5b3a984', '{"action":"token_refreshed","actor_id":"a6be4506-720d-4b53-b427-4c7f1c14a85e","actor_username":"ariel@iturri.com","actor_via_sso":false,"log_type":"token"}', '2026-03-24 17:13:11.628419+00', ''),
	('00000000-0000-0000-0000-000000000000', '955f1b9f-406b-45c4-a043-26185261f4f5', '{"action":"token_revoked","actor_id":"a6be4506-720d-4b53-b427-4c7f1c14a85e","actor_username":"ariel@iturri.com","actor_via_sso":false,"log_type":"token"}', '2026-03-24 17:13:11.633789+00', ''),
	('00000000-0000-0000-0000-000000000000', '6db8dac7-c167-4382-964d-786c0d76e005', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-24 17:36:00.404784+00', ''),
	('00000000-0000-0000-0000-000000000000', '59284d71-c16c-4b5e-a782-802d49159702', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-24 18:02:38.396269+00', ''),
	('00000000-0000-0000-0000-000000000000', '600339b9-95d7-4ad9-9cc1-6340b31116cb', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-03-24 18:02:49.549782+00', ''),
	('00000000-0000-0000-0000-000000000000', '8f51cbc2-72d6-4157-935c-4d449f4069ba', '{"action":"login","actor_id":"a980bef3-bf65-43bc-a144-eeeebb6b3e0d","actor_username":"nuevo.cliente@iturri.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-24 18:02:55.923644+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd613b80b-df73-4562-add0-2f57cf594489', '{"action":"logout","actor_id":"a980bef3-bf65-43bc-a144-eeeebb6b3e0d","actor_username":"nuevo.cliente@iturri.com","actor_via_sso":false,"log_type":"account"}', '2026-03-24 18:03:20.967992+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ed668fe1-1015-40da-a514-f4dd42a68976', '{"action":"login","actor_id":"a6be4506-720d-4b53-b427-4c7f1c14a85e","actor_username":"ariel@iturri.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-24 18:03:41.129305+00', ''),
	('00000000-0000-0000-0000-000000000000', '102fd999-6611-4ca8-961d-ba3bca644e7b', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-24 18:20:19.046773+00', ''),
	('00000000-0000-0000-0000-000000000000', '07bb9f2c-bdca-47b6-9bf5-db85f882269d', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-24 18:32:06.201917+00', ''),
	('00000000-0000-0000-0000-000000000000', '51c63441-db7d-420c-b402-642e744bc95f', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-03-24 18:32:41.269398+00', ''),
	('00000000-0000-0000-0000-000000000000', '2eec452b-a89d-4efa-a110-66cb0d17ad4b', '{"action":"login","actor_id":"a6be4506-720d-4b53-b427-4c7f1c14a85e","actor_username":"ariel@iturri.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-24 18:32:49.881018+00', ''),
	('00000000-0000-0000-0000-000000000000', '0c04a0bb-a463-439c-b312-bdc68be49c9f', '{"action":"logout","actor_id":"a6be4506-720d-4b53-b427-4c7f1c14a85e","actor_username":"ariel@iturri.com","actor_via_sso":false,"log_type":"account"}', '2026-03-24 18:38:39.793758+00', ''),
	('00000000-0000-0000-0000-000000000000', '9e107044-39c2-4692-b55e-a4257491c581', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-24 18:38:46.062042+00', ''),
	('00000000-0000-0000-0000-000000000000', '92c36881-0977-45b6-9141-687826514a2c', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-24 19:32:16.755207+00', ''),
	('00000000-0000-0000-0000-000000000000', '9c1d2ac9-9028-478f-8263-eb6742b45c31', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-03-24 19:38:09.352244+00', ''),
	('00000000-0000-0000-0000-000000000000', '23648cbf-72a3-4c09-b10b-cc0b608a8759', '{"action":"login","actor_id":"a980bef3-bf65-43bc-a144-eeeebb6b3e0d","actor_username":"nuevo.cliente@iturri.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-24 19:38:17.568427+00', ''),
	('00000000-0000-0000-0000-000000000000', '7ee43db8-9659-43b9-9045-d99604c0ebb7', '{"action":"logout","actor_id":"a980bef3-bf65-43bc-a144-eeeebb6b3e0d","actor_username":"nuevo.cliente@iturri.com","actor_via_sso":false,"log_type":"account"}', '2026-03-24 19:38:23.91216+00', ''),
	('00000000-0000-0000-0000-000000000000', '0126d44a-76de-4fa3-af00-21cdfafd1eda', '{"action":"login","actor_id":"a6be4506-720d-4b53-b427-4c7f1c14a85e","actor_username":"ariel@iturri.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-24 19:38:33.36404+00', ''),
	('00000000-0000-0000-0000-000000000000', '9249b643-7462-4e51-ae5b-a5e3d388cc3b', '{"action":"logout","actor_id":"a6be4506-720d-4b53-b427-4c7f1c14a85e","actor_username":"ariel@iturri.com","actor_via_sso":false,"log_type":"account"}', '2026-03-24 19:38:40.014107+00', ''),
	('00000000-0000-0000-0000-000000000000', '21d2776b-7c18-4e8f-88f3-fc9b0aaf2467', '{"action":"login","actor_id":"a980bef3-bf65-43bc-a144-eeeebb6b3e0d","actor_username":"nuevo.cliente@iturri.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-24 19:38:47.250632+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f34ecc90-8dfe-41db-95f6-e0d4830ace65', '{"action":"logout","actor_id":"a980bef3-bf65-43bc-a144-eeeebb6b3e0d","actor_username":"nuevo.cliente@iturri.com","actor_via_sso":false,"log_type":"account"}', '2026-03-24 19:57:09.357307+00', ''),
	('00000000-0000-0000-0000-000000000000', '62b27b18-cb78-43b2-8dd8-e5791f48840f', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-24 19:57:14.363986+00', ''),
	('00000000-0000-0000-0000-000000000000', '38abd20b-77dd-4139-bc6f-6fee4a9a80fd', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-24 19:57:20.460199+00', ''),
	('00000000-0000-0000-0000-000000000000', '8639bfd4-d37b-4a5f-946c-817e872d56c7', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-03-24 19:57:25.177263+00', ''),
	('00000000-0000-0000-0000-000000000000', '71e5299a-11f2-4907-a2ef-cfe6a8f3b148', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-24 19:57:29.752145+00', ''),
	('00000000-0000-0000-0000-000000000000', '82c0d37e-334b-4f9c-b5b5-c33b65586a3b', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"sguevara@iturri.com","user_id":"1c66a1b9-7d8a-42da-8709-43a692bdc5fc","user_phone":""}}', '2026-03-24 20:24:32.716703+00', ''),
	('00000000-0000-0000-0000-000000000000', '817fc2ec-72ae-4cac-a7ed-afe9081bc8ee', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-24 21:01:50.549313+00', ''),
	('00000000-0000-0000-0000-000000000000', '63628fd7-30a8-4a9c-bbb4-ea581b749328', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-24 21:01:50.558035+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b2d7603b-e125-4337-8d93-cb6891895af7', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-27 18:29:18.762593+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c27c2f04-3c2d-44c2-90fa-99b071281d7b', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-27 18:29:18.775614+00', ''),
	('00000000-0000-0000-0000-000000000000', '2c5117b2-8033-49f0-9bfa-dd7bfe8fd9da', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-27 18:29:23.638756+00', ''),
	('00000000-0000-0000-0000-000000000000', '80e9c9af-3195-4935-93ad-3ab57f57f764', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"gguevara@gmai.com","user_id":"3920f491-a451-4190-88f0-324d1094fa9d","user_phone":""}}', '2026-03-27 18:55:51.349751+00', ''),
	('00000000-0000-0000-0000-000000000000', '95edea46-7b6c-4f9c-9c2b-d55d893c2a6e', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-03-27 19:07:53.619681+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cf67b621-7ec9-46a8-a05c-4c32a023ca30', '{"action":"login","actor_id":"a6be4506-720d-4b53-b427-4c7f1c14a85e","actor_username":"ariel@iturri.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-27 19:08:05.118229+00', ''),
	('00000000-0000-0000-0000-000000000000', '40dda79c-b6d5-49ff-ad13-e4477cdb183a', '{"action":"logout","actor_id":"a6be4506-720d-4b53-b427-4c7f1c14a85e","actor_username":"ariel@iturri.com","actor_via_sso":false,"log_type":"account"}', '2026-03-27 19:08:11.780329+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b122db97-3fd0-45c8-a7ca-651a9fb5381b', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-27 19:08:16.715626+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a76bc2ca-149b-4e84-b4b7-1441b525d172', '{"action":"user_signedup","actor_id":"2a938e7f-a1e1-44ff-8770-3f3187ab86cc","actor_username":"admin@iturri.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-03-27 19:36:45.599099+00', ''),
	('00000000-0000-0000-0000-000000000000', '826b790f-d1c2-43cf-85cf-087079af157e', '{"action":"login","actor_id":"2a938e7f-a1e1-44ff-8770-3f3187ab86cc","actor_username":"admin@iturri.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-27 19:36:45.664983+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dd9b8bf4-ac25-4630-b443-3ddb2106fca7', '{"action":"login","actor_id":"2a938e7f-a1e1-44ff-8770-3f3187ab86cc","actor_username":"admin@iturri.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-27 19:37:02.842966+00', ''),
	('00000000-0000-0000-0000-000000000000', '0387207c-02ee-4222-833c-ebab10e2cad2', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-27 20:12:21.671507+00', ''),
	('00000000-0000-0000-0000-000000000000', '0a15d7c7-f511-4775-9547-9b3cadd66605', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-27 20:12:21.684657+00', ''),
	('00000000-0000-0000-0000-000000000000', '220989cb-4f52-4edd-bbdd-1de5caedc495', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-30 18:21:11.491045+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dbda926d-384b-401d-ab4f-820672aefd28', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-30 18:21:11.498026+00', ''),
	('00000000-0000-0000-0000-000000000000', '5c4e4ea7-0d38-4323-b8d4-8cd79842be66', '{"action":"token_refreshed","actor_id":"2a938e7f-a1e1-44ff-8770-3f3187ab86cc","actor_username":"admin@iturri.com","actor_via_sso":false,"log_type":"token"}', '2026-03-30 19:01:14.430356+00', ''),
	('00000000-0000-0000-0000-000000000000', '0fa6c4b2-dbbf-41d7-99ce-3d80771e394a', '{"action":"token_revoked","actor_id":"2a938e7f-a1e1-44ff-8770-3f3187ab86cc","actor_username":"admin@iturri.com","actor_via_sso":false,"log_type":"token"}', '2026-03-30 19:01:14.459013+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c2628b58-fd70-4941-a26c-d400854c064e', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-30 19:20:23.922672+00', ''),
	('00000000-0000-0000-0000-000000000000', '2a1a6489-6539-4bb6-8f20-090246c44fb6', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-30 19:20:23.927526+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ae0b4d98-4273-4846-bff6-28c7c8b9b90d', '{"action":"user_signedup","actor_id":"36afd55b-1651-44fb-bd7f-f9842df89ff0","actor_username":"rhuanca@abogados.bo","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-03-30 19:49:50.063906+00', ''),
	('00000000-0000-0000-0000-000000000000', 'edb2ac58-df5a-4977-84a6-1ce213006af5', '{"action":"login","actor_id":"36afd55b-1651-44fb-bd7f-f9842df89ff0","actor_username":"rhuanca@abogados.bo","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-30 19:49:50.085059+00', ''),
	('00000000-0000-0000-0000-000000000000', '9a965c57-4ea0-4ac3-b4fb-e83b3911e33c', '{"action":"user_repeated_signup","actor_id":"36afd55b-1651-44fb-bd7f-f9842df89ff0","actor_username":"rhuanca@abogados.bo","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2026-03-30 19:49:52.745945+00', ''),
	('00000000-0000-0000-0000-000000000000', '0dc9c235-e516-451e-bb6b-a57938395c12', '{"action":"user_repeated_signup","actor_id":"36afd55b-1651-44fb-bd7f-f9842df89ff0","actor_username":"rhuanca@abogados.bo","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2026-03-30 19:49:54.820473+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a3e8932e-3084-455c-8a81-2ae9f6b0aeb5', '{"action":"user_repeated_signup","actor_id":"36afd55b-1651-44fb-bd7f-f9842df89ff0","actor_username":"rhuanca@abogados.bo","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2026-03-30 19:49:55.898836+00', ''),
	('00000000-0000-0000-0000-000000000000', '13b842df-3f0e-4d71-8077-ffedbce02f77', '{"action":"user_repeated_signup","actor_id":"36afd55b-1651-44fb-bd7f-f9842df89ff0","actor_username":"rhuanca@abogados.bo","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2026-03-30 19:49:56.445498+00', ''),
	('00000000-0000-0000-0000-000000000000', '6161d9c3-bfe0-4799-b787-1f37a6ae7d27', '{"action":"user_repeated_signup","actor_id":"36afd55b-1651-44fb-bd7f-f9842df89ff0","actor_username":"rhuanca@abogados.bo","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2026-03-30 19:51:47.849823+00', ''),
	('00000000-0000-0000-0000-000000000000', '0885c5e6-1580-48f8-839f-08ef91e32729', '{"action":"logout","actor_id":"36afd55b-1651-44fb-bd7f-f9842df89ff0","actor_username":"rhuanca@abogados.bo","actor_via_sso":false,"log_type":"account"}', '2026-03-30 19:58:06.222345+00', ''),
	('00000000-0000-0000-0000-000000000000', '89567e86-08a4-422c-847b-cb484b0bd695', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-30 19:58:12.742718+00', ''),
	('00000000-0000-0000-0000-000000000000', '7d901df3-09dd-4d00-a60c-b906cb022242', '{"action":"user_signedup","actor_id":"464ed384-c5d4-4601-afaa-b6055f258db1","actor_username":"acuellar@abogados.bo","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-03-30 19:59:35.620805+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ade5af5d-5d3f-4137-8371-68315b88dcc3', '{"action":"login","actor_id":"464ed384-c5d4-4601-afaa-b6055f258db1","actor_username":"acuellar@abogados.bo","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-30 19:59:35.636072+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac3b563a-8321-42b4-8ab9-6df49c563abd', '{"action":"token_refreshed","actor_id":"2a938e7f-a1e1-44ff-8770-3f3187ab86cc","actor_username":"admin@iturri.com","actor_via_sso":false,"log_type":"token"}', '2026-03-30 20:08:31.741884+00', ''),
	('00000000-0000-0000-0000-000000000000', '4a9233db-8750-4124-b478-0c2eebe03a26', '{"action":"token_revoked","actor_id":"2a938e7f-a1e1-44ff-8770-3f3187ab86cc","actor_username":"admin@iturri.com","actor_via_sso":false,"log_type":"token"}', '2026-03-30 20:08:31.760605+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd38c3e22-809f-4f56-bd0b-b039ab71bedf', '{"action":"user_signedup","actor_id":"37f59c3a-a308-496c-818e-8ecd7c60235a","actor_username":"this_will_fail@test.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-03-30 20:10:45.407754+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cb5397cb-a785-4490-9048-e334e3639b39', '{"action":"login","actor_id":"37f59c3a-a308-496c-818e-8ecd7c60235a","actor_username":"this_will_fail@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-30 20:10:45.447064+00', ''),
	('00000000-0000-0000-0000-000000000000', '6ae800a3-0f02-4074-a31c-3e2c788c73af', '{"action":"user_signedup","actor_id":"3fdfc7be-d9d5-4146-adae-4cf042df5f0e","actor_username":"acabrera@abogados.bo","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-03-30 20:13:44.257175+00', ''),
	('00000000-0000-0000-0000-000000000000', '3456449f-1c5c-43b2-ae17-f6c9eb3077b0', '{"action":"login","actor_id":"3fdfc7be-d9d5-4146-adae-4cf042df5f0e","actor_username":"acabrera@abogados.bo","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-30 20:13:44.273442+00', ''),
	('00000000-0000-0000-0000-000000000000', '9922f850-2b2b-4424-9649-404548f3643a', '{"action":"logout","actor_id":"3fdfc7be-d9d5-4146-adae-4cf042df5f0e","actor_username":"acabrera@abogados.bo","actor_via_sso":false,"log_type":"account"}', '2026-03-30 20:14:17.184394+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f0d70160-5127-4c82-9a9e-b0e171e5f4d0', '{"action":"login","actor_id":"3fdfc7be-d9d5-4146-adae-4cf042df5f0e","actor_username":"acabrera@abogados.bo","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-30 20:14:27.050862+00', ''),
	('00000000-0000-0000-0000-000000000000', '7519fbfa-22f5-48ed-8f44-dbb3db078a07', '{"action":"logout","actor_id":"3fdfc7be-d9d5-4146-adae-4cf042df5f0e","actor_username":"acabrera@abogados.bo","actor_via_sso":false,"log_type":"account"}', '2026-03-30 20:14:31.46959+00', ''),
	('00000000-0000-0000-0000-000000000000', '5e7705dc-0b3d-464e-bafd-0089e278e782', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-30 20:14:41.692961+00', ''),
	('00000000-0000-0000-0000-000000000000', '245dd8b4-d8f6-421e-8288-0ac6f61c6add', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"rhuanca@abogados.bo","user_id":"36afd55b-1651-44fb-bd7f-f9842df89ff0","user_phone":""}}', '2026-03-30 20:17:48.455596+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b8e9f881-388f-46f4-a185-8921e5f7d713', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"acuellar@abogados.bo","user_id":"464ed384-c5d4-4601-afaa-b6055f258db1","user_phone":""}}', '2026-03-30 20:17:48.455565+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f4d4e391-6fd1-40e2-8071-a0d67dbb6ae9', '{"action":"user_signedup","actor_id":"f4ba47fc-50e4-4c29-8254-f42b2850267e","actor_username":"ntguevara@abogados.bo","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-03-30 20:19:30.335005+00', ''),
	('00000000-0000-0000-0000-000000000000', '28ae21b7-fb6e-49db-9729-a7310578276b', '{"action":"login","actor_id":"f4ba47fc-50e4-4c29-8254-f42b2850267e","actor_username":"ntguevara@abogados.bo","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-30 20:19:30.349359+00', ''),
	('00000000-0000-0000-0000-000000000000', '68d8cc21-68e2-4f38-b3ab-5a18ab549134', '{"action":"user_signedup","actor_id":"c387d1ec-7049-4eca-82fd-e69b7f52384b","actor_username":"dvillalobos@abogados.bo","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-03-30 20:20:06.976599+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c90b4ca5-56f5-42e8-ae9b-73e92014d2ad', '{"action":"login","actor_id":"c387d1ec-7049-4eca-82fd-e69b7f52384b","actor_username":"dvillalobos@abogados.bo","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-30 20:20:06.996913+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e7345341-2c90-47ca-876f-9a20d0cd4578', '{"action":"logout","actor_id":"c387d1ec-7049-4eca-82fd-e69b7f52384b","actor_username":"dvillalobos@abogados.bo","actor_via_sso":false,"log_type":"account"}', '2026-03-30 20:22:24.773605+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cca814ac-0e92-412f-b489-0689104cb71a', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-30 20:23:38.235413+00', ''),
	('00000000-0000-0000-0000-000000000000', '15692e9c-2eda-45e9-b867-28654f71f78a', '{"action":"user_signedup","actor_id":"d46304ca-edd8-4b8d-b814-6e58f9150e8c","actor_username":"acuellar@abogados.bo","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-03-30 20:41:01.408174+00', ''),
	('00000000-0000-0000-0000-000000000000', '8ee80e1b-bb4e-4d69-aaab-156398130bad', '{"action":"login","actor_id":"d46304ca-edd8-4b8d-b814-6e58f9150e8c","actor_username":"acuellar@abogados.bo","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-30 20:41:01.423981+00', ''),
	('00000000-0000-0000-0000-000000000000', '0b7b3bac-3dac-4d85-87d5-97a52e00906d', '{"action":"logout","actor_id":"d46304ca-edd8-4b8d-b814-6e58f9150e8c","actor_username":"acuellar@abogados.bo","actor_via_sso":false,"log_type":"account"}', '2026-03-30 20:46:57.399526+00', ''),
	('00000000-0000-0000-0000-000000000000', '9feb5d10-b2be-4922-85ca-aa8cfb348760', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-30 20:47:21.352095+00', ''),
	('00000000-0000-0000-0000-000000000000', '55aa5512-29ef-4fd7-9400-9cfa2d0898ae', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"lvillalba@abogados.bo","user_id":"ce13d0c2-fb10-4729-a626-06a2980a01ad","user_phone":""}}', '2026-03-30 20:48:17.203932+00', ''),
	('00000000-0000-0000-0000-000000000000', '70859c73-4df8-45b1-95f0-96525622b14d', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"acabrera@abogados.bo","user_id":"3fdfc7be-d9d5-4146-adae-4cf042df5f0e","user_phone":""}}', '2026-03-30 20:50:23.575511+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a0207255-2cf1-443e-b31b-b729afd5660f', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-06 19:59:30.467557+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bc32f693-f977-4d27-ad5a-2c22e874dfa4', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"dvillalobos@abogados.bo","user_id":"c387d1ec-7049-4eca-82fd-e69b7f52384b","user_phone":""}}', '2026-03-30 20:50:23.578617+00', ''),
	('00000000-0000-0000-0000-000000000000', '108e1fa2-18e2-4d3e-90d8-4206643bd0e7', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"ntguevara@abogados.bo","user_id":"f4ba47fc-50e4-4c29-8254-f42b2850267e","user_phone":""}}', '2026-03-30 20:50:23.582661+00', ''),
	('00000000-0000-0000-0000-000000000000', '4bca67e7-6b24-4ba5-940e-e16a8c76a9af', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"acuellar@abogados.bo","user_id":"d46304ca-edd8-4b8d-b814-6e58f9150e8c","user_phone":""}}', '2026-03-30 20:50:23.585116+00', ''),
	('00000000-0000-0000-0000-000000000000', '8c108640-1de1-4276-9ce1-d4689b95b511', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"lvillalba@abogados.bo","user_id":"ce13d0c2-fb10-4729-a626-06a2980a01ad","user_phone":""}}', '2026-03-30 20:50:23.590356+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b48f677a-56be-48c5-a5db-bf5707b9827c', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"this_will_fail@test.com","user_id":"37f59c3a-a308-496c-818e-8ecd7c60235a","user_phone":""}}', '2026-03-30 20:50:23.711058+00', ''),
	('00000000-0000-0000-0000-000000000000', 'af05c6f7-c14e-454e-9924-e51619bf0c81', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-30 20:51:28.899568+00', ''),
	('00000000-0000-0000-0000-000000000000', '88995f54-24c5-4474-90b5-9e4b2176a2f1', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"admin@iturri.com","user_id":"2a938e7f-a1e1-44ff-8770-3f3187ab86cc","user_phone":""}}', '2026-03-30 20:51:53.824266+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fbf6b547-0a32-4940-9242-f9dbd3ed7430', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"nuevo.cliente@iturri.com","user_id":"a980bef3-bf65-43bc-a144-eeeebb6b3e0d","user_phone":""}}', '2026-03-30 20:53:21.008067+00', ''),
	('00000000-0000-0000-0000-000000000000', '6954ac3c-face-4bee-a19a-67ec458ffb8e', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"gguevara@gmai.com","user_id":"3920f491-a451-4190-88f0-324d1094fa9d","user_phone":""}}', '2026-03-30 20:53:21.007901+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd2e9aaaf-85ab-47ff-8039-cf4c9076ae53', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"sguevara@iturri.com","user_id":"1c66a1b9-7d8a-42da-8709-43a692bdc5fc","user_phone":""}}', '2026-03-30 20:53:21.00767+00', ''),
	('00000000-0000-0000-0000-000000000000', '49b5a552-3348-4573-ad54-40cf1fa822b8', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"nguevara@abogados.bo","user_id":"6251f6be-0b58-4e65-bc74-6c1f894d459a","user_phone":""}}', '2026-03-30 20:55:11.732997+00', ''),
	('00000000-0000-0000-0000-000000000000', '665a922d-72fb-4f48-8920-bf56ce6878bc', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-03-30 20:57:00.254984+00', ''),
	('00000000-0000-0000-0000-000000000000', '9d449154-d0fc-48fc-bd64-bcefaea3c707', '{"action":"login","actor_id":"6251f6be-0b58-4e65-bc74-6c1f894d459a","actor_username":"nguevara@abogados.bo","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-30 20:57:13.874099+00', ''),
	('00000000-0000-0000-0000-000000000000', '828af5db-d49c-458f-9613-3bb2a71dd3fb', '{"action":"user_recovery_requested","actor_id":"6251f6be-0b58-4e65-bc74-6c1f894d459a","actor_username":"nguevara@abogados.bo","actor_via_sso":false,"log_type":"user"}', '2026-03-30 20:57:26.818536+00', ''),
	('00000000-0000-0000-0000-000000000000', '577b385d-4f1d-46ba-942d-ab706b514283', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-30 20:57:53.37076+00', ''),
	('00000000-0000-0000-0000-000000000000', '455ef016-5524-4412-ada7-4b43e09e8378', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"sergioguevarab@gmail.com","user_id":"9dae0f89-d722-4a8d-9fb3-65b16bbe9847","user_phone":""}}', '2026-03-30 20:58:32.921978+00', ''),
	('00000000-0000-0000-0000-000000000000', '31c20a7c-fb32-4597-b8ea-76a88638798f', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-03-30 20:58:37.473399+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dbb0e128-acec-47d5-94b2-1c1d30e9fa6d', '{"action":"login","actor_id":"9dae0f89-d722-4a8d-9fb3-65b16bbe9847","actor_username":"sergioguevarab@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-30 20:58:41.483562+00', ''),
	('00000000-0000-0000-0000-000000000000', '95e023f5-57ff-475b-bfcd-a7b66865a91e', '{"action":"logout","actor_id":"9dae0f89-d722-4a8d-9fb3-65b16bbe9847","actor_username":"sergioguevarab@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-03-30 20:58:48.924044+00', ''),
	('00000000-0000-0000-0000-000000000000', '7c0cbb1d-c19b-4ed3-a2bc-2d81ae97d83d', '{"action":"login","actor_id":"6251f6be-0b58-4e65-bc74-6c1f894d459a","actor_username":"nguevara@abogados.bo","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-30 20:58:59.081091+00', ''),
	('00000000-0000-0000-0000-000000000000', '07e94589-b08e-4a01-b47c-db3a42681a49', '{"action":"token_refreshed","actor_id":"6251f6be-0b58-4e65-bc74-6c1f894d459a","actor_username":"nguevara@abogados.bo","actor_via_sso":false,"log_type":"token"}', '2026-03-31 17:25:32.326096+00', ''),
	('00000000-0000-0000-0000-000000000000', '8a1155bb-6815-4410-852b-517bca73d89b', '{"action":"token_revoked","actor_id":"6251f6be-0b58-4e65-bc74-6c1f894d459a","actor_username":"nguevara@abogados.bo","actor_via_sso":false,"log_type":"token"}', '2026-03-31 17:25:32.34276+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e5af82b1-b266-4d65-90dc-c3075ff40c95', '{"action":"logout","actor_id":"6251f6be-0b58-4e65-bc74-6c1f894d459a","actor_username":"nguevara@abogados.bo","actor_via_sso":false,"log_type":"account"}', '2026-03-31 17:25:43.190271+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ec1b61d1-5da7-450d-87fa-d54e3ce51d12', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-03-31 17:25:48.838692+00', ''),
	('00000000-0000-0000-0000-000000000000', '2ac1e7be-0b7a-487a-9eb6-c2c9879d47fe', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-31 18:25:55.314441+00', ''),
	('00000000-0000-0000-0000-000000000000', '87ff1e78-61f4-4c40-88de-f77b6edab2b4', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-31 18:25:55.331115+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f0048453-c382-4daa-a9b7-9c031766cc12', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"nt@abogados.bo","user_id":"6c3fa5cd-710b-45a5-95f6-fd02b89367ca","user_phone":""}}', '2026-03-31 19:07:15.651233+00', ''),
	('00000000-0000-0000-0000-000000000000', '949e843f-2c38-4c0e-a03b-b61e17b3691d', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"nt@abogados.bo","user_id":"6c3fa5cd-710b-45a5-95f6-fd02b89367ca","user_phone":""}}', '2026-03-31 19:17:46.804042+00', ''),
	('00000000-0000-0000-0000-000000000000', '39cbab56-e667-4f74-9afd-eded9b0a45a6', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"nt@abogados.bo","user_id":"ec6325d1-96be-4c02-8c5a-5c3d879bd868","user_phone":""}}', '2026-03-31 19:18:16.209863+00', ''),
	('00000000-0000-0000-0000-000000000000', '8392cb72-10fb-4d95-947f-e8ca9714f319', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"nt@abogados.bo","user_id":"ec6325d1-96be-4c02-8c5a-5c3d879bd868","user_phone":""}}', '2026-03-31 19:18:59.935353+00', ''),
	('00000000-0000-0000-0000-000000000000', '4964a91e-fed8-4b3e-9098-4d70b0cf7301', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"nt@abogados.bo","user_id":"573ca906-336d-492c-87f1-a4b263665f11","user_phone":""}}', '2026-03-31 19:20:45.441117+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fd7d4206-68a8-4578-85fa-db1dd68076be', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-31 19:28:04.189248+00', ''),
	('00000000-0000-0000-0000-000000000000', '191349db-381f-45aa-ad0e-536226a15ee9', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-31 19:28:04.200515+00', ''),
	('00000000-0000-0000-0000-000000000000', '3cf72a93-82d2-4e49-8f47-e43be7f1b61b', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"nt@abogados.bo","user_id":"573ca906-336d-492c-87f1-a4b263665f11","user_phone":""}}', '2026-03-31 19:28:30.517082+00', ''),
	('00000000-0000-0000-0000-000000000000', '39c2db2e-dcd7-4c2c-8adc-cabe6be972a2', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"rsanchez@abogados.bo","user_id":"0311dc47-d6b3-47f1-8ee4-3bb0f03151fa","user_phone":""}}', '2026-03-31 19:29:24.303735+00', ''),
	('00000000-0000-0000-0000-000000000000', '3e5e6e25-4266-439a-9e4e-b900ca5f1ca1', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-06 19:59:30.481212+00', ''),
	('00000000-0000-0000-0000-000000000000', '973b5a1d-6b7a-4b0a-9be1-a8ed89434cad', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"rsanchez@abogados.bo","user_id":"0311dc47-d6b3-47f1-8ee4-3bb0f03151fa","user_phone":""}}', '2026-03-31 19:45:44.363423+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f20c6633-52a3-4c28-a6b7-172fcbd39355', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"rsanchez@abogados.bo","user_id":"59f38c42-e6c8-4ffa-80a0-4ca243fb518c","user_phone":""}}', '2026-03-31 19:46:03.78079+00', ''),
	('00000000-0000-0000-0000-000000000000', '6228fdd4-683e-48a6-86b1-c9e17011326e', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-31 20:53:09.576121+00', ''),
	('00000000-0000-0000-0000-000000000000', '203e0a85-f3cd-4cd2-abbe-9519d50bc09d', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-03-31 20:53:09.594255+00', ''),
	('00000000-0000-0000-0000-000000000000', '0f511f93-4779-43a7-be8f-78ac30e6204c', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-01 17:14:17.550899+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bd0e7523-b5ce-41b4-994b-6740f1fcad03', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-01 17:14:17.608601+00', ''),
	('00000000-0000-0000-0000-000000000000', '9f4150a7-0eb6-4314-a577-3d14239d9303', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-01 17:14:22.875896+00', ''),
	('00000000-0000-0000-0000-000000000000', '8112be74-0142-4146-9275-7e9cb185a8f4', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-01 19:57:38.456082+00', ''),
	('00000000-0000-0000-0000-000000000000', '56587c56-c3a4-4e5a-8c11-cc9ce1481ff1', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-01 19:57:38.467007+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a14a4543-a95d-423e-9a03-88dc7d177ef8', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-01 19:57:48.582058+00', ''),
	('00000000-0000-0000-0000-000000000000', '2edf3f61-ac1f-427f-9f0b-0ea829b04693', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-06 17:52:47.22833+00', ''),
	('00000000-0000-0000-0000-000000000000', '6412d90d-2310-474e-aa2f-d2113a0eb1fd', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-06 17:52:47.238618+00', ''),
	('00000000-0000-0000-0000-000000000000', '95e0e033-e194-4593-bc47-9011e1f9e783', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-06 17:58:19.887734+00', ''),
	('00000000-0000-0000-0000-000000000000', '2cbea556-006e-42a5-b6d9-8bf2211af56a', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-06 17:58:38.560436+00', ''),
	('00000000-0000-0000-0000-000000000000', '0180e8b9-af9e-4a65-96b0-126be8606504', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"gguevara@abogatech.com","user_id":"76db2165-bf9a-4efc-89eb-af37aed8bcfd","user_phone":""}}', '2026-04-06 18:36:55.391472+00', ''),
	('00000000-0000-0000-0000-000000000000', '0ef771d0-dc5d-4e24-ab96-06c5c1528a03', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"rhuanca@abogados.bo","user_id":"11005ef9-0cfd-4324-8bd8-fa0ebae5aae7","user_phone":""}}', '2026-04-06 18:37:29.408151+00', ''),
	('00000000-0000-0000-0000-000000000000', '59413bc8-2105-4d9d-af02-beabfbddbf58', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-06 18:59:30.747755+00', ''),
	('00000000-0000-0000-0000-000000000000', '19badc13-0481-41e4-a9d7-b01f23ed20cc', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-06 18:59:30.755508+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b37dead4-e434-4352-a8ac-510f7009ccc1', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"ebarbosa@abogados.com","user_id":"2c1ab5d3-3f44-4091-b451-8829f55d2f6d","user_phone":""}}', '2026-04-06 19:00:30.479891+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd21c63ef-acbf-45c4-9282-62b7cd63cb57', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"djustiniano@abogatech.com","user_id":"b814cef3-15c4-462c-bc09-9169f305eb8e","user_phone":""}}', '2026-04-06 19:05:39.689385+00', ''),
	('00000000-0000-0000-0000-000000000000', '625d47a7-c7d5-4acb-b5f4-a91d480c4604', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"maria.lopez@email.com","user_id":"fb943ca8-961d-4a76-93d4-bfc5744c899b","user_phone":""}}', '2026-04-06 19:13:13.495428+00', ''),
	('00000000-0000-0000-0000-000000000000', '1203c2d4-1b8f-4c00-9683-815158e5c4fb', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"gguevara@abogatech.com","user_id":"76db2165-bf9a-4efc-89eb-af37aed8bcfd","user_phone":""}}', '2026-04-06 19:14:23.110668+00', ''),
	('00000000-0000-0000-0000-000000000000', '7df70558-f110-4d6c-b24f-e6cf61d15309', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"djustiniano@abogatech.com","user_id":"b814cef3-15c4-462c-bc09-9169f305eb8e","user_phone":""}}', '2026-04-06 19:14:23.114585+00', ''),
	('00000000-0000-0000-0000-000000000000', '8dbbea3a-d207-4d85-bc8e-f4176f88cd35', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"rhuanca@abogados.bo","user_id":"11005ef9-0cfd-4324-8bd8-fa0ebae5aae7","user_phone":""}}', '2026-04-06 19:14:23.114011+00', ''),
	('00000000-0000-0000-0000-000000000000', '97b7340e-f15a-466a-a69b-0af1ae1c1f48', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"ebarbosa@abogados.com","user_id":"2c1ab5d3-3f44-4091-b451-8829f55d2f6d","user_phone":""}}', '2026-04-06 19:14:23.114427+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e03af56c-0e33-4a15-b268-d4630b7f3eb5', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"maria.lopez@email.com","user_id":"fb943ca8-961d-4a76-93d4-bfc5744c899b","user_phone":""}}', '2026-04-06 19:14:23.122089+00', ''),
	('00000000-0000-0000-0000-000000000000', '1550c1d0-af0b-4660-a03c-26afb398cf9d', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"rsanchez@abogados.bo","user_id":"59f38c42-e6c8-4ffa-80a0-4ca243fb518c","user_phone":""}}', '2026-04-06 19:14:35.401303+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a0714bc8-8eee-4992-987d-5ccb044be9ae', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-07 17:19:28.03751+00', ''),
	('00000000-0000-0000-0000-000000000000', '6cf61e54-2ebf-48a4-aaa6-8777751d3736', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-07 18:31:09.29976+00', ''),
	('00000000-0000-0000-0000-000000000000', 'abc9e40d-713d-4312-9767-8fb85896ccfc', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-07 18:31:09.302671+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a7f3b200-8c92-4d9d-b0e8-b323e5b7c73a', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"sergioguevarab@gmail.com","user_id":"9dae0f89-d722-4a8d-9fb3-65b16bbe9847","user_phone":""}}', '2026-04-07 18:57:09.923045+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dfae37a9-7ec0-40a3-b05e-28bb19b18862', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"sergioguevarab@gmail.com","user_id":"4c483850-8cb7-4c1a-a251-76e004727ced","user_phone":""}}', '2026-04-07 18:59:25.205097+00', ''),
	('00000000-0000-0000-0000-000000000000', '8d48d7a6-49af-4e69-b626-dad11e3640c1', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"sergioguevarab@gmail.com","user_id":"4c483850-8cb7-4c1a-a251-76e004727ced","user_phone":""}}', '2026-04-07 19:12:36.802811+00', ''),
	('00000000-0000-0000-0000-000000000000', '03d12c59-18f7-4183-bba2-7d0ddb266ab5', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"sergioguevarab@gmail.com","user_id":"d5c16733-7a1c-4f36-ba54-504f79d96598","user_phone":""}}', '2026-04-07 19:12:53.412572+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bf2d2ca7-1566-436c-b795-00789104edcd', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"sergioguevarab@gmail.com","user_id":"d5c16733-7a1c-4f36-ba54-504f79d96598","user_phone":""}}', '2026-04-07 19:22:18.572313+00', ''),
	('00000000-0000-0000-0000-000000000000', '4400fcd2-30c3-4186-b81c-b7308f0009dd', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"sergioguevarab@gmail.com","user_id":"1e332165-59d3-4039-84d7-1a9a0ad07679","user_phone":""}}', '2026-04-07 19:26:57.510634+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b4cfcbaf-d94f-48ad-b43d-5ae299bfad22', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-07 19:32:48.683413+00', ''),
	('00000000-0000-0000-0000-000000000000', '107cbaa8-532c-4dc7-97fd-a6d05f6b11a0', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-07 19:32:48.686246+00', ''),
	('00000000-0000-0000-0000-000000000000', '35c54f2f-e77c-49f8-af45-8a83158fe4d3', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-07 20:32:41.360095+00', ''),
	('00000000-0000-0000-0000-000000000000', '97daa088-f407-48a7-89da-a6059aee8f44', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-07 20:32:41.368789+00', ''),
	('00000000-0000-0000-0000-000000000000', '89aa83bc-1a9e-4e3d-b494-32e21c852c42', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-09 17:36:01.873192+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fa944953-646a-4986-aae2-cbdfc5ec1234', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-09 17:36:01.884928+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ab7be829-4bd0-4909-a732-5b39a058dbad', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-09 17:36:11.281098+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f946c891-2413-40f1-a473-5ca654d6b220', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-09 17:57:30.314549+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c3b155e0-d917-4d63-8898-7d8ef41bacf0', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-09 17:57:37.892934+00', ''),
	('00000000-0000-0000-0000-000000000000', '1d53c6ca-e210-479f-8db6-00722d13e62f', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"rhuanca@abogatech.com","user_id":"a27483b8-9eee-4479-8417-dab866186c37","user_phone":""}}', '2026-04-09 18:25:27.768488+00', ''),
	('00000000-0000-0000-0000-000000000000', '23686bbd-4f23-48d7-b1d1-cf9ce1e3131f', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-09 18:58:32.143687+00', ''),
	('00000000-0000-0000-0000-000000000000', '92972c62-5c58-4893-93d8-5d1e2e424dde', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-09 18:58:32.15182+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b84e8e4b-cb82-4a19-acea-44e89e5197ef', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"ltarqui@abogatech.com","user_id":"3f20f9a1-5850-49eb-ace5-73b4fee3d4d6","user_phone":""}}', '2026-04-09 19:32:56.97586+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd82f0877-e2f7-4882-80aa-58427e466f31', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-09 19:59:08.157591+00', ''),
	('00000000-0000-0000-0000-000000000000', '52773945-9bbe-49f1-aa78-a5c6165f63ad', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-09 19:59:08.165386+00', ''),
	('00000000-0000-0000-0000-000000000000', '0fb6d39b-176f-4fbe-b3ba-b4532870b7d4', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"arodriguez@abogatech.com","user_id":"f2aba17c-886d-4eaf-9f64-26445ef6582a","user_phone":""}}', '2026-04-09 20:50:59.768809+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ad0dc684-1e74-49e0-9d6e-3dafacff46a2', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-09 20:57:26.716564+00', ''),
	('00000000-0000-0000-0000-000000000000', '5d94602d-5fcf-41a6-a035-f64c21c8629f', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-09 20:57:26.72168+00', ''),
	('00000000-0000-0000-0000-000000000000', '70447f9e-1cb0-4184-8acd-d429ee30f7c4', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-10 18:35:28.27342+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b3f6aaeb-baa1-4b40-b179-4c8a014a09da', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-10 18:35:28.287009+00', ''),
	('00000000-0000-0000-0000-000000000000', '790c2ee1-10dd-490b-af73-2d5f6bc336c6', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-13 19:10:23.984926+00', ''),
	('00000000-0000-0000-0000-000000000000', '3e6fbc2d-b628-40d1-8c88-6b78e95f926a', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-13 19:10:23.993601+00', ''),
	('00000000-0000-0000-0000-000000000000', '9faefb3b-e99d-4749-b1b0-0bef4b79a1bd', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-13 19:10:25.956503+00', ''),
	('00000000-0000-0000-0000-000000000000', 'be76cef6-4f98-4f58-bca9-6a07a4b512de', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-13 19:35:34.289099+00', ''),
	('00000000-0000-0000-0000-000000000000', '43462916-3cea-44ad-8491-439ae9ebd9d0', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-13 19:35:40.564035+00', ''),
	('00000000-0000-0000-0000-000000000000', '01ef5dd6-277f-43a3-8fe6-81230548cd46', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-13 20:34:45.756226+00', ''),
	('00000000-0000-0000-0000-000000000000', '33dcc9e9-fd58-4f4d-ab82-0de3ed2dc505', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-13 20:34:45.761471+00', ''),
	('00000000-0000-0000-0000-000000000000', '4697ede6-f735-4cb6-b9f5-3bb115adb13a', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-04-13 21:08:12.507225+00', ''),
	('00000000-0000-0000-0000-000000000000', '9a4cdf81-5ddf-4c03-a9fc-15b06c61734e', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-13 21:09:19.18459+00', ''),
	('00000000-0000-0000-0000-000000000000', '5baaf653-a427-4fe5-a62f-25446300597c', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"kikekikop@gmail.com","user_id":"6d482b42-e6fe-4123-acf8-04c2dddee69e","user_phone":""}}', '2026-04-13 21:09:59.728547+00', ''),
	('00000000-0000-0000-0000-000000000000', '28017db9-3d73-482b-bca5-1bd5086237d6', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-04-13 21:10:06.198403+00', ''),
	('00000000-0000-0000-0000-000000000000', '8439f5b1-5efc-48c9-94b4-ffd1aafd39a5', '{"action":"login","actor_id":"6251f6be-0b58-4e65-bc74-6c1f894d459a","actor_username":"nguevara@abogados.bo","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-13 21:10:15.750141+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ba7931fd-3941-4e3a-a19e-e096c28124a4', '{"action":"logout","actor_id":"6251f6be-0b58-4e65-bc74-6c1f894d459a","actor_username":"nguevara@abogados.bo","actor_via_sso":false,"log_type":"account"}', '2026-04-13 21:10:25.426498+00', ''),
	('00000000-0000-0000-0000-000000000000', '477596de-018f-4ef8-b22c-8eff3931b2ce', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-13 21:13:20.108702+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e4706334-53a3-4389-abf4-9052a4d74569', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-14 13:08:13.206879+00', ''),
	('00000000-0000-0000-0000-000000000000', '2ac8dc4c-f6c9-43fc-9d01-a03adca12cdb', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-14 13:08:13.210351+00', ''),
	('00000000-0000-0000-0000-000000000000', '5731231a-e140-4aab-9623-052c5a79cb8a', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-14 13:08:15.513182+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a85f4de1-a0b8-4f88-973c-49b34a4cb1de', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-14 17:26:16.806286+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b30ef737-48cb-4dc2-818f-7d1f0db22a7b', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-14 17:26:16.819099+00', ''),
	('00000000-0000-0000-0000-000000000000', '030265ed-9ead-4361-9624-82804f38da4e', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-14 17:26:21.812815+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e012567a-2e6c-4bd8-905a-be64b50504e9', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-14 18:26:39.574273+00', ''),
	('00000000-0000-0000-0000-000000000000', '05c0f436-7a1a-4aba-8d84-0be08b44afbe', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-14 18:26:39.608108+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c93fb9c7-b86e-4234-b18a-2c4270d08dbe', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-14 19:26:55.477826+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aa02d64b-9415-4a2e-863b-853a578a2105', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-14 19:26:55.520576+00', ''),
	('00000000-0000-0000-0000-000000000000', '1941d53b-d422-4a43-ab7c-e9b83e5c20dc', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-14 20:27:14.35429+00', ''),
	('00000000-0000-0000-0000-000000000000', '1955a354-ff9c-41b8-90b9-1f89d5391ab0', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-14 20:27:14.365384+00', ''),
	('00000000-0000-0000-0000-000000000000', '49321d28-7e5b-47c2-812f-9b163f577732', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-16 19:01:57.333897+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cc96db7d-320b-4b9c-870f-bfa9cee1c089', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-16 19:01:57.346009+00', ''),
	('00000000-0000-0000-0000-000000000000', '4ea5f322-7ad8-4a50-b1cb-979962e37181', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-16 19:02:06.754829+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bf463562-2154-4c17-9040-fcb90004134a', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-16 20:01:22.567076+00', ''),
	('00000000-0000-0000-0000-000000000000', '1749304b-562b-4869-b5ff-1fd59459874b', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-16 20:01:22.575151+00', ''),
	('00000000-0000-0000-0000-000000000000', '17df7afd-d286-463d-9998-3b8375196576', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-16 20:59:48.080628+00', ''),
	('00000000-0000-0000-0000-000000000000', '7859b60b-0cc1-4938-b3ef-be47f6db1130', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-16 20:59:48.090222+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b7c5ee68-2b8e-496b-848c-9781c975e2f7', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-17 03:09:12.124113+00', ''),
	('00000000-0000-0000-0000-000000000000', '74155c60-1644-424f-bef0-47ccd6c7b3f4', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-17 03:09:12.131864+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd5b2fbd0-86d6-48f8-a3b8-08bac0251a29', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-17 19:04:16.498941+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bfc25e03-026c-4a1f-83ef-d6538ff47bd8', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-17 19:04:16.522101+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b664ec7f-5c0c-47a2-8d71-4b75a82b63cb', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-17 19:04:19.014119+00', ''),
	('00000000-0000-0000-0000-000000000000', '0ee184dc-ed52-4ee3-9f34-689e83ab7e12', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-17 20:49:29.78819+00', ''),
	('00000000-0000-0000-0000-000000000000', '1b81d5a8-3086-4aef-83b4-4f27943bc8c7', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-17 20:49:29.803015+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fdac4768-8bbd-4e49-be0b-39d575498863', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-20 18:02:09.04043+00', ''),
	('00000000-0000-0000-0000-000000000000', '8daeb4a8-2678-47f7-95d4-52f37429d34c', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-20 18:02:09.053774+00', ''),
	('00000000-0000-0000-0000-000000000000', '97827557-7466-44e7-83d1-52526c72146b', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-20 18:02:17.645221+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b37e5282-3469-4856-a447-63435e43b706', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-20 18:02:23.155268+00', ''),
	('00000000-0000-0000-0000-000000000000', '427115e9-4d3e-4dac-a323-03e8d8b73b25', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-20 19:00:56.442172+00', ''),
	('00000000-0000-0000-0000-000000000000', '76bbcd13-904d-4920-85ca-e853f2ee9c4a', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-20 19:00:56.453959+00', ''),
	('00000000-0000-0000-0000-000000000000', '5c73324f-171a-4a7e-a7fa-370c70bf7add', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-20 19:59:32.387696+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e7107782-cc20-4ae8-b456-d3a44c8c4624', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-20 19:59:32.396445+00', ''),
	('00000000-0000-0000-0000-000000000000', '3a71158d-f7f6-4f23-af25-f1641042435f', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-20 21:01:07.012291+00', ''),
	('00000000-0000-0000-0000-000000000000', '0beab500-383e-4d19-a50b-9e0d45ec8136', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-20 21:01:07.018479+00', ''),
	('00000000-0000-0000-0000-000000000000', '63695f11-f919-4d1a-b861-2fe8d3a68a55', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-21 17:47:47.810244+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ec551836-1f16-4ac6-93c0-75349bb5e092', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-21 17:47:47.817545+00', ''),
	('00000000-0000-0000-0000-000000000000', '4887316b-5a66-493d-a40f-372909e67c86', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-21 19:11:14.363129+00', ''),
	('00000000-0000-0000-0000-000000000000', '6a0e9cb5-5d72-45a4-ba18-f0d2be252778', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-21 19:11:14.372958+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bb17f715-6dec-4e45-b695-37dd02404e8e', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-04-21 19:12:57.83972+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd9b66830-aa87-4103-99e7-dfeff6ec60c2', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-21 19:13:15.54522+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e9aca702-dc85-419e-86b6-2bb05e11e1be', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-04-21 19:13:33.845515+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bd3884d7-5aa3-46e9-ad60-2edc5914733a', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-21 19:15:21.176576+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd6a13adc-4a3b-4a39-943c-a411e38a4cdb', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"djimenez@abogatech.com","user_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","user_phone":""}}', '2026-04-21 19:27:11.326001+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a7722564-272d-4bba-8c93-9443d19edccd', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-04-21 19:48:12.904281+00', ''),
	('00000000-0000-0000-0000-000000000000', '2bf000a9-0545-49f0-9b6e-db18cb69129e', '{"action":"login","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-21 19:48:28.425818+00', ''),
	('00000000-0000-0000-0000-000000000000', '542f6fe5-c218-4173-8900-7e0c692936c3', '{"action":"token_refreshed","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"token"}', '2026-04-21 20:47:58.783656+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ebbbe1e1-0118-4897-aaca-5102e21bf208', '{"action":"token_revoked","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"token"}', '2026-04-21 20:47:58.791744+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b62b6974-edfe-44b2-914d-d8558e9bb702', '{"action":"token_refreshed","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"token"}', '2026-04-23 16:33:04.277318+00', ''),
	('00000000-0000-0000-0000-000000000000', '68ab1df6-b523-415a-a1d2-81a24e170368', '{"action":"token_revoked","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"token"}', '2026-04-23 16:33:04.290378+00', ''),
	('00000000-0000-0000-0000-000000000000', '6c5c8ae9-a872-44cf-b372-fae47249263d', '{"action":"logout","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account"}', '2026-04-23 16:33:19.718978+00', ''),
	('00000000-0000-0000-0000-000000000000', '7b88d114-469e-41c7-a62d-a0e54ad717f8', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-23 16:33:21.599304+00', ''),
	('00000000-0000-0000-0000-000000000000', '487ba36a-0b32-446e-8d81-6b5d536f3ef8', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-24 18:08:30.193438+00', ''),
	('00000000-0000-0000-0000-000000000000', '2ba00194-5559-46ff-89c7-3268a25e1991', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-04-24 18:08:30.209798+00', ''),
	('00000000-0000-0000-0000-000000000000', '72e483a1-9236-4e7f-ad91-6532e569a0eb', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-24 18:08:37.812361+00', ''),
	('00000000-0000-0000-0000-000000000000', '31c80063-6efd-4e42-a9e1-397f09c9a968', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-04-24 18:09:18.933704+00', ''),
	('00000000-0000-0000-0000-000000000000', '1c85cdba-2b5d-4d08-93c7-ad8cb39c15d6', '{"action":"login","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-24 18:09:48.65471+00', ''),
	('00000000-0000-0000-0000-000000000000', '4264027b-ad2d-4afb-b913-be99b3bde91d', '{"action":"token_refreshed","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"token"}', '2026-04-24 19:10:22.633902+00', ''),
	('00000000-0000-0000-0000-000000000000', '00d8b4ff-556e-4bfe-a0b3-6a908222a5f8', '{"action":"token_revoked","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"token"}', '2026-04-24 19:10:22.641084+00', ''),
	('00000000-0000-0000-0000-000000000000', '8ffebce1-3239-418b-ad46-4ee0a525804f', '{"action":"logout","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account"}', '2026-04-24 19:31:44.993582+00', ''),
	('00000000-0000-0000-0000-000000000000', '5a3a1f61-4979-4524-83a6-1c8851698442', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-24 19:31:48.078221+00', ''),
	('00000000-0000-0000-0000-000000000000', '06f39bd1-8542-4ee8-a6f2-fc3279ab5f68', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-04-24 19:32:13.197132+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a314aeac-e373-4251-a221-afc95342a802', '{"action":"login","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-24 19:32:35.661108+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c9f21611-ec29-4843-a32d-acf7b0b8626b', '{"action":"logout","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account"}', '2026-04-24 19:47:32.297448+00', ''),
	('00000000-0000-0000-0000-000000000000', '1ed063ae-3b6f-439d-89fc-9d3a3f668530', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-24 19:47:34.81653+00', ''),
	('00000000-0000-0000-0000-000000000000', '4e2477f7-103d-4ce7-a777-286aac4bcc46', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-04-24 19:50:30.090942+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fbc5b74f-abe4-404c-bd34-6ec0f518921b', '{"action":"login","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-24 19:50:36.360139+00', ''),
	('00000000-0000-0000-0000-000000000000', '3a4b5205-b8c0-4b1b-a978-cada8fa4d4d8', '{"action":"logout","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account"}', '2026-04-24 19:56:16.355829+00', ''),
	('00000000-0000-0000-0000-000000000000', '15ff2bde-c514-4222-be4b-181023cc1832', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-24 19:56:19.795797+00', ''),
	('00000000-0000-0000-0000-000000000000', '489211d0-a78c-492d-9b87-a699375680b0', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-04-24 20:04:27.605663+00', ''),
	('00000000-0000-0000-0000-000000000000', '9746c15d-d63c-4357-b0c3-721f00c0c622', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-24 20:04:30.67402+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dc56485c-91da-47e9-aeea-58ee3c74846f', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-04-24 20:04:49.354058+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd75dd1f6-146e-43fb-9e7b-8ef04ba0575a', '{"action":"login","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-24 20:04:58.707861+00', ''),
	('00000000-0000-0000-0000-000000000000', '56d39522-f611-4005-a3ba-17b8f8311568', '{"action":"logout","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account"}', '2026-04-24 20:30:56.532037+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a94a666b-bf72-4c44-9734-9fdfd9ff7b71', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-24 20:30:58.494114+00', ''),
	('00000000-0000-0000-0000-000000000000', '58c6f73f-7d3f-42a2-9d4d-965dff5af7e5', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-04-24 20:45:03.994581+00', ''),
	('00000000-0000-0000-0000-000000000000', '9a3c33a5-262a-4a22-8b0c-94adda178bc3', '{"action":"login","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-24 20:45:10.382718+00', ''),
	('00000000-0000-0000-0000-000000000000', 'feebbff4-5a5f-4718-ba63-2dabb1c9f6c4', '{"action":"token_refreshed","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"token"}', '2026-04-27 15:29:24.836943+00', ''),
	('00000000-0000-0000-0000-000000000000', '6118aae8-8a35-4664-97c0-dd4da03f6b3e', '{"action":"token_revoked","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"token"}', '2026-04-27 15:29:24.844486+00', ''),
	('00000000-0000-0000-0000-000000000000', '99c7f3b8-2d53-4d68-904b-91446a6ee6d2', '{"action":"login","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-27 15:29:58.179558+00', ''),
	('00000000-0000-0000-0000-000000000000', '20b8036f-137b-490e-8ae3-f82f1ad7cd84', '{"action":"token_refreshed","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"token"}', '2026-04-28 15:26:14.443423+00', ''),
	('00000000-0000-0000-0000-000000000000', '8af74d8c-0440-4412-a2ce-b5720158c237', '{"action":"token_revoked","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"token"}', '2026-04-28 15:26:14.455702+00', ''),
	('00000000-0000-0000-0000-000000000000', '9b6ede00-e9da-4834-814c-606949e6ab91', '{"action":"login","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-28 15:26:51.299027+00', ''),
	('00000000-0000-0000-0000-000000000000', '6339ac06-1b2a-4a4c-8d81-5349832966a9', '{"action":"logout","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account"}', '2026-04-28 15:32:49.725037+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fe5fca93-5ee5-4b15-a61d-0d67d201d141', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-28 15:32:51.989751+00', ''),
	('00000000-0000-0000-0000-000000000000', '210bab65-2486-4a84-a2e9-18aec43183b0', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"ftarqui@abogatech.com","user_id":"bbd33588-f1bd-4fee-8e9d-b73d56c727f3","user_phone":""}}', '2026-04-28 15:36:02.329322+00', ''),
	('00000000-0000-0000-0000-000000000000', '3eebc2c6-4f09-43d1-b7f2-61583b9b5448', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-04-28 15:36:05.986964+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a262db65-fddf-4ddb-ad41-bb027ad593e9', '{"action":"login","actor_id":"bbd33588-f1bd-4fee-8e9d-b73d56c727f3","actor_username":"ftarqui@abogatech.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-28 15:36:28.967544+00', ''),
	('00000000-0000-0000-0000-000000000000', '99de5292-95d4-40b1-b619-644c9f0058cc', '{"action":"logout","actor_id":"bbd33588-f1bd-4fee-8e9d-b73d56c727f3","actor_username":"ftarqui@abogatech.com","actor_via_sso":false,"log_type":"account"}', '2026-04-28 15:58:50.61699+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f0255133-1dfe-4f26-a3cd-56133943f5d7', '{"action":"login","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-28 15:58:59.130672+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c170a2a1-f01d-41ca-a8da-70bb39b9fc0f', '{"action":"logout","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account"}', '2026-04-28 16:28:37.072708+00', ''),
	('00000000-0000-0000-0000-000000000000', 'df51c521-580a-4a7e-93b1-416c84765d36', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-28 16:30:49.877638+00', ''),
	('00000000-0000-0000-0000-000000000000', '9127bd14-1a41-41b2-9955-fd1351a58f3e', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-04-28 16:30:52.163191+00', ''),
	('00000000-0000-0000-0000-000000000000', '254d7f92-ca64-462f-9b74-e91e156e78d7', '{"action":"login","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-28 16:30:58.414504+00', ''),
	('00000000-0000-0000-0000-000000000000', '1f06ae91-59f0-4189-91dc-049527285439', '{"action":"logout","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account"}', '2026-04-28 16:31:36.632922+00', ''),
	('00000000-0000-0000-0000-000000000000', '07eafca3-ba3b-4f0e-acde-7d8fc1129a74', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-28 16:31:40.636082+00', ''),
	('00000000-0000-0000-0000-000000000000', '98c5cfa0-caa5-4630-b0ba-d770b08d9190', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-04-28 16:32:08.212443+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b7d68ccb-8775-46e6-9a88-e50719f8548b', '{"action":"login","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-04-28 16:32:15.670401+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f12c6357-ae2c-4300-b4d8-4717395273e0', '{"action":"token_refreshed","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"token"}', '2026-05-04 18:28:53.755858+00', ''),
	('00000000-0000-0000-0000-000000000000', '63e0e51a-d048-487b-959b-21fa4c00a51d', '{"action":"token_revoked","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"token"}', '2026-05-04 18:28:53.766238+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f5e17f74-d24f-4cd4-a90b-92bbcd5c9e4c', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"rhuanca@abogadoya.tech","user_id":"9d8a3be2-4885-4060-9c81-58905245700a","user_phone":""}}', '2026-05-04 18:53:02.870374+00', ''),
	('00000000-0000-0000-0000-000000000000', '8f53f70b-8bee-4906-9f5f-14e6f20e019e', '{"action":"logout","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account"}', '2026-05-04 19:18:56.351972+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ad88acc4-36b6-4a9f-ab1b-5fa86caa959e', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-04 19:19:01.911304+00', ''),
	('00000000-0000-0000-0000-000000000000', '357577d7-b392-458c-9e24-f5fda0fad2ac', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-04 19:20:32.641597+00', ''),
	('00000000-0000-0000-0000-000000000000', '36dd73bc-7780-470c-8189-bd3688df49bb', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-05-04 19:21:22.250561+00', ''),
	('00000000-0000-0000-0000-000000000000', '2c4d7bcf-d775-4000-8c73-381beb811a3d', '{"action":"login","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-04 19:21:27.778577+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f89ef527-4d46-4198-9c92-7070da935caa', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"ohitachib@abogadoya.tech","user_id":"a5ff653a-35fb-4115-9ab8-8dfefc07dc52","user_phone":""}}', '2026-05-04 19:25:08.89315+00', ''),
	('00000000-0000-0000-0000-000000000000', '0fc4ce86-0206-4cd2-ba68-85b3b61176ee', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"mtarquia@abogadoya.tech","user_id":"48cc2915-6363-4660-b454-b367b4a5ccd3","user_phone":""}}', '2026-05-04 19:32:35.85424+00', ''),
	('00000000-0000-0000-0000-000000000000', '3a438f45-b9c0-4867-87af-6aabb182d1b1', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"avillalbac@abogadoya.tech","user_id":"33e61366-bd9b-479f-a072-42fa846f4ecf","user_phone":""}}', '2026-05-04 19:45:46.311218+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b47bf17f-3782-49d3-b26e-253fc88c895f', '{"action":"logout","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account"}', '2026-05-04 19:46:58.966297+00', ''),
	('00000000-0000-0000-0000-000000000000', '6b233bca-51ab-4d33-bdd5-24a8b0b90e8e', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-04 19:47:00.905772+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f1916620-9747-40fe-b190-6abb9d0fcc1b', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-05-04 19:47:26.50783+00', ''),
	('00000000-0000-0000-0000-000000000000', '2e3c4a54-1541-4381-987a-3fe4b5424be6', '{"action":"login","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-04 19:47:33.198289+00', ''),
	('00000000-0000-0000-0000-000000000000', '3c8cf4e2-558f-44e2-ad1f-6f8f99ab268b', '{"action":"token_refreshed","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"token"}', '2026-05-06 19:58:56.403553+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f555a96d-4150-4275-a7bc-f9e594e3b003', '{"action":"token_revoked","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"token"}', '2026-05-06 19:58:56.417062+00', ''),
	('00000000-0000-0000-0000-000000000000', '023c0023-9517-4b10-b457-24fbd79c78df', '{"action":"logout","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account"}', '2026-05-06 20:00:01.54048+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b9a163cc-a382-4712-83dc-ec69167b261c', '{"action":"login","actor_id":"48cc2915-6363-4660-b454-b367b4a5ccd3","actor_username":"mtarquia@abogadoya.tech","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-06 20:00:43.75242+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ed390d90-2a3f-4077-964f-618d04a2e5ff', '{"action":"user_repeated_signup","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2026-05-06 20:03:21.290918+00', ''),
	('00000000-0000-0000-0000-000000000000', '13059818-1152-45c5-b447-51f4062d42da', '{"action":"login","actor_id":"48cc2915-6363-4660-b454-b367b4a5ccd3","actor_username":"mtarquia@abogadoya.tech","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-06 20:21:11.427707+00', ''),
	('00000000-0000-0000-0000-000000000000', '2dbd81ce-037e-4cec-a838-0f82e771b58b', '{"action":"logout","actor_id":"48cc2915-6363-4660-b454-b367b4a5ccd3","actor_username":"mtarquia@abogadoya.tech","actor_via_sso":false,"log_type":"account"}', '2026-05-06 20:29:43.41175+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c47795e6-a0fc-48d3-9907-99be8a762edf', '{"action":"login","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-06 20:29:49.457923+00', ''),
	('00000000-0000-0000-0000-000000000000', '643a23a3-8d9b-4a75-a447-1716f295baad', '{"action":"logout","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account"}', '2026-05-06 20:30:03.090838+00', ''),
	('00000000-0000-0000-0000-000000000000', '869e147f-8242-47a1-8515-baf84f39d34e', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-06 20:30:05.031048+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cde020a1-b6f4-441c-9ea2-d02a542406f8', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-05-06 20:31:05.193149+00', ''),
	('00000000-0000-0000-0000-000000000000', '383c44f2-5495-43b2-a266-79148cedb9f8', '{"action":"login","actor_id":"33e61366-bd9b-479f-a072-42fa846f4ecf","actor_username":"avillalbac@abogadoya.tech","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-06 20:32:19.701781+00', ''),
	('00000000-0000-0000-0000-000000000000', '63a3bb3a-6ded-4d9b-8b5b-fa8792a95241', '{"action":"logout","actor_id":"33e61366-bd9b-479f-a072-42fa846f4ecf","actor_username":"avillalbac@abogadoya.tech","actor_via_sso":false,"log_type":"account"}', '2026-05-06 20:45:01.626411+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fef530b4-d341-4143-ac1c-089e9a0b99a9', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-06 20:45:11.124012+00', ''),
	('00000000-0000-0000-0000-000000000000', '10d4a005-6c91-4b72-addc-3192ea67ac75', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-06 20:45:24.237854+00', ''),
	('00000000-0000-0000-0000-000000000000', '8ec0fdb2-3505-4369-806c-967cbf000448', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-06 20:45:53.134611+00', ''),
	('00000000-0000-0000-0000-000000000000', '9d8e9bd4-548e-4c98-a37a-d2933a194de6', '{"action":"login","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-06 20:46:22.509602+00', ''),
	('00000000-0000-0000-0000-000000000000', '190249ff-4dc6-4566-8fdd-16ff1931ea47', '{"action":"login","actor_id":"48cc2915-6363-4660-b454-b367b4a5ccd3","actor_username":"mtarquia@abogadoya.tech","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-06 20:46:48.872292+00', ''),
	('00000000-0000-0000-0000-000000000000', '3d3c3664-9601-4189-a232-b8cb555c4016', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-06 20:48:09.28836+00', ''),
	('00000000-0000-0000-0000-000000000000', '72472247-d7e2-45a2-89b5-cc46f0785746', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"msacat@abogadoya.tech","user_id":"917a4162-45aa-421e-a5c6-fc648de744a1","user_phone":""}}', '2026-05-06 20:49:27.672986+00', ''),
	('00000000-0000-0000-0000-000000000000', '92aec5b4-920b-4526-ab67-4d395eacb4ac', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-05-06 20:52:12.346881+00', ''),
	('00000000-0000-0000-0000-000000000000', '42e5715a-007e-426d-b3c0-64217687c2e0', '{"action":"login","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-06 20:53:16.866581+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e71efee6-1a65-440e-895d-4462801838ce', '{"action":"logout","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account"}', '2026-05-06 20:53:34.055639+00', ''),
	('00000000-0000-0000-0000-000000000000', '0d728793-7f33-4f4e-b7d3-4829989fafd7', '{"action":"login","actor_id":"917a4162-45aa-421e-a5c6-fc648de744a1","actor_username":"msacat@abogadoya.tech","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-06 20:54:15.166387+00', ''),
	('00000000-0000-0000-0000-000000000000', '8e50e902-c826-4c0f-bb5d-68631852cd22', '{"action":"logout","actor_id":"917a4162-45aa-421e-a5c6-fc648de744a1","actor_username":"msacat@abogadoya.tech","actor_via_sso":false,"log_type":"account"}', '2026-05-06 21:01:16.774574+00', ''),
	('00000000-0000-0000-0000-000000000000', '14d10a78-17d0-4c77-976a-abfe0ea2fd6e', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-06 21:01:30.374905+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f119224e-f4aa-4889-9847-21d94e859bd7', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-07 19:58:15.738108+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ea44daa6-99c8-4609-af21-5624b3a1acdf', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-07 19:58:15.759245+00', ''),
	('00000000-0000-0000-0000-000000000000', '12ed02b2-3629-4c73-b73c-2ea7810cc280', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-05-07 20:27:05.420215+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b0679df9-e849-4ac1-85a5-c78e0dbc53c1', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-07 20:27:58.03486+00', ''),
	('00000000-0000-0000-0000-000000000000', '8299cf54-85c1-40ca-98ff-02d1a4e40df1', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-05-07 20:28:01.559482+00', ''),
	('00000000-0000-0000-0000-000000000000', '735d2a7b-7d88-4efd-b7a5-cb4b82d1222a', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-07 20:28:39.079418+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a113e731-79ed-4f44-b3d4-4dfd0f3726ee', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"fabri@gmail.com","user_id":"79d78a1e-e5dd-4f82-9d73-9ce33b2c2a24","user_phone":""}}', '2026-05-07 20:31:08.915366+00', ''),
	('00000000-0000-0000-0000-000000000000', '6ac03f3a-5eb5-45ae-a2a2-245ee26dbdbf', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-05-07 21:02:09.132967+00', ''),
	('00000000-0000-0000-0000-000000000000', '3ffad237-93e4-4530-a2db-b2202c0a6fde', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-07 21:02:12.934784+00', ''),
	('00000000-0000-0000-0000-000000000000', '670dd1a4-0e6b-4f55-985f-41e70912de6e', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-05-07 21:09:58.655336+00', ''),
	('00000000-0000-0000-0000-000000000000', '8134ae11-1cf5-40b2-b9be-acdebd024660', '{"action":"login","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-07 21:16:13.889087+00', ''),
	('00000000-0000-0000-0000-000000000000', '0b33768a-cd72-4edc-9780-0bc8a2375a88', '{"action":"logout","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account"}', '2026-05-07 21:19:46.946143+00', ''),
	('00000000-0000-0000-0000-000000000000', '06bdb99d-acc6-4a74-b7a2-f14008ab44f2', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-07 21:19:49.549958+00', ''),
	('00000000-0000-0000-0000-000000000000', '2c4fdc1c-1eff-4e57-b3be-65acd54f39d4', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-05-07 21:20:36.928213+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd54b07d1-f4b6-4d32-a390-fe6754894ef2', '{"action":"login","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-07 21:20:46.154301+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dc0803e5-b3d9-4f7d-8125-b7b289abea8a', '{"action":"logout","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account"}', '2026-05-07 21:21:27.096373+00', ''),
	('00000000-0000-0000-0000-000000000000', '7c156e70-cb96-490d-a971-9d83eef6bd07', '{"action":"login","actor_id":"48cc2915-6363-4660-b454-b367b4a5ccd3","actor_username":"mtarquia@abogadoya.tech","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-07 21:22:18.320249+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c0242d73-596d-448e-ab9b-f86c9edb8cc0', '{"action":"token_refreshed","actor_id":"48cc2915-6363-4660-b454-b367b4a5ccd3","actor_username":"mtarquia@abogadoya.tech","actor_via_sso":false,"log_type":"token"}', '2026-05-08 20:32:33.14382+00', ''),
	('00000000-0000-0000-0000-000000000000', '4fd69ac8-81a9-47ff-875a-438c944cdf44', '{"action":"token_revoked","actor_id":"48cc2915-6363-4660-b454-b367b4a5ccd3","actor_username":"mtarquia@abogadoya.tech","actor_via_sso":false,"log_type":"token"}', '2026-05-08 20:32:33.152306+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c2511b31-d6bd-4a69-b14e-3798c6b23697', '{"action":"logout","actor_id":"48cc2915-6363-4660-b454-b367b4a5ccd3","actor_username":"mtarquia@abogadoya.tech","actor_via_sso":false,"log_type":"account"}', '2026-05-08 20:33:14.470543+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b74f5b13-d479-427f-9138-1869ee668c89', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 20:46:28.310913+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eaf1077f-fb40-4e1b-b79f-40abdd5f6bb2', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"svillalbac@abogatech.com","user_id":"c4fd4f50-d3bc-4c2e-a8c6-7e9fbc76e5a8","user_phone":""}}', '2026-05-08 20:49:40.86538+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a8406912-fdf2-475d-9070-d3c7fe7c9107', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-11 15:34:50.173055+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b014f65f-0ce0-400a-8d74-59a969237e99', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-11 15:34:50.185277+00', ''),
	('00000000-0000-0000-0000-000000000000', '0602e10b-fd1a-4c4e-be0a-5f8f78e2bc5d', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-11 15:35:09.290416+00', ''),
	('00000000-0000-0000-0000-000000000000', '6a572174-3f40-4417-8cab-443cc9580f22', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-11 16:38:40.312994+00', ''),
	('00000000-0000-0000-0000-000000000000', '32f53d8d-d3e4-48fa-8820-262aa65681c0', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-11 16:38:40.320043+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e26f1cb0-1631-45fd-a6aa-b6a84342ffbc', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-11 17:36:50.174603+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a86b35f7-bfa1-4239-b0a1-6128886164a3', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-11 17:36:50.179873+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e409238a-7294-422f-82f7-837665f02bf9', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-11 18:35:21.086918+00', ''),
	('00000000-0000-0000-0000-000000000000', '9ef51fd5-4184-4ebb-bc5e-108951e5412b', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-11 18:35:21.096212+00', ''),
	('00000000-0000-0000-0000-000000000000', '2588fc82-0b34-4f18-8e9f-9ae7a527d2cd', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-13 19:23:49.667602+00', ''),
	('00000000-0000-0000-0000-000000000000', '3d579ab2-9a36-46da-ac21-9a2cfd7327d0', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-13 19:23:49.672553+00', ''),
	('00000000-0000-0000-0000-000000000000', '6057e2c4-fdd0-4a78-9a73-96ef3260576d', '{"action":"token_refreshed","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-14 16:41:06.306138+00', ''),
	('00000000-0000-0000-0000-000000000000', '2121df9e-a8f1-4e8c-bfa7-959c646e804b', '{"action":"token_revoked","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-14 16:41:06.316627+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ca222e32-5c4b-4f85-971e-33c644934c13', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-14 16:41:11.986572+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a052f3bb-baea-4c4a-8bf6-8634c296271e', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-05-14 17:08:11.773088+00', ''),
	('00000000-0000-0000-0000-000000000000', '8dc3d59a-2653-4c15-a893-f026ac49b967', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-14 17:08:49.214986+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e2bc174c-2cb8-4288-8bb9-30473fddb69c', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-05-14 17:08:56.557771+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c971a0db-2863-457a-8a3e-a91314790dbf', '{"action":"login","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-14 17:09:01.165063+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fe125ba0-eb7e-4d44-993d-86d637034d22', '{"action":"token_refreshed","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"token"}', '2026-05-19 19:26:15.329521+00', ''),
	('00000000-0000-0000-0000-000000000000', '78b251bc-08a3-424f-9283-b42160c69db9', '{"action":"token_revoked","actor_id":"d2d54597-3bf7-4ff3-a604-f521b7dda59f","actor_username":"djimenez@abogatech.com","actor_via_sso":false,"log_type":"token"}', '2026-05-19 19:26:15.33518+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f0e12dc0-ea01-47e8-8b06-6298b0bdf7d6', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-19 19:26:54.329596+00', ''),
	('00000000-0000-0000-0000-000000000000', '826d90a4-094a-4bbd-a137-b7ce60a44310', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-05-19 19:55:26.884846+00', ''),
	('00000000-0000-0000-0000-000000000000', '3a14ecbf-46d4-41b3-aefa-95cb7d67885d', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-19 19:55:32.293498+00', ''),
	('00000000-0000-0000-0000-000000000000', '33bdc70e-1109-4e40-9084-f0b6dda50b04', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-19 20:21:20.354027+00', ''),
	('00000000-0000-0000-0000-000000000000', '20fdd8d5-972f-45b3-9ba6-837879479b22', '{"action":"logout","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-05-19 20:21:23.977275+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f5f6baec-d0c8-4273-9708-50df5d856844', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-19 20:33:32.946647+00', ''),
	('00000000-0000-0000-0000-000000000000', '52543877-6f8d-488f-bb2c-711e31d7bb68', '{"action":"login","actor_id":"d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d","actor_username":"fabri2wavy@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-19 20:33:36.759271+00', '');


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'f2aba17c-886d-4eaf-9f64-26445ef6582a', 'authenticated', 'authenticated', 'arodriguez@abogatech.com', '$2a$10$hmfoA5ObpDOGaoqXpFXbNOvKCUX9kHU7w9tEw4Q9S.bZ43An1lAlK', '2026-04-09 20:50:59.773492+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-04-09 20:50:59.748298+00', '2026-04-09 20:50:59.774269+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '48cc2915-6363-4660-b454-b367b4a5ccd3', 'authenticated', 'authenticated', 'mtarquia@abogadoya.tech', '$2a$10$/KU5HPiaow4O5W4a5B1T4eJVbG4aA9d4BsoCtBG9z6z13UhHzqu2O', '2026-05-04 19:32:35.856378+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-07 21:22:18.322189+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-04 19:32:35.848212+00', '2026-05-08 20:32:33.160117+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '6d482b42-e6fe-4123-acf8-04c2dddee69e', 'authenticated', 'authenticated', 'kikekikop@gmail.com', '$2a$10$qym823zNiSYG43aoHu.j7ON8emK1BxmbqcLtfVNvHGZBoyGA/NQKi', '2026-04-13 21:09:59.730124+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-04-13 21:09:59.712754+00', '2026-04-13 21:09:59.730975+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'a6be4506-720d-4b53-b427-4c7f1c14a85e', 'authenticated', 'authenticated', 'ariel@iturri.com', '$2a$10$w5N.LBoLiFpNoCKhggF51OEvE6Isi43O.jDyPo39cRSb0vhPTQV4W', '2026-03-23 20:03:00.942744+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-03-27 19:08:05.120291+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-03-23 20:03:00.923126+00', '2026-03-27 19:08:05.131165+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '9d8a3be2-4885-4060-9c81-58905245700a', 'authenticated', 'authenticated', 'rhuanca@abogadoya.tech', '$2a$10$TDCplW3WMsZ8QtwTcQADHOjm5qJgrQykyYXoXAn5pgMBthVfPgELK', '2026-05-04 18:53:02.874504+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-04 18:53:02.845981+00', '2026-05-04 18:53:02.87532+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'a27483b8-9eee-4479-8417-dab866186c37', 'authenticated', 'authenticated', 'rhuanca@abogatech.com', '$2a$10$PjEAArO3Fe1jKD.8gn0x..lT9d8vJIT4DApJonaaA/3HAh5vaAeqa', '2026-04-09 18:25:27.776631+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-04-09 18:25:27.727481+00', '2026-04-09 18:25:27.778809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '6251f6be-0b58-4e65-bc74-6c1f894d459a', 'authenticated', 'authenticated', 'nguevara@abogados.bo', '$2a$10$RkbVlSspACI6vapyAbgDk.LtemFQ4K0sQzcETavcjkhd5Ay5DugVe', '2026-03-30 20:55:11.738444+00', NULL, '', NULL, 'af8aa6a7689289e8609d8ccdef432fbb7ab6d829278435110b24ee57', '2026-03-30 20:57:26.822376+00', '', '', NULL, '2026-04-13 21:10:15.751361+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-03-30 20:55:11.68655+00', '2026-04-13 21:10:15.754732+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '1e332165-59d3-4039-84d7-1a9a0ad07679', 'authenticated', 'authenticated', 'sergioguevarab@gmail.com', '$2a$10$DNUFFKsecq/53H8Xtxb0n..La/DOQuRoiPwFBTe3BVRNzAo5E4nji', '2026-04-07 19:26:57.513998+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-04-07 19:26:57.493888+00', '2026-04-07 19:26:57.514806+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'bbd33588-f1bd-4fee-8e9d-b73d56c727f3', 'authenticated', 'authenticated', 'ftarqui@abogatech.com', '$2a$10$cVdfWwVdbtrL450MKtktge8fOI1Iz98nA4g8/ZbDY2iHnAqAT7CrC', '2026-04-28 15:36:02.33197+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-04-28 15:36:28.969759+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-04-28 15:36:02.312391+00', '2026-04-28 15:36:28.97657+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '3f20f9a1-5850-49eb-ace5-73b4fee3d4d6', 'authenticated', 'authenticated', 'ltarqui@abogatech.com', '$2a$10$rUfNnMbz5MK5Bmyv372SweS7ANjo/fI8GM/rSFLLQ.jLJTWOmrZxa', '2026-04-09 19:32:56.980822+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-04-09 19:32:56.956934+00', '2026-04-09 19:32:56.983112+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '917a4162-45aa-421e-a5c6-fc648de744a1', 'authenticated', 'authenticated', 'msacat@abogadoya.tech', '$2a$10$Ocr/GvwCiPW5smyaZr00rO4a7P/RRjfvta.VToAvT94LrNxkq1NE6', '2026-05-06 20:49:27.679164+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-06 20:54:15.170479+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-06 20:49:27.641729+00', '2026-05-06 20:54:15.181355+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '33e61366-bd9b-479f-a072-42fa846f4ecf', 'authenticated', 'authenticated', 'avillalbac@abogadoya.tech', '$2a$10$FyK9/ij.djqvrR7esVBbkOMgRzPlwjtxg1ybIARX9xsCZKTQ7JCsW', '2026-05-04 19:45:46.317067+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-06 20:32:19.706118+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-04 19:45:46.292481+00', '2026-05-06 20:32:19.716119+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'a5ff653a-35fb-4115-9ab8-8dfefc07dc52', 'authenticated', 'authenticated', 'ohitachib@abogadoya.tech', '$2a$10$vcBd7seGicTKrLBZF247t.8a4ZRjyDoiMl5WpuSJ27Mb1UEMtn0xa', '2026-05-04 19:25:08.895442+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-04 19:25:08.881129+00', '2026-05-04 19:25:08.896185+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'd2d54597-3bf7-4ff3-a604-f521b7dda59f', 'authenticated', 'authenticated', 'djimenez@abogatech.com', '$2a$10$q8zhY5/3T4UHoeMjpXg45uKOdiJVmNhY.rLazxU3DOoxTO242rF92', '2026-04-21 19:27:11.332869+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-14 17:09:01.166429+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-04-21 19:27:11.292198+00', '2026-05-19 19:26:15.347308+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '79d78a1e-e5dd-4f82-9d73-9ce33b2c2a24', 'authenticated', 'authenticated', 'fabri@gmail.com', '$2a$10$wNLzYbO/YOpRbhtlK.ipvO5ereIB9NopKEQZKV8RjF/EqfdbL2Wnu', '2026-05-07 20:31:08.917244+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-07 20:31:08.898346+00', '2026-05-07 20:31:08.918019+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', 'authenticated', 'authenticated', 'fabri2wavy@gmail.com', '$2a$10$m3OWyGkARaxH4VY204Fkkevpc/dtveE8xg4q6XZGkUMMgtl.0g5kq', '2026-03-16 20:27:06.596767+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-19 20:33:36.761678+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d", "email": "fabri2wavy@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2026-03-16 20:27:06.579581+00', '2026-05-19 20:33:36.768997+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'c4fd4f50-d3bc-4c2e-a8c6-7e9fbc76e5a8', 'authenticated', 'authenticated', 'svillalbac@abogatech.com', '$2a$10$AfS/u5btDS04ImchXb2pbeZNsaxB5EGVlRepO7/PBGNv2VxdRyV5S', '2026-05-08 20:49:40.868532+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-08 20:49:40.842217+00', '2026-05-08 20:49:40.869266+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '{"sub": "d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d", "email": "fabri2wavy@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-03-16 20:27:06.592234+00', '2026-03-16 20:27:06.592264+00', '2026-03-16 20:27:06.592264+00', '662d843f-16b5-4388-a5b5-661a0b254e6a'),
	('a6be4506-720d-4b53-b427-4c7f1c14a85e', 'a6be4506-720d-4b53-b427-4c7f1c14a85e', '{"sub": "a6be4506-720d-4b53-b427-4c7f1c14a85e", "email": "ariel@iturri.com", "email_verified": false, "phone_verified": false}', 'email', '2026-03-23 20:03:00.936562+00', '2026-03-23 20:03:00.936866+00', '2026-03-23 20:03:00.936866+00', '98f1f37b-8e73-48a9-8deb-d71d3850c173'),
	('6251f6be-0b58-4e65-bc74-6c1f894d459a', '6251f6be-0b58-4e65-bc74-6c1f894d459a', '{"sub": "6251f6be-0b58-4e65-bc74-6c1f894d459a", "email": "nguevara@abogados.bo", "email_verified": false, "phone_verified": false}', 'email', '2026-03-30 20:55:11.727427+00', '2026-03-30 20:55:11.727738+00', '2026-03-30 20:55:11.727738+00', 'b9404e3c-f535-4cf9-a7d2-bba65c42023c'),
	('1e332165-59d3-4039-84d7-1a9a0ad07679', '1e332165-59d3-4039-84d7-1a9a0ad07679', '{"sub": "1e332165-59d3-4039-84d7-1a9a0ad07679", "email": "sergioguevarab@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-04-07 19:26:57.508443+00', '2026-04-07 19:26:57.508729+00', '2026-04-07 19:26:57.508729+00', 'd928dd19-2d63-49f3-831f-88417c0921bd'),
	('a27483b8-9eee-4479-8417-dab866186c37', 'a27483b8-9eee-4479-8417-dab866186c37', '{"sub": "a27483b8-9eee-4479-8417-dab866186c37", "email": "rhuanca@abogatech.com", "email_verified": false, "phone_verified": false}', 'email', '2026-04-09 18:25:27.764569+00', '2026-04-09 18:25:27.764676+00', '2026-04-09 18:25:27.764676+00', '36e1bd7e-15a1-40c2-96d6-58cf17625f0b'),
	('3f20f9a1-5850-49eb-ace5-73b4fee3d4d6', '3f20f9a1-5850-49eb-ace5-73b4fee3d4d6', '{"sub": "3f20f9a1-5850-49eb-ace5-73b4fee3d4d6", "email": "ltarqui@abogatech.com", "email_verified": false, "phone_verified": false}', 'email', '2026-04-09 19:32:56.971992+00', '2026-04-09 19:32:56.972584+00', '2026-04-09 19:32:56.972584+00', 'b75ab18d-37ee-4be6-81de-68a8f6282ddf'),
	('f2aba17c-886d-4eaf-9f64-26445ef6582a', 'f2aba17c-886d-4eaf-9f64-26445ef6582a', '{"sub": "f2aba17c-886d-4eaf-9f64-26445ef6582a", "email": "arodriguez@abogatech.com", "email_verified": false, "phone_verified": false}', 'email', '2026-04-09 20:50:59.765835+00', '2026-04-09 20:50:59.766075+00', '2026-04-09 20:50:59.766075+00', '15394645-1e24-4952-82f8-85276833be42'),
	('6d482b42-e6fe-4123-acf8-04c2dddee69e', '6d482b42-e6fe-4123-acf8-04c2dddee69e', '{"sub": "6d482b42-e6fe-4123-acf8-04c2dddee69e", "email": "kikekikop@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-04-13 21:09:59.725356+00', '2026-04-13 21:09:59.725443+00', '2026-04-13 21:09:59.725443+00', 'a1da25a3-194a-4d87-aa6f-991ded18ee8c'),
	('d2d54597-3bf7-4ff3-a604-f521b7dda59f', 'd2d54597-3bf7-4ff3-a604-f521b7dda59f', '{"sub": "d2d54597-3bf7-4ff3-a604-f521b7dda59f", "email": "djimenez@abogatech.com", "email_verified": false, "phone_verified": false}', 'email', '2026-04-21 19:27:11.32166+00', '2026-04-21 19:27:11.322076+00', '2026-04-21 19:27:11.322076+00', '5f8d9a1d-c227-4a5e-a1d6-94d89b235362'),
	('bbd33588-f1bd-4fee-8e9d-b73d56c727f3', 'bbd33588-f1bd-4fee-8e9d-b73d56c727f3', '{"sub": "bbd33588-f1bd-4fee-8e9d-b73d56c727f3", "email": "ftarqui@abogatech.com", "email_verified": false, "phone_verified": false}', 'email', '2026-04-28 15:36:02.326769+00', '2026-04-28 15:36:02.326868+00', '2026-04-28 15:36:02.326868+00', 'eed00504-85fb-4fea-9afa-8e73d09f5d41'),
	('9d8a3be2-4885-4060-9c81-58905245700a', '9d8a3be2-4885-4060-9c81-58905245700a', '{"sub": "9d8a3be2-4885-4060-9c81-58905245700a", "email": "rhuanca@abogadoya.tech", "email_verified": false, "phone_verified": false}', 'email', '2026-05-04 18:53:02.867913+00', '2026-05-04 18:53:02.867987+00', '2026-05-04 18:53:02.867987+00', '01ef04ea-3e53-4158-aa52-dbf3d1b13b85'),
	('a5ff653a-35fb-4115-9ab8-8dfefc07dc52', 'a5ff653a-35fb-4115-9ab8-8dfefc07dc52', '{"sub": "a5ff653a-35fb-4115-9ab8-8dfefc07dc52", "email": "ohitachib@abogadoya.tech", "email_verified": false, "phone_verified": false}', 'email', '2026-05-04 19:25:08.889918+00', '2026-05-04 19:25:08.890203+00', '2026-05-04 19:25:08.890203+00', 'f1dbb1cb-0829-4bef-af72-220e3c7a1d00'),
	('48cc2915-6363-4660-b454-b367b4a5ccd3', '48cc2915-6363-4660-b454-b367b4a5ccd3', '{"sub": "48cc2915-6363-4660-b454-b367b4a5ccd3", "email": "mtarquia@abogadoya.tech", "email_verified": false, "phone_verified": false}', 'email', '2026-05-04 19:32:35.852711+00', '2026-05-04 19:32:35.852777+00', '2026-05-04 19:32:35.852777+00', '13834393-fc6d-4240-8c4e-6d83de18033c'),
	('33e61366-bd9b-479f-a072-42fa846f4ecf', '33e61366-bd9b-479f-a072-42fa846f4ecf', '{"sub": "33e61366-bd9b-479f-a072-42fa846f4ecf", "email": "avillalbac@abogadoya.tech", "email_verified": false, "phone_verified": false}', 'email', '2026-05-04 19:45:46.308128+00', '2026-05-04 19:45:46.308383+00', '2026-05-04 19:45:46.308383+00', '29b24418-a484-40d1-b812-36e0b7c535e2'),
	('917a4162-45aa-421e-a5c6-fc648de744a1', '917a4162-45aa-421e-a5c6-fc648de744a1', '{"sub": "917a4162-45aa-421e-a5c6-fc648de744a1", "email": "msacat@abogadoya.tech", "email_verified": false, "phone_verified": false}', 'email', '2026-05-06 20:49:27.667624+00', '2026-05-06 20:49:27.667819+00', '2026-05-06 20:49:27.667819+00', 'fbfc9b10-318a-48ee-a10c-43a0e3d629bd'),
	('79d78a1e-e5dd-4f82-9d73-9ce33b2c2a24', '79d78a1e-e5dd-4f82-9d73-9ce33b2c2a24', '{"sub": "79d78a1e-e5dd-4f82-9d73-9ce33b2c2a24", "email": "fabri@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-07 20:31:08.912961+00', '2026-05-07 20:31:08.913056+00', '2026-05-07 20:31:08.913056+00', '9cd61ee3-1e26-4f52-9b68-5a433e6a65bc'),
	('c4fd4f50-d3bc-4c2e-a8c6-7e9fbc76e5a8', 'c4fd4f50-d3bc-4c2e-a8c6-7e9fbc76e5a8', '{"sub": "c4fd4f50-d3bc-4c2e-a8c6-7e9fbc76e5a8", "email": "svillalbac@abogatech.com", "email_verified": false, "phone_verified": false}', 'email', '2026-05-08 20:49:40.861868+00', '2026-05-08 20:49:40.862153+00', '2026-05-08 20:49:40.862153+00', 'dda6c6e9-f71e-4557-945e-4486a338a4b6');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('cdbc7ede-7b20-498b-8ca1-ee7e97b40f67', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-05-19 20:33:32.955782+00', '2026-05-19 20:33:32.955782+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '172.19.0.1', NULL, NULL, NULL, NULL, NULL),
	('cd75ddb6-d01e-4ae5-b1e6-7a463d572174', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-05-19 20:33:36.761844+00', '2026-05-19 20:33:36.761844+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '172.19.0.1', NULL, NULL, NULL, NULL, NULL),
	('1d16c908-8cb7-4d32-8add-950ae507bbf0', 'd2d54597-3bf7-4ff3-a604-f521b7dda59f', '2026-05-14 17:09:01.166504+00', '2026-05-19 19:26:15.353249+00', NULL, 'aal1', NULL, '2026-05-19 19:26:15.353065', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '172.19.0.1', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('1d16c908-8cb7-4d32-8add-950ae507bbf0', '2026-05-14 17:09:01.170445+00', '2026-05-14 17:09:01.170445+00', 'password', '41da9a94-aa89-4b1f-95e9-d3f57d01a80d'),
	('cdbc7ede-7b20-498b-8ca1-ee7e97b40f67', '2026-05-19 20:33:32.972913+00', '2026-05-19 20:33:32.972913+00', 'password', '6d3ff21c-99be-4a52-9c71-53fe1136450e'),
	('cd75ddb6-d01e-4ae5-b1e6-7a463d572174', '2026-05-19 20:33:36.770134+00', '2026-05-19 20:33:36.770134+00', 'password', '54feb04a-9bdb-49ff-a86d-36a00061be8d');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") VALUES
	('a0783cb0-6ccf-409c-a24c-204c5cd5af0b', '6251f6be-0b58-4e65-bc74-6c1f894d459a', 'recovery_token', 'af8aa6a7689289e8609d8ccdef432fbb7ab6d829278435110b24ee57', 'nguevara@abogados.bo', '2026-03-30 20:57:26.957883', '2026-03-30 20:57:26.957883');


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 338, 'ueljioj37a6s', 'd2d54597-3bf7-4ff3-a604-f521b7dda59f', true, '2026-05-14 17:09:01.168669+00', '2026-05-19 19:26:15.336716+00', NULL, '1d16c908-8cb7-4d32-8add-950ae507bbf0'),
	('00000000-0000-0000-0000-000000000000', 339, 'hf5k2avkmrff', 'd2d54597-3bf7-4ff3-a604-f521b7dda59f', false, '2026-05-19 19:26:15.343239+00', '2026-05-19 19:26:15.343239+00', 'ueljioj37a6s', '1d16c908-8cb7-4d32-8add-950ae507bbf0'),
	('00000000-0000-0000-0000-000000000000', 343, '4t2hxcnp2e4b', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', false, '2026-05-19 20:33:32.965993+00', '2026-05-19 20:33:32.965993+00', NULL, 'cdbc7ede-7b20-498b-8ca1-ee7e97b40f67'),
	('00000000-0000-0000-0000-000000000000', 344, '6u4ggaaupwv4', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', false, '2026-05-19 20:33:36.766514+00', '2026-05-19 20:33:36.766514+00', NULL, 'cd75ddb6-d01e-4ae5-b1e6-7a463d572174');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: perfiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."perfiles" ("id", "rol", "telefono", "creado_en", "nombres", "apellido_paterno", "apellido_materno", "email", "creado_por") VALUES
	('d2d54597-3bf7-4ff3-a604-f521b7dda59f', 'abogado', '77665544', '2026-04-21 19:27:11.291471+00', 'Daner Guido', 'Jimenez', 'Escobar', NULL, NULL),
	('bbd33588-f1bd-4fee-8e9d-b73d56c727f3', 'abogado', '71283121', '2026-04-28 15:36:02.311897+00', 'fabricio', 'tarqui', 'villalba', NULL, NULL),
	('9d8a3be2-4885-4060-9c81-58905245700a', 'cliente', '70605040', '2026-05-04 18:53:02.844788+00', 'Rafael ', 'Huanca', 'Palacios', NULL, 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d'),
	('1e332165-59d3-4039-84d7-1a9a0ad07679', 'cliente', '71234567', '2026-04-07 19:26:57.492948+00', 'Sergio', 'Guevara', 'Barrero', NULL, 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d'),
	('6251f6be-0b58-4e65-bc74-6c1f894d459a', 'cliente', '67105670', '2026-03-30 20:55:11.68415+00', 'Nayeli', 'Guevara', 'Barrero', NULL, 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d'),
	('3f20f9a1-5850-49eb-ace5-73b4fee3d4d6', 'cliente', '71942617', '2026-04-09 19:32:56.956259+00', 'Luciana Mayte', 'Tarqui ', 'Villalba', NULL, 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d'),
	('a27483b8-9eee-4479-8417-dab866186c37', 'cliente', '7012345', '2026-04-09 18:25:27.725737+00', 'Kevin', 'Huanca', 'Palacios', NULL, 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d'),
	('48cc2915-6363-4660-b454-b367b4a5ccd3', 'cliente', '71942617', '2026-05-04 19:32:35.847797+00', 'Martin Ramiro', 'Tarqui ', 'Apaza', NULL, NULL),
	('a6be4506-720d-4b53-b427-4c7f1c14a85e', 'abogado', NULL, '2026-03-23 20:03:00.922299+00', 'Dr. Ariel', NULL, NULL, NULL, NULL),
	('d5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', 'admin', NULL, '2026-03-17 18:12:15+00', 'Dr. Iturri', NULL, NULL, NULL, NULL),
	('a5ff653a-35fb-4115-9ab8-8dfefc07dc52', 'cliente', '77665544', '2026-05-04 19:25:08.880567+00', 'Oscar Gabriel ', 'Hitachi', 'Bravo', NULL, '48cc2915-6363-4660-b454-b367b4a5ccd3'),
	('917a4162-45aa-421e-a5c6-fc648de744a1', 'cliente', '71906017', '2026-05-06 20:49:27.640773+00', 'Massiel', 'Saca', 'Tarqui', NULL, 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d'),
	('79d78a1e-e5dd-4f82-9d73-9ce33b2c2a24', 'cliente', '71234567', '2026-05-07 20:31:08.897945+00', 'Ariel', 'Guevara', 'VIllalba', NULL, 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d'),
	('c4fd4f50-d3bc-4c2e-a8c6-7e9fbc76e5a8', 'cliente', '76234904', '2026-05-08 20:49:40.841281+00', 'Sonia', 'Villalba', 'Caceres', NULL, 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d'),
	('33e61366-bd9b-479f-a072-42fa846f4ecf', 'cliente', '712382131', '2026-05-04 19:45:46.290965+00', 'Alfredo ', 'Villalba', 'Caceres', NULL, 'd2d54597-3bf7-4ff3-a604-f521b7dda59f'),
	('f2aba17c-886d-4eaf-9f64-26445ef6582a', 'abogado', '67105670', '2026-04-09 20:50:59.74592+00', 'Angela', 'Rodriguez', 'Copeticona', NULL, NULL),
	('6d482b42-e6fe-4123-acf8-04c2dddee69e', 'abogado', '71283121', '2026-04-13 21:09:59.712371+00', 'Ariel Fabricio', 'Tarqui', 'Villalba', NULL, NULL);


--
-- Data for Name: expedientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."expedientes" ("id", "numero_caso", "titulo", "descripcion", "estado", "cliente_id", "abogado_asignado_id", "fecha_creacion", "fecha_actualizacion", "materia", "juzgado", "parte_contraria", "informe_despacho", "informe_cliente", "rol_cliente", "tipo_proceso", "nurej", "numero_fiscalia", "numero_felcc", "juez_actual", "secretario_actuario", "fiscal_actual", "investigador_asignado", "etapa_procesal", "cuantia") VALUES
	('386fbc0f-a0c8-4fa1-a18e-d01fc75499f7', '2026-12-1312', 'Demanda por Bienes', NULL, 'en_espera', '33e61366-bd9b-479f-a072-42fa846f4ecf', 'd2d54597-3bf7-4ff3-a604-f521b7dda59f', '2026-05-04 20:01:58.374417+00', '2026-05-04 20:01:58.374417+00', 'Familia', 'Juzgado primero', 'Familia Villalba', 'Caso iniciado en plataforma corporativa.', 'Su expediente ha sido ingresado al sistema de seguimiento legal.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('e03fee81-7158-4d5e-9b28-8f7ecad9c50e', '2026-12-14', 'DEMANDA LABORAL', NULL, 'en_espera', '917a4162-45aa-421e-a5c6-fc648de744a1', 'd2d54597-3bf7-4ff3-a604-f521b7dda59f', '2026-05-06 20:50:19.227857+00', '2026-05-06 20:50:19.227857+00', 'Laboral', 'Juzgado primero', 'YAPE ', 'Caso iniciado en plataforma corporativa.', 'Su expediente ha sido ingresado al sistema de seguimiento legal.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('36abf022-cec4-482e-aa05-7112a300384d', '32424', 'tdemanda  x divorcio ', NULL, 'en_espera', '79d78a1e-e5dd-4f82-9d73-9ce33b2c2a24', 'f2aba17c-886d-4eaf-9f64-26445ef6582a', '2026-05-07 20:47:53.18473+00', '2026-05-07 20:47:53.18473+00', 'Penal', 'Juzgado primero', 'bcp', 'Caso iniciado en plataforma corporativa.', 'Su expediente ha sido ingresado al sistema de seguimiento legal.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('772fab4c-3c6b-4c63-a0f1-d04d0048e755', '01', 'Demanda por Bienes', NULL, 'en_espera', '1e332165-59d3-4039-84d7-1a9a0ad07679', 'd2d54597-3bf7-4ff3-a604-f521b7dda59f', '2026-05-11 15:48:31.031948+00', '2026-05-11 15:48:31.031948+00', 'Penal', 'Juzgado primero', 'Juan Perez', 'Caso iniciado en plataforma corporativa.', 'Su expediente ha sido ingresado al sistema de seguimiento legal.', 'Demandante', 'Oral', '2026-01-14', '11052026', '1105', 'Sofia Perez', 'Oscar Hitachi', 'Abel Menacho', 'Osman Villalba', 'Etapa Preparatoria', ''),
	('19385d2a-7efb-47b3-8eb7-67781c8d3475', '2024-25-48', 'Demanda por deuda', NULL, 'en_espera', '6251f6be-0b58-4e65-bc74-6c1f894d459a', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-03-30 20:55:55.95136+00', '2026-03-30 20:55:55.95136+00', 'Penal', '1ro publico', 'BNB', 'Caso iniciado en plataforma corporativa.', 'Su expediente ha sido ingresado al sistema de seguimiento legal.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('c4a1ad27-c64c-431a-8093-6cbfe9cdaf42', '2024-12-13', 'Demanda por deuda', NULL, 'cerrado', '6251f6be-0b58-4e65-bc74-6c1f894d459a', 'a6be4506-720d-4b53-b427-4c7f1c14a85e', '2026-04-07 18:46:09.679311+00', '2026-04-07 18:46:09.679311+00', 'Laboral', '2do publico', 'Mercantil', 'Caso iniciado en plataforma corporativa.', 'Su expediente ha sido ingresado al sistema de seguimiento legal.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('0ed7bbdd-d518-4d9b-83ea-d923f0a8066c', '2025-012-12', 'Demanda por Notas', NULL, 'en_espera', '6251f6be-0b58-4e65-bc74-6c1f894d459a', 'a6be4506-720d-4b53-b427-4c7f1c14a85e', '2026-04-07 19:37:08.324498+00', '2026-04-07 19:37:08.324498+00', 'Civil', '3ro publico', 'EMI', 'Caso iniciado en plataforma corporativa.', 'Su expediente ha sido ingresado al sistema de seguimiento legal.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('c52e10c2-ad14-4fb0-8edf-d2fe73f8a2e8', 'ASDASD', 'ASDASD', NULL, 'en_espera', '6251f6be-0b58-4e65-bc74-6c1f894d459a', 'a6be4506-720d-4b53-b427-4c7f1c14a85e', '2026-04-07 19:48:18.358406+00', '2026-04-07 19:48:18.358406+00', 'Civil', 'ASDASD', 'SADADSA', 'Caso iniciado en plataforma corporativa.', 'Su expediente ha sido ingresado al sistema de seguimiento legal.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('65608394-c991-4065-b3d2-5c72df7a1382', 'FGHFGF', 'FGGDFGDGD', NULL, 'en_espera', '6251f6be-0b58-4e65-bc74-6c1f894d459a', 'a6be4506-720d-4b53-b427-4c7f1c14a85e', '2026-04-07 19:48:57.655259+00', '2026-04-07 19:48:57.655259+00', 'Civil', 'DFGDFG', 'GDFGDFGDFG', 'Caso iniciado en plataforma corporativa.', 'Su expediente ha sido ingresado al sistema de seguimiento legal.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('86bd3052-55dc-4f63-9c34-ac5a2c3e9a2e', '2024-12-12', 'Demanda por apuesta', NULL, 'en_espera', 'a27483b8-9eee-4479-8417-dab866186c37', 'a6be4506-720d-4b53-b427-4c7f1c14a85e', '2026-04-09 19:20:43.184451+00', '2026-04-09 19:20:43.184451+00', 'Civil', '1ro publico', 'MI CASINO', 'Caso iniciado en plataforma corporativa.', 'Su expediente ha sido ingresado al sistema de seguimiento legal.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	('1d29c8a4-ec0a-4297-9dd1-3853155a18c4', '2026-12-12', 'Demanda por apuesta', NULL, 'en_espera', '1e332165-59d3-4039-84d7-1a9a0ad07679', 'd2d54597-3bf7-4ff3-a604-f521b7dda59f', '2026-04-09 19:25:32.382933+00', '2026-04-09 19:25:32.382933+00', 'Penal', '1ro Publico', 'METABET', 'Caso iniciado en plataforma corporativa.', 'Su expediente ha sido ingresado al sistema de seguimiento legal.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: agenda_eventos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."agenda_eventos" ("id", "titulo", "descripcion", "fecha_inicio", "fecha_fin", "tipo_evento", "estado", "expediente_id", "asignado_a", "creado_por", "creado_en") VALUES
	('6a3e140a-6580-46d9-9c99-8199ca560b46', 'Audiencia Inicial - Caso Rodriguez', 'Caso Rodriguez, presentar archivos y folder', '2026-04-15 11:30:00+00', '2026-04-15 18:30:00+00', 'reunion', 'pendiente', '1d29c8a4-ec0a-4297-9dd1-3853155a18c4', '6d482b42-e6fe-4123-acf8-04c2dddee69e', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-04-14 19:30:49.832941+00'),
	('7a2f01fd-8451-4821-b6b3-b97368b02424', 'Audiencia Inicial', 'Caso BNB', '2026-04-25 12:00:00+00', '2026-04-25 13:00:00+00', 'audiencia', 'pendiente', '1d29c8a4-ec0a-4297-9dd1-3853155a18c4', 'd2d54597-3bf7-4ff3-a604-f521b7dda59f', 'd2d54597-3bf7-4ff3-a604-f521b7dda59f', '2026-04-24 21:23:28.881571+00'),
	('7a3724a2-a31b-4510-88b4-cdafd7dbb8ca', 'AUDIENCIA INICIAL', 'AUDIENCIA INICIAL CASO YAPE', '2026-05-07 13:00:00+00', '2026-05-07 16:00:00+00', 'audiencia', 'pendiente', 'e03fee81-7158-4d5e-9b28-8f7ecad9c50e', 'd2d54597-3bf7-4ff3-a604-f521b7dda59f', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-05-06 20:51:05.335155+00'),
	('abde172b-ca46-4dda-a84e-4a559a845a95', 'Audiencia de Medidas Cautelares', 'Audiencia Caso Sergio', '2026-05-15 13:00:00+00', '2026-05-15 15:00:00+00', 'audiencia', 'pendiente', '1d29c8a4-ec0a-4297-9dd1-3853155a18c4', 'd2d54597-3bf7-4ff3-a604-f521b7dda59f', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-05-14 17:05:27.32408+00');


--
-- Data for Name: auditoria_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."auditoria_logs" ("id", "usuario_id", "accion", "entidad", "entidad_id", "detalles", "creado_en") VALUES
	('71f89517-0a84-4bf0-8be5-9e8614f6c3c3', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', 'EDITAR', 'expedientes', '1d29c8a4-ec0a-4297-9dd1-3853155a18c4', '{"campos_actualizados": {"estado": "cerrado"}, "timestamp_operacion": "2026-04-20T21:19:15.161Z"}', '2026-04-20 21:19:15.259479+00'),
	('e737a4bc-012d-4817-825c-a1d96cfbe29e', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', 'ELIMINAR', 'documentos', 'c947d157-18c1-4d87-9655-6239e35a01fd', '{"ruta_storage": "1d29c8a4-ec0a-4297-9dd1-3853155a18c4/1775763066214_Contrato De Desarrollo De Software Crm Legal.pdf", "timestamp_operacion": "2026-04-20T21:19:19.546Z"}', '2026-04-20 21:19:19.646029+00'),
	('e6f53077-088b-4b95-95fb-5a9aaf245caf', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', 'CREAR', 'documentos', 'f57386c2-3072-4172-9bd1-c803a2c73c24', '{"tamano_bytes": 18148, "tipo_archivo": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "expediente_id": "1d29c8a4-ec0a-4297-9dd1-3853155a18c4", "nombre_archivo": "Contrato De Desarrollo De Software Crm Legal.docx", "timestamp_operacion": "2026-04-21T19:21:31.767Z"}', '2026-04-21 19:21:31.878863+00'),
	('55123a1a-5d78-4097-8202-92b593898f41', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', 'CREAR', 'plantillas', '779bcb65-6990-42c0-ae15-7a0add99027d', '{"tipo": "otro", "nombre": "DEMANDA BASE", "timestamp_operacion": "2026-04-23T16:47:06.867Z"}', '2026-04-23 16:47:06.966454+00'),
	('72fa27bd-6d28-4869-a8b8-c4692ef9d35c', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', 'CREAR', 'plantillas', '6ff155d4-3253-4a98-89f0-800b8d1c1fe8', '{"tipo": "memorial", "nombre": "SOLICITUD SIMPLE", "timestamp_operacion": "2026-04-23T16:47:46.383Z"}', '2026-04-23 16:47:46.475632+00'),
	('11ced5a2-a625-4732-93d1-e3a5bf7badde', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', 'EDITAR', 'expedientes', '1d29c8a4-ec0a-4297-9dd1-3853155a18c4', '{"campos_actualizados": {"estado": "en_espera"}, "timestamp_operacion": "2026-04-23T16:48:01.103Z"}', '2026-04-23 16:48:01.204003+00'),
	('c57a39b6-2bb9-419c-b6fd-5f5e4121a075', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', 'EDITAR', 'expedientes', '1d29c8a4-ec0a-4297-9dd1-3853155a18c4', '{"campos_actualizados": {"abogado_id": "d2d54597-3bf7-4ff3-a604-f521b7dda59f"}, "timestamp_operacion": "2026-04-24T19:32:09.045Z"}', '2026-04-24 19:32:09.149764+00'),
	('4a235418-e578-4c4f-9edd-efe506f5235c', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', 'EDITAR', 'expedientes', '19385d2a-7efb-47b3-8eb7-67781c8d3475', '{"campos_actualizados": {"abogado_id": "d2d54597-3bf7-4ff3-a604-f521b7dda59f"}, "timestamp_operacion": "2026-04-24T19:57:16.220Z"}', '2026-04-24 19:57:16.324258+00'),
	('aa87c61d-4650-4158-8a6d-b19d3a305d07', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', 'EDITAR', 'expedientes', 'c4a1ad27-c64c-431a-8093-6cbfe9cdaf42', '{"campos_actualizados": {"abogado_id": "d2d54597-3bf7-4ff3-a604-f521b7dda59f"}, "timestamp_operacion": "2026-04-24T19:58:09.998Z"}', '2026-04-24 19:58:10.102332+00'),
	('b21ed696-4e42-4266-ba9c-3da1449e7b7a', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', 'EDITAR', 'expedientes', '0ed7bbdd-d518-4d9b-83ea-d923f0a8066c', '{"campos_actualizados": {"abogado_id": "d2d54597-3bf7-4ff3-a604-f521b7dda59f"}, "timestamp_operacion": "2026-04-24T19:58:18.321Z"}', '2026-04-24 19:58:18.444955+00'),
	('df7fb24a-0abb-4438-8d66-2d3946790aa1', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', 'EDITAR', 'expedientes', 'c52e10c2-ad14-4fb0-8edf-d2fe73f8a2e8', '{"campos_actualizados": {"abogado_id": "d2d54597-3bf7-4ff3-a604-f521b7dda59f"}, "timestamp_operacion": "2026-04-24T20:00:19.889Z"}', '2026-04-24 20:00:20.061051+00'),
	('4d645944-9307-436f-a2ae-606725e3ca0e', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', 'EDITAR', 'expedientes', '19385d2a-7efb-47b3-8eb7-67781c8d3475', '{"campos_actualizados": {"abogado_id": "d2d54597-3bf7-4ff3-a604-f521b7dda59f"}, "timestamp_operacion": "2026-04-24T20:00:30.544Z"}', '2026-04-24 20:00:30.633403+00'),
	('5d21f612-a13c-4727-a3bc-15c073b84e97', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', 'EDITAR', 'expedientes', '1d29c8a4-ec0a-4297-9dd1-3853155a18c4', '{"campos_actualizados": {"abogado_id": "d2d54597-3bf7-4ff3-a604-f521b7dda59f"}, "timestamp_operacion": "2026-04-24T20:04:41.337Z"}', '2026-04-24 20:04:41.440115+00'),
	('b4b4125e-b700-49e1-acfd-98496c26253c', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', 'CREAR', 'expedientes', 'e03fee81-7158-4d5e-9b28-8f7ecad9c50e', '{"titulo": "DEMANDA LABORAL", "materia": "Laboral", "numero_caso": "2026-12-14", "timestamp_operacion": "2026-05-06T20:50:19.248Z"}', '2026-05-06 20:50:19.422894+00'),
	('f1766e26-631e-4492-9fb6-bc332880c2a0', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', 'CREAR', 'expedientes', '36abf022-cec4-482e-aa05-7112a300384d', '{"titulo": "tdemanda  x divorcio ", "materia": "Penal", "numero_caso": "32424", "timestamp_operacion": "2026-05-07T20:47:53.207Z"}', '2026-05-07 20:47:53.339666+00'),
	('27ca8401-d3e0-4822-a7c6-7dba2d9b2927', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', 'EDITAR', 'expedientes', '36abf022-cec4-482e-aa05-7112a300384d', '{"campos_actualizados": {"abogado_id": "f2aba17c-886d-4eaf-9f64-26445ef6582a"}, "timestamp_operacion": "2026-05-07T20:49:49.654Z"}', '2026-05-07 20:49:49.777067+00'),
	('6072c9b0-a4c4-4f69-9fa2-a4aee5421f28', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', 'CREAR', 'documentos', 'c7794a11-4e82-4c14-8491-50cbe06bd161', '{"tamano_bytes": 1102943, "tipo_archivo": "text/html", "expediente_id": "36abf022-cec4-482e-aa05-7112a300384d", "nombre_archivo": "REGLA_90_ARIEL_FABRICIO_TARQUI_VILLALBA.html", "timestamp_operacion": "2026-05-07T20:50:06.433Z"}', '2026-05-07 20:50:06.540359+00'),
	('95512a37-1b1f-4c52-b3b4-246f01ab5de4', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', 'CREAR', 'expedientes', '772fab4c-3c6b-4c63-a0f1-d04d0048e755', '{"titulo": "Demanda por Bienes", "materia": "Penal", "numero_caso": "01", "timestamp_operacion": "2026-05-11T15:48:31.082Z"}', '2026-05-11 15:48:31.195838+00'),
	('8ea326e9-b960-4187-b746-65b5e7326d93', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', 'CREAR', 'informes_avance', 'bfba4be0-ed4f-48a7-88f2-2063a999c6cd', '{"mes_anio": "Mayo de 2026", "expediente_id": "772fab4c-3c6b-4c63-a0f1-d04d0048e755", "timestamp_operacion": "2026-05-11T15:51:00.388Z"}', '2026-05-11 15:51:00.509935+00');


--
-- Data for Name: bitacora; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."bitacora" ("id", "expediente_id", "contenido", "visible_cliente", "creado_por", "creado_en") VALUES
	('4cca8ba6-e2c1-494a-b039-430ff583d785', '19385d2a-7efb-47b3-8eb7-67781c8d3475', 'Prubea del caso', false, 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-03-31 17:35:30.892974+00'),
	('ff3a270a-6f29-42bd-a073-b7705a6b2ecd', '19385d2a-7efb-47b3-8eb7-67781c8d3475', 'Prueba del Caso', true, 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-03-31 17:35:37.938622+00'),
	('b8fabb99-aa1d-4f5f-862d-6c88137d7d41', '19385d2a-7efb-47b3-8eb7-67781c8d3475', 'Hola', false, 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-04-06 18:10:20.253845+00'),
	('434699f7-9a8d-4b21-a200-48222bf3e01c', '1d29c8a4-ec0a-4297-9dd1-3853155a18c4', 'Hola', false, 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-04-09 19:26:51.153128+00'),
	('04b9a081-1a34-4881-8748-523425434d2d', '1d29c8a4-ec0a-4297-9dd1-3853155a18c4', 'Hola Cliente', true, 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-04-09 19:27:13.440656+00'),
	('bb59bd32-4222-4097-b543-fe431a299f09', '1d29c8a4-ec0a-4297-9dd1-3853155a18c4', 'Hola', false, 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-04-21 19:21:37.171097+00'),
	('ef6dc28d-8acb-471a-8de3-feb77e3e22bc', '1d29c8a4-ec0a-4297-9dd1-3853155a18c4', 'Dr. Fabricio, revise bien la foja 45, me parece que hay un error', false, 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-04-28 16:32:05.382702+00'),
	('0da28410-5f0e-49af-a63c-f6fa8b557125', '1d29c8a4-ec0a-4297-9dd1-3853155a18c4', 'Foja 45 revisada, sin error', false, 'd2d54597-3bf7-4ff3-a604-f521b7dda59f', '2026-04-28 16:32:35.860917+00'),
	('23ac7057-662d-4fbb-893f-beca4498a53b', '36abf022-cec4-482e-aa05-7112a300384d', 'hola', false, 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-05-07 20:50:44.000052+00'),
	('e2c03aec-f138-498f-8892-6e8b1442f5a1', '36abf022-cec4-482e-aa05-7112a300384d', 'hola', true, 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-05-07 20:50:55.653974+00');


--
-- Data for Name: configuracion_global; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."configuracion_global" ("id", "categoria", "valor", "activo", "creado_en") VALUES
	('6b259b2b-7d12-4e62-bd85-f616d1546fcf', 'juzgado', 'Juzgado primero', true, '2026-04-20 20:00:51.391246+00'),
	('969e01d6-66da-4dad-afc2-29eee2bee120', 'tipo_evento', 'Audiencia precautelar', true, '2026-04-20 20:01:04.275052+00'),
	('815a712f-eb03-4caa-93ec-517370699d2a', 'materia', 'Forense', true, '2026-04-20 21:19:00.580006+00'),
	('5115208c-ba75-4278-bdbb-7d9e3c4d447b', 'juzgado', 'Juzgado segundo', true, '2026-04-21 17:58:07.307693+00'),
	('14657df9-7659-426b-b333-7cbff0b1975b', 'tipo_evento', 'Audiencia cautelar', true, '2026-04-21 17:58:41.063659+00');


--
-- Data for Name: honorarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."honorarios" ("id", "expediente_id", "monto_total", "moneda", "estado_contrato", "creado_en", "creado_por") VALUES
	('79f77871-6b08-47b9-b006-66534c68d467', '1d29c8a4-ec0a-4297-9dd1-3853155a18c4', 100.00, 'BS', 'vigente', '2026-04-16 20:53:10.232432+00', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d'),
	('1f2cf111-43c4-42ab-b35c-c983ad6832a0', '36abf022-cec4-482e-aa05-7112a300384d', 200.00, 'BS', 'vigente', '2026-05-07 20:52:49.099783+00', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d');


--
-- Data for Name: cuotas_pago; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."cuotas_pago" ("id", "honorario_id", "descripcion", "monto", "fecha_vencimiento", "estado", "fecha_pago", "creado_en") VALUES
	('296d29a4-c0a8-4f46-aa51-53a28310ed08', '79f77871-6b08-47b9-b006-66534c68d467', 'Audiencia', 10.00, '2026-04-17', 'pendiente', NULL, '2026-04-16 20:53:10.291501+00'),
	('a6093ce2-ca7f-4427-928c-e1ef14352a5f', '1f2cf111-43c4-42ab-b35c-c983ad6832a0', 'PRIMERA', 100.00, '2026-05-08', 'pendiente', NULL, '2026-05-07 20:52:49.124063+00'),
	('3e5b6d8a-4323-4f76-ba2b-f8ec88d4f111', '1f2cf111-43c4-42ab-b35c-c983ad6832a0', 'SEGUDA', 100.00, '2026-05-09', 'pendiente', NULL, '2026-05-07 20:52:49.124063+00');


--
-- Data for Name: detalles_cliente; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."detalles_cliente" ("perfil_id", "ci", "expedido", "estado_civil", "profesion", "direccion", "actualizado_en", "nacionalidad", "fecha_nacimiento", "referido_por", "contacto_referidor", "telefono_laboral", "direccion_oficina") VALUES
	('1e332165-59d3-4039-84d7-1a9a0ad07679', '123456', 'LP', 'Soltero/a', 'Estudiante', 'Av. Arce', '2026-04-07 19:26:57.55998+00', 'Boliviana', '2004-01-04', NULL, NULL, NULL, NULL),
	('6251f6be-0b58-4e65-bc74-6c1f894d459a', '7193743', 'OR', 'Soltero/a', 'Estudiante', 'Av Kantutani', '2026-03-30 20:55:11.951739+00', 'Boliviana', '2004-08-04', NULL, NULL, NULL, NULL),
	('3f20f9a1-5850-49eb-ace5-73b4fee3d4d6', '4271702', 'LP', 'Soltero/a', 'Estudiante', 'Av. Flor Medina', '2026-04-09 19:32:57.050393+00', 'Boliviana', '2008-03-05', NULL, NULL, NULL, NULL),
	('a27483b8-9eee-4479-8417-dab866186c37', '6818794', 'LP', 'Soltero/a', 'Estudiante', 'Av. Buenos Aires', '2026-04-09 18:25:27.871465+00', 'Boliviana', '2001-11-11', NULL, NULL, NULL, NULL),
	('9d8a3be2-4885-4060-9c81-58905245700a', '4271702', 'LP', 'Soltero/a', 'Ingeniero Industrial', 'Av Buenos Aires', '2026-05-04 18:53:02.962686+00', 'Boliviana', '2004-10-30', NULL, NULL, NULL, NULL),
	('a5ff653a-35fb-4115-9ab8-8dfefc07dc52', '4271701', 'LP', 'Soltero/a', 'Ingeniero Civil', 'Av Flor Medina', '2026-05-04 19:25:08.957142+00', 'Boliviana', '2005-10-31', NULL, NULL, NULL, NULL),
	('48cc2915-6363-4660-b454-b367b4a5ccd3', '4271702', 'LP', 'Soltero/a', 'Comerciante', 'Av. Julio Viera', '2026-05-04 19:32:35.919334+00', 'Boliviana', '1972-06-17', NULL, NULL, NULL, NULL),
	('917a4162-45aa-421e-a5c6-fc648de744a1', '4270123', 'LP', 'Soltero/a', 'Ingeniera Comercial', 'Av. Florida ', '2026-05-06 20:49:27.87191+00', 'Boliviana', '2001-10-20', NULL, NULL, NULL, NULL),
	('79d78a1e-e5dd-4f82-9d73-9ce33b2c2a24', '6818794', 'SCZ', 'Soltero/a', 'Estudiante', 'av', '2026-05-07 20:31:08.978001+00', 'Boliviana', '2001-02-12', NULL, NULL, NULL, NULL),
	('c4fd4f50-d3bc-4c2e-a8c6-7e9fbc76e5a8', '6818794012', 'TJ', 'Casado/a', 'Comerciante', 'Av Flor Medina', '2026-05-08 20:49:40.939313+00', 'Boliviana', '1982-04-30', NULL, NULL, NULL, NULL),
	('33e61366-bd9b-479f-a072-42fa846f4ecf', '10203040', 'CH', 'Casado/a', 'Abogado', 'Av. Fer Quebracho', '2026-05-04 19:45:46.412561+00', 'Boliviana', '2000-04-12', NULL, NULL, '2-24004204', 'Av. 6 de Agosto');


--
-- Data for Name: detalles_equipo; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."detalles_equipo" ("id", "especialidad", "cargo", "estado_laboral", "created_at") VALUES
	('f2aba17c-886d-4eaf-9f64-26445ef6582a', 'Laboral', 'Abogado Junior', 'activo', '2026-04-09 20:50:59.850954+00'),
	('6d482b42-e6fe-4123-acf8-04c2dddee69e', 'Derecho Laboral', 'Abogado Junior', 'activo', '2026-04-13 21:09:59.778028+00'),
	('d2d54597-3bf7-4ff3-a604-f521b7dda59f', 'Derecho Civil', 'Abogado Junior', 'activo', '2026-04-21 19:27:11.401268+00'),
	('bbd33588-f1bd-4fee-8e9d-b73d56c727f3', 'Penal', 'Abogado Junior', 'activo', '2026-04-28 15:36:02.396261+00');


--
-- Data for Name: documentos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."documentos" ("id", "expediente_id", "nombre_archivo", "ruta_storage", "tipo_archivo", "tamano_bytes", "visible_cliente", "subido_por", "creado_en") VALUES
	('d8c050dc-1f06-4d6c-8cdc-050d809c8ff2', '19385d2a-7efb-47b3-8eb7-67781c8d3475', 'Propuesta de Estudio de Mercado.pdf', '19385d2a-7efb-47b3-8eb7-67781c8d3475/1775499001673_Propuesta de Estudio de Mercado.pdf', 'application/pdf', 75134, false, 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-04-06 18:10:02.513297+00'),
	('f57386c2-3072-4172-9bd1-c803a2c73c24', '1d29c8a4-ec0a-4297-9dd1-3853155a18c4', 'Contrato De Desarrollo De Software Crm Legal.docx', '1d29c8a4-ec0a-4297-9dd1-3853155a18c4/1776799290858_Contrato_De_Desarrollo_De_Software_Crm_Legal.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 18148, false, 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-04-21 19:21:31.754634+00'),
	('9ffc85a7-9803-44a0-9c79-e3f7dd9859d8', '1d29c8a4-ec0a-4297-9dd1-3853155a18c4', 'Ejemplos de Fraude Financiero - Legislación 2026.pdf', '1d29c8a4-ec0a-4297-9dd1-3853155a18c4/1777392942446_Ejemplos_de_Fraude_Financiero_-_Legislacion_2026.pdf', 'application/pdf', 75219, true, 'd2d54597-3bf7-4ff3-a604-f521b7dda59f', '2026-04-28 16:15:43.265922+00'),
	('c7794a11-4e82-4c14-8491-50cbe06bd161', '36abf022-cec4-482e-aa05-7112a300384d', 'REGLA_90_ARIEL_FABRICIO_TARQUI_VILLALBA.html', '36abf022-cec4-482e-aa05-7112a300384d/1778187005031_REGLA_90_ARIEL_FABRICIO_TARQUI_VILLALBA.html', 'text/html', 1102943, true, 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-05-07 20:50:06.420748+00');


--
-- Data for Name: gastos_expediente; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."gastos_expediente" ("id", "expediente_id", "concepto", "monto", "fecha", "reembolsado", "comprobante_url", "creado_en", "creado_por", "observaciones") VALUES
	('cc886c35-8598-4053-90de-41e6b051fd7c', '1d29c8a4-ec0a-4297-9dd1-3853155a18c4', 'Fotocopias Legalizadas', 10.00, '2026-04-27', false, NULL, '2026-04-28 16:37:11.981621+00', 'd2d54597-3bf7-4ff3-a604-f521b7dda59f', NULL),
	('5fad5567-3071-480b-8d05-eb4cf18646ec', '1d29c8a4-ec0a-4297-9dd1-3853155a18c4', 'Taxi', 25.00, '2026-04-28', false, NULL, '2026-04-28 16:37:46.791506+00', 'd2d54597-3bf7-4ff3-a604-f521b7dda59f', NULL),
	('f8272d5a-3f76-46b7-96e6-6d79254a7799', '36abf022-cec4-482e-aa05-7112a300384d', 'Fotocopias Legalizadas', 10.00, '2026-05-07', false, NULL, '2026-05-07 20:58:58.718836+00', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', NULL),
	('b91d9b25-bb22-4b8d-876d-8fca7af1ab3e', '36abf022-cec4-482e-aa05-7112a300384d', 'TAXI', 50.00, '2026-05-08', true, NULL, '2026-05-08 20:51:51.251961+00', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', 'SE TOMO UN TAXI DESDE EL JUZGADO HASTA EL DOMICILIO DE LA PERSONA');


--
-- Data for Name: informes_avance; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."informes_avance" ("id", "expediente_id", "mes_anio", "resumen_proceso", "estado_actual", "medidas_precautorias", "comentario", "creado_por", "created_at") VALUES
	('bfba4be0-ed4f-48a7-88f2-2063a999c6cd', '772fab4c-3c6b-4c63-a0f1-d04d0048e755', 'Mayo de 2026', 'Demanda iniciada por cobro de bono.', 'Juez admitió la demanda.', 'Retención de fondos denegada.', 'Necesito que me deposite 500 Bs para fotocopias.', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-05-11 15:51:00.37533+00');


--
-- Data for Name: plantillas_documentos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."plantillas_documentos" ("id", "nombre", "descripcion", "contenido", "tipo", "creado_por", "creado_en") VALUES
	('5dba83fc-091d-4c90-a4d3-84b9ef661f4b', 'Apersonamiento', 'Documento para que el abogado se presente formalmente en el proceso.', 'SEÑOR JUEZ {{JUZGADO}}

NUREJ: {{NUMERO_EXPEDIENTE}}

I. APERSONAMIENTO

Dentro del proceso en materia {{MATERIA}}, seguido por/contra quien corresponda, ante su autoridad con respeto expongo:

Yo, en representación de {{NOMBRE_CLIENTE}}, con C.I. Nº {{CI_CLIENTE}}, me apersono al presente proceso, solicitando se me hagan conocer futuras actuaciones.

II. DOMICILIO PROCESAL

Señalo domicilio procesal donde se me harán conocer futuras diligencias.

Será justicia.

{{FECHA_ACTUAL}}', 'memorial', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-04-20 19:06:09.709141+00'),
	('779bcb65-6990-42c0-ae15-7a0add99027d', 'DEMANDA BASE', 'Plantilla base para iniciar procesos civiles o similares.', 'SEÑOR JUEZ {{JUZGADO}}

I. DEMANDA

Yo, {{NOMBRE_CLIENTE}}, con C.I. Nº {{CI_CLIENTE}}, dentro del marco legal correspondiente, interpongo demanda en materia {{MATERIA}}.

II. FUNDAMENTOS DE HECHO

Señalo que los hechos que motivan la presente acción son los siguientes:

[DESCRIBIR HECHOS]

III. FUNDAMENTOS DE DERECHO

Amparo la presente acción conforme a la normativa vigente aplicable.

IV. PETITORIO

Solicito a su autoridad admitir la presente demanda y declarar PROBADA la misma conforme a derecho.

OTROSÍ.- Adjunta prueba documental pertinente.

{{FECHA_ACTUAL}}', 'otro', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-04-23 16:47:06.847567+00'),
	('6ff155d4-3253-4a98-89f0-800b8d1c1fe8', 'SOLICITUD SIMPLE', 'Para pedir actuaciones dentro del proceso (oficios, certificaciones, etc.).', 'SEÑOR JUEZ {{JUZGADO}}

NUREJ: {{NUMERO_EXPEDIENTE}}

Dentro del proceso en materia {{MATERIA}}, seguido por/contra quien corresponda, ante su autoridad expongo:

Solicito respetuosamente se disponga lo siguiente:

[DETALLE DE LA SOLICITUD]

Será justicia.

{{FECHA_ACTUAL}}', 'memorial', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-04-23 16:47:46.370074+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('documentos', 'documentos', NULL, '2026-03-27 20:43:52.311023+00', '2026-03-27 20:43:52.311023+00', true, false, NULL, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('337c77ee-629d-4dfe-90de-757f7d43af64', 'documentos', '383a7691-efc8-48b3-a542-6baf86acec79/1774645091982_TARQUI_VILLALBA_ARIEL_FABRICIO.pdf', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-03-27 20:58:12.508605+00', '2026-03-27 20:58:12.508605+00', '2026-03-27 20:58:12.508605+00', '{"eTag": "\"b7be97472641c785c888b4986e0bf7cd\"", "size": 96829, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-03-27T20:58:12.489Z", "contentLength": 96829, "httpStatusCode": 200}', '5117593b-85df-4452-95d5-e7f8e27ef456', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '{}'),
	('83d31703-8454-4d5c-9ae0-39f3232ceb07', 'documentos', '383a7691-efc8-48b3-a542-6baf86acec79/1774645431378_Gemini_Generated_Image_2zqm632zqm632zqm.png', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-03-27 21:03:53.022376+00', '2026-03-27 21:03:53.022376+00', '2026-03-27 21:03:53.022376+00', '{"eTag": "\"d4d82ebb8ef68fcc7c33c7837c64ea07\"", "size": 7972039, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-03-27T21:03:52.910Z", "contentLength": 7972039, "httpStatusCode": 200}', '3f22dbf6-80f2-4edd-8ecd-57b3ff98d267', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '{}'),
	('7b1205c7-8ba8-49c3-b4fe-b5252008232b', 'documentos', '19385d2a-7efb-47b3-8eb7-67781c8d3475/1775499001673_Propuesta de Estudio de Mercado.pdf', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-04-06 18:10:02.439597+00', '2026-04-06 18:10:02.439597+00', '2026-04-06 18:10:02.439597+00', '{"eTag": "\"f414d2b462f134c09ca336665acaf203\"", "size": 75134, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-04-06T18:10:02.403Z", "contentLength": 75134, "httpStatusCode": 200}', '6039f52d-ce80-450c-a355-44ca3ca7bd00', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '{}'),
	('4864e131-bc94-42c2-826b-cbf7f844a252', 'documentos', '1d29c8a4-ec0a-4297-9dd1-3853155a18c4/1776799290858_Contrato_De_Desarrollo_De_Software_Crm_Legal.docx', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-04-21 19:21:31.694146+00', '2026-04-21 19:21:31.694146+00', '2026-04-21 19:21:31.694146+00', '{"eTag": "\"fac2b3af01a7efb613d9700c3851c524\"", "size": 18148, "mimetype": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "cacheControl": "max-age=3600", "lastModified": "2026-04-21T19:21:31.662Z", "contentLength": 18148, "httpStatusCode": 200}', '444aa7f6-f401-4aaa-965c-4931b64ba17f', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '{}'),
	('c064f4e7-ad71-4f2a-ac8d-4212c25ecb67', 'documentos', '1d29c8a4-ec0a-4297-9dd1-3853155a18c4/1777392942446_Ejemplos_de_Fraude_Financiero_-_Legislacion_2026.pdf', 'd2d54597-3bf7-4ff3-a604-f521b7dda59f', '2026-04-28 16:15:43.114993+00', '2026-04-28 16:15:43.114993+00', '2026-04-28 16:15:43.114993+00', '{"eTag": "\"97201e2774577de410ff4b36a4a3903f\"", "size": 75219, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-04-28T16:15:43.073Z", "contentLength": 75219, "httpStatusCode": 200}', 'a5ef6bcd-7016-4d8e-87e4-c36caa05ef81', 'd2d54597-3bf7-4ff3-a604-f521b7dda59f', '{}'),
	('315d0a99-ab26-443b-b4b9-3b72ebc7fcf6', 'documentos', '36abf022-cec4-482e-aa05-7112a300384d/1778187005031_REGLA_90_ARIEL_FABRICIO_TARQUI_VILLALBA.html', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '2026-05-07 20:50:06.24892+00', '2026-05-07 20:50:06.24892+00', '2026-05-07 20:50:06.24892+00', '{"eTag": "\"f1724d6a45648106433a35d7d5b949d7\"", "size": 1102943, "mimetype": "text/html", "cacheControl": "max-age=3600", "lastModified": "2026-05-07T20:50:05.794Z", "contentLength": 1102943, "httpStatusCode": 200}', '62c1b955-0928-43c3-ac4d-a84be2e332b6', 'd5b9b4c9-27d3-4c9a-9e0a-3ef77038271d', '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 344, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict JgwSjX0S6g3NqravKUaUSyvEYzo41v07fwbO0PdScXhkyOKkcHpA2VeNSXVFbvD

RESET ALL;
