from rest_framework import serializers
from .models import Item, ItemImage, Category

class ItemImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemImage
        fields = ['id', 'image']

class ItemSerializer(serializers.ModelSerializer):
    images = ItemImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )
    
    owner_name = serializers.SerializerMethodField()
    owner_picture = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = [
            'id', 'title', 'description', 'category', 'user', 'owner_name',
            'date_lost_or_found', 'contact_info', 'latitude', 'longitude',
            'location_address', 'is_resolved', 'status', 'images', 
            'uploaded_images', 'owner_picture', 'created_at', 'views_count',
            'ai_labels', 'is_processed' # Add these new fields here
        ]
        read_only_fields = ['user', 'is_resolved', 'ai_labels', 'is_processed']

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        
        # The 'user' is passed here from perform_create in the ViewSet
        item = Item.objects.create(**validated_data)
        
        for image in uploaded_images:
            ItemImage.objects.create(item=item, image=image)
            
        return item
    
    def get_owner_name(self, obj):
        name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return name if name else obj.user.email

    def get_owner_picture(self, obj):
        request = self.context.get('request')
        if obj.user.avatar and hasattr(obj.user.avatar, 'url'):
            if request:
                return request.build_absolute_uri(obj.user.avatar.url)
            return obj.user.avatar.url
        return None

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']