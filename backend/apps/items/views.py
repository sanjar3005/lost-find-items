from django.shortcuts import render
from .tasks import process_item_images
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import permissions
from .models import Item, Category
from .serializers import ItemSerializer,CategorySerializer
from .permissions import IsOwnerOrReadOnly

class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    
    # Crucial for React file uploads! Tells DRF to expect FormData, not just raw JSON.
    parser_classes = [MultiPartParser, FormParser] 

    def get_queryset(self):
        # Best Practice: Optimize database queries
        # select_related is for ForeignKey (1-to-1 or Many-to-1)
        # prefetch_related is for reverse ForeignKeys (1-to-Many, like your images)
        return Item.objects.select_related('user', 'category') \
                               .prefetch_related('images').all()

    def perform_create(self, serializer):
        # Absolute Security: Force the 'user' to be whoever is making the request
        # using their secure JWT token. The user CANNOT fake this.
        item = serializer.save(user=self.request.user)

        process_item_images.delay(item.id)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny] # Anyone can see the categories


