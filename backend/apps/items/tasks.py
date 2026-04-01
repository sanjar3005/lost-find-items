# tasks.py
from celery import shared_task
from .models import Item, ItemImage, Category # Assuming a separate image model

@shared_task
def process_item_images(item_id):
    try:
        from .utils import get_labels_with_colors

        item = Item.objects.get(id=item_id)
        image_obj = item.images.first()
        
        if image_obj:
            # This calls your AI function that returns the dict
            result = get_labels_with_colors(image_obj.image.path)
            
            # Extract data from the dictionary
            labels_with_colors = result.get("labels_with_colors", [])
            nouns = result.get("nouns", [])

            # Save to your model
            item.ai_labels = ", ".join(labels_with_colors)
            item.is_processed = True
            
            # Check and create categories from nouns
            for noun in nouns:
                print(f"Processing noun: {noun}")
                if noun.strip():  # Make sure the noun isn't empty
                    noun_clean = noun.capitalize() # Capitalizes "cat" to "Cat"
                    
                    # Case-insensitive check to avoid "Cat" vs "cat" duplicates
                    cat = Category.objects.filter(name__iexact=noun_clean).first()
                    
                    if not cat:
                        cat = Category.objects.create(name=noun_clean)
                        print(f"Category '{cat.name}' - Created just now!")
                    else:
                        print(f"Category '{cat.name}' - Already existed.")
                    
                    # ALWAYS overwrite the category with the AI discovered one
                    item.category = cat
                    print(f"Assigned category '{cat.name}' to item '{item.title}'")
                    break  # Stop after assigning the first AI category to avoid secondary background objects

            item.save()
            
            return result # This will now show the full dict in Celery logs
            
    except Exception as e:
        return f"Error: {str(e)}"