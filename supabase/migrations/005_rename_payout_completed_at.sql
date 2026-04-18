-- ============================================================
-- 集計日キーの統一: payout_paid_at → payout_completed_at
-- Supabase Migration: 005_rename_payout_completed_at.sql
-- ============================================================
-- 30日/90日の売上集計バケットは「送金完了日」を唯一のキーとする。
-- 検収日 (client_approved_at) や案件完了日 (completed_at) ではない。
-- ============================================================

alter table projects rename column payout_paid_at to payout_completed_at;

-- trigger も新カラム名に追従
create or replace function handle_project_completed()
returns trigger as $$
begin
  if new.status = 'completed' and (old.status is null or old.status <> 'completed') then
    new.completed_at := coalesce(new.completed_at, now());
    new.auto_approval_deadline := coalesce(new.auto_approval_deadline, now() + interval '72 hours');
  end if;

  if new.status = 'cancelled' and (old.status is null or old.status <> 'cancelled') then
    new.cancelled_at := coalesce(new.cancelled_at, now());
  end if;
  if new.payout_status = 'refunded' and (old.payout_status is null or old.payout_status <> 'refunded') then
    new.refunded_at := coalesce(new.refunded_at, now());
  end if;
  if new.payout_status = 'disputed' and (old.payout_status is null or old.payout_status <> 'disputed') then
    new.disputed_at := coalesce(new.disputed_at, now());
  end if;
  if new.payout_status = 'paid' and (old.payout_status is null or old.payout_status <> 'paid') then
    new.payout_completed_at := coalesce(new.payout_completed_at, now());
  end if;

  return new;
end;
$$ language plpgsql security definer;
