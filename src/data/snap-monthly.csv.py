# Source website is https://www.fns.usda.gov/pd/supplemental-nutrition-assistance-program-snap

import pandas as pd
import zipfile
import sys
import io

class FNSFile:
    def __init__(self, file):
        self.file = file
        # also is a summary sheet, but ignoring that one
        # SWRO with a space is a typo in the file
        self.sheet_names = ["NERO", "MARO", "MWRO", "SWRO", "SWRO ", "MPRO", "SERO", "WRO"]
        self.us_state_territory_names = ["American Samoa", "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
                  "Commonwealth of Northern Mariana Islands", "Delaware", "District of Columbia",
               "Florida", "Georgia", "Guam", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
               "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
               "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York",
               "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Puerto Rico", "Rhode Island",
               "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Virgin Islands", "Washington",
               "West Virginia", "Wisconsin", "Wyoming"]

    def get_sheets_from_file(self):
        sheets_to_return = []
        dfs = pd.read_excel(self.file, sheet_name=None)
        sheet_names_in_file = list(dfs.keys())
        for sheet_name in self.sheet_names:
            if sheet_name not in sheet_names_in_file:
                continue
            else:
                sheets_to_return.append(dfs[sheet_name])

        return sheets_to_return
    def validate(self):
        pass


    def proper_column_names(self, prefix, suffix):
        empty_string = lambda x: "" if pd.isna(x) else str(x).strip() + " "
        return f"{empty_string(prefix)}{empty_string(suffix)}"


    def clean_sheet(self, sheet):
        # state tables starting rows
        state_title_rows = sheet.index[sheet.iloc[:, 0].isin(self.us_state_territory_names)]
        state_header = "Fiscal Year and Month"
        state_tables = []
        index_of_columns = sheet.index[sheet.iloc[:, 0] == state_header]
        column_prefix = sheet.iloc[index_of_columns[0], :3]
        columns = sheet.iloc[index_of_columns[0] + 1, :3]
        col_names = [self.proper_column_names(prefix, column) for prefix, column in zip(column_prefix, columns)]
        for state in state_title_rows:
            # remove the first row of the state table
            state_name = sheet.iloc[state, 0]
            state_data = sheet.iloc[state+1:state+13, 0:3].copy()
            # some states might not have any data associated with them
            no_data_found_indicator = state_data.iloc[0, 0]
            if "No data" in no_data_found_indicator:
                continue
            state_data.columns = col_names
            state_data["state"] = state_name
            state_data = state_data.replace('', float('nan')).dropna(how="all")
            # some dates may have a footnote, indicated by " /2", remove these
            state_data["Fiscal Year and Month "] = state_data["Fiscal Year and Month "].str.replace(" /2", "")
            state_tables.append(state_data.reset_index(drop=True))
        sheet = pd.concat(state_tables)
        return sheet

    @property
    def parsed_file(self):
        sheets = self.get_sheets_from_file()
        return pd.concat([self.clean_sheet(sheet) for sheet in sheets]).reset_index(drop=True)

if __name__ == "__main__":
    data_files = r"src\data\snap-monthly.zip"
    data = []
    with zipfile.ZipFile(data_files, 'r') as z:
        for file in z.namelist():
            if not file.startswith('FY'):
                # state level data not available past 1988, skip it
                continue
            with z.open(file) as f:
                file_buffer = io.BytesIO(f.read())
                data.append(FNSFile(file_buffer).parsed_file)

    csv_data = pd.concat(data, axis=0, ignore_index=True).rename(
        columns={"Fiscal Year and Month ": "fiscal_year_month",
                 "Participation 1/ Household ": "households",
                 "Persons ": "persons"})
    
    csv_data["fiscal_year_month"] = pd.to_datetime(csv_data["fiscal_year_month"], format="%b %Y").dt.strftime("%Y-%m-%d")    
    csv_data = csv_data.replace("--", 0)
    csv_data = csv_data.groupby(["state", "fiscal_year_month"]).sum().reset_index()
    csv_data.to_csv(sys.stdout, index=False, lineterminator='\n')