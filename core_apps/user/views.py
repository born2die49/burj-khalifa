import logging
from typing import Optional
from django.conf import settings
from djoser.social.views import ProviderAuthView
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

logger = logging.getLogger(__name__)

def set_auth_cookies(response: Response, access_token: str, refresh_token: Optional[str] = None) -> None:
  # Helper function to set authentication cookies on a response object.
  access_token_lifetime = settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds()
  cookie_settings = {
    "path": settings.COOKIE_PATH,
    "secure": settings.COOKIE_SECURE,
    "httponly": settings.COOKIE_HTTPONLY,
    "samesite": settings.COOKIE_SAMESITE,
    "max_age": access_token_lifetime,
  }
  response.set_cookie("access", access_token, **cookie_settings)
  
  if refresh_token:
    refresh_token_lifetime = settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()
    refresh_cookie_settings = cookie_settings.copy()
    refresh_cookie_settings["max_age"] = refresh_token_lifetime
    response.set_cookie("refresh", refresh_token, **refresh_cookie_settings)
    
  # Create a 'logged_in' flag cookie accessible by client-side JavaScript.
  logged_in_cookie_settings = cookie_settings.copy()
  logged_in_cookie_settings["httponly"] = False
  response.set_cookie("logged_in", "true", **logged_in_cookie_settings)


class CustomTokenObtainPairView(TokenObtainPairView):
  # Custom view for token-based authentication (login).
  def post(self, request: Request, *args, **kwargs) -> Response:
    # Call the parent class's post method to get the standard token response.
    token_res = super().post(request, *args, **kwargs)
    
    if token_res.status_code == status.HTTP_200_OK:
      access_token = token_res.data.get("access")
      refresh_token = token_res.data.get("refresh")
      
      if access_token and refresh_token:
        # If tokens are generated, set them as secure, HttpOnly cookies.
        set_auth_cookies(token_res, access_token=access_token, refresh_token=refresh_token)
        
        # For security, remove the tokens from the response body.
        token_res.data.pop("access", None)
        token_res.data.pop("refresh", None)
        
        token_res.data["message"] = "Login Successfull"
      else:
        token_res.data["message"] = "Login Failed"
        logger.error("Access or refresh token not found in login response data")
     
    return token_res
  

class CustomTokenRefreshView(TokenRefreshView):
  # Custom view for refreshing access tokens.
  def post(self, request: Request, *args, **kwargs) -> Response:
    # Extract the refresh token from the incoming cookie.
    refresh_token = request.COOKIES.get("refresh")
    
    if refresh_token:
      # Manually add the refresh token to the request data for the parent view to process.
      request.data["refresh"] = refresh_token
      
    refresh_res = super().post(request, *args, **kwargs)
    
    if refresh_res.status_code == status.HTTP_200_OK:
      access_token = refresh_res.data.get("access")
      refresh_token = refresh_res.data.get("refresh") # a new refresh token if ROTATE_REFRESH_TOKENS is True
      
      if access_token and refresh_token:
        set_auth_cookies(refresh_res, access_token=access_token, refresh_token=refresh_token)
        
        refresh_res.data.pop("access", None)
        refresh_res.data.pop("refresh", None)
        
        refresh_res.data["message"] = "Access token refreshed successfully"
      else:
        refresh_res.data["message"] = "Access or Refresh token not found in refresh response data"
        logger.error("Access or Refresh token not found in refresh response data")
     
    return refresh_res
        
    
class CustomProviderAuthView(ProviderAuthView):
  # Custom view for social authentication (e.g., Google).
  def post(self, request: Request, *args, **kwargs) -> Response:
    # Let Djoser's view handle the social authentication process.
    provider_res = super().post(request, *args, **kwargs)
    
    if provider_res.status_code == status.HTTP_201_CREATED:
      access_token = provider_res.data.get("access")
      refresh_token = provider_res.data.get("refresh")
      
      if access_token and refresh_token:
        # After successful social login, set the authentication cookies.
        set_auth_cookies(provider_res, access_token=access_token, refresh_token=refresh_token)
        
        provider_res.data.pop("access", None)
        provider_res.data.pop("refresh", None)
        
        provider_res.data["message"] = "You are logged in Successfully"
      else:
        provider_res.data["message"] = ("Access or Refresh token not found in provider response")
        logger.error("Access or Refresh token not found in provider response data")
     
    return provider_res
  
  
class LogoutAPIView(APIView):
  # API view for user logout.
  def post(self, request: Request, *args, **kwargs):
    # Create a response that doesn't need a body, as is standard for logout.
    response = Response(status=status.HTTP_204_NO_CONTENT)
    response.delete_cookie("access")
    response.delete_cookie("refresh")
    response.delete_cookie("logged_in")
    return response