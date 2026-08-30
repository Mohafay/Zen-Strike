# Clinic Referral Engine MCP

## What this does

This is an MCP server for a multi-location post-surgical recovery clinic that
runs manual lymphatic drainage (MLD) programs. It turns the clinic's patient,
appointment, and surgeon data into five tools Claude can call directly.
Instead of pulling reports by hand, an operations manager can ask Claude
where patients are coming from, which referring surgeons are worth
cultivating, and log outreach back to those surgeons -- all in conversation.

This is a proof of concept running on generated mock data. **No real patient
data. No PHI.**

## What question it answers

- Where do our patients actually come from -- surgeon referrals, search,
  social, or word of mouth -- and is that mix changing?
- Which referring surgeons send patients who buy full packages and finish
  them, versus ones who send single-visit tire-kickers?
- Which referral relationships are quietly dying, and what's that worth in
  annual revenue if nobody notices?

## Install

```bash
cd clinic-referral-mcp
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python seed.py        # generates data/*.json deterministically
pytest                 # should be all green
```

## Connect to Claude

Use `claude_desktop_config.example.json` as a template, filling in the
absolute path to `server.py` on your machine:

```json
{
  "mcpServers": {
    "clinic-referral": {
      "command": "python3",
      "args": ["/absolute/path/to/clinic-referral-mcp/server.py"]
    }
  }
}
```

Merge this into Claude Desktop's config file, then restart Claude Desktop:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

## The five tools

| Tool | Plain-English purpose | When Claude reaches for it |
|---|---|---|
| `get_acquisition_mix` | Breaks down new patients by acquisition source, location, and month | "Where are our patients coming from?" |
| `get_referral_performance` | Ranks referring surgeons by revenue, package rate, completion rate, no-shows | "Which surgeons refer good patients, not just a lot of them?" |
| `detect_referral_decay` | Flags surgeons whose referral rate has dropped vs. their own baseline | "Is anyone quietly sending us fewer patients?" |
| `get_surgeon_patients` | Pulls one surgeon's referred patients for a period, ready to summarize | "Draft this office a report on their referrals" |
| `log_outreach` | Records an outreach action; updates a surgeon's last-contacted date | "Log that I emailed Dr. X's office today" |

## Try it

1. *"Where are our new patients coming from this year, and is it mostly
   surgeon referrals like we assume?"*
2. *"Which referring surgeons should we be worried about losing? Show me
   who's declined and what it's costing us."*
3. *"Draft this month's referral report for Dr. Whitfield's office."*
   (This uses the `monthly_surgeon_report` prompt -- Claude will present the
   draft for your approval before logging anything.)

## Swapping mock data for real systems

| Mock file | Maps to (in a real deployment) | What changes |
|---|---|---|
| `data/patients.json` | Your CRM or EHR | Replace `load_data()` in `server.py` with a call into that system's API; keep the same field names or add a translation layer |
| `data/appointments.json` | Booking/scheduling software (e.g. Acuity, Mindbody) | Same -- swap the loader for an API call, paginate as needed |
| `data/surgeons.json` | Wherever referral sources currently live -- often a spreadsheet, sometimes nothing formal | This is usually the biggest lift, since referral tracking is rarely centralized; expect to build this from scratch alongside the real integration |
| `data/locations.json` | Practice management config | Rarely changes; can often stay a static file even in production |

The tool logic in `server.py` doesn't need to change -- only `load_data()`
and `_log_outreach`'s persistence need to point at real systems instead of
JSON files.

## Data and privacy

This POC uses generated mock data and contains no PHI. **Connecting live
patient data requires a HIPAA scoping conversation and a signed BAA before
any real patient record reaches a model API.** This is not optional and not
a formality -- do not point this server at a real patient database without
that in place first.

## Extending it

To add a sixth tool: write a plain function that takes the data lists and
your arguments and returns a dict with a `summary` key, decorate a thin
wrapper with `@mcp.tool()` that calls it with the module's loaded data, add
a docstring describing when Claude should reach for it, and add a test in
`tests/test_tools.py`. Don't add a tool that just drafts text -- that's what
prompts are for.
