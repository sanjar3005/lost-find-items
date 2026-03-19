# tasks.py
from celery import shared_task
from .models import Item, ItemImage # Assuming a separate image model
from .utils import get_labels_with_colors # Your AI logic moved to utils.py

@shared_task
def process_item_images(item_id):
    try:
        item = Item.objects.get(id=item_id)
        image_obj = item.images.first()
        
        if image_obj:
            # This calls your AI function that returns the dict
            result = get_labels_with_colors(image_obj.image.path)
            
            # Extract data from the dictionary
            

            # Save to your model
            # You can save just the labels or combine them with the caption
            item.ai_labels = result 
            # item.description += f"\n\nAI Description: {caption}" # Optional: append caption to description
            
            item.is_ai_processed = True
            item.save()
            
            return result # This will now show the full dict in Celery logs
            
    except Exception as e:
        return f"Error: {str(e)}"