"""
Deterministic mock data generator for the clinic referral MCP demo.

Run: python seed.py

Regenerates data/locations.json, data/surgeons.json, data/patients.json,
and data/appointments.json from a fixed random seed. No real patient data.
"""

import json
import random
from datetime import date, timedelta
from pathlib import Path

SEED = 20260715
random.seed(SEED)

DATA_DIR = Path(__file__).parent / "data"

TODAY = date(2026, 7, 15)
MONTHS_OF_HISTORY = 18
TOTAL_PATIENTS = 120

# ---------------------------------------------------------------------------
# Locations
# ---------------------------------------------------------------------------

LOCATIONS = [
    {"location_id": "loc_1", "name": "Riverside Recovery & Wellness", "city": "Austin", "session_price": 120.0},
    {"location_id": "loc_2", "name": "Northgate MLD Studio", "city": "Denver", "session_price": 100.0},
    {"location_id": "loc_3", "name": "Harborview Post-Surgical Care", "city": "Charleston", "session_price": 150.0},
]
LOCATION_IDS = [loc["location_id"] for loc in LOCATIONS]

# ---------------------------------------------------------------------------
# Surgeons
# ---------------------------------------------------------------------------
# weight        -> baseline relative monthly referral volume
# decay         -> multiplier applied to weight in the most recent 3 months
# package_rate  -> probability a referred patient buys a package (vs single session)
# completion_q  -> mean fraction of purchased sessions a referred patient completes
# days_to_first -> mean days from surgery to first MLD visit for this surgeon's referrals

SURGEONS = [
    {
        "surgeon_id": "sg_1", "name": "Dr. Elena Ramirez", "practice_name": "Ramirez Plastic Surgery",
        "specialty": "plastic surgery", "office_email": "office@ramirezplasticsurgery.example",
        "office_manager": "Carla Nunez", "relationship_since": "2023-09-01",
        "weight": 4.5, "decay": 1.0, "package_rate": 0.55, "completion_q": 0.75, "days_to_first": 9,
    },
    {
        "surgeon_id": "sg_2", "name": "Dr. Marcus Chen", "practice_name": "Chen Aesthetic Surgery Group",
        "specialty": "plastic surgery", "office_email": "referrals@chenaesthetic.example",
        "office_manager": "Priya Mehta", "relationship_since": "2022-11-15",
        "weight": 3.2, "decay": 1.15, "package_rate": 0.85, "completion_q": 0.90, "days_to_first": 6,
    },
    {
        "surgeon_id": "sg_3", "name": "Dr. Grace Whitfield", "practice_name": "Whitfield Reconstructive Surgery",
        "specialty": "reconstructive", "office_email": "info@whitfieldreconstructive.example",
        "office_manager": "Dana Osei", "relationship_since": "2023-02-20",
        "weight": 2.6, "decay": 0.15, "package_rate": 0.45, "completion_q": 0.60, "days_to_first": 11,
    },
    {
        "surgeon_id": "sg_4", "name": "Dr. Samuel Okonkwo", "practice_name": "Okonkwo Plastic & Reconstructive",
        "specialty": "plastic surgery", "office_email": "scheduling@okonkwoprs.example",
        "office_manager": "Lena Brandt", "relationship_since": "2024-01-10",
        "weight": 1.8, "decay": 1.05, "package_rate": 0.75, "completion_q": 0.80, "days_to_first": 8,
    },
    {
        "surgeon_id": "sg_5", "name": "Dr. Ingrid Bergstrom", "practice_name": "Bergstrom Cosmetic Surgery",
        "specialty": "plastic surgery", "office_email": "office@bergstromcosmetic.example",
        "office_manager": "Renee Falk", "relationship_since": "2023-05-05",
        "weight": 2.1, "decay": 0.15, "package_rate": 0.35, "completion_q": 0.55, "days_to_first": 13,
    },
    {
        "surgeon_id": "sg_6", "name": "Dr. Anil Patel", "practice_name": "Patel Orthopedic & Sports Medicine",
        "specialty": "orthopedic", "office_email": "referrals@patelortho.example",
        "office_manager": "Sofia Reyes", "relationship_since": "2024-06-01",
        "weight": 1.3, "decay": 1.0, "package_rate": 0.65, "completion_q": 0.70, "days_to_first": 10,
    },
    {
        "surgeon_id": "sg_7", "name": "Dr. Jasmine Alvarez", "practice_name": "Alvarez OB-GYN & Wellness",
        "specialty": "ob-gyn", "office_email": "office@alvarezobgyn.example",
        "office_manager": "Marisol Vega", "relationship_since": "2024-03-18",
        "weight": 0.7, "decay": 1.1, "package_rate": 0.90, "completion_q": 0.95, "days_to_first": 7,
    },
    {
        "surgeon_id": "sg_8", "name": "Dr. Thomas Nakamura", "practice_name": "Nakamura Plastic Surgery",
        "specialty": "plastic surgery", "office_email": "info@nakamuraplasticsurgery.example",
        "office_manager": "Owen Field", "relationship_since": "2025-08-01",
        "weight": 0.15, "decay": 1.0, "package_rate": 0.50, "completion_q": 0.60, "days_to_first": 12,
    },
]
SURGEON_BY_ID = {s["surgeon_id"]: s for s in SURGEONS}

PROCEDURES = ["tummy tuck", "liposuction", "BBL", "breast augmentation", "mommy makeover", "other"]

FIRST_NAMES = [
    "Olivia", "Sophia", "Isabella", "Ava", "Mia", "Amelia", "Harper", "Evelyn", "Camila", "Luna",
    "Grace", "Chloe", "Zoe", "Layla", "Nora", "Hazel", "Aria", "Ellie", "Lily", "Stella",
    "Maya", "Naomi", "Ruby", "Ivy", "Elena", "Sadie", "Claire", "Alice", "Piper", "Josephine",
    "Michael", "James", "Robert", "David", "Daniel", "Andrew", "Ryan", "Justin", "Brian", "Kevin",
]
LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
]


def month_start(d: date, offset: int) -> date:
    """Return the first-of-month date that is `offset` months before d's month (offset=0 -> d's own month)."""
    total = (d.year * 12 + (d.month - 1)) - offset
    y, m = divmod(total, 12)
    return date(y, m + 1, 1)


def random_day_in_month(ms: date) -> date:
    if ms.month == 12:
        next_m = date(ms.year + 1, 1, 1)
    else:
        next_m = date(ms.year, ms.month + 1, 1)
    days_in_month = (next_m - ms).days
    day_offset = random.randint(0, days_in_month - 1)
    d = ms + timedelta(days=day_offset)
    return min(d, TODAY)


def weighted_choice(items, weights):
    return random.choices(items, weights=weights, k=1)[0]


def gen_patient_counts_per_month(n_months: int, total: int):
    counts = [random.randint(4, 9) for _ in range(n_months)]
    # scale/adjust to hit the exact total
    while sum(counts) < total:
        counts[random.randrange(n_months)] += 1
    while sum(counts) > total:
        idx = random.randrange(n_months)
        if counts[idx] > 1:
            counts[idx] -= 1
    return counts


def allocate_counts(total: int, weights: list[float]) -> list[int]:
    """Largest-remainder proportional allocation of `total` units across
    `weights`. Deterministic given the weights, so a surgeon's seeded
    baseline vs. recent referral rate reflects the intended trend rather
    than multinomial sampling noise."""
    if total <= 0 or sum(weights) <= 0:
        return [0] * len(weights)
    weight_sum = sum(weights)
    raw = [total * w / weight_sum for w in weights]
    floors = [int(x) for x in raw]
    remainder = total - sum(floors)
    fractions = sorted(range(len(weights)), key=lambda i: raw[i] - floors[i], reverse=True)
    for i in fractions[:remainder]:
        floors[i] += 1
    return floors


def build_patients():
    patients = []
    appointments = []
    patient_seq = 1
    appt_seq = 1

    month_offsets = list(range(MONTHS_OF_HISTORY))  # 0 = current month
    month_starts = [month_start(TODAY, off) for off in month_offsets]
    counts = gen_patient_counts_per_month(MONTHS_OF_HISTORY, TOTAL_PATIENTS)

    def regime_of(off):
        # matches detect_referral_decay's default windows exactly, so the
        # baseline-vs-recent comparison isn't diluted by resampling a wider
        # pool: "recent" = last 3 months, "baseline" = the 6 months before
        # that, "older" = everything beyond (steady-state, same as baseline).
        if off < 3:
            return "recent"
        elif off < 9:
            return "baseline"
        return "older"

    # --- decide acquisition source per patient slot, month by month ---
    sources_by_month = {}
    for off, count in zip(month_offsets, counts):
        is_recent = regime_of(off) == "recent"
        referral_share = 0.40 if is_recent else 0.58
        remainder = 1.0 - referral_share
        sources_by_month[off] = [
            weighted_choice(
                ["surgeon_referral", "self_search", "social", "word_of_mouth"],
                [referral_share, remainder * 0.50, remainder * 0.35, remainder * 0.15],
            )
            for _ in range(count)
        ]

    # --- deterministically allocate referred slots across surgeons, per regime ---
    # (proportional to each surgeon's weight, not a per-patient random draw,
    # and pooled across the whole regime rather than per-month, so the seeded
    # decay/steady/growth trends survive at this sample size instead of being
    # swamped by multinomial noise and small per-month counts)
    surgeon_pool_by_regime = {}
    for regime in ("recent", "baseline", "older"):
        regime_offsets = [off for off in month_offsets if regime_of(off) == regime]
        n_referred = sum(
            1 for off in regime_offsets for s in sources_by_month[off] if s == "surgeon_referral"
        )
        decay_applies = regime == "recent"
        surgeon_weights = [s["weight"] * (s["decay"] if decay_applies else 1.0) for s in SURGEONS]
        surgeon_alloc_counts = allocate_counts(n_referred, surgeon_weights)
        pool = []
        for surgeon_obj, n in zip(SURGEONS, surgeon_alloc_counts):
            pool.extend([surgeon_obj] * n)
        random.shuffle(pool)
        surgeon_pool_by_regime[regime] = iter(pool)

    for off, ms, count in zip(month_offsets, month_starts, counts):
        sources = sources_by_month[off]
        surgeon_pool_iter = surgeon_pool_by_regime[regime_of(off)]

        for source in sources:
            first_visit_date = random_day_in_month(ms)

            surgeon = next(surgeon_pool_iter) if source == "surgeon_referral" else None
            referred_by_surgeon_id = surgeon["surgeon_id"] if surgeon else None

            # --- surgery date / days to first session ---
            if surgeon:
                mean_gap = surgeon["days_to_first"]
            else:
                mean_gap = 10
            gap_days = max(2, int(round(random.gauss(mean_gap, 3))))
            surgery_date = first_visit_date - timedelta(days=gap_days)

            procedure = random.choice(PROCEDURES)
            preferred_location_id = random.choice(LOCATION_IDS)

            # --- package decision ---
            days_since_first_visit = (TODAY - first_visit_date).days
            if days_since_first_visit < 14 and random.random() < 0.30:
                package_type = "none"
            else:
                if surgeon:
                    package_rate = surgeon["package_rate"]
                elif source == "word_of_mouth":
                    package_rate = 0.50
                else:
                    package_rate = 0.40
                if random.random() < package_rate:
                    package_type = weighted_choice(["package_10", "package_12"], [0.6, 0.4])
                else:
                    package_type = "single_session"

            if package_type == "package_10":
                sessions_purchased = 10
            elif package_type == "package_12":
                sessions_purchased = 12
            else:
                sessions_purchased = 0

            planned_visits = sessions_purchased if sessions_purchased > 0 else 1

            if surgeon:
                completion_q = surgeon["completion_q"]
            else:
                completion_q = 0.68
            completion_frac = max(0.15, min(1.0, random.gauss(completion_q, 0.12)))
            target_attend = max(1, round(completion_frac * planned_visits))
            target_attend = min(target_attend, planned_visits)

            # --- generate appointments on a weekly cadence ---
            completed_count = 0
            no_show_count = 0
            location = next(loc for loc in LOCATIONS if loc["location_id"] == preferred_location_id)

            for i in range(1, planned_visits + 1):
                appt_date = first_visit_date + timedelta(days=7 * (i - 1))
                if i > target_attend:
                    continue  # patient dropped out before reaching this session
                if appt_date > TODAY:
                    status = "scheduled"
                else:
                    roll = random.random()
                    if roll < 0.05:
                        status = "no_show"
                        no_show_count += 1
                    elif roll < 0.08:
                        status = "cancelled"
                    else:
                        status = "completed"
                        completed_count += 1
                appointments.append({
                    "appointment_id": f"appt_{appt_seq}",
                    "patient_id": f"pat_{patient_seq}",
                    "location_id": preferred_location_id,
                    "starts_at": f"{appt_date.isoformat()}T09:00:00",
                    "status": status,
                    "session_number": i,
                })
                appt_seq += 1

            sessions_used = completed_count

            if sessions_purchased > 0:
                discount = 0.95 if package_type == "package_10" else 0.90
                total_spend = round(location["session_price"] * sessions_purchased * discount, 2)
            else:
                total_spend = round(location["session_price"] * sessions_used, 2)

            do_not_contact = random.random() < 0.08
            consent_sms = random.random() < 0.80
            consent_email = random.random() < 0.90

            first_name = random.choice(FIRST_NAMES)
            last_name = random.choice(LAST_NAMES)

            patients.append({
                "patient_id": f"pat_{patient_seq}",
                "first_name": first_name,
                "last_name": last_name,
                "phone": f"555-{1000 + patient_seq:04d}",
                "email": f"{first_name.lower()}.{last_name.lower()}{patient_seq}@example.com",
                "preferred_location_id": preferred_location_id,
                "acquisition_source": source,
                "referred_by_surgeon_id": referred_by_surgeon_id,
                "procedure": procedure,
                "surgery_date": surgery_date.isoformat(),
                "first_visit_date": first_visit_date.isoformat(),
                "package_type": package_type,
                "package_sessions_purchased": sessions_purchased,
                "package_sessions_used": sessions_used,
                "total_spend": total_spend,
                "consent_sms": consent_sms,
                "consent_email": consent_email,
                "do_not_contact": do_not_contact,
            })
            patient_seq += 1

    return patients, appointments


def build_last_report_sent(patients):
    """Assign a plausible last_report_sent date per surgeon: recent for active,
    stale/null for the two decaying surgeons, to make the decay tool's
    days_since_last_report meaningful."""
    for s in SURGEONS:
        if s["surgeon_id"] in ("sg_3", "sg_5"):
            # stale reports -- no one has told them referrals dropped
            days_ago = random.randint(70, 140)
            s["last_report_sent"] = (TODAY - timedelta(days=days_ago)).isoformat()
        elif s["surgeon_id"] == "sg_8":
            s["last_report_sent"] = None
        else:
            days_ago = random.randint(5, 35)
            s["last_report_sent"] = (TODAY - timedelta(days=days_ago)).isoformat()


def main():
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    patients, appointments = build_patients()
    build_last_report_sent(SURGEONS)

    surgeons_out = [
        {k: v for k, v in s.items() if k not in ("weight", "decay", "package_rate", "completion_q", "days_to_first")}
        for s in SURGEONS
    ]

    with open(DATA_DIR / "locations.json", "w") as f:
        json.dump(LOCATIONS, f, indent=2)

    with open(DATA_DIR / "surgeons.json", "w") as f:
        json.dump(surgeons_out, f, indent=2)

    with open(DATA_DIR / "patients.json", "w") as f:
        json.dump(patients, f, indent=2)

    with open(DATA_DIR / "appointments.json", "w") as f:
        json.dump(appointments, f, indent=2)

    print(f"Wrote {len(LOCATIONS)} locations, {len(surgeons_out)} surgeons, "
          f"{len(patients)} patients, {len(appointments)} appointments to {DATA_DIR}")


if __name__ == "__main__":
    main()
