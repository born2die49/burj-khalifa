from typing import List
from django.contrib.auth import get_user_model
from django.db.models import QuerySet
from django.http import Http404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from core_apps.common.renderers import GenericJSONRenderer
from .models import Profile
from .serializers import AvatarUploadSerializer, ProfileSerializer, UpdateProfileSerializer
from .tasks import upload_avatar_to_cloudinary

User = get_user_model()

# A custom pagination class to standardize the response format for paginated results
class StandardResultsSetPagination(PageNumberPagination):
  page_size = 9
  page_size_query_param = "page_size"
  max_page_size = 100


# API view to list all profiles that belong to users with the "TENANT" occupation
class ProfileListAPIView(generics.ListAPIView):
  serializer_class = ProfileSerializer
  renderer_classes = [GenericJSONRenderer]
  pagination_class = StandardResultsSetPagination
  object_label = "profiles"
  filter_backends = [DjangoFilterBackend, filters.SearchFilter]
  search_fields = ["user__username", "user__first_name", "user__last_name"]
  filterset_fields = ["occupation", "gender", "country_of_origin"]
  
  def get_queryset(self) -> List[Profile]:
    """
    Overrides the default queryset to return only profiles of active, non-staff users
    who are registered as tenants. Primary endpoint for finding tenants.
    """
    return Profile.objects.exclude(user__is_staff=True).exclude(user__is_superuser=True).filter(occupation = Profile.Occupation.TENANT)


# API view to retrieve the profile details of the currently authenticated user
class ProfileDetailAPIView(generics.RetrieveAPIView):
  serializer_class = ProfileSerializer
  renderer_classes = [GenericJSONRenderer]
  object_label = "profile"
  
  def get_queryset(self) -> QuerySet:
    """
    Optimizes the database query by pre-fetching the related User object along with the Profile. Avoiding an extra database hit when accessing user data.
    """
    return Profile.objects.select_related("user").all()
  
  def get_object(self) -> Profile:
    """
    Retrieves the profile associated with the user making the request.
    If no profile is found, it raises a 404 error.
    """
    try:
      return Profile.objects.get(user=self.request.user)
    except Profile.DoesNotExist:
      raise Http404("Profile not found")
    

# API view for the authenticated user to retrieve and update their own profile
class ProfileUpdateAPIView(generics.RetrieveUpdateAPIView):
  serializer_class = UpdateProfileSerializer
  renderer_classes = [GenericJSONRenderer]
  object_label = "profile"
  
  def get_queryset(self):
    return Profile.objects.none()
  
  def get_object(self) -> Profile:
    """
    Fetches the profile for the current user. If a profile does not exist,
    it creates one, ensuring a profile is always available for update.
    """
    profile, _ = Profile.objects.get_or_create(user=self.request.user)
    return profile
  
  def perform_update(self, serializer: UpdateProfileSerializer) -> Profile:
    """
    Handles the update logic. It separates the user data from the profile data,
    saves the profile first, and then updates the associated User model instance.
    """
    user_data = serializer.validated_data.pop("user", {})
    profile = serializer.save()
    
    User.objects.filter(id=self.request.user.id).update(**user_data)
    
    return profile
  

# API view dedicated to handling profile avatar uploads
class AvatarUploadView(APIView):
  def patch(self, request, *args, **kwargs):
    return self.upload_avatar(request, *args, **kwargs)
  
  def upload_avatar(self, request, *args, **kwargs):
    """
    Processes the avatar upload asynchronously. The image is validated and then
    passed to a Celery task for uploading to Cloudinary in the background.
    """
    profile = request.user.profile
    serializer = AvatarUploadSerializer(profile, data=request.data)
    
    if serializer.is_valid():
      image = serializer.validated_data["avatar"]
      
      image_content = image.read()
      
      upload_avatar_to_cloudinary.delay(str(profile.id), image_content)
      
      return Response(
        {"message": "Avatar upload started"}, status=status.HTTP_202_ACCEPTED
      )
      
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  

# API view to list all profiles that are NOT tenants (e.g., service providers)
class NonTenantProfileListAPIView(generics.ListAPIView):
  serializer_class = ProfileSerializer
  renderer_classes = [GenericJSONRenderer]
  pagination_class = StandardResultsSetPagination
  object_label = "non_tenant_profiles"
  filter_backends = [DjangoFilterBackend, filters.SearchFilter]
  search_fields = ["user__username", "user__first_name", "user__last_name"]
  filterset_fields = ["occupation", "gender", "country_of_origin"]
  
  def get_queryset(self) -> List[Profile]:
    """
    Returns a queryset of profiles for active, non-staff users,
    explicitly excluding any user registered as a tenant.
    This is useful for finding service providers like plumbers, electricians, etc.
    """
    return (
      Profile.objects.exclude(user__is_staff=True)
      .exclude(user__is_superuser=True)
      .exclude(occupation=Profile.Occupation.TENANT)
    )