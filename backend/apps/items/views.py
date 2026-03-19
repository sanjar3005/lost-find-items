from django.db.models import Q
from django.shortcuts import render
from .tasks import process_item_images
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import permissions
from .models import Item, Category, SavedItem
from .serializers import ItemSerializer,CategorySerializer
from .permissions import IsOwnerOrReadOnly
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    
    # Crucial for React file uploads! Tells DRF to expect FormData, not just raw JSON.
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.action == 'toggle_save':
            return [IsAuthenticated()]
        return [permission() for permission in self.permission_classes]

    def get_queryset(self):
        # Best Practice: Optimize database queries
        # select_related is for ForeignKey (1-to-1 or Many-to-1)
        # prefetch_related is for reverse ForeignKeys (1-to-Many, like your images)
        qs = Item.objects.select_related('user', 'category').prefetch_related('images').all()
        
        # Filtering logic
        search = self.request.query_params.get('search')
        category = self.request.query_params.get('category')
        status = self.request.query_params.get('status')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        is_resolved = self.request.query_params.get('is_resolved')
        saved = self.request.query_params.get('saved')
        include_resolved = self.request.query_params.get('include_resolved')

        if self.action == 'list' and include_resolved != 'true':
            qs = qs.filter(is_resolved=False)

        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(description__icontains=search) | Q(ai_labels__icontains=search))
        if category:
            try:
                # categories are typically integers, but if they pass ID, we fetch name
                cat_obj = Category.objects.get(id=category)
                cat_name_capitalized = str(cat_obj.name).capitalize()
                qs = qs.filter(Q(category_id=category) | Q(ai_labels__icontains=cat_name_capitalized) | Q(ai_labels__icontains=cat_obj.name))
            except (Category.DoesNotExist, ValueError):
                qs = qs.filter(category_id=category)
        if status:
            qs = qs.filter(status=status)
        if start_date:
            qs = qs.filter(date_lost_or_found__gte=start_date)
        if end_date:
            qs = qs.filter(date_lost_or_found__lte=end_date)
        if is_resolved is not None:
            qs = qs.filter(is_resolved=is_resolved.lower() == 'true')
        if saved == 'true' and self.request.user.is_authenticated:
            qs = qs.filter(saved_by__user=self.request.user)

        return qs

    def perform_create(self, serializer):
        # Absolute Security: Force the 'user' to be whoever is making the request
        # using their secure JWT token. The user CANNOT fake this.
        item = serializer.save(user=self.request.user)

        process_item_images.delay(item.id)

    @action(detail=True, methods=['post'], url_path='toggle-save')
    def toggle_save(self, request, pk=None):
        item = self.get_object()
        saved_obj = SavedItem.objects.filter(user=request.user, item=item).first()

        if saved_obj:
            saved_obj.delete()
            return Response({'saved': False})

        SavedItem.objects.create(user=request.user, item=item)
        return Response({'saved': True})


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny] # Anyone can see the categories


