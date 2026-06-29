"""
Seed the database with the previous Executive Committees (1st–11th EC)
parsed directly from the .docx files in the "previous EC" folder.

Usage (from the backend/ directory):

    python manage.py seed_previous_ec
    python manage.py seed_previous_ec --dir "../previous EC"
    python manage.py seed_previous_ec --dry-run        # parse & print, no DB writes
    python manage.py seed_previous_ec --replace        # delete existing rows for
                                                       # the parsed years first

Each .docx holds one session. The session year is taken from the heading
("1st Executive Committee (2014-15)" -> 2014). Every member becomes one
EcMember row (the same person across sessions is intentionally duplicated,
once per session). Photos are left blank — the frontend shows initials.
"""

from __future__ import annotations

import os
import re
import zipfile
from xml.etree import ElementTree as ET

from django.core.management.base import BaseCommand, CommandError

from committee.models import EcMember

# .docx XML namespace for paragraphs / runs
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

# Ordinal filename -> EC number (1st = 2014, 2nd = 2015, ...)
FOUNDING_YEAR = 2014
ORDINAL_FILES = {
    "1st": 1, "2nd": 2, "3rd": 3, "4th": 4, "5th": 5, "6th": 6,
    "7th": 7, "8th": 8, "9th": 9, "10th": 10, "11th": 11, "12th": 12,
}

# A "Role:" header line. Group 1 = role label, group 2 = trailing text (may be empty).
ROLE_RE = re.compile(r"^([A-Za-z][A-Za-z /&\-'.()]+?)\s*:\s*(.*)$")

# "Name (UNIVERSITY)" — capture name and the parenthesised university.
NAME_UNI_RE = re.compile(r"^(.*?)\s*\(([^)]*)\)\s*$")


def _para_text(doc_xml: bytes) -> list[str]:
    """Return the visible text of each <w:p> paragraph in a document.xml."""
    root = ET.fromstring(doc_xml)
    paras: list[str] = []
    for p in root.iter(f"{W}p"):
        texts = [t.text or "" for t in p.iter(f"{W}t")]
        line = "".join(texts).strip()
        # collapse internal whitespace
        line = re.sub(r"\s+", " ", line)
        if line:
            paras.append(line)
    return paras


def _normalise_role(label: str) -> str:
    """Singularise common plural role labels and tidy spacing."""
    label = label.strip()
    label = re.sub(r"\s+", " ", label)
    plural_map = {
        "Vice Presidents": "Vice President",
        "Vice-Presidents": "Vice President",
        "Joint Secretaries": "Joint Secretary",
        "Joint General Secretaries": "Joint General Secretary",
        "Organizing Secretaries": "Organizing Secretary",
        "Organising Secretaries": "Organizing Secretary",
        "Joint Secretarys": "Joint Secretary",
        "Assistant Secretaries": "Assistant Secretary",
        "Executive Members": "Executive Member",
        "Members": "Member",
    }
    return plural_map.get(label, label)


def _split_member(text: str) -> tuple[str, str] | None:
    """Parse 'Name (UNIV)' -> (name, univ). Returns None if there's no real name."""
    text = text.strip().strip(",").strip()
    if not text:
        return None
    m = NAME_UNI_RE.match(text)
    if m:
        name = m.group(1).strip()
        uni = m.group(2).strip()
    else:
        name, uni = text, ""
    # Clean stray spaces inside names (the docx scatters them: "A z m o l")
    name = re.sub(r"\s+", " ", name).strip()
    # Tidy spaced hyphens: "Harun- Or- Rasid" -> "Harun-Or-Rasid"
    name = re.sub(r"\s*-\s*", "-", name)
    # Strip stray parentheses left by source typos like "Name ((JU)"
    name = name.strip("()").strip()
    uni = uni.strip("()").strip()
    if not name or len(name) < 2:
        return None
    return name, uni


def parse_docx(path: str) -> tuple[int, list[tuple[str, str, str]]]:
    """Parse one session .docx -> (year, [(name, role, university), ...])."""
    base = os.path.splitext(os.path.basename(path))[0].lower().strip()
    # filename like "1st", "10th"
    key = base.split()[0]
    ec_no = ORDINAL_FILES.get(key)

    with zipfile.ZipFile(path) as z:
        doc_xml = z.read("word/document.xml")
    paras = _para_text(doc_xml)
    if not paras:
        return (0, [])

    # Year: prefer the (YYYY-YY) in the heading; else derive from ordinal.
    year = None
    heading = paras[0]
    ym = re.search(r"\((\d{4})\s*-\s*\d{2,4}\)", heading)
    if ym:
        year = int(ym.group(1))
    elif ec_no:
        year = FOUNDING_YEAR + ec_no - 1
    if year is None:
        raise CommandError(f"Could not determine year for {path}")

    members: list[tuple[str, str, str]] = []
    current_role = "Member"
    for line in paras[1:]:
        rm = ROLE_RE.match(line)
        if rm and "(" not in rm.group(1):
            # New role header.
            current_role = _normalise_role(rm.group(1))
            trailing = rm.group(2).strip()
            if trailing:
                parsed = _split_member(trailing)
                if parsed:
                    members.append((parsed[0], current_role, parsed[1]))
        else:
            # Continuation line: another member of the current role.
            parsed = _split_member(line)
            if parsed:
                members.append((parsed[0], current_role, parsed[1]))

    return (year, members)


class Command(BaseCommand):
    help = "Seed previous Executive Committees from the 'previous EC' .docx files."

    def add_arguments(self, parser):
        default_dir = os.path.join(
            os.path.dirname(__file__), "..", "..", "..", "..", "previous EC"
        )
        parser.add_argument("--dir", default=os.path.abspath(default_dir),
                            help="Folder containing the .docx files.")
        parser.add_argument("--dry-run", action="store_true",
                            help="Parse and print a summary without writing to the DB.")
        parser.add_argument("--replace", action="store_true",
                            help="Delete existing non-current rows for parsed years first.")

    def handle(self, *args, **opts):
        folder = opts["dir"]
        if not os.path.isdir(folder):
            raise CommandError(f"Folder not found: {folder}")

        files = sorted(
            (f for f in os.listdir(folder) if f.lower().endswith(".docx")),
            key=lambda f: ORDINAL_FILES.get(f.split(".")[0].lower(), 99),
        )
        if not files:
            raise CommandError(f"No .docx files in {folder}")

        total = 0
        for fname in files:
            path = os.path.join(folder, fname)
            year, members = parse_docx(path)
            if not members:
                self.stdout.write(self.style.WARNING(f"  {fname}: no members parsed"))
                continue

            self.stdout.write(
                self.style.HTTP_INFO(f"{fname} -> year {year}: {len(members)} members")
            )
            if opts["dry_run"]:
                for name, role, uni in members:
                    self.stdout.write(f"    {role}: {name} ({uni})")
                total += len(members)
                continue

            if opts["replace"]:
                # Remove only previous-EC rows for this year. Never touch the
                # current session or the 2014 convening committee.
                deleted, _ = EcMember.objects.filter(
                    year=year, is_current=False, is_convening=False
                ).delete()
                if deleted:
                    self.stdout.write(self.style.WARNING(f"    removed {deleted} existing rows"))

            objs = [
                EcMember(
                    name=name,
                    role=role,
                    university=uni,
                    year=year,
                    is_current=False,
                    is_convening=False,
                    photo_url="",
                )
                for name, role, uni in members
            ]
            EcMember.objects.bulk_create(objs)
            total += len(objs)

        verb = "Would create" if opts["dry_run"] else "Created"
        self.stdout.write(self.style.SUCCESS(f"\n{verb} {total} EcMember rows."))
