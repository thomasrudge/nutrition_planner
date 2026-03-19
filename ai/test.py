from transformers import pipeline

classifier = pipeline("image-classification", model="nateraw/food")
result = classifier("path/to/food.jpg")
print(result)