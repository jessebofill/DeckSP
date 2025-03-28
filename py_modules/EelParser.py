import json
import re
from typing import List, TypedDict
import decky

class Parameter(TypedDict):
    variable_name: str
    default_value: float
    min: float
    max: float
    step: float
    description: str
    init_line: int
    current_value: float

class EELParser:
    def __init__(self, path):
        self.path = path
        try:
            self._lines = self._read().splitlines()
        except Exception as e:
            self.error = e
            return
        
        self.parameters: List[Parameter] = []
        self.description = None
        self._parse()
        
    def _read(self):
        try:
            with open(self.path, "r") as script_file:
                return script_file.read()
        except OSError as e:
            decky.logger.error(f"Error reading file {self.path}: {e}")
            raise e
            
    def _write(self, script):
        try:
            with open(self.path, "w") as script_file:
                script_file.write(script)
        except OSError as e:
            decky.logger.error(f"Error writing file {self.path}: {e}")

    def _parse(self):
        decky.logger.info(f'parsing {len(self._lines)} lines, script: {self.path}')
        pattern = re.compile(r"(?P<var>\w+):(?P<def>-?\d+\.?\d*)?<(?P<min>-?\d+\.?\d*),(?P<max>-?\d+\.?\d*),?(?P<step>-?\d+\.?\d*)?(?:\{(?P<opt>[^\}]*)\})?>(?P<desc>[^\n]*)$")
        def to_float(value):
            try:
                return float(value)
            except (TypeError, ValueError):
                return None
            
        for i, line in enumerate(self._lines):
            line = line.strip()

            if line == "@init":
                break

            if not self.description:
                desc_match = re.search(r"^desc:(.*)$", line)
                if desc_match:
                    self.description = desc_match.group(1)
                    continue
                    
            match = pattern.search(line)
            if match:
                decky.logger.info(f'found param match {match.group("var")}')
                init = self._find_init_line_and_value(match.group("var"), i + 1)
                if init:
                    decky.logger.info(f'found param init line')
                    
                    init_line, init_value = init
                    parameter: Parameter = {
                        "variable_name": match.group("var"),
                        "default_value": to_float(match.group("def")),
                        "min": to_float(match.group("min")),
                        "max": to_float(match.group("max")),
                        "step": to_float(match.group("step")), 
                        "description": match.group("desc").strip(),
                        "init_line": init_line,
                        "current_value": to_float(init_value),
                    }
                    if (
                        parameter["min"] is None or 
                        parameter["max"] is None or 
                        parameter["default_value"] is None or 
                        parameter["min"] >= parameter["max"]
                    ):
                        decky.logger.info(f'param did not meet expectations, skipping {match.group("var")}')
                        continue
                    else: self.parameters.append(parameter)

                    if parameter["step"] is None or parameter["step"] <= 0: parameter["step"] = 0.1

                    if match.group("opt"):
                        parameter["type"] = "list"
                        parameter["options"] = match.group("opt").split(",")
                        parameter["step"] = 1
                        parameter["max"] = len(parameter["options"]) - 1
                        parameter["min"] = 0
                    else: parameter["type"] = "range"
                        
                    if parameter["default_value"] > parameter["max"]: parameter["default_value"] = parameter["max"]
                    if parameter["default_value"] < parameter["min"]: parameter["default_value"] = parameter["min"]

                    if parameter["current_value"] is None or parameter["current_value"] > parameter["max"] or parameter["current_value"] < parameter["min"]:
                        parameter["current_value"] = parameter["default_value"]
                        
        decky.logger.info(json.dumps(self.parameters))

    def _find_init_line_and_value(self, param, start_index):
        pattern = re.compile(rf"{param}\s*=\s*(?P<val>-?\d+\.?\d*)\s*;")
        for i in range(start_index, len(self._lines)):
            match = pattern.search(self._lines[i])
            if match:
                return [i, match.group("val")]

    def edit_value(self, param, value):
        for parameter in self.parameters:
            if parameter["variable_name"] == param:
                line_number = parameter["init_line"]
                pattern = re.compile(rf"{param}\s*=\s*(?P<val>-?\d+\.?\d*)\s*;")
                line = self._lines[line_number]
                match = pattern.search(line)
                if match:
                    start, end = match.span("val")
                    self._lines[line_number] = line[:start] + str(value) + line[end:]
                    parameter["current_value"] = value

    def update_script(self):
        self._write("\n".join(self._lines))
        
    def set_and_commit(self, param, value):
        self.edit_value(param, value)
        self.update_script()

    def reset_to_defaults(self):
        for slider in self.parameters:
            if "default_value" in slider:
                self.edit_value(slider["variable_name"], slider["default_value"])

