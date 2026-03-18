from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import random

class AnalyzeRequest(BaseModel):
    imagePath: str

FOODS = {
    "Arroz branco": {"protein": 2.7, "carbs": 28.2, "fats": 0.3, "calories": 130},
    "Feijão carioca": {"protein": 4.8, "carbs": 13.6, "fats": 0.5, "calories": 76},
    "Frango grelhado": {"protein": 31.0, "carbs": 0.0, "fats": 3.6, "calories": 165},
    "Batata doce": {"protein": 1.6, "carbs": 20.7, "fats": 0.1, "calories": 86},
    "Brócolis": {"protein": 2.8, "carbs": 7.0, "fats": 0.4, "calories": 34},
    "Ovo cozido": {"protein": 12.6, "carbs": 1.1, "fats": 10.6, "calories": 155},
    "Salmão": {"protein": 25.4, "carbs": 0.0, "fats": 13.4, "calories": 208},
    "Avocado": {"protein": 2.0, "carbs": 8.5, "fats": 14.7, "calories": 160},
    "Tomate": {"protein": 0.9, "carbs": 3.9, "fats": 0.2, "calories": 18},
    "Banana": {"protein": 1.1, "carbs": 23.0, "fats": 0.3, "calories": 89},
}

app = FastAPI()

@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    amount = random.randint(2, 4)
    foods = random.sample(list(FOODS.keys()), amount)
    items = []
    for food in foods:
        quantity = random.randint(50, 200)
        nutrition = FOODS[food]
        items.append({
            "name": food,
            "quantity": quantity,
            "protein": round(nutrition["protein"] * quantity / 100, 2),
            "carbs": round(nutrition["carbs"] * quantity / 100, 2),
            "fats": round(nutrition["fats"] * quantity / 100, 2),
            "calories": round(nutrition["calories"] * quantity / 100, 2),
        })
    return {"items": items}
        

