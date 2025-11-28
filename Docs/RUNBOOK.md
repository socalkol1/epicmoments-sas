# Operations Runbook

> Common operational tasks and procedures.

## D.1 Manually Deliver Album

When automatic delivery fails:

```sql
-- 1. Check album status
SELECT id, title, status, client_id, delivered_at 
FROM albums WHERE id = '<album_id>';

-- 2. Mark as ready
UPDATE albums 
SET status = 'ready', delivered_at = NOW() 
WHERE id = '<album_id>';
```

```bash
# 3. Manually trigger notification
npm run script:send-album-notification -- --album-id=<album_id>
```

---

## D.2 Reset Client Password

**Via Dashboard:**
1. Supabase Dashboard → Authentication → Users
2. Find user by email
3. Click "..." → "Send password recovery"

**Via SQL:**
```sql
SELECT auth.send_recovery_email('<client_email>');
```

---

## D.3 Refund Order

1. **Stripe Dashboard:**
   - Payments → Find payment → Refund

2. **Update database:**
```sql
UPDATE orders 
SET status = 'refunded', updated_at = NOW()
WHERE stripe_payment_intent_id = '<pi_xxx>';
```

3. **Revoke album access (if needed):**
```sql
UPDATE albums 
SET status = 'cancelled', client_id = NULL
WHERE id = '<album_id>';
```

---

## D.4 Suspend Tenant

```sql
-- Suspend (blocks all access)
UPDATE tenants 
SET subscription_status = 'suspended' 
WHERE slug = '<tenant_slug>';

-- Restore
UPDATE tenants 
SET subscription_status = 'active' 
WHERE slug = '<tenant_slug>';
```

---

## D.5 View Tenant Usage

```sql
SELECT 
  t.slug,
  t.name,
  t.storage_used_bytes / (1024*1024*1024) as storage_gb,
  t.subscription_plan,
  (SELECT COUNT(*) FROM albums WHERE tenant_id = t.id) as albums,
  (SELECT COUNT(*) FROM profiles WHERE tenant_id = t.id AND role = 'client') as clients,
  (SELECT COUNT(*) FROM orders WHERE tenant_id = t.id AND status = 'paid') as orders
FROM tenants t
WHERE t.id = '<tenant_id>';
```

---

## D.6 Database Maintenance

**Clean old logs (run monthly):**
```sql
DELETE FROM activity_log WHERE created_at < NOW() - INTERVAL '90 days';
DELETE FROM notifications WHERE created_at < NOW() - INTERVAL '1 year';
VACUUM ANALYZE;
```

**Check table sizes:**
```sql
SELECT tablename, pg_size_pretty(pg_total_relation_size('public.' || tablename)) as size
FROM pg_tables WHERE schemaname = 'public'
ORDER BY pg_total_relation_size('public.' || tablename) DESC;
```

---

## D.7 Debug Stripe Webhooks

```bash
# List recent events
stripe events list --limit 10

# Get event details
stripe events retrieve <evt_xxx>

# Resend event
stripe events resend <evt_xxx>

# Check webhook endpoints
stripe webhook_endpoints list
```

**Common issues:**
- Signature failing: Check STRIPE_WEBHOOK_SECRET matches
- Events not arriving: Check endpoint URL is public
- Handler errors: Check Sentry

---

## D.8 B2 Storage Operations

```bash
# Authorize
b2 authorize-account <keyId> <key>

# List files
b2 ls photography-prod/<tenant_id>/

# Download file
b2 download-file-by-name photography-prod <path> <local>

# Delete file
b2 delete-file-version <fileName> <fileId>

# Check bucket usage
b2 get-bucket photography-prod
```

---

## D.9 Generate Support Report

Gather info for user support:

```sql
-- User info
SELECT id, email, full_name, role, tenant_id, created_at
FROM profiles WHERE email = '<email>';

-- Their tenant
SELECT * FROM tenants WHERE id = '<tenant_id>';

-- Recent orders
SELECT o.*, p.name as product
FROM orders o JOIN products p ON o.product_id = p.id
WHERE o.client_id = '<profile_id>'
ORDER BY o.created_at DESC LIMIT 5;

-- Recent activity
SELECT action, entity_type, created_at
FROM activity_log WHERE actor_id = '<profile_id>'
ORDER BY created_at DESC LIMIT 10;
```

---

## D.10 Incident Response

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| P1 | Site down, payments failing | 15 min |
| P2 | Major feature broken | 1 hour |
| P3 | Feature degraded | 4 hours |
| P4 | Minor bug | Next day |

### P1 Response Checklist

1. [ ] Acknowledge incident
2. [ ] Check Sentry for errors
3. [ ] Check Vercel deployment status
4. [ ] Check Supabase dashboard
5. [ ] Check Stripe dashboard
6. [ ] Rollback if recent deploy caused it
7. [ ] Communicate to affected users
8. [ ] Post-mortem within 24 hours

### Rollback

1. Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

---

## D.11 Tenant Offboarding

**Data retention:** 30 days after cancellation

**Deletion procedure:**
```sql
-- 1. Soft delete tenant
UPDATE tenants SET subscription_status = 'cancelled' WHERE id = '<id>';

-- 2. After 30 days, hard delete
DELETE FROM tenants WHERE id = '<id>';
```

```bash
# 3. Delete storage
b2 rm --recursive photography-prod/<tenant_id>/
```

```typescript
// 4. Revoke Stripe Connect
await stripe.accounts.del(tenant.stripe_account_id);
```

---

## Quick Reference

| Task | Command/Location |
|------|------------------|
| View logs | Vercel Dashboard → Logs |
| View errors | Sentry Dashboard |
| View DB | Supabase Dashboard → Table Editor |
| View payments | Stripe Dashboard |
| View storage | B2 Dashboard / CLI |
| Deploy | Push to main branch |
| Rollback | Vercel → Promote old deployment |
