drop table if exists topics;

create table topics (
  id bigint primary key generated always as identity
  , topic text not null
  , prompt text not null
  , promptliteral boolean default false
  , model varchar (255) default 'gpt-4o-mini'
  , message jsonb
  , usage jsonb
  , modified timestamp with time zone default timezone('utc'::text, now()) not null
  , dbu text default current_user
);

alter table topics enable row level security;

create policy "public can read topics"
on public.topics
for select to anon
using (true);

comment on table topics is 'contains the motd topic and last results';
comment on column topics.message is 'generated unparsed result';
comment on column topics.usage is 'resources consumed';

INSERT INTO 
    topics (topic, model, promptliteral, prompt) 
VALUES
     ('general','gpt-4o',true,'create a list of 50 "message of the day" quotes formatted as an array of json objects containing the fields message and author')
   , ('sopranos','gpt-4o-mini',false,'by characters from the sopranos')
   , ('got', 'gpt-4o-mini',false,'by characters from game of thrones or from house of the dragon')
   , ('elon','gpt-4o',false,'related to Elon Musk')
   , ('trump' ,'gpt-4o',false,'related to Donald Trump')
   , ('kamala','gpt-4o',false,'related to Kamala Harris')
   , ('politics','gpt-4o',false,'related to American Politics from the past month')
   ;
COMMIT;

