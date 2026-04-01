from PIL import Image
from transformers import BlipProcessor, BlipForQuestionAnswering, BlipForConditionalGeneration
import nltk
import warnings
import os
from threading import Lock

# --- 1. INITIAL SETUP ---
os.environ["TRANSFORMERS_VERBOSITY"] = "error"
warnings.filterwarnings("ignore")

_MODEL_LOCK = Lock()
_NLTK_LOCK = Lock()
_PROCESSOR = None
_CAPTION_MODEL = None
_VQA_MODEL = None
_NLTK_READY = False


def _ensure_nltk_data():
    global _NLTK_READY
    if _NLTK_READY:
        return

    with _NLTK_LOCK:
        if _NLTK_READY:
            return

        resources = [
            ("tokenizers/punkt", "punkt"),
            ("tokenizers/punkt_tab", "punkt_tab"),
            ("taggers/averaged_perceptron_tagger_eng", "averaged_perceptron_tagger_eng"),
        ]

        for resource_path, package_name in resources:
            try:
                nltk.data.find(resource_path)
            except LookupError:
                try:
                    nltk.download(package_name, quiet=True)
                except Exception:
                    continue

        _NLTK_READY = True


def _get_models():
    global _PROCESSOR, _CAPTION_MODEL, _VQA_MODEL
    if _PROCESSOR is not None and _CAPTION_MODEL is not None and _VQA_MODEL is not None:
        return _PROCESSOR, _CAPTION_MODEL, _VQA_MODEL

    with _MODEL_LOCK:
        if _PROCESSOR is None or _CAPTION_MODEL is None or _VQA_MODEL is None:
            _PROCESSOR = BlipProcessor.from_pretrained("Salesforce/blip-vqa-base")
            _CAPTION_MODEL = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
            _VQA_MODEL = BlipForQuestionAnswering.from_pretrained("Salesforce/blip-vqa-base")

    return _PROCESSOR, _CAPTION_MODEL, _VQA_MODEL

def get_labels_with_colors(image_path):
    # --- 2. LOAD AI MODELS ---
    print("Loading AI models...")
    processor, caption_model, vqa_model = _get_models()

    if not os.path.exists(image_path):
        print(f"Error: File '{image_path}' not found.")
        return

    raw_image = Image.open(image_path).convert('RGB')

    # --- 3. GENERATE DESCRIPTION ---
    print("Analyzing image...")
    inputs = processor(raw_image, return_tensors="pt")
    out = caption_model.generate(**inputs, max_new_tokens=50, num_beams=5)
    caption = processor.decode(out[0], skip_special_tokens=True)

    # --- 4. EXTRACT & FILTER VOCABULARY ---
    _ensure_nltk_data()
    tokens = nltk.word_tokenize(caption)
    tags = nltk.pos_tag(tokens)

    # List of common colors to ignore during "Object" extraction
    # This prevents the "Orange Orange" problem
    color_filter = [
        'red', 'blue', 'green', 'yellow', 'orange', 'black', 'white', 
        'gray', 'grey', 'brown', 'purple', 'pink', 'silver', 'gold'
    ]
    
    spatial_ignore = ['top', 'bottom', 'side', 'front', 'back', 'middle', 'edge', 'background']
    meta_ignore = ['photo', 'image', 'picture', 'shot']
    
    full_ignore = color_filter + spatial_ignore + meta_ignore

    # Extract ONLY Nouns (NN/NNS) that aren't in our ignore list
    unique_objects = list(set([word.lower() for word, tag in tags if tag in ('NN', 'NNS') and word.lower() not in full_ignore]))

    # --- 5. COLOR DETECTION (VQA) ---
    final_output = []
    print("Identifying colors...")
    for obj in unique_objects:
        question = f"what is the main color of the {obj}?"
        inputs_vqa = processor(raw_image, question, return_tensors="pt")
        out_vqa = vqa_model.generate(**inputs_vqa, max_new_tokens=10)
        color = processor.decode(out_vqa[0], skip_special_tokens=True)
        
        # Don't add it if the VQA fails to find a color
        if color.strip():
            final_output.append(f"{color.title()} {obj.title()}")

    # --- 6. DISPLAY RESULTS ---
    # print("\n" + "═"*50)
    # print(f"SENTENCE: {caption}")
    # print(f"RESULTS : {', '.join(final_output)}")
    # print("═"*50)
    print({
        "caption": caption,
        "labels_with_colors": final_output,
        "nouns": [obj.title() for obj in unique_objects]
    })
    return {
        "caption": caption,
        "labels_with_colors": final_output,
        "nouns": [obj.title() for obj in unique_objects]
    }


if __name__ == "__main__":
    print(get_labels_with_colors(r"C:\Users\Malikov\Desktop\projects\ai-category\images.jpg"))