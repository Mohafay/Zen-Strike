"""
Clinic Referral Engine MCP server.

Makes a multi-location post-surgical MLD clinic's acquisition and referral
relationships measurable: where patients come from, which referring
surgeons are worth cultivating, and which relationships are quietly dying.

Mock data only. No PHI. See README.md.
"""

import json
from collections import defaultdict
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Any, Optional

from mcp.server.fastmcp import FastMCP

DATA_DIR = Path(__file__).parent / "data"
OUTREACH_LOG_PATH = DATA_DIR / "outreach_log.json"
SURGEONS_PATH = DATA_DIR / "surgeons.json"

mcp = FastMCP("Clinic Referral Engine")


# ---------------------------------------------------------------------------
# Data loading
# ---------------------------------------------------------------------------

def load_json(path: Path) -> list:
    if not path.exists():
        return []
    with open(path) as f:
        return json.load(f)


def load_data(data_dir: Path = DATA_DIR) -> dict:
    return {
        "locations": load_json(data_dir / "locations.json"),
        "surgeons": load_json(data_dir / "surgeons.json"),
        "patients": load_json(data_dir / "patients.json"),
        "appointments": load_json(data_dir / "appointments.json"),
    }


_DATA = load_data()
LOCATIONS = _DATA["locations"]
SURGEONS = _DATA["surgeons"]
PATIENTS = _DATA["patients"]
APPOINTMENTS = _DATA["appointments"]


def parse_date(s: Optional[str]) -> Optional[date]:
    if not s:
        return None
    return date.fromisoformat(s[:10])


def months_between(earlier: date, later: date) -> int:
    """Whole calendar months between two dates (later - earlier), >= 0."""
    return (later.year - earlier.year) * 12 + (later.month - earlier.month)


def month_key(d: date) -> str:
    return f"{d.year:04d}-{d.month:02d}"


def in_window(visit_date: date, today: date, months_back: int) -> bool:
    return 0 <= months_between(visit_date, today) < months_back


# ---------------------------------------------------------------------------
# Tool 1: get_acquisition_mix
# ---------------------------------------------------------------------------

def _get_acquisition_mix(
    patients: list[dict],
    months_back: int = 12,
    location_id: Optional[str] = None,
    today: Optional[date] = None,
) -> dict[str, Any]:
    today = today or date.today()

    window_patients = [
        p for p in patients
        if in_window(parse_date(p["first_visit_date"]), today, months_back)
        and (location_id is None or p["preferred_location_id"] == location_id)
    ]

    total = len(window_patients)

    by_source: dict[str, dict[str, Any]] = defaultdict(lambda: {"count": 0, "revenue": 0.0})
    for p in window_patients:
        entry = by_source[p["acquisition_source"]]
        entry["count"] += 1
        entry["revenue"] += p["total_spend"]

    source_breakdown = []
    for source, entry in sorted(by_source.items(), key=lambda kv: kv[1]["count"], reverse=True):
        count = entry["count"]
        revenue = round(entry["revenue"], 2)
        source_breakdown.append({
            "acquisition_source": source,
            "count": count,
            "percentage": round(count / total * 100, 1) if total else 0.0,
            "total_revenue": revenue,
            "avg_revenue_per_patient": round(revenue / count, 2) if count else 0.0,
        })

    by_location: dict[str, dict[str, Any]] = defaultdict(lambda: {"count": 0, "revenue": 0.0})
    for p in window_patients:
        entry = by_location[p["preferred_location_id"]]
        entry["count"] += 1
        entry["revenue"] += p["total_spend"]

    location_breakdown = []
    for loc_id, entry in sorted(by_location.items(), key=lambda kv: kv[1]["count"], reverse=True):
        count = entry["count"]
        revenue = round(entry["revenue"], 2)
        location_breakdown.append({
            "location_id": loc_id,
            "count": count,
            "percentage": round(count / total * 100, 1) if total else 0.0,
            "total_revenue": revenue,
            "avg_revenue_per_patient": round(revenue / count, 2) if count else 0.0,
        })

    monthly: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    for p in window_patients:
        mk = month_key(parse_date(p["first_visit_date"]))
        monthly[mk][p["acquisition_source"]] += 1

    monthly_trend = []
    for mk in sorted(monthly.keys()):
        month_total = sum(monthly[mk].values())
        monthly_trend.append({
            "month": mk,
            "total": month_total,
            "by_source": {
                src: {
                    "count": monthly[mk].get(src, 0),
                    "percentage": round(monthly[mk].get(src, 0) / month_total * 100, 1) if month_total else 0.0,
                }
                for src in ["surgeon_referral", "self_search", "social", "word_of_mouth"]
            },
        })

    referral_pct = next(
        (s["percentage"] for s in source_breakdown if s["acquisition_source"] == "surgeon_referral"), 0.0
    )
    if total == 0:
        headline = "No new patients in this window."
    elif referral_pct >= 50:
        headline = f"Surgeon referrals are the dominant channel at {referral_pct}% of new patients."
    elif referral_pct >= 25:
        headline = f"Surgeon referrals are a meaningful but not dominant channel at {referral_pct}% of new patients."
    else:
        headline = (
            f"Surgeon referrals are a minor channel at only {referral_pct}% of new patients "
            f"-- most patients are finding the clinic on their own or through word of mouth."
        )

    return {
        "months_back": months_back,
        "location_id": location_id,
        "total_new_patients": total,
        "by_acquisition_source": source_breakdown,
        "by_location": location_breakdown,
        "monthly_trend": monthly_trend,
        "summary": headline,
    }


@mcp.tool()
def get_acquisition_mix(months_back: int = 12, location_id: Optional[str] = None) -> dict:
    """Where do new patients actually come from? Breaks down new patients in
    the window by acquisition source and location, with revenue per channel
    and a month-by-month trend. Use this to test the assumption that surgeon
    referrals drive the business -- it will say plainly if they don't."""
    return _get_acquisition_mix(PATIENTS, months_back=months_back, location_id=location_id)


# ---------------------------------------------------------------------------
# Tool 2: get_referral_performance
# ---------------------------------------------------------------------------

def _referred_patients_in_window(
    patients: list[dict], months_back: int, today: date, surgeon_id: Optional[str] = None
) -> dict[str, list[dict]]:
    by_surgeon: dict[str, list[dict]] = defaultdict(list)
    for p in patients:
        sid = p.get("referred_by_surgeon_id")
        if not sid:
            continue
        if surgeon_id is not None and sid != surgeon_id:
            continue
        if not in_window(parse_date(p["first_visit_date"]), today, months_back):
            continue
        by_surgeon[sid].append(p)
    return by_surgeon


def _appointments_by_patient(appointments: list[dict]) -> dict[str, list[dict]]:
    by_patient: dict[str, list[dict]] = defaultdict(list)
    for a in appointments:
        by_patient[a["patient_id"]].append(a)
    return by_patient


def _get_referral_performance(
    patients: list[dict],
    surgeons: list[dict],
    appointments: list[dict],
    months_back: int = 12,
    surgeon_id: Optional[str] = None,
    today: Optional[date] = None,
) -> dict[str, Any]:
    today = today or date.today()
    surgeons_by_id = {s["surgeon_id"]: s for s in surgeons}
    appts_by_patient = _appointments_by_patient(appointments)

    by_surgeon = _referred_patients_in_window(patients, months_back, today, surgeon_id)

    results = []
    for sid, plist in by_surgeon.items():
        surgeon = surgeons_by_id.get(sid, {})
        n = len(plist)
        package_buyers = sum(1 for p in plist if p["package_sessions_purchased"] > 0)
        total_revenue = round(sum(p["total_spend"] for p in plist), 2)

        completion_rates = [
            p["package_sessions_used"] / p["package_sessions_purchased"]
            for p in plist if p["package_sessions_purchased"] > 0
        ]
        series_completion_rate = (
            round(sum(completion_rates) / len(completion_rates), 3) if completion_rates else None
        )

        no_show_total = 0
        appt_total = 0
        for p in plist:
            for a in appts_by_patient.get(p["patient_id"], []):
                appt_total += 1
                if a["status"] == "no_show":
                    no_show_total += 1

        results.append({
            "surgeon_id": sid,
            "surgeon_name": surgeon.get("name", "Unknown"),
            "practice_name": surgeon.get("practice_name"),
            "patients_referred": n,
            "package_purchase_rate": round(package_buyers / n, 3) if n else 0.0,
            "avg_revenue_per_patient": round(total_revenue / n, 2) if n else 0.0,
            "total_revenue_attributed": total_revenue,
            "series_completion_rate": series_completion_rate,
            "no_show_rate": round(no_show_total / appt_total, 3) if appt_total else 0.0,
            "last_report_sent": surgeon.get("last_report_sent"),
        })

    results.sort(key=lambda r: r["total_revenue_attributed"], reverse=True)

    if results:
        top = results[0]
        summary = (
            f"{len(results)} surgeon(s) referred patients in the last {months_back} month(s). "
            f"{top['surgeon_name']} leads in attributed revenue (${top['total_revenue_attributed']:,.2f}) "
            f"with a {top['package_purchase_rate'] * 100:.0f}% package purchase rate."
        )
    else:
        summary = f"No surgeon-referred patients in the last {months_back} month(s)."

    return {
        "months_back": months_back,
        "surgeon_id": surgeon_id,
        "surgeons": results,
        "summary": summary,
    }


@mcp.tool()
def get_referral_performance(months_back: int = 12, surgeon_id: Optional[str] = None) -> dict:
    """Per-surgeon referral quality, not just volume: package purchase rate,
    average and total revenue, series completion rate, no-show rate, and
    when they last got a report from the clinic. Sorted by revenue
    attributed, descending. A surgeon sending many patients who buy single
    sessions is not the same as one sending fewer who buy full packages --
    this makes that visible."""
    return _get_referral_performance(
        PATIENTS, SURGEONS, APPOINTMENTS, months_back=months_back, surgeon_id=surgeon_id
    )


# ---------------------------------------------------------------------------
# Tool 3: detect_referral_decay
# ---------------------------------------------------------------------------

def _get_referred_revenue_by_surgeon(patients: list[dict]) -> dict[str, float]:
    revenue: dict[str, list[float]] = defaultdict(list)
    for p in patients:
        sid = p.get("referred_by_surgeon_id")
        if sid:
            revenue[sid].append(p["total_spend"])
    return {sid: (sum(vals) / len(vals) if vals else 0.0) for sid, vals in revenue.items()}


def _detect_referral_decay(
    patients: list[dict],
    surgeons: list[dict],
    baseline_months: int = 6,
    recent_months: int = 3,
    min_drop_pct: float = 30.0,
    today: Optional[date] = None,
) -> dict[str, Any]:
    today = today or date.today()
    surgeons_by_id = {s["surgeon_id"]: s for s in surgeons}

    baseline_start = recent_months  # months_ago >= recent_months and < recent_months + baseline_months
    baseline_end = recent_months + baseline_months

    baseline_counts: dict[str, int] = defaultdict(int)
    recent_counts: dict[str, int] = defaultdict(int)
    baseline_patients: dict[str, list[dict]] = defaultdict(list)

    for p in patients:
        sid = p.get("referred_by_surgeon_id")
        if not sid:
            continue
        m = months_between(parse_date(p["first_visit_date"]), today)
        if 0 <= m < recent_months:
            recent_counts[sid] += 1
        elif baseline_start <= m < baseline_end:
            baseline_counts[sid] += 1
            baseline_patients[sid].append(p)

    avg_revenue_by_surgeon = _get_referred_revenue_by_surgeon(patients)

    flagged = []
    excluded = []
    for s in surgeons:
        sid = s["surgeon_id"]
        baseline_n = baseline_counts.get(sid, 0)
        if baseline_n < 3:
            if baseline_n > 0:
                excluded.append({
                    "surgeon_id": sid,
                    "surgeon_name": s["name"],
                    "baseline_referrals": baseline_n,
                    "reason": f"fewer than 3 referrals in the baseline window ({baseline_n}) -- too small to call a trend",
                })
            continue

        baseline_rate = baseline_n / baseline_months
        recent_rate = recent_counts.get(sid, 0) / recent_months
        if baseline_rate == 0:
            continue
        drop_pct = (baseline_rate - recent_rate) / baseline_rate * 100

        if drop_pct > min_drop_pct:
            avg_revenue = avg_revenue_by_surgeon.get(sid, 0.0)
            revenue_impact_annualized = round((baseline_rate - recent_rate) * avg_revenue * 12, 2)
            last_report_sent = s.get("last_report_sent")
            days_since = (
                (today - parse_date(last_report_sent)).days if last_report_sent else None
            )
            flagged.append({
                "surgeon_id": sid,
                "surgeon_name": s["name"],
                "practice_name": s.get("practice_name"),
                "baseline_rate": round(baseline_rate, 2),
                "recent_rate": round(recent_rate, 2),
                "drop_pct": round(drop_pct, 1),
                "revenue_impact_annualized": revenue_impact_annualized,
                "last_report_sent": last_report_sent,
                "days_since_last_report": days_since,
            })

    flagged.sort(key=lambda r: r["revenue_impact_annualized"], reverse=True)

    if flagged:
        top = flagged[0]
        summary = (
            f"{len(flagged)} surgeon(s) show a referral drop over {min_drop_pct}%. "
            f"{top['surgeon_name']} dropped {top['drop_pct']}% "
            f"(~${top['revenue_impact_annualized']:,.2f}/yr at risk) and hasn't had a report in "
            f"{top['days_since_last_report']} day(s)."
            if top["days_since_last_report"] is not None else
            f"{len(flagged)} surgeon(s) show a referral drop over {min_drop_pct}%. "
            f"{top['surgeon_name']} dropped {top['drop_pct']}% "
            f"(~${top['revenue_impact_annualized']:,.2f}/yr at risk)."
        )
    else:
        summary = f"No surgeon referral declines over {min_drop_pct}% detected."
    if excluded:
        summary += f" {len(excluded)} surgeon(s) had too few baseline referrals to evaluate."

    return {
        "baseline_months": baseline_months,
        "recent_months": recent_months,
        "min_drop_pct": min_drop_pct,
        "flagged": flagged,
        "excluded_low_volume": excluded,
        "summary": summary,
    }


@mcp.tool()
def detect_referral_decay(
    baseline_months: int = 6, recent_months: int = 3, min_drop_pct: float = 30.0
) -> dict:
    """Find referring surgeons whose referral volume has dropped, comparing
    a recent window to a prior baseline. Reports the rate drop and the
    estimated annualized revenue at risk. Surgeons with fewer than 3
    baseline referrals are excluded as too small a sample to call a trend
    (and listed separately, not silently dropped)."""
    return _detect_referral_decay(
        PATIENTS, SURGEONS,
        baseline_months=baseline_months, recent_months=recent_months, min_drop_pct=min_drop_pct,
    )


# ---------------------------------------------------------------------------
# Tool 4: get_surgeon_patients
# ---------------------------------------------------------------------------

def _get_surgeon_patients(
    patients: list[dict],
    surgeons: list[dict],
    appointments: list[dict],
    surgeon_id: str,
    months_back: int = 1,
    today: Optional[date] = None,
) -> dict[str, Any]:
    today = today or date.today()
    surgeons_by_id = {s["surgeon_id"]: s for s in surgeons}
    appts_by_patient = _appointments_by_patient(appointments)

    surgeon = surgeons_by_id.get(surgeon_id)

    referred = [
        p for p in patients
        if p.get("referred_by_surgeon_id") == surgeon_id
        and in_window(parse_date(p["first_visit_date"]), today, months_back)
    ]

    patient_rows = []
    days_to_first_list = []
    completion_rates = []
    package_buyers = 0

    for p in referred:
        surgery_date = parse_date(p["surgery_date"])
        first_visit_date = parse_date(p["first_visit_date"])
        days_to_first = (first_visit_date - surgery_date).days
        days_to_first_list.append(days_to_first)

        purchased = p["package_sessions_purchased"]
        used = p["package_sessions_used"]
        if purchased > 0:
            completion_rates.append(used / purchased)
            package_buyers += 1
            completed = used >= purchased
        else:
            completed = used >= 1

        no_show_count = sum(
            1 for a in appts_by_patient.get(p["patient_id"], []) if a["status"] == "no_show"
        )

        patient_rows.append({
            "patient_id": p["patient_id"],
            "name": f"{p['first_name']} {p['last_name'][0]}.",
            "procedure": p["procedure"],
            "first_visit_date": p["first_visit_date"],
            "days_surgery_to_first_session": days_to_first,
            "sessions_used": used,
            "sessions_purchased": purchased,
            "completed": completed,
            "no_show_count": no_show_count,
        })

    total = len(referred)
    never_started = [
        {"patient_id": p["patient_id"], "name": f"{p['first_name']} {p['last_name'][0]}."}
        for p in referred if p["package_sessions_used"] == 0
    ]

    summary = (
        f"{surgeon['name'] if surgeon else surgeon_id} referred {total} patient(s) in the last "
        f"{months_back} month(s)."
    ) if total else (
        f"{surgeon['name'] if surgeon else surgeon_id} referred no patients in the last "
        f"{months_back} month(s)."
    )

    return {
        "surgeon_id": surgeon_id,
        "surgeon_name": surgeon["name"] if surgeon else None,
        "months_back": months_back,
        "total_referred": total,
        "avg_days_surgery_to_first_session": (
            round(sum(days_to_first_list) / len(days_to_first_list), 1) if days_to_first_list else None
        ),
        "series_completion_rate": (
            round(sum(completion_rates) / len(completion_rates), 3) if completion_rates else None
        ),
        "package_purchase_rate": round(package_buyers / total, 3) if total else 0.0,
        "patients": patient_rows,
        "never_started": never_started,
        "summary": summary,
    }


@mcp.tool()
def get_surgeon_patients(surgeon_id: str, months_back: int = 1) -> dict:
    """Everything needed to draft a report back to a referring surgeon's
    office in one call: each referred patient (first name + last initial
    only, never a full last name), procedure, days from surgery to first
    MLD session, sessions used of purchased, whether they completed, and
    no-show count -- plus aggregate rates for the period."""
    return _get_surgeon_patients(
        PATIENTS, SURGEONS, APPOINTMENTS, surgeon_id=surgeon_id, months_back=months_back
    )


# ---------------------------------------------------------------------------
# Tool 5: log_outreach
# ---------------------------------------------------------------------------

VALID_TARGET_TYPES = {"surgeon", "patient"}
VALID_CHANNELS = {"email", "sms", "call"}
VALID_OUTCOMES = {"sent", "replied", "meeting_booked", "no_response"}


def _load_outreach_log(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with open(path) as f:
        return json.load(f)


def _save_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


def _log_outreach(
    patients: list[dict],
    surgeons: list[dict],
    target_type: str,
    target_id: str,
    channel: str,
    summary: str,
    outcome: str,
    outreach_log_path: Path,
    surgeons_path: Path,
    now: Optional[datetime] = None,
) -> dict[str, Any]:
    now = now or datetime.now()

    if target_type not in VALID_TARGET_TYPES:
        return {"error": f"invalid target_type '{target_type}', must be one of {sorted(VALID_TARGET_TYPES)}"}
    if channel not in VALID_CHANNELS:
        return {"error": f"invalid channel '{channel}', must be one of {sorted(VALID_CHANNELS)}"}
    if outcome not in VALID_OUTCOMES:
        return {"error": f"invalid outcome '{outcome}', must be one of {sorted(VALID_OUTCOMES)}"}

    if target_type == "patient":
        patient = next((p for p in patients if p["patient_id"] == target_id), None)
        if patient is None:
            return {"error": f"unknown patient_id '{target_id}'"}
        if patient.get("do_not_contact"):
            return {"error": f"patient {target_id} is marked do_not_contact -- refusing to log outreach"}
        consent_field = {"email": "consent_email", "sms": "consent_sms", "call": None}[channel]
        if consent_field is not None and not patient.get(consent_field):
            return {"error": f"patient {target_id} has not consented to {channel} contact -- refusing to log outreach"}
    else:
        surgeon = next((s for s in surgeons if s["surgeon_id"] == target_id), None)
        if surgeon is None:
            return {"error": f"unknown surgeon_id '{target_id}'"}

    record = {
        "target_type": target_type,
        "target_id": target_id,
        "channel": channel,
        "summary": summary,
        "outcome": outcome,
        "logged_at": now.isoformat(),
    }

    log = _load_outreach_log(outreach_log_path)
    log.append(record)
    _save_json(outreach_log_path, log)

    if target_type == "surgeon":
        for s in surgeons:
            if s["surgeon_id"] == target_id:
                s["last_report_sent"] = now.date().isoformat()
        _save_json(surgeons_path, surgeons)

    return {
        "record": record,
        "summary": f"Logged {channel} outreach to {target_type} {target_id} ({outcome}).",
    }


@mcp.tool()
def log_outreach(
    target_type: str, target_id: str, channel: str, summary: str, outcome: str
) -> dict:
    """Record an outreach action taken toward a surgeon's office or a
    patient. Updates the surgeon's last_report_sent when the target is a
    surgeon. Refuses -- with an explicit error, never silently -- to log
    outreach to a patient marked do_not_contact or lacking consent for the
    given channel."""
    return _log_outreach(
        PATIENTS, SURGEONS, target_type, target_id, channel, summary, outcome,
        OUTREACH_LOG_PATH, SURGEONS_PATH,
    )


# ---------------------------------------------------------------------------
# Resources
# ---------------------------------------------------------------------------

@mcp.resource("clinic://locations")
def locations_resource() -> str:
    """All clinic locations with their session pricing."""
    return json.dumps(LOCATIONS, indent=2)


@mcp.resource("clinic://surgeons")
def surgeons_resource() -> str:
    """All referring surgeons and their relationship metadata."""
    return json.dumps(SURGEONS, indent=2)


# ---------------------------------------------------------------------------
# Prompts
# ---------------------------------------------------------------------------

@mcp.prompt()
def monthly_surgeon_report(surgeon_id: str) -> str:
    """Draft a monthly referral report for a surgeon's office, for human
    review before anything is sent."""
    return f"""You are drafting a monthly referral report for a referring surgeon's office.

## Inputs required before writing

Call these tools first, in order, and use only their returned data:
1. `get_surgeon_patients(surgeon_id="{surgeon_id}", months_back=1)`
2. `get_referral_performance(surgeon_id="{surgeon_id}", months_back=1)`

Do not call `log_outreach` in this turn. This report is drafted for a human
at the clinic to review, edit, and approve before anything is sent to the
surgeon's office.

## Output contract

Produce exactly the following sections, in this order, and nothing before
the first heading (no preamble, no "Here is the report:"):

### Subject
One line, suitable as an email subject.

### Greeting
One line, addressed to the surgeon's office (use the office_manager name
and practice_name from the tool results, not the surgeon's personal name).

### Referral Volume
How many patients this office referred in the period. State the number
plainly, no editorializing.

### Time to First Session
How quickly each referred patient got into care after surgery: the
average days from surgery to first MLD session, and call out any patient
who took notably longer than the rest.

### Series Progress
How the series went for each referred patient: sessions completed out of
purchased, and the aggregate series completion rate for this office's
referrals this period.

### Patients Who Never Started
List by first-name-and-last-initial only (as returned by the tool -- do
not fabricate or expand names) any referred patient with zero sessions
used. If none, state that plainly.

### Closing
One or two sentences inviting the office to reach out with questions.
No marketing language, no calls to action to refer more patients.

## Tone and constraints

- Professional, addressed to a medical office, not a patient or the public.
- No clinical claims about outcomes the clinic cannot evidence (do not say
  a patient "recovered well" or "responded to treatment" -- only report
  attendance and series completion, which are facts the data supports).
- No marketing language ("we'd love to see more referrals!").
- Every number in the report must come from the tool results. Do not
  estimate or round in a way that changes the figure.
- Present the finished draft to the user for approval. Do not take any
  further action until they approve it.
"""


if __name__ == "__main__":
    mcp.run(transport="stdio")
