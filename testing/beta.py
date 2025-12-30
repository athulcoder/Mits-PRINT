import time
import requests
import subprocess
from pathlib import Path
import threading
import hashlib

# ================= CONFIG =================

SERVER_BASE = "https://yourserver/api"
JOB_FETCH_URL = f"{SERVER_BASE}/jobs/next"
JOB_STATUS_URL = f"{SERVER_BASE}/jobs/status"
PRINTER_STATUS_URL = f"{SERVER_BASE}/printer/status"

PRINTER_PC_ID = "printer_pc_01"

CHECK_JOB_INTERVAL = 10
CHECK_PRINTER_INTERVAL = 5

WORK_DIR = Path("/var/lib/printer_agent")
WORK_DIR.mkdir(parents=True, exist_ok=True)

# ================= STATE =================

printed_jobs = set()
last_printer_state = {}

# ================= UTIL =================

def hash_job(job_id):
    return hashlib.sha256(job_id.encode()).hexdigest()

# ================= PRINTER STATUS =================

def get_printer_status():
    r = subprocess.run(
        ["lpstat", "-p"],
        capture_output=True,
        text=True
    )
    return r.stdout.splitlines()

def parse_printer_status(lines):
    status = {}
    for line in lines:
        parts = line.split()
        printer = parts[1]
        state = " ".join(parts[3:])
        status[printer] = state
    return status

def report_printer_status(status):
    payload = {
        "printer_pc_id": PRINTER_PC_ID,
        "status": status
    }
    requests.post(PRINTER_STATUS_URL, json=payload, timeout=10)

def printer_monitor():
    global last_printer_state
    while True:
        try:
            raw = get_printer_status()
            current = parse_printer_status(raw)
            if current != last_printer_state:
                report_printer_status(current)
                last_printer_state = current
        except Exception as e:
            print("[Printer Monitor Error]", e)
        time.sleep(CHECK_PRINTER_INTERVAL)

# ================= JOB HANDLING =================

def fetch_job():
    r = requests.get(JOB_FETCH_URL, timeout=15)
    if r.status_code == 204:
        return None
    r.raise_for_status()
    return r.json()

def download_pdf(url, job_id):
    pdf_path = WORK_DIR / f"{job_id}.pdf"
    r = requests.get(url, stream=True, timeout=30)
    r.raise_for_status()
    with open(pdf_path, "wb") as f:
        for chunk in r.iter_content(8192):
            f.write(chunk)
    return pdf_path

def choose_printer(job):
    if job["color"]:
        return "Epson", ["-o", "sides=one-sided"]
    else:
        opts = []
        if job["duplex"]:
            opts += ["-o", "sides=two-sided-long-edge"]
        return "Xerox", opts

def print_job(job, pdf_path):
    printer, options = choose_printer(job)
    cmd = [
        "lp",
        "-d", printer,
        "-n", str(job["copies"]),
        *options,
        str(pdf_path)
    ]
    subprocess.run(cmd, check=True)

def report_job(job_id, status, reason=None):
    payload = {
        "job_id": job_id,
        "printer_pc_id": PRINTER_PC_ID,
        "status": status,
        "reason": reason
    }
    requests.post(JOB_STATUS_URL, json=payload, timeout=10)

def job_worker():
    while True:
        try:
            job = fetch_job()
            if not job:
                time.sleep(CHECK_JOB_INTERVAL)
                continue

            job_hash = hash_job(job["job_id"])
            if job_hash in printed_jobs:
                continue

            pdf = download_pdf(job["file_url"], job["job_id"])

            try:
                print_job(job, pdf)
                report_job(job["job_id"], "PRINTED")
                printed_jobs.add(job_hash)
            except subprocess.CalledProcessError:
                report_job(job["job_id"], "FAILED", "Printer error")

        except Exception as e:
            print("[Job Worker Error]", e)

        time.sleep(2)

# ================= MAIN =================

def main():
    print("🖨️ Printer Agent Started (Headless)")

    threading.Thread(target=printer_monitor, daemon=True).start()
    threading.Thread(target=job_worker, daemon=True).start()

    while True:
        time.sleep(60)

if __name__ == "__main__":
    main()
