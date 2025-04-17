import re
from typing import Dict, List, TypedDict, cast
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

# Cache values per profile
class EELCache:
    # Represents a mapping of profile ids to numeric values
    # Example: { "profile1": 5.0, "profile2": 10.0 }
    ParameterCache = Dict[str, float]

    # Represents a mapping of parameter names to ParameterCache
    # Example: { "paramA": { "profile1": 5.0 }, "paramB": { "profile1": 3.0 } }
    ScriptCache = Dict[str, ParameterCache]

class EELParser:
    def __init__(self, path, cache: EELCache.ScriptCache, profile_id):
        self.path = path
        self._lines = self._read().splitlines()
        self.cache = cache
        self.profile = profile_id
        self.parameters: List[Parameter] = []
        self.description = None
        self._parse()
        
    def _read(self):
        try:
            with open(self.path, "r") as script_file:
                return script_file.read()
        except OSError as e:
            decky.logger.error(f"Error reading eel file {self.path}: {e}")
            raise e
            
    def _write(self, script):
        try:
            with open(self.path, "w") as script_file:
                script_file.write(script)
        except OSError as e:
            decky.logger.error(f"Error writing eel file {self.path}: {e}")
            raise e

    def _parse(self):
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
                init = self._find_init_line_and_value(match.group("var"), i + 1)
                if init:
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
                    self._use_cached_param(parameter)
        self._clean_cache()
        self._write("\n".join(self._lines))

    def _find_init_line_and_value(self, param, start_index):
        pattern = re.compile(rf"{param}\s*=\s*(?P<val>-?\d+\.?\d*)\s*;")
        for i in range(start_index, len(self._lines)):
            match = pattern.search(self._lines[i])
            if match:
                return [i, match.group("val")]

    def _clean_cache(self):
        for param in self.cache:
            if not next((parameter for parameter in self.parameters if parameter["variable_name"] == param), None):
                del self.cache[param]
                
    def _cache_param(self, parameter: Parameter):
        parameter_cache: EELCache.ParameterCache = {}
        if self.cache.get(parameter['variable_name']): parameter_cache = self.cache[parameter['variable_name']]
        else: self.cache[parameter['variable_name']] = parameter_cache
        parameter_cache[self.profile] = parameter['current_value']

    def _use_cached_param(self, parameter: Parameter):
        parameter_cache = self.cache.get(parameter['variable_name'], None) or {}
        value = parameter_cache.get(self.profile)
        self._edit_value(parameter['variable_name'], parameter['default_value'] if value == None else value)
            
    def _edit_value(self, param, value):
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
                    self._cache_param(parameter)

    def set_and_commit(self, param, value):
        self._edit_value(param, value)
        self._write("\n".join(self._lines))

    def reset_to_defaults(self):
        for slider in self.parameters:
            if "default_value" in slider:
                self._edit_value(slider["variable_name"], slider["default_value"])
        self._write("\n".join(self._lines))

