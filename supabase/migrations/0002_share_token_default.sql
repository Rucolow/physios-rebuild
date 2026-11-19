-- Postgres 16 の encode() は base64url を知らないので、選手を作ると失敗していた。
-- 18 バイトの base64 は 24 文字で = が付かない。+ と / を URL で使える - と _ に置き換える。
alter table player alter column share_token set default translate(encode(gen_random_bytes(18), 'base64'), '+/', '-_');
