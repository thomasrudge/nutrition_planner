from fastapi import FastAPI
from pydantic import BaseModel
from ultralytics import YOLO
from PIL import Image
import io, base64, cv2
import torch

app = FastAPI()


class AnalyzeRequest(BaseModel):
    image: str


# ============================================================================
# Dicionário nutricional + densidades
# ============================================================================
FOODS = {
    'arroz': {
        'density': 0.8,
        'calories': 128, 'protein': 2.5, 'carbs': 28.1, 'fats': 0.2,
    },
    'feijão': {
        'density': 0.6,
        'calories': 77, 'protein': 4.5, 'carbs': 14.0, 'fats': 0.5,
    },
    'frango': {
        'density': 1.0,
        'calories': 220, 'protein': 28.0, 'carbs': 0.0, 'fats': 12.0,
    },
    'carne bovina': {
        'density': 1.2,
        'calories': 219, 'protein': 27.0, 'carbs': 0.0, 'fats': 12.0,
    },
    'peixe': {
        'density': 0.9,
        'calories': 140, 'protein': 22.0, 'carbs': 0.0, 'fats': 5.0,
    },
    'ovo': {
        'density': 0.8,
        'calories': 155, 'protein': 13.0, 'carbs': 1.1, 'fats': 11.0,
    },
    'batata frita': {
        'density': 0.5,
        'calories': 312, 'protein': 3.4, 'carbs': 41.0, 'fats': 15.0,
    },
    'batata cozida': {
        'density': 1.0,
        'calories': 87, 'protein': 1.9, 'carbs': 20.0, 'fats': 0.1,
    },
    'purê': {
        'density': 0.9,
        'calories': 113, 'protein': 2.0, 'carbs': 17.0, 'fats': 4.0,
    },
    'farofa': {
        'density': 0.4,
        'calories': 380, 'protein': 1.8, 'carbs': 84.0, 'fats': 1.0,
    },
    'mandioca': {
        'density': 0.7,
        'calories': 297, 'protein': 1.5, 'carbs': 37.0, 'fats': 15.0,
    },
    'macarrão': {
        'density': 0.5,
        'calories': 158, 'protein': 5.8, 'carbs': 30.9, 'fats': 0.9,
    },
    'pão': {
        'density': 0.4,
        'calories': 300, 'protein': 8.0, 'carbs': 58.0, 'fats': 3.1,
    },
    'salada': {
        'density': 0.3,
        'calories': 17, 'protein': 1.4, 'carbs': 3.3, 'fats': 0.2,
    },
    'tomate': {
        'density': 0.7,
        'calories': 18, 'protein': 0.9, 'carbs': 3.9, 'fats': 0.2,
    },
    'cenoura': {
        'density': 0.9,
        'calories': 41, 'protein': 0.9, 'carbs': 9.6, 'fats': 0.2,
    },
    'brócolis': {
        'density': 0.4,
        'calories': 34, 'protein': 2.8, 'carbs': 6.6, 'fats': 0.4,
    },
    'pizza': {
        'density': 0.7,
        'calories': 266, 'protein': 11.0, 'carbs': 33.0, 'fats': 10.0,
    },
}

class ReclassifyRequest(BaseModel):
    className: str
    quantity: float


@app.post("/reclassify")
async def reclassify(request: ReclassifyRequest):
    cls_name = request.className
    quantity = request.quantity
    
    if cls_name not in FOODS:
        return {"error": f"Classe '{cls_name}' não encontrada"}
    
    nutrition = FOODS[cls_name]
    
    return {
        "name": cls_name,
        "quantity": quantity,
        "protein": round(nutrition["protein"] * quantity / 100, 2),
        "carbs": round(nutrition["carbs"] * quantity / 100, 2),
        "fats": round(nutrition["fats"] * quantity / 100, 2),
        "calories": round(nutrition["calories"] * quantity / 100, 2),
    }

# ============================================================================
# Modelo YOLO
# ============================================================================
import os
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'best.pt')
model = YOLO(MODEL_PATH)

PLATE_DIAMETER_CM = 24
CALIBRATION_FACTOR = 80  



def filter_duplicates(result, iou_threshold=0.5):
    """Remove boxes da mesma classe com IoU alto entre si (NMS manual)."""
    if result.boxes is None or len(result.boxes) == 0:
        return []
    
    boxes = result.boxes.xyxy
    scores = result.boxes.conf
    classes = result.boxes.cls
    
    keep = []
    indices = scores.argsort(descending=True).tolist()
    
    while indices:
        current = indices.pop(0)
        keep.append(current)
        
        if not indices:
            break
        
        current_box = boxes[current]
        current_class = classes[current]
        
        remaining = []
        for idx in indices:
            if classes[idx] != current_class:
                remaining.append(idx)
                continue
            
            x1 = max(current_box[0], boxes[idx][0])
            y1 = max(current_box[1], boxes[idx][1])
            x2 = min(current_box[2], boxes[idx][2])
            y2 = min(current_box[3], boxes[idx][3])
            
            inter = max(0, x2 - x1) * max(0, y2 - y1)
            area1 = (current_box[2] - current_box[0]) * (current_box[3] - current_box[1])
            area2 = (boxes[idx][2] - boxes[idx][0]) * (boxes[idx][3] - boxes[idx][1])
            
            # Usa containment (quanto da box MENOR está dentro da MAIOR)
            smaller_area = min(area1, area2)
            containment = inter / smaller_area if smaller_area > 0 else 0
            
            if containment < iou_threshold:
                remaining.append(idx)
        
        indices = remaining
    
    return keep


@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    image_bytes = base64.b64decode(request.image)
    
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    result = model.predict(img, imgsz=640, conf=0.25, iou=0.5, verbose=False)[0]
    
    # Filtra duplicatas (NMS manual)
    keep_indices = filter_duplicates(result, iou_threshold=0.3)
    print(f"\nAntes da filtragem: {len(result.boxes) if result.boxes is not None else 0}")
    print(f"Depois da filtragem: {len(keep_indices)}\n")
    
    # Imagem anotada — desenha SÓ os mantidos
    annotated = img.copy()
    annotated_np = cv2.cvtColor(__import__('numpy').array(annotated), cv2.COLOR_RGB2BGR)
    
    for i in keep_indices:
        mask = result.masks.data[i].cpu().numpy()
        box = result.boxes.xyxy[i].cpu().numpy().astype(int)
        cls_name = result.names[int(result.boxes.cls[i])]
        conf = float(result.boxes.conf[i])
        
        # Cor aleatória mas reproduzível por classe
        import hashlib
        h = hashlib.md5(cls_name.encode()).hexdigest()
        color = (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))
        
        # Desenha máscara
        import numpy as np
        mask_resized = cv2.resize(mask, (annotated_np.shape[1], annotated_np.shape[0]))
        mask_bool = mask_resized > 0.5
        annotated_np[mask_bool] = annotated_np[mask_bool] * 0.5 + np.array(color) * 0.5
        
        # Desenha box
        cv2.rectangle(annotated_np, (box[0], box[1]), (box[2], box[3]), color, 3)
        
        # Label
        label = f"{cls_name} {conf:.2f}"
        cv2.putText(annotated_np, label, (box[0], box[1] - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.0, color, 2)
    
    _, buffer = cv2.imencode('.jpg', annotated_np.astype('uint8'))
    annotated_b64 = base64.b64encode(buffer).decode('utf-8')
    
    # Items pra nutrição
    # Agrupa por classe
    grouped = {}  # {cls_name: {area_px_total, max_conf}}
    
    if result.masks is not None:
        for i in keep_indices:
            cls_name = result.names[int(result.boxes.cls[i])]
            if cls_name not in FOODS:
                continue
            
            mask = result.masks.data[i]
            area_px = int(mask.sum().item())
            conf = float(result.boxes.conf[i])
            
            if cls_name in grouped:
                grouped[cls_name]['area_px'] += area_px
                grouped[cls_name]['max_conf'] = max(grouped[cls_name]['max_conf'], conf)
            else:
                grouped[cls_name] = {'area_px': area_px, 'max_conf': conf}
    
    # Calcula nutrição por classe agrupada
    items = []
    if grouped:
        w, h = img.size
        cm_per_px = PLATE_DIAMETER_CM / min(w, h)
        
        for cls_name, data in grouped.items():
            area_cm2 = data['area_px'] * (cm_per_px ** 2)
            density = FOODS[cls_name]['density']
            mass_g = area_cm2 * density * CALIBRATION_FACTOR
            nutrition = FOODS[cls_name]
            
            items.append({
                "name": cls_name,
                "quantity": round(mass_g, 1),
                "confidence": round(data['max_conf'], 3),
                "protein": round(nutrition["protein"] * mass_g / 100, 2),
                "carbs": round(nutrition["carbs"] * mass_g / 100, 2),
                "fats": round(nutrition["fats"] * mass_g / 100, 2),
                "calories": round(nutrition["calories"] * mass_g / 100, 2),
            })
    
    return {"items": items, "annotated_image": annotated_b64}