-- 迁移 002:根治示例数据重复插入(在 Supabase SQL Editor 运行)
-- 背景:seedSampleData 若被并发/连点触发,可能重复插入示例数据。
-- 方案:标记示例数据 + 部分唯一索引,让重复插入在数据库层被 ON CONFLICT 忽略。
-- 注意:普通订阅(is_sample=false)仍允许重名 —— 你可能真有两个同名订阅。

-- 1. 加一列标记是否示例数据
alter table subscriptions
  add column if not exists is_sample boolean not null default false;

-- 2. 部分唯一索引:同一用户的同名「示例」数据只能有一条
--    （只约束 is_sample = true 的行,普通订阅不受影响,可自由重名)
create unique index if not exists subscriptions_sample_unique
  on subscriptions (user_id, name)
  where is_sample = true;
