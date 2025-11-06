# Quickstart Guide: Google Analytics Integration

**Feature**: 003-google-analytics
**Audience**: Developers and site owners
**Time to Complete**: 10 minutes
**Last Updated**: 2025-11-06

---

## Overview

This guide explains how to use the Google Analytics integration in the Vietnam Gross-to-Net Salary Calculator. You'll learn how to:
- View analytics data in the GA4 dashboard
- Understand tracked events and metrics
- Verify tracking is working correctly
- Troubleshoot common issues

---

## Prerequisites

- Google Analytics 4 property created (already done)
- Measurement ID: `G-9YLLHMNV3W` (configured)
- Access to GA4 dashboard: [analytics.google.com](https://analytics.google.com)

---

## Viewing Analytics Data

### 1. Access GA4 Dashboard

1. Go to [Google Analytics](https://analytics.google.com)
2. Select the **PIT (Salary Calculator)** property
3. Navigate to **Reports** in the left sidebar

### 2. Real-Time Reports

To verify tracking is working **immediately**:

1. **Reports** → **Realtime**
2. Open the calculator in a new tab: [pit.thangtd.com](https://pit.thangtd.com)
3. Perform actions (calculate salary, click presets, switch views)
4. Within 5-10 seconds, you should see:
   - **Active users**: +1 (your session)
   - **Events**: Page views, button clicks, calculations

**What to look for**:
- `page_view` events with paths: `/2025`, `/2026`, `/compare`
- `preset_click` events with labels: `preset_10M`, `preset_30M`, etc.
- `calculate_salary` events when you change inputs
- `regime_switch` events when toggling between views

### 3. Historical Reports

To view aggregate data over time:

1. **Reports** → **Engagement** → **Events**
2. See all tracked events with counts:
   - `page_view`: Total page loads and view switches
   - `preset_click`: Which presets are most popular
   - `calculate_salary`: How many calculations performed
   - `regime_switch`: User flow between 2025/2026/Compare
   - `share`: How often users share results

3. **Reports** → **Engagement** → **Pages and screens**
   - See which views are most popular: `/2025`, `/2026`, or `/compare`
   - Average engagement time per view

4. **Reports** → **User attributes** → **Overview**
   - Geographic distribution (Vietnam vs other countries)
   - Device types (mobile vs desktop)
   - Browser types

---

## Understanding Tracked Events

### Page Views

**Event**: `page_view`

**When triggered**:
- Initial page load
- Switching from 2025 to 2026 view
- Switching to comparison mode

**Parameters**:
- `page_path`: Virtual path (`/2025`, `/2026`, `/compare`)
- `page_title`: View title

**Example in GA4**:
```
Event: page_view
page_path: /2026
page_title: Salary Calculator 2026
```

---

### Preset Button Clicks

**Event**: `preset_click`

**When triggered**: User clicks a salary preset button (10M, 20M, 30M, etc.)

**Parameters**:
- `event_category`: `interaction`
- `event_label`: Preset identifier (e.g., `preset_30M`)
- `value`: Preset index (0-7)

**Example in GA4**:
```
Event: preset_click
event_category: interaction
event_label: preset_50M
value: 4
```

**Privacy Note**: Actual salary amounts (50,000,000 VND) are NOT tracked, only generic labels (50M).

---

### Salary Calculations

**Event**: `calculate_salary`

**When triggered**: User calculates net salary (by changing gross, dependents, or region)

**Parameters**:
- `regime`: Tax regime used (`2025` or `2026`)
- `has_input`: Whether user entered custom salary (`true`) or used preset (`false`)

**Example in GA4**:
```
Event: calculate_salary
regime: 2026
has_input: true
```

**Privacy Note**: Actual gross/net salary amounts are NOT tracked.

---

### Regime Switches

**Event**: `regime_switch`

**When triggered**: User toggles between 2025, 2026, or Compare views

**Parameters**:
- `from`: Previous view mode
- `to`: New view mode

**Example in GA4**:
```
Event: regime_switch
from: 2025
to: compare
```

**Use case**: Understand user flow - do users explore multiple regimes or stick to one?

---

### Share Actions

**Event**: `share`

**When triggered**: User shares results via URL or copies details

**Parameters**:
- `method`: Share method (`url` or `copy`)
- `regime`: Active regime when shared (optional)

**Example in GA4**:
```
Event: share
method: url
regime: 2026
```

**Use case**: Track feature usage - is sharing popular? Which method do users prefer?

---

## Verifying Tracking Works

### Method 1: Real-Time View (Recommended)

1. Open GA4 dashboard → **Realtime**
2. Open calculator: [pit.thangtd.com](https://pit.thangtd.com)
3. Perform actions and verify events appear within 5-10 seconds

✅ **Expected**: See events in real-time as you interact

❌ **If not working**: See [Troubleshooting](#troubleshooting) section

### Method 2: Browser DevTools

1. Open calculator in Chrome/Firefox
2. Open DevTools (F12) → **Console** tab
3. Look for `[Analytics]` log messages (development mode only)
4. Expected output:
   ```
   [Analytics] Page view tracked: /2025
   [Analytics] Event tracked: preset_click
   [Analytics] Event tracked: calculate_salary
   ```

### Method 3: Network Tab

1. Open DevTools → **Network** tab
2. Filter by `google-analytics.com` or `collect`
3. Perform actions on the calculator
4. Verify you see POST requests to GA4 endpoints

✅ **Expected**: See network requests when events are tracked

❌ **If blocked**: Ad blocker is active (expected, app still works)

---

## Troubleshooting

### No Events in GA4 Dashboard

**Symptom**: Real-time view shows 0 events, no data appearing

**Possible causes**:

1. **Measurement ID mismatch**
   - Check `index.html` contains `G-9YLLHMNV3W`
   - Verify GA4 property uses same ID
   - Solution: Update ID in code and redeploy

2. **GA4 property not set up**
   - Verify property exists at [analytics.google.com](https://analytics.google.com)
   - Check property is for "Web" platform (not iOS/Android)
   - Solution: Create web property with measurement ID

3. **Tracking not deployed**
   - Check deployed site has analytics code
   - View page source: Should see `gtag.js` script
   - Solution: Rebuild and redeploy

### Ad Blocker Warnings

**Symptom**: Console shows `gtag not available` or network requests blocked

**Expected behavior**: This is normal! 30-40% of users have ad blockers.

**Impact**:
- ✅ Calculator works normally (no errors)
- ❌ No analytics data collected for that user

**Solution**: No action needed. Track trends from users without blockers.

### Events Not Showing Correct Parameters

**Symptom**: Events appear but parameters are missing or wrong

**Possible causes**:

1. **Custom parameters not configured in GA4**
   - GA4 needs custom dimensions defined for non-standard params
   - Solution: Add custom dimensions in GA4 Admin → Custom Definitions

2. **Parameter validation failing**
   - Privacy filter may be blocking suspicious values
   - Solution: Check console for validation warnings (dev mode)

### Performance Issues

**Symptom**: Page loads slowly after adding analytics

**Diagnosis**:
1. Check Network tab: gtag.js should load async (not blocking)
2. Check Performance tab: Analytics calls should be <10ms
3. Verify `async` attribute on script tag in `index.html`

**Solution**:
- Ensure gtag.js uses `async` attribute
- Verify tracking calls are fire-and-forget (no awaits)

---

## Advanced Usage

### Creating Custom Reports

1. **Reports** → **Explore** → **Blank exploration**
2. Add dimensions:
   - `Event name`
   - `Page path`
   - `Event label`
3. Add metrics:
   - `Event count`
   - `Active users`
4. Apply filters (e.g., only `preset_click` events)
5. Save report for future use

**Example**: "Most Popular Presets" report
- Dimension: `event_label`
- Filter: `event_name = preset_click`
- Metric: `event_count`
- Sort: Descending by count

### Setting Up Alerts

1. **Admin** → **Custom Alerts**
2. Create alert for unusual activity:
   - **Condition**: Daily active users drops >50%
   - **Notification**: Email to admin
3. Use case: Detect tracking failures or traffic drops

### Exporting Data

1. **Reports** → Select any report
2. Click **Share** icon (top right)
3. Choose format:
   - **PDF**: Visual snapshot
   - **Google Sheets**: Editable data
   - **CSV**: Raw data export

---

## Privacy & Compliance

### What is Tracked

✅ **Anonymous data**:
- Page views (virtual paths: /2025, /2026, /compare)
- Button clicks (preset labels: preset_30M, etc.)
- Feature usage (calculations, regime switches, shares)
- Geographic location (city-level, anonymized IP)
- Device type, browser, screen size

❌ **NOT tracked**:
- Actual salary amounts (30,000,000 VND)
- User names, emails, or identities
- Exact IP addresses (anonymized)
- Sensitive personal information (PII)

### Privacy Settings Enabled

- ✅ **IP Anonymization**: Enabled (last octet removed)
- ✅ **Google Signals**: Disabled (no cross-device tracking)
- ✅ **Data Retention**: 14 months (GA4 default)
- ✅ **User Deletion**: Available on request (GDPR compliant)

### Disabling Analytics (If Needed)

To temporarily disable tracking:

1. **Method 1**: Set environment variable
   ```bash
   VITE_GA_MEASUREMENT_ID=""
   ```
   Rebuild and deploy.

2. **Method 2**: Remove gtag.js script from `index.html`
   Comment out or delete the `<script>` tags.

3. **Method 3**: Use ad blocker (user-side)
   Users can block analytics without affecting calculator functionality.

---

## Getting Help

### Resources

- **GA4 Documentation**: [support.google.com/analytics](https://support.google.com/analytics)
- **Event Debugging**: GA4 → **Admin** → **DebugView** (requires debug mode)
- **Feature Spec**: `specs/003-google-analytics/spec.md`
- **Implementation Plan**: `specs/003-google-analytics/plan.md`

### Debug Mode (Development)

To enable verbose logging:

1. Set environment variable:
   ```bash
   NODE_ENV=development
   ```

2. Console will show:
   ```
   [Analytics] gtag loaded successfully
   [Analytics] Page view tracked: /2025
   [Analytics] Event tracked: preset_click with params {...}
   ```

### Common Questions

**Q: How long does it take for data to appear in GA4?**
A: Real-time view: 5-10 seconds. Standard reports: Up to 24 hours.

**Q: Why is my data different from expected?**
A: Ad blockers, privacy tools, and bot filters affect tracking (expected 60-70% coverage).

**Q: Can I see individual user sessions?**
A: No. GA4 focuses on aggregated, anonymized data (privacy-first design).

**Q: How do I change the Measurement ID?**
A: Update `VITE_GA_MEASUREMENT_ID` env var, rebuild, redeploy.

---

## Summary

**Quick Reference**:
- 📊 **View data**: [analytics.google.com](https://analytics.google.com) → Realtime/Reports
- 🔍 **Verify tracking**: Realtime view or browser DevTools console
- 🎯 **Key events**: `page_view`, `preset_click`, `calculate_salary`, `regime_switch`, `share`
- 🔒 **Privacy**: IP anonymized, no PII tracked
- 🛠️ **Troubleshoot**: Check Measurement ID, verify deployment, test in Realtime

**Next Steps**:
1. Open GA4 dashboard and explore Realtime view
2. Test calculator interactions and watch events appear
3. Create custom reports for insights (e.g., popular presets)
4. Review weekly/monthly reports for trends

**Need more help?** Check the [data-model.md](./data-model.md) and [contracts/analytics-service.md](./contracts/analytics-service.md) for technical details.
