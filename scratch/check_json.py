import json

with open("scratch/all_presentation_data.json") as f:
    data = json.load(f)

print("Domains count:", len(data["allDomains"]))
print("Pillars count:", len(data["allPillars"]))
print("DR strategies:", len(data["drStrategies"]))
print("Theoretical foundations:", len(data["theoreticalFoundations"]))
print("Client workloads:", len(data["clientWorkloads"]))
print("Pillar details:", len(data["pillarDetails"]))
print("Module scripts:", len(data["moduleScripts"]))
print("Module tables:", len(data["moduleTables"]))
print("Theory slides:", len(data["theorySlides"]))
