from rest_framework import serializers
from .models import Item, ItemImage, Category

class ItemImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemImage
        fields = ['id', 'image']

class ItemSerializer(serializers.ModelSerializer):
    # This reads the images out of the database for the GET request
    images = ItemImageSerializer(many=True, read_only=True)
    
    # This accepts an array of image files during a POST request
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )
    
    # Get the owner's name to display on the React frontend
    owner_name = serializers.SerializerMethodField()
    owner_picture = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = [
            'id', 'title', 'description', 'category', 'user', 'owner_name',
            'date_lost_or_found', 'contact_info', 'latitude', 'longitude',
            'location_address', 'is_resolved', 'status', 'images', 'uploaded_images', 'owner_picture'
        ]
        # Force these to be read-only for strict security
        read_only_fields = ['user', 'is_resolved']

    def create(self, validated_data):
        # 1. Pull the uploaded images out of the validated data
        uploaded_images = validated_data.pop('uploaded_images', [])
        
        # 2. Create the Item instance
        item = Item.objects.create(**validated_data)
        
        # 3. Create an ItemImage instance for every uploaded file
        for image in uploaded_images:
            ItemImage.objects.create(item=item, image=image)
            
        return item
    
    def get_owner_name(self, obj):
        # obj is the specific Item. We reach through it to the connected User.
        name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        # If they haven't set a name yet, fallback to their email so it isn't blank
        return name if name else obj.user.email

    # 4. Write the function for the owner's avatar
    def get_owner_picture(self, obj):
        request = self.context.get('request')
        # Check if the user actually uploaded an avatar
        if obj.user.avatar and hasattr(obj.user.avatar, 'url'):
            # THE MAGIC TRICK: This automatically adds 'http://127.0.0.1:8000' to the URL!
            if request:
                return request.build_absolute_uri(obj.user.avatar.url)
            return obj.user.avatar.url
        return None

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']