create table
  public.articles (
    id uuid not null default gen_random_uuid (),
    user_id uuid not null,
    title text not null,
    content text not null,
    category text not null,
    created_at timestamp
    with
      time zone not null default now (),
      updated_at timestamp
    with
      time zone not null default now (),
      image_url text null,
      constraint articles_pkey primary key (id),
      constraint articles_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
  ) TABLESPACE pg_default;

create trigger update_articles_updated_at BEFORE
update on articles for EACH row execute FUNCTION update_updated_at_column ();