from rest_framework import serializers
from .models import Item, ItemImage, Category, Color

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'name', 'hex_code']

class ItemImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemImage
        fields = ['id', 'image']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if not rep.get('image'):
            request = self.context.get('request', None)
            default_url = '/media/item_images/default.png'  # You should have this image in your media folder
            if request:
                rep['image'] = request.build_absolute_uri(default_url)
            else:
                rep['image'] = default_url
        return rep

class ItemSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    categories = CategorySerializer(many=True, read_only=True)
    colors = ColorSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )
    
    owner_name = serializers.SerializerMethodField()
    owner_picture = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = [
            'id', 'title', 'description', 'category', 'categories', 'colors', 'user', 'owner_name',
            'date_lost_or_found', 'contact_info', 'latitude', 'longitude',
            'location_address', 'is_resolved', 'status', 'images', 
            'uploaded_images', 'owner_picture', 'is_saved', 'created_at', 'views_count',
            'ai_labels', 'is_processed' # Add these new fields here
        ]
        read_only_fields = ['user', 'ai_labels', 'is_processed', 'categories', 'colors']

    def get_images(self, obj):
        images = obj.images.all()
        if not images.exists():
            request = self.context.get('request', None)
            default_url = '/media/item_images/default.png'  # You should have this image in your media folder
            if request:
                return [{'id': None, 'image': request.build_absolute_uri(default_url)}]
            else:
                return [{'id': None, 'image': default_url}]
        return ItemImageSerializer(images, many=True, context=self.context).data

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

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated:
            return False
        return obj.saved_by.filter(user=request.user).exists()