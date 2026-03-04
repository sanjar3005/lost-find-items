from django.db import models
from apps.users.models import User, BaseModel

# Create your models here.
class Category(BaseModel, models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class ItemStatus(models.TextChoices):
    LOST = 'LOST', 'Lost'
    FOUND = 'FOUND', 'Found'
    
class Item(BaseModel, models.Model):

    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, related_name='items', null=True, blank=True)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='items')
    date_lost_or_found = models.DateField()
    contact_info = models.CharField(max_length=255)

    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    location_address = models.CharField(max_length=255, blank=True, null=True)
    views_count = models.IntegerField(default=0)
    
    is_resolved = models.BooleanField(default=False)
    status = models.CharField(max_length=10, choices=ItemStatus.choices)


    def __str__(self):
        return f"{self.title} - {self.user.first_name}"
    
    class Meta:
        ordering = ['-created_at']

        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['category']),
            models.Index(fields=['date_lost_or_found']),
            models.Index(fields=['is_resolved']),
        ]

class ItemImage(BaseModel, models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='item_images/')
    
    def __str__(self):
        return f"Image for {self.item.title}"