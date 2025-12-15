import requests
import subprocess
import time
import os
from urllib.parse import urlparse

SERVER_URL = "https://www.example.com/api/print-queue"
POLL_INTERVAL = 5  # seconds

# CUPS printer names
EPSON_PRINTER = "Epson_Color"
XEROX_PRINTER = "Xerox_BW"

DOWNLOAD_DIR = "/tmp/print_jobs"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)


def download_pdf(url):
    filename = os.path.basename(urlparse(url).path)
    path = os.path.join(DOWNLOAD_DIR, filename)

    r = requests.get(url, timeout=30)
    r.raise_for_status()

    with open(path, "wb") as f:
        f.write(r.content)

    return path


def choose_printer(print_job):
    """
    Epson:
      - COLOR
      - single sided only
    Xerox:
      - BLACK_WHITE
      - duplex allowed
    """
    if print_job["colorMode"] == "COLOR":
        return EPSON_PRINTER
    return XEROX_PRINTER


def build_lp_command(printer, job, file_path):
    cmd = [
        "lp",
        "-d", printer,
        "-n", str(job["copies"])
    ]

    # Duplex handling
    if printer == XEROX_PRINTER and job["printOnBothSides"]:
        cmd += ["-o", "sides=two-sided-long-edge"]
    else:
        cmd += ["-o", "sides=one-sided"]

    # Color handling
    if printer == XEROX_PRINTER:
        cmd += ["-o", "ColorModel=Gray"]
    else:
        cmd += ["-o", "ColorModel=RGB"]

    # Orientation
    if job["orientation"] == "LANDSCAPE":
        cmd += ["-o", "orientation-requested=4"]

    # Page range
    if job["pageRange"] == "CUSTOM" and job["customRange"]:
        cmd += ["-o", f"page-ranges={job['customRange']}"]

    cmd.append(file_path)
    return cmd


def print_job(job):
    printer = choose_printer(job)
    pdf_path = download_pdf(job["fileUrl"])
    cmd = build_lp_command(printer, job, pdf_path)

    print(f"[→] Printing {pdf_path} on {printer}")
    subprocess.run(cmd, check=True)
    print("[✓] Print triggered successfully")


def fetch_orders():
    r = requests.get(SERVER_URL, timeout=10)
    r.raise_for_status()
    return r.json()["orders"]


def main():
    print("🖨️ Print agent started")
    while True:
        try:
            orders = fetch_orders()

            for order in orders:
                for job in order["prints"]:
                    if job["status"] != "PENDING":
                        continue

                    print_job(job)

                    # OPTIONAL: update job status back to server
                    # requests.post("https://www.example.com/api/update-status",
                    #               json={"printId": job["id"], "status": "SUCCESS"})

        except Exception as e:
            print("⚠️ Error:", e)

        time.sleep(POLL_INTERVAL)


if __name__ == "__main__":
    main()
