import requests
import sys

if __name__ == "__main__":
    response = requests.get(
        "https://raw.githubusercontent.com/leppekja/SNAP-performance-indicators/refs/heads/main/csvs/application_processing_times.csv"
    )

    response.raise_for_status()

    sys.stdout.write(response.text)