import json
from pathlib import Path

class DBManager:
    def __init__(self, filename):
        self.filepath = Path(f"data/{filename}")
        self.data = self._load()
    
    def _load(self):
        try:
            with open(self.filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return []
    
    def save(self):
        self.filepath.parent.mkdir(exist_ok=True)
        with open(self.filepath, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=4, ensure_ascii=False)
    
    def get_all(self):
        return self.data
    
    def add(self, item):
        self.data.append(item)
        self.save()