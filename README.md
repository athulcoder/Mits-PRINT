<img width="1024" height="1024" alt="flow-diagram" src="https://github.com/user-attachments/assets/e1e8cc73-4e42-4b27-9f18-ac25d932282b" />


# Auto-Print & Delete Automation

This project automates the process of printing PDF files. It monitors a specific folder (e.g., "print"); whenever a PDF is detected, it automatically sends it to the default printer and deletes the file afterward.

## Features
- **Auto-detection:** Watch a specific folder for new `.pdf` files.
- **Auto-printing:** Sends files to the Windows Default Printer immediately.
- **Auto-cleanup:** Deletes the file after the print job is spooled to prevent duplicate prints.

---

## Prerequisites

Before running the scripts, ensure the following:

1.  **Default Printer:** Make sure your physical printer is set as the **Default Printer** in Windows Settings.
    * *Settings > Bluetooth & devices > Printers & scanners > Select your printer > Set as default.*
    * *Warning:* If "Microsoft Print to PDF" is default, the script will get stuck asking where to save files.
2.  **PDF Reader:** Ensure you have a PDF reader installed (Adobe Reader, SumatraPDF, Edge, etc.).

---

## Method 1: Python (Recommended)

This method is more robust and offers better control over file handling.

### 1. Installation
1.  Install [Python](https://www.python.org/downloads/) if you haven't already.
2.  Open your Command Prompt or Terminal and install the required Windows extensions:
    ```bash
    pip install pywin32
    ```

### 2. Configuration
1.  Create a file named `autoprint.py`.
2.  Paste the code below into the file.
3.  **Important:** Edit the `path_to_watch` variable in the code to match your specific folder path.

```python
import os
import time
import win32api
import win32print

# --- CONFIGURATION ---
# Use 'r' before the string to handle backslashes
path_to_watch = r"C:\Users\YourName\Desktop\print" 
# ---------------------

print(f"Monitoring {path_to_watch} for PDFs...")

while True:
    try:
        files = os.listdir(path_to_watch)
        for filename in files:
            if filename.lower().endswith(".pdf"):
                full_path = os.path.join(path_to_watch, filename)
                print(f"Printing: {filename}")
                
                # Print using default printer
                win32api.ShellExecute(0, "print", full_path, None, ".", 0)
                
                # Wait for spooling (adjust if printing large files)
                time.sleep(10) 
                
                # Delete file
                os.remove(full_path)
                print(f"Deleted: {filename}")
                
        time.sleep(5)
    except Exception as e:
        print(f"Error: {e}")
        time.sleep(5)
```
~sankar
