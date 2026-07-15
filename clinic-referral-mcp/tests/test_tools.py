import json
import sys
from datetime import date
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent))

import server  # noqa: E402


TODAY = date(2026, 7, 15)


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def locations():
    return [
        {"location_id": "loc_1", "name": "Test Location A", "city": "Testville", "session_price": 100.0},
        {"location_id": "loc_2", "name": "Test Location B", "city": "Testburg", "session_price": 150.0},
    ]


@pytest.fixture
def surgeons():
    return [
        {
            "surgeon_id": "sg_a", "name": "Dr. A", "practice_name": "Practice A",
            "specialty": "plastic surgery", "office_email": "a@example.com",
            "office_manager": "Manager A", "relationship_since": "2023-01-01",
            "last_report_sent": "2026-05-01",
        },
        {
            "surgeon_id": "sg_b", "name": "Dr. B", "practice_name": "Practice B",
            "specialty": "plastic surgery", "office_email": "b@example.com",
            "office_manager": "Manager B", "relationship_since": "2023-01-01",
            "last_report_sent": None,
        },
    ]


@pytest.fixture
def patients_fixture():
    """Hand-built patients with known values for precise math checks.

    sg_a referred 4 patients: 3 bought a package (10 sessions, $100/session
    with a 0.95 discount = $950 each), 1 bought a single session ($100).
    sg_b referred 1 patient with a package.
    2 patients are unreferred (self_search / social), inside the window.
    1 referred patient is outside the 12-month window (should be excluded).
    """
    return [
        {
            "patient_id": "p1", "first_name": "Alice", "last_name": "Anderson",
            "phone": "555-0001", "email": "a1@example.com", "preferred_location_id": "loc_1",
            "acquisition_source": "surgeon_referral", "referred_by_surgeon_id": "sg_a",
            "procedure": "tummy tuck", "surgery_date": "2026-06-01", "first_visit_date": "2026-06-10",
            "package_type": "package_10", "package_sessions_purchased": 10, "package_sessions_used": 10,
            "total_spend": 950.0, "consent_sms": True, "consent_email": True, "do_not_contact": False,
        },
        {
            "patient_id": "p2", "first_name": "Beth", "last_name": "Brown",
            "phone": "555-0002", "email": "a2@example.com", "preferred_location_id": "loc_1",
            "acquisition_source": "surgeon_referral", "referred_by_surgeon_id": "sg_a",
            "procedure": "liposuction", "surgery_date": "2026-06-02", "first_visit_date": "2026-06-11",
            "package_type": "package_10", "package_sessions_purchased": 10, "package_sessions_used": 5,
            "total_spend": 950.0, "consent_sms": True, "consent_email": True, "do_not_contact": False,
        },
        {
            "patient_id": "p3", "first_name": "Carla", "last_name": "Cruz",
            "phone": "555-0003", "email": "a3@example.com", "preferred_location_id": "loc_1",
            "acquisition_source": "surgeon_referral", "referred_by_surgeon_id": "sg_a",
            "procedure": "BBL", "surgery_date": "2026-06-03", "first_visit_date": "2026-06-12",
            "package_type": "package_10", "package_sessions_purchased": 10, "package_sessions_used": 10,
            "total_spend": 950.0, "consent_sms": True, "consent_email": True, "do_not_contact": False,
        },
        {
            "patient_id": "p4", "first_name": "Dana", "last_name": "Diaz",
            "phone": "555-0004", "email": "a4@example.com", "preferred_location_id": "loc_1",
            "acquisition_source": "surgeon_referral", "referred_by_surgeon_id": "sg_a",
            "procedure": "other", "surgery_date": "2026-06-04", "first_visit_date": "2026-06-13",
            "package_type": "single_session", "package_sessions_purchased": 0, "package_sessions_used": 1,
            "total_spend": 100.0, "consent_sms": True, "consent_email": True, "do_not_contact": False,
        },
        {
            "patient_id": "p5", "first_name": "Elle", "last_name": "Evans",
            "phone": "555-0005", "email": "a5@example.com", "preferred_location_id": "loc_2",
            "acquisition_source": "surgeon_referral", "referred_by_surgeon_id": "sg_b",
            "procedure": "breast augmentation", "surgery_date": "2026-06-05", "first_visit_date": "2026-06-14",
            "package_type": "package_12", "package_sessions_purchased": 12, "package_sessions_used": 12,
            "total_spend": 1620.0, "consent_sms": True, "consent_email": True, "do_not_contact": False,
        },
        {
            "patient_id": "p6", "first_name": "Fay", "last_name": "Ford",
            "phone": "555-0006", "email": "a6@example.com", "preferred_location_id": "loc_1",
            "acquisition_source": "self_search", "referred_by_surgeon_id": None,
            "procedure": "other", "surgery_date": "2026-06-06", "first_visit_date": "2026-06-15",
            "package_type": "single_session", "package_sessions_purchased": 0, "package_sessions_used": 1,
            "total_spend": 100.0, "consent_sms": True, "consent_email": True, "do_not_contact": False,
        },
        {
            "patient_id": "p7", "first_name": "Gia", "last_name": "Gomez",
            "phone": "555-0007", "email": "a7@example.com", "preferred_location_id": "loc_2",
            "acquisition_source": "social", "referred_by_surgeon_id": None,
            "procedure": "other", "surgery_date": "2026-06-07", "first_visit_date": "2026-06-16",
            "package_type": "single_session", "package_sessions_purchased": 0, "package_sessions_used": 1,
            "total_spend": 150.0, "consent_sms": True, "consent_email": True, "do_not_contact": False,
        },
        {
            # Outside the 12-month window: should never be counted.
            "patient_id": "p8", "first_name": "Hana", "last_name": "Hicks",
            "phone": "555-0008", "email": "a8@example.com", "preferred_location_id": "loc_1",
            "acquisition_source": "surgeon_referral", "referred_by_surgeon_id": "sg_a",
            "procedure": "other", "surgery_date": "2024-01-01", "first_visit_date": "2024-01-10",
            "package_type": "package_10", "package_sessions_purchased": 10, "package_sessions_used": 10,
            "total_spend": 950.0, "consent_sms": True, "consent_email": True, "do_not_contact": False,
        },
    ]


@pytest.fixture
def appointments_fixture():
    return [
        {"appointment_id": "ap1", "patient_id": "p1", "location_id": "loc_1",
         "starts_at": "2026-06-10T09:00:00", "status": "completed", "session_number": 1},
        {"appointment_id": "ap2", "patient_id": "p2", "location_id": "loc_1",
         "starts_at": "2026-06-11T09:00:00", "status": "no_show", "session_number": 1},
        {"appointment_id": "ap3", "patient_id": "p2", "location_id": "loc_1",
         "starts_at": "2026-06-18T09:00:00", "status": "completed", "session_number": 2},
    ]


# ---------------------------------------------------------------------------
# get_acquisition_mix
# ---------------------------------------------------------------------------

def test_acquisition_mix_percentages_sum_to_100(patients_fixture):
    result = server._get_acquisition_mix(patients_fixture, months_back=12, today=TODAY)
    total_pct = sum(s["percentage"] for s in result["by_acquisition_source"])
    assert abs(total_pct - 100.0) < 0.5


def test_acquisition_mix_only_counts_patients_in_window(patients_fixture):
    result = server._get_acquisition_mix(patients_fixture, months_back=12, today=TODAY)
    # p8's first_visit_date (2024-01-10) is outside the 12-month window.
    assert result["total_new_patients"] == 7
    ids_seen = sum(s["count"] for s in result["by_acquisition_source"])
    assert ids_seen == 7


# ---------------------------------------------------------------------------
# get_referral_performance
# ---------------------------------------------------------------------------

def test_referral_performance_only_attributes_revenue_to_referred_patients(
    patients_fixture, surgeons, appointments_fixture
):
    result = server._get_referral_performance(
        patients_fixture, surgeons, appointments_fixture, months_back=12, today=TODAY
    )
    sg_a = next(s for s in result["surgeons"] if s["surgeon_id"] == "sg_a")
    # p1+p2+p3+p4 = 950+950+950+100 = 2950. p8 excluded (out of window).
    # p6/p7 (unreferred) must never be attributed to any surgeon.
    assert sg_a["total_revenue_attributed"] == pytest.approx(2950.0)
    total_attributed = sum(s["total_revenue_attributed"] for s in result["surgeons"])
    unreferred_revenue = sum(
        p["total_spend"] for p in patients_fixture if p["referred_by_surgeon_id"] is None
    )
    assert total_attributed + unreferred_revenue == pytest.approx(
        sum(p["total_spend"] for p in patients_fixture if p["patient_id"] != "p8")
    )


def test_referral_performance_package_purchase_rate(patients_fixture, surgeons, appointments_fixture):
    result = server._get_referral_performance(
        patients_fixture, surgeons, appointments_fixture, months_back=12, today=TODAY
    )
    sg_a = next(s for s in result["surgeons"] if s["surgeon_id"] == "sg_a")
    # sg_a referred p1,p2,p3 (package) and p4 (single session) -> 3/4 = 0.75
    assert sg_a["patients_referred"] == 4
    assert sg_a["package_purchase_rate"] == pytest.approx(0.75)

    sg_b = next(s for s in result["surgeons"] if s["surgeon_id"] == "sg_b")
    assert sg_b["package_purchase_rate"] == pytest.approx(1.0)


def test_referral_performance_sorted_by_revenue_descending(patients_fixture, surgeons, appointments_fixture):
    result = server._get_referral_performance(
        patients_fixture, surgeons, appointments_fixture, months_back=12, today=TODAY
    )
    revenues = [s["total_revenue_attributed"] for s in result["surgeons"]]
    assert revenues == sorted(revenues, reverse=True)


# ---------------------------------------------------------------------------
# detect_referral_decay (uses the real seeded data -- the decline for sg_3 /
# sg_5 and the low-volume exclusion for sg_7 are baked in by seed.py)
# ---------------------------------------------------------------------------

def test_detect_referral_decay_flags_seeded_decline():
    result = server._detect_referral_decay(server.PATIENTS, server.SURGEONS, today=TODAY)
    flagged_ids = {f["surgeon_id"] for f in result["flagged"]}
    assert flagged_ids & {"sg_3", "sg_5"}, "expected the seeded declining surgeon(s) to be flagged"


def test_detect_referral_decay_excludes_low_baseline_volume():
    result = server._detect_referral_decay(server.PATIENTS, server.SURGEONS, today=TODAY)
    excluded_ids = {e["surgeon_id"] for e in result["excluded_low_volume"]}
    flagged_ids = {f["surgeon_id"] for f in result["flagged"]}
    assert excluded_ids, "expected at least one surgeon excluded for low baseline volume"
    assert excluded_ids.isdisjoint(flagged_ids)


def test_detect_referral_decay_synthetic_exclusion(surgeons):
    # sg_a has only 2 baseline referrals (below the minimum of 3) and should
    # be excluded rather than evaluated, even though its rate technically dropped.
    patients = [
        {
            "patient_id": f"q{i}", "first_name": "X", "last_name": "Y",
            "phone": "555-0000", "email": "x@example.com", "preferred_location_id": "loc_1",
            "acquisition_source": "surgeon_referral", "referred_by_surgeon_id": "sg_a",
            "procedure": "other", "surgery_date": "2026-01-01", "first_visit_date": d,
            "package_type": "single_session", "package_sessions_purchased": 0, "package_sessions_used": 1,
            "total_spend": 100.0, "consent_sms": True, "consent_email": True, "do_not_contact": False,
        }
        for i, d in enumerate(["2026-02-01", "2026-03-01"])
    ]
    result = server._detect_referral_decay(
        patients, surgeons, baseline_months=6, recent_months=3, today=TODAY
    )
    assert "sg_a" not in {f["surgeon_id"] for f in result["flagged"]}
    assert "sg_a" in {e["surgeon_id"] for e in result["excluded_low_volume"]}


# ---------------------------------------------------------------------------
# get_surgeon_patients
# ---------------------------------------------------------------------------

def test_get_surgeon_patients_returns_only_that_surgeons_patients(
    patients_fixture, surgeons, appointments_fixture
):
    result = server._get_surgeon_patients(
        patients_fixture, surgeons, appointments_fixture, surgeon_id="sg_a", months_back=12, today=TODAY
    )
    returned_ids = {p["patient_id"] for p in result["patients"]}
    assert returned_ids == {"p1", "p2", "p3", "p4"}
    assert result["total_referred"] == 4


def test_get_surgeon_patients_never_returns_full_last_name(
    patients_fixture, surgeons, appointments_fixture
):
    result = server._get_surgeon_patients(
        patients_fixture, surgeons, appointments_fixture, surgeon_id="sg_a", months_back=12, today=TODAY
    )
    full_last_names = {"Anderson", "Brown", "Cruz", "Diaz"}
    for row in result["patients"]:
        assert not any(ln in row["name"] for ln in full_last_names)
        # "First L." pattern: last token is a single initial followed by a period.
        last_token = row["name"].split()[-1]
        assert len(last_token) == 2 and last_token[1] == "."


# ---------------------------------------------------------------------------
# log_outreach
# ---------------------------------------------------------------------------

def test_log_outreach_writes_and_returns_record(tmp_path, patients_fixture, surgeons):
    log_path = tmp_path / "outreach_log.json"
    surgeons_path = tmp_path / "surgeons.json"
    result = server._log_outreach(
        patients_fixture, surgeons, "surgeon", "sg_a", "email", "Sent monthly report", "sent",
        log_path, surgeons_path, now=None,
    )
    assert "record" in result
    assert result["record"]["target_id"] == "sg_a"
    on_disk = json.loads(log_path.read_text())
    assert len(on_disk) == 1
    assert on_disk[0]["outcome"] == "sent"


def test_log_outreach_updates_last_report_sent_for_surgeon(tmp_path, patients_fixture, surgeons):
    log_path = tmp_path / "outreach_log.json"
    surgeons_path = tmp_path / "surgeons.json"
    from datetime import datetime
    fixed_now = datetime(2026, 7, 15, 12, 0, 0)
    server._log_outreach(
        patients_fixture, surgeons, "surgeon", "sg_b", "email", "Sent report", "sent",
        log_path, surgeons_path, now=fixed_now,
    )
    sg_b = next(s for s in surgeons if s["surgeon_id"] == "sg_b")
    assert sg_b["last_report_sent"] == "2026-07-15"
    on_disk = json.loads(surgeons_path.read_text())
    on_disk_b = next(s for s in on_disk if s["surgeon_id"] == "sg_b")
    assert on_disk_b["last_report_sent"] == "2026-07-15"


def test_log_outreach_refuses_do_not_contact(tmp_path, surgeons):
    log_path = tmp_path / "outreach_log.json"
    surgeons_path = tmp_path / "surgeons.json"
    patients = [{
        "patient_id": "dnc1", "first_name": "No", "last_name": "Contact",
        "phone": "555-9999", "email": "nc@example.com", "preferred_location_id": "loc_1",
        "acquisition_source": "self_search", "referred_by_surgeon_id": None,
        "procedure": "other", "surgery_date": "2026-06-01", "first_visit_date": "2026-06-10",
        "package_type": "single_session", "package_sessions_purchased": 0, "package_sessions_used": 1,
        "total_spend": 100.0, "consent_sms": True, "consent_email": True, "do_not_contact": True,
    }]
    result = server._log_outreach(
        patients, surgeons, "patient", "dnc1", "email", "Follow up", "sent",
        log_path, surgeons_path,
    )
    assert "error" in result
    assert not log_path.exists()


def test_log_outreach_refuses_missing_channel_consent(tmp_path, surgeons):
    log_path = tmp_path / "outreach_log.json"
    surgeons_path = tmp_path / "surgeons.json"
    patients = [{
        "patient_id": "nosms1", "first_name": "No", "last_name": "Sms",
        "phone": "555-8888", "email": "ns@example.com", "preferred_location_id": "loc_1",
        "acquisition_source": "self_search", "referred_by_surgeon_id": None,
        "procedure": "other", "surgery_date": "2026-06-01", "first_visit_date": "2026-06-10",
        "package_type": "single_session", "package_sessions_purchased": 0, "package_sessions_used": 1,
        "total_spend": 100.0, "consent_sms": False, "consent_email": True, "do_not_contact": False,
    }]
    result = server._log_outreach(
        patients, surgeons, "patient", "nosms1", "sms", "Reminder", "sent",
        log_path, surgeons_path,
    )
    assert "error" in result
    assert not log_path.exists()
