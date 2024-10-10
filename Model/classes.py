import json
from collections import defaultdict

# Load data from JSON file
with open("./datasets/annotations_final.json", "r", encoding="utf-8") as file:
    data = json.load(file)

# Extract classes and annotations
class_instances = defaultdict(int)

# Iterate through each entry in the data
for entry in data:
    _, annotation = entry
    entities = annotation.get("entities", [])
    
    # Increment instance count for each class
    for _, _, label in entities:
        class_instances[label] += 1

# Print table header
print("Class\t\tInstances")

total_labels = sum(class_instances.values())

# Print each class and its instance count
for class_name, instance_count in class_instances.items():
    print(f"{class_name}\t\t{instance_count}")

print(f"\nTotal Labels: {total_labels}")