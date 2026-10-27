
from pathlib import Path

import torch
import torch.nn as nn
from fastapi import FastAPI, File, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError
from torchvision.models import mobilenet_v3_small


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "app" / "models" / "ip102_mobilenet_v3_small.pth"

IMAGE_SIZE = 224
DEVICE = torch.device("cpu")

app = FastAPI(
    title="PestGuard AI Service",
    description="Environmental and image-based pest warning service",
    version="1.0.0",
)

model = None
class_names = []
model_load_error = None


def load_image_model():
    """Load the saved image-classification checkpoint."""
    global model, class_names, model_load_error

    try:
        if not MODEL_PATH.is_file():
            model_load_error = "Model checkpoint not found"
            return

        checkpoint = torch.load(
            MODEL_PATH,
            map_location=DEVICE,
            weights_only=True,
        )

        names = checkpoint.get("class_names")
        if (
            not isinstance(names, list)
            or len(names) != 102
            or not all(isinstance(name, str) for name in names)
        ):
            raise ValueError("Invalid class-name mapping in checkpoint")

        if checkpoint.get("architecture") != "mobilenet_v3_small":
            raise ValueError("Unsupported model architecture")

        loaded_model = mobilenet_v3_small(weights=None)
        input_features = loaded_model.classifier[3].in_features
        loaded_model.classifier[3] = nn.Linear(input_features, 102)
        loaded_model.load_state_dict(checkpoint["model_state_dict"])
        loaded_model.to(DEVICE)
        loaded_model.eval()

        model = loaded_model
        class_names = names
        model_load_error = None

    except Exception as exc:
        model = None
        class_names = []
        model_load_error = str(exc)


@app.on_event("startup")
def startup_event():
    load_image_model()


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "PestGuard AI",
        "environmental_model": "not_trained",
        "image_model": "ready" if model is not None else "unavailable",
    }


@app.post("/predict/image")
async def predict_image(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Image model is unavailable. Check /health and the checkpoint.",
        )

    if file.content_type and not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=415,
            detail="Please upload an image file.",
        )

    try:
        contents = await file.read(10 * 1024 * 1024 + 1)

        if not contents:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=413,
                detail="Image must be 10 MB or smaller.",
            )

        import io

        with Image.open(io.BytesIO(contents)) as source:
            image = source.convert("RGB")
            image = image.resize(
                (IMAGE_SIZE, IMAGE_SIZE),
                Image.Resampling.BILINEAR,
            )

        mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
        std = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)

        image_tensor = torch.frombuffer(
            bytearray(image.tobytes()), dtype=torch.uint8
        )
        image_tensor = image_tensor.reshape(IMAGE_SIZE, IMAGE_SIZE, 3)
        image_tensor = image_tensor.permute(2, 0, 1).float() / 255.0
        image_tensor = (image_tensor - mean) / std
        image_tensor = image_tensor.unsqueeze(0)

        with torch.inference_mode():
            logits = model(image_tensor)
            probabilities = torch.softmax(logits, dim=1)[0]
            confidence, predicted_index = probabilities.max(dim=0)

        index = int(predicted_index.item())

        return {
            "predicted_class": class_names[index],
            "class_id": index,
            "confidence": round(float(confidence.item()), 4),
            "model": "mobilenet_v3_small",
            "experimental": True,
            "message": (
                "Experimental prediction. Verify the result before "
                "making pest-control decisions."
            ),
        }

    except HTTPException:
        raise
    except (UnidentifiedImageError, OSError, ValueError):
        raise HTTPException(
            status_code=400,
            detail="Could not read the uploaded image. Please upload a valid image.",
        )
    finally:
        await file.close()
