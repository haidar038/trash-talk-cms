create table public.profiles (
  id uuid not null,
  full_name text null,
  username text null,
  avatar_url text null,
  role public.user_role null default 'user'::user_role,
  updated_at timestamp with time zone null default timezone ('utc'::text, now()),
  constraint profiles_pkey primary key (id),
  constraint profiles_username_key unique (username),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE,
  constraint username_length check ((char_length(username) >= 3))
) TABLESPACE pg_default;

create trigger on_avatar_update BEFORE
update on profiles for EACH row when (old.avatar_url is distinct from new.avatar_url)
execute FUNCTION handle_avatar_update ();