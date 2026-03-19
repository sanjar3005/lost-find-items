import torch
from PIL import Image
from transformers import BlipProcessor, BlipForQuestionAnswering, BlipForConditionalGeneration
import nltk
import warnings
import os

# --- 1. INITIAL SETUP ---
os.environ["TRANSFORMERS_VERBOSITY"] = "error"
warnings.filterwarnings("ignore")

nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)
nltk.download('averaged_perceptron_tagger_eng', quiet=True)

def get_labels_with_colors(image_path):
    # --- 2. LOAD AI MODELS ---
    print("Loading AI models...")
    processor = BlipProcessor.from_pretrained("Salesforce/blip-vqa-base")
    caption_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
    vqa_model = BlipForQuestionAnswering.from_pretrained("Salesforce/blip-vqa-base")

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