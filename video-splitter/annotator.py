import os
import json
import pandas as pd

class Annotator:
    def __init__(self, database: str = None, config: str = None):
        self.database_path = database
        if os.path.exists(database):
            self.database = pd.read_csv('database.csv', delimiter=',')
        else:
            self.database = pd.DataFrame(columns=['video_name', 'label'], dtype=str)
        self.config_path = config
        if os.path.exists(config):
            with open(config, 'r') as f:
                self.config = json.load(f)
        else:
            self.config = {
                'current_task': None,
                'saved_tasks': [],
                'uploads_folder': None
            }
            
        self.save()
            
    def save(self):
        self.database.to_csv(self.database_path, index=False)
        with open(self.config_path, 'w') as f:
            json.dump(self.config, f)
        
    def load(self):
        self.database = pd.read_csv('database.csv', delimiter=',')
        with open(self.config_path, 'r') as f:
            self.config = json.load(f)
            
    def set_uploads_folder(self, folder: str):
        if not os.path.exists(folder):
            raise FileNotFoundError('Folder does not exist')
        self.config['uploads_folder'] = folder
        self.save()
        
    def update_database(self):
        # if there are new videos in the uploads folder, add them to the database
        if self.config['uploads_folder'] is not None:
            for video in os.listdir(self.config['uploads_folder']):
                if video not in self.database['video_name'].tolist():
                    self.database.loc[len(self.database)] = [video, None]
        # remove videos that are not in the uploads folder
        self.database = self.database[self.database['video_name'].apply(lambda x: os.path.exists(os.path.join(self.config['uploads_folder'], x)))]
        self.save()
        
    def add_tasks(self, tasks: str | list):
        # tasks is a list of video names that need to be annotated. Set the label to None
        if type(tasks) == str:
            tasks = [tasks]
        for task in tasks:
            if task not in self.database['video_name'].tolist():
                self.database.loc[len(self.database)] = [task, None]
            
    def annotate(self, video_name: str, label: str):
        self.database.loc[self.database['video_name'] == video_name, 'label'] = label
        self.config['saved_tasks'].append(video_name)
        # if memory is more than 10, remove the oldest task
        if len(self.config['saved_tasks']) > 10:
            self.config['saved_tasks'] = self.config['saved_tasks'][1:]
        self.save()
        
    def get_unannotated(self):
        return self.database[self.database['label'].isnull()]
    
    def get_new_task(self, n: int = 1):
        unannotated_tasks = self.get_unannotated()
        if len(self.get_unannotated()) == 0:
            return None
        n = min(n, len(unannotated_tasks))
        return unannotated_tasks.iloc[:n]['video_name'].tolist()
    
    def clear_all_annotations(self):
        self.database['label'] = None
        self.config['saved_tasks'] = []
        self.save()
    
    def go_back(self):
        if len(self.config['saved_tasks']) > 0:
            self.database.loc[self.database['video_name'] == self.config['saved_tasks'][-1], 'label'] = None
            self.config['saved_tasks'] = self.config['saved_tasks'][:-1]
            self.save()